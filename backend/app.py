import os
from flask import Flask, jsonify, request, make_response
from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt
from datetime import datetime
from bson.objectid import ObjectId
from flask_cors import CORS
from config import Config
from flask_jwt_extended import JWTManager, create_access_token, JWTManager,jwt_required, get_jwt_identity
from agora_token_builder import RtcTokenBuilder, RtmTokenBuilder

# --- INITIALIZE EXTENSIONS ---
mongo = PyMongo()
bcrypt = Bcrypt()
jwt = JWTManager()
#This helper function also turned giibberish
# def get_users_collection():
#     """Helper function to get the MongoDB 'users' collection."""
#     return mongo.db.users

# Initialize the Flask App
app = Flask(__name__)

app.config.from_object(Config)

# Initialize Extensions
mongo.init_app(app)
bcrypt.init_app(app)
jwt.init_app(app)

# Enable CORS for all routes
CORS(
    app,
    resources={
        r"/*": {  # This matches all routes
            "origins": ["*"],
            "methods": ["GET", "POST", "PUT", "OPTIONS"],
            "allow_headers": ["Authorization", "Content-Type"],
            "supports_credentials": True,
            "expose_headers": ["Content-Type", "Authorization"]
        }
    }
)

# --- ROUTES ---

@app.route('/')
def index():
    return "Welcome to the Meet A Vet Application API!"

@app.route('/api/appointments', methods=['POST'])
@jwt_required()
def create_appointment():
    data = request.get_json()
    user_id = get_jwt_identity()
    
    appointment = {
        "appointment_id": str(ObjectId()),
        "user_id": user_id,
        "vet_id": data.get("vet_id"),
        "animal_id": data.get("animal_id"),
        "appointment_date": data.get("appointment_date"),
        "description": data.get("reason"),
        "created_at": datetime.utcnow()
    }
    
    appointments_collection = mongo.db.appointments
    result = appointments_collection.insert_one(appointment)
    
    return jsonify({"message": "Appointment created", "appointment_id": str(result.inserted_id)}), 201

@app.route('/api/appointments', methods=['GET'])
@jwt_required()
def appointment():
    user_id = get_jwt_identity()
    appointments_collection = mongo.db.appointments
    appointments = list(appointments_collection.find({"user_id": user_id}))
    
    # Convert ObjectId to string for JSON serialization
    for appt in appointments:
        appt['_id'] = str(appt['_id'])
    
    return jsonify(appointments), 200

def get_mpesa_auth_token():
    """Gets an OAuth2 token from the M-Pesa API."""
    try:
        creds = f"{MPESA_CONSUMER_KEY}:{MPESA_CONSUMER_SECRET}"
        auth = base64.b64encode(creds.encode('utf-8')).decode('utf-8')
        headers = {'Authorization': f'Basic {auth}'}
        
        response = requests.get(AUTH_URL, headers=headers)
        response.raise_for_status()  # Raise an error for bad status codes
        
        token = response.json().get('access_token')
        return token
    except Exception as e:
        print(f"Error getting M-Pesa auth token: {e}")
        return None

#
# === ENDPOINT 1: INITIATE PAYMENT (React calls this) ===
#
@app.route('/api/initiate-stk-push', methods=['POST'])
def initiate_stk_push():
    """
    Initiates an STK push. React app sends {phone: '254...', amount: 1, appointment_id: '...'}
    """
    data = request.get_json()
    phone_number = data.get('phone')  # e.g., 2547XXXXXXXX
    amount = data.get('amount')
    appointment_id = data.get('appointment_id') # For tracking

    if not all([phone_number, amount, appointment_id]):
        return jsonify({"error": "Missing phone, amount, or appointment_id"}), 400

    # 1. Get auth token
    access_token = get_mpesa_auth_token()
    if not access_token:
        return jsonify({"error": "Failed to get auth token"}), 500

    # 2. Create timestamp and password
    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
    password_data = f"{MPESA_SHORTCODE}{MPESA_PASSKEY}{timestamp}"
    password = base64.b64encode(password_data.encode('utf-8')).decode('utf-8')

    # 3. This is the URL Safaricom will POST to *after* payment
    callback_url = f"{NGROK_URL}/api/payment-callback"

    # 4. Build the STK Push payload
    payload = {
        "BusinessShortCode": MPESA_SHORTCODE,
        "Password": password,
        "Timestamp": timestamp,
        "TransactionType": "CustomerPayBillOnline",  # or "CustomerBuyGoodsOnline" for Till
        "Amount": str(amount), # Must be a string
        "PartyA": phone_number,
        "PartyB": MPESA_SHORTCODE,
        "PhoneNumber": phone_number,
        "CallBackURL": callback_url,
        "AccountReference": appointment_id,
        "TransactionDesc": "Vet Telemedicine Consultation"
    }

    # 5. Send the STK Push request to Safaricom
    headers = {'Authorization': f'Bearer {access_token}', 'Content-Type': 'application/json'}
    try:
        response = requests.post(STK_PUSH_URL, json=payload, headers=headers)
        response.raise_for_status()
        
        # 6. Get the response from Safaricom
        stk_response = response.json()
        checkout_request_id = stk_response.get('CheckoutRequestID')

        if not checkout_request_id:
            return jsonify({"error": "Failed to initiate STK push", "details": stk_response}), 500

        # 7. Save to MongoDB with 'pending' status
        payment_record = {
            "checkout_request_id": checkout_request_id,
            "appointment_id": appointment_id,
            "phone_number": phone_number,
            "amount": amount,
            "status": "pending",
            "timestamp": datetime.now()
        }
        payments_collection.insert_one(payment_record)

        return jsonify({"message": "STK push initiated successfully", "checkout_request_id": checkout_request_id}), 200

    except requests.exceptions.HTTPError as e:
        return jsonify({"error": "HTTP Error", "details": str(e.response.text)}), 500
    except Exception as e:
        return jsonify({"error": "An unexpected error occurred", "details": str(e)}), 500

#
# === ENDPOINT 2: PAYMENT CALLBACK (Safaricom calls this) ===
#
@app.route('/api/payment-callback', methods=['POST'])
def payment_callback():
    """
    This is the endpoint Safaricom POSTs to after the user pays.
    """
    print("--- Payment Callback Received ---")
    data = request.get_json()
    print(data)

    try:
        # Extract the relevant data from the callback
        stk_callback = data.get('Body', {}).get('stkCallback', {})
        checkout_request_id = stk_callback.get('CheckoutRequestID')
        result_code = stk_callback.get('ResultCode')

        # Find the payment in our database
        payment_record = payments_collection.find_one({"checkout_request_id": checkout_request_id})

        if not payment_record:
            print(f"Error: No payment record found for {checkout_request_id}")
            return jsonify({"ResultCode": 0, "ResultDesc": "Accepted"}), 200

        # Update the payment status based on the result
        if result_code == 0:
            # Payment was successful
            new_status = "completed"
            
            # Extract metadata (optional but good)
            metadata = stk_callback.get('CallbackMetadata', {}).get('Item', [])
            mpesa_receipt = next((item['Value'] for item in metadata if item['Name'] == 'MpesaReceiptNumber'), None)
            
            payments_collection.update_one(
                {"_id": payment_record['_id']},
                {"$set": {
                    "status": new_status, 
                    "mpesa_receipt": mpesa_receipt,
                    "callback_data": stk_callback # Save the whole callback
                }}
            )
            
            # --- IMPORTANT ---
            # This is where you would update your Appointment collection
            # e.g., db.appointments.update_one({"_id": payment_record['appointment_id']}, {"$set": {"paid": True}})
            # --- --- --- --- ---
            
        else:
            # Payment failed (e.g., user cancelled, insufficient funds)
            new_status = "failed"
            payments_collection.update_one(
                {"_id": payment_record['_id']},
                {"$set": {"status": new_status, "callback_data": stk_callback}}
            )

        print(f"Payment {checkout_request_id} status updated to {new_status}")

    except Exception as e:
        print(f"Error in callback: {e}")
        # Even if we fail, tell Safaricom we received it.
        # Otherwise, it will keep retrying.
        return jsonify({"ResultCode": 1, "ResultDesc": "Failed internally"}), 200

    # Tell Safaricom "Thank you, we got it."
    return jsonify({"ResultCode": 0, "ResultDesc": "Accepted"}), 200

#
# === ENDPOINT 3: PAYMENT STATUS (React calls this) ===
#
@app.route('/api/payment-status/<string:checkout_request_id>', methods=['GET'])
def payment_status(checkout_request_id):
    """
    React app polls this endpoint to check if the payment is complete.
    """
    payment_record = payments_collection.find_one({"checkout_request_id": checkout_request_id})

    if not payment_record:
        return jsonify({"error": "Payment not found"}), 404

    return jsonify({
        "status": payment_record.get('status'),
        "checkout_request_id": checkout_request_id
    }), 200

@app.route("/api/get-token", methods=["POST"])
def get_token():

    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid JSON payload"}), 400

        user_id = data.get("userId")
        channel_name = data.get("channelName")
   
        if not user_id:
            return jsonify({"error": "Unauthorized, User Id Required"}), 403
        if not channel_name:
            return jsonify({"error": "Channel Name Required"}), 400

        expire_time_in_seconds = 3600
        current_timestamp = int(datetime.utcnow().timestamp())
        privilege_expired_ts = current_timestamp + expire_time_in_seconds


        rtc_token = RtcTOkenBuilder.buildTokenWithUid(
            Config.AGORA_APP_ID,
            Config.AGORA_APP_CERTIFICATE,
            channel_name, 
            user_id,
            0,
            Role_Rtc_Publisher,
            privilege_expired_ts
        )

        rtm_token = RtmTokenBuilder.buildToken(
            Config.AGORA_APP_ID,
            Config.AGORA_APP_CERTIFICATE,
            user_id,
            privilege_expired_ts
        )

        return jsonify({
            "rtcToken": rtc_token,
            "rtmToken": rtm_token,
            "appid": Config.AGORA_APP_ID,
            "channelName": channel_name,
            "uid": user_id,
            "expiresIn": expire_time_in_seconds
        }),200

    except Exception as e:
        app.logger.error(f"Error generating tokens: {e}")
        return jsonify({"error": "Internal Server Error"}), 500
    
    
@app.route('/register', methods=['POST'])
def register():
    """
    Handle user registration and save data to MongoDB.
    """

    data =  request.get_json()
    email = data.get('email')
    password = data.get('password')
    role = data.get('role')
    license_number = data.get('licenseNumber')
    license_expiry_str = data.get('licenseExpiry')

    full_name = email.split('@')[0]
    
    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400
    
    users_collection = mongo.db.users
    if users_collection.find_one({'email': email}):
        return jsonify({'error': 'Email already exists'}), 400
    
    if role == 'surgeon':
        if not license_number or not license_expiry_str:
            return jsonify({'error': 'License number and expiry date are required'}),400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    user = {
        'email': email,
        'password_hash': hashed_password,
        'role': role,
        'username': full_name,
        'firstName': full_name.capitalize(), # Add default name
        'lastName': "",
        'avatarUrl': f"https://placehold.co/100x100/EBF4FF/7F9CF5?text={full_name[0].upper()}", # Default avatar
        'phone1': "",
        'phone2': "",
        'location': "",
        'created_at': datetime.utcnow()
    }

    if role == 'surgeon':
        try:
            # You can store as a string, or convert to a datetime object
            license_expiry = datetime.strptime(license_expiry_str, '%Y-%m-%d')
            user['license_expiry'] = license_expiry
        except ValueError:
            return jsonify({'error': 'Invalid date format for license expiry. Use YYYY-MM-DD.'}), 400
        
        user['license_number'] = license_number
    
    try:
        result = users_collection.insert_one(user)

        return jsonify({'message': 'User registered successfully',
        'user_id': str(result.inserted_id),
        'user_email':email,
        'role': role
        }), 201
    except Exception as e:
        print(f"Error inserting user: {e}")
        return jsonify({'error': 'An error occurred during registration'}), 500
        

@app.route('/login', methods=['POST', 'OPTIONS'])
def login():
    """
    Handle user login and authentication.
    """
    # Handle preflight OPTIONS request
    if request.method == 'OPTIONS':
        response = make_response()
        return response

    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    users_collection = mongo.db.users
    user = users_collection.find_one({'email': email})

    if not user:
        return jsonify({'error': 'Invalid email or password'}), 401

    if not bcrypt.check_password_hash(user['password_hash'], password):
        return jsonify({'error': 'Invalid email or password'}), 401

    # Verify role is present
    if 'role' not in user:
        return jsonify({'error': 'User account is not properly configured'}), 400

    # This is the identity subject
    identity_string = str(user['_id'])

    # Identity with user Id and role
    additional_claims = {
        'user_id': str(user['_id']),
        'email': user['email'],
        'role': user['role']
    }

    # Create access token with role in claims
    access_token = create_access_token(
        identity=identity_string,
        additional_claims=additional_claims
    )

    response = jsonify({
        'message': 'Login successful',
        'access_token': access_token,
        'role': user.get('role')
    }), 200

    return response


@app.route('/api/profile', methods=['GET'])
@jwt_required(locations=["headers"])
def get_profile():
    """
    Get the logged-in user's profile data.
    """
    user_id = get_jwt_identity()
    
    users_collection = mongo.db.users
    user = users_collection.find_one(
        {"_id": ObjectId(user_id)},
        {"password_hash": 0}
    )

    if not user:
        return jsonify({"error": "User not found"}), 404
        
    # Convert _id to string
    user['_id'] = str(user['_id'])

    # Normalize animals to animalRecords for frontend compatibility
    animals = user.get('animals', [])
    user['animalRecords'] = animals

    # Convert dates if they exist (example)
    if 'created_at' in user:
        user['created_at'] = user['created_at'].isoformat()
    if 'license_expiry' in user and isinstance(user['license_expiry'], datetime):
        user['license_expiry'] = user['license_expiry'].isoformat().split('T')[0]

    return jsonify(user), 200


@app.route('/api/profile', methods=['PUT'])
@jwt_required() # This protects the route
def update_profile():
    """
    Update the logged-in user's profile data.
    """
    user_id = get_jwt_identity()
    
    data = request.get_json()
    
    # Define which fields are allowed to be updated
    allowed_updates = {
        "firstName": data.get("firstName"),
        "lastName": data.get("lastName"),
        "email": data.get("email"),
        "phone1": data.get("phone1"),
        "phone2": data.get("phone2"),
        "location": data.get("location"),
        "avatarUrl": data.get("avatarUrl") # Profile photo URL
    }
    
    # Remove any keys that were not provided (None)
    update_fields = {k: v for k, v in allowed_updates.items() if v is not None}

    if not update_fields:
        return jsonify({"error": "No valid fields provided for update"}), 400
        
    try:
        users_collection = mongo.db.users
        result = users_collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": update_fields}
        )
        
        if result.matched_count == 0:
            return jsonify({"error": "User not found"}), 404
            
        return jsonify({"message": "Profile updated successfully"}), 200
        
    except Exception as e:
        print(f"Error updating profile: {e}")
        return jsonify({"error": "An error occurred during update"}), 500


@app.route('/api/add_animal', methods=['POST'])
@jwt_required()
def add_animal():
    """
    API endpoint to add a new animal to the logged-in user's profile
    """
    # Read JSON payload
    data = request.get_json()
    if not data or 'name' not in data or 'species' not in data:
        return jsonify({'error': 'Missing Fields Required'}), 400

    # Debug: log Authorization header (helps diagnose 401 issues)
    try:
        auth_header = request.headers.get('Authorization')
        print(f"add_animal: Authorization header: {auth_header}")
    except Exception:
        pass

    user_id = get_jwt_identity()

    animal = {
        'name': data.get('name'),
        'species': data.get('species'),
        'breed': data.get('breed', ''),
        'age': data.get('age', ''),
        'gender': data.get('gender', ''),
        'notes': data.get('notes', ''),
        'owner_id': user_id,
        'added_at': datetime.utcnow()
    }

    try:
        result = mongo.db.users.update_one(
            {'_id': ObjectId(user_id)},
            {'$push': {'animals': animal}}
        )
        if result.matched_count == 0:
            return jsonify({'error': 'User not found'}), 404

        # Return the newly created animal document for client-side state update
        return jsonify(animal), 201
    except Exception as e:
        print(f"Error adding animal: {e}")
        return jsonify({'error': 'An error occurred while adding the animal'}), 500

@app.route('/api/animals', methods=['GET'])
@jwt_required()
def get_animals():
        # Return the created animal so client can update local state
    return jsonify(animal), 201
    """
    API endpoint to fetch all animals for the logged-in user.
    """
    user_id = get_jwt_identity()
    
    users_collection = mongo.db.users
    user = users_collection.find_one(
        {"_id": ObjectId(user_id)},
        {"animals": 1}
    )

    if not user:
        return jsonify({"error": "User not found"}), 404

    animals = user.get('animals', [])
    
    return jsonify({"animals": animals}), 200

@app.route('/api/summary', methods=['GET'])
@jwt_required()
def get_summary():

    """
    API endpoint to fetch summary data for the logged-in user.
    """
    user_id = get_jwt_identity()
    
    users_collection = mongo.db.users
    user = users_collection.find_one(
        {"_id": ObjectId(user_id)},
        {"animals": 1}
    )

    if not user:
        return jsonify({"error": "User not found"}), 404

    animals = user.get('animals', [])
    total_animals = len(animals)

    # Compute species distribution
    species_counts = {}
    for a in animals:
        species = a.get('species', 'Unknown')
        species_counts[species] = species_counts.get(species, 0) + 1

    species_distribution = [
        { 'name': name, 'count': count, 'fill': f"#{(hash(name) & 0xFFFFFF):06x}" }
        for name, count in species_counts.items()
    ]

    summary = {
        "totalAnimals": total_animals,
        "totalSpecies": len(species_counts),
        "scheduledAppointments": 0,  # placeholder, implement if you store appointments
        "speciesDistribution": species_distribution,
        "animalRecords": animals
    }

    return jsonify(summary), 200

@app.route('/api/vets', methods=['GET'])
def get_vets():
    """
    API endpoint to fetch a list of all available vets from MongoDB.
    """
    users_collection = mongo.db.users
    
    
    query = { 'role': { '$in': ['surgeon', 'paraprofessional'] } }
    
    # Exclude the password hash from the results for security
    projection = { 'password_hash': 0 }
    
    vets = list(users_collection.find(query, projection))
    
    # Convert MongoDB's _id object to a string for JSON compatibility
    for vet in vets:
        vet['_id'] = str(vet['_id'])
        # Handle potential datetime objects if you store expiry as date
        if 'license_expiry' in vet and isinstance(vet['license_expiry'], datetime):
            vet['license_expiry'] = vet['license_expiry'].isoformat()

    
    return jsonify({"vets": vets}), 200


@app.route('/admin-login', methods=['POST', 'OPTIONS'])
def admin_login():
    """
    Handle admin login and authentication.
    """
    # Handle preflight OPTIONS request
    if request.method == 'OPTIONS':
        response = make_response()
        return response

    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    users_collection = mongo.db.users
    user = users_collection.find_one({'email': email, 'role': 'admin'})

    if not user or not bcrypt.check_password_hash(user['password_hash'], password):
        return jsonify({'error': 'Invalid email or password'}), 401

    #This is the identity subject
    identity_string = str(user['_id'])

    #Identity with user Id and role
    additional_claims = {
        'user_id': str(user['_id']),
        'email': user['email'],
        'role': user.get('role')
    }
    access_token = create_access_token(
        identity=identity_string,
        additional_claims=additional_claims
        )

    response = jsonify({
        'message': 'Login successful',
        'access_token': access_token,
        'role': user.get('role')
    }), 200

    return response


@app.route('/api/admin/stats', methods=['GET'])
@jwt_required()
def admin_dashboard():
    """
    API endpoint to fetch admin dashboard data.
    """
    users_collection = mongo.db.users
    
    
    query = { 'role': { '$in': ['surgeon', 'paraprofessional', 'farmer'] } }
    
    # Exclude the password hash from the results for security
    projection = { 'password_hash': 0 }
    
    vets = list(users_collection.find(query, projection))
    
    # Convert MongoDB's _id object to a string for JSON compatibility
    for vet in vets:
        vet['_id'] = str(vet['_id'])
        # Handle potential datetime objects if you store expiry as date
        if 'license_expiry' in vet and isinstance(vet['license_expiry'], datetime):
            vet['license_expiry'] = vet['license_expiry'].isoformat()
    
        return jsonify({"vets": vets}), 200

@app.route('/api/admin/farmers', methods=['GET'])
@jwt_required()
def admin_farmers():
    """
    API endpoint to fetch all farmers for the admin dashboard.
    """
    users_collection = mongo.db.users
    
    
    query = { 'role': 'farmer' }
    
    # Exclude the password hash from the results for security
    projection = { 'password_hash': 0 }
    
    vets = list(users_collection.find(query, projection))
    
    # Convert MongoDB's _id object to a string for JSON compatibility
    for vet in vets:
        vet['_id'] = str(vet['_id'])
        # Handle potential datetime objects if you store expiry as date
        if 'license_expiry' in vet and isinstance(vet['license_expiry'], datetime):
            vet['license_expiry'] = vet['license_expiry'].isoformat()

    return jsonify({"farmers": vets}), 200

@app.route('/api/admin/surgeons', methods=['GET'])
@jwt_required()
def admin_surgeons():
    """
    API endpoint to fetch all surgeons for the admin dashboard.
    """
    users_collection = mongo.db.users
    
    
    query = { 'role': 'surgeon' }
    
    # Exclude the password hash from the results for security
    projection = { 'password_hash': 0 }
    
    vets = list(users_collection.find(query, projection))
    
    # Convert MongoDB's _id object to a string for JSON compatibility
    for vet in vets:
        vet['_id'] = str(vet['_id'])
        # Handle potential datetime objects if you store expiry as date
        if 'license_expiry' in vet and isinstance(vet['license_expiry'], datetime):
            vet['license_expiry'] = vet['license_expiry'].isoformat()

    return jsonify({"surgeons": vets}), 200

@app.route('/api/admin/paraprofessionals', methods=['GET'])
@jwt_required()
def admin_paraprofessionals():
    """
    API endpoint to fetch all paraprofessionals for the admin dashboard.
    """
    users_collection = mongo.db.users
    
    
    query = { 'role': 'paraprofessional' }
    
    # Exclude the password hash from the results for security
    projection = { 'password_hash': 0 }
    
    vets = list(users_collection.find(query, projection))
    
    # Convert MongoDB's _id object to a string for JSON compatibility
    for vet in vets:
        vet['_id'] = str(vet['_id'])
        # Handle potential datetime objects if you store expiry as date
        if 'license_expiry' in vet and isinstance(vet['license_expiry'], datetime):
            vet['license_expiry'] = vet['license_expiry'].isoformat()

    return jsonify({"paraprofessionals": vets}), 200

@app.route('/api/admin/transactions', methods=['GET'])
@jwt_required()
def admin_transactions():
    """
    API endpoint to fetch all transactions for the admin dashboard.
    """
    transactions_collection = mongo.db.transactions
    
    transactions = list(transactions_collection.find())
    
    # Convert MongoDB's _id object to a string for JSON compatibility
    for transaction in transactions:
        transaction['_id'] = str(transaction['_id'])
        # Handle potential datetime objects
        if 'date' in transaction and isinstance(transaction['date'], datetime):
            transaction['date'] = transaction['date'].isoformat()

    return jsonify({"transactions": transactions}), 200

    @app.route('/api/admin/users/<user_id>', methods=['PUT', 'DELETE'])
    @jwt_required()
    def admin_manage_user(user_id):
        """
        PUT: Admin updates a user's profile (cannot change password here).
        DELETE: Admin deletes a user (cannot delete themselves).
        """
        admin_id = get_jwt_identity()
        users_collection = mongo.db.users

        # Verify admin privileges
        try:
            admin = users_collection.find_one({"_id": ObjectId(admin_id)})
        except Exception:
            return jsonify({"error": "Invalid admin id"}), 400

        if not admin or admin.get("role") != "admin":
            return jsonify({"error": "Forbidden: admin access required"}), 403

        # Validate target user id
        try:
            target_obj_id = ObjectId(user_id)
        except Exception:
            return jsonify({"error": "Invalid user id"}), 400

        # DELETE: remove user
        if request.method == "DELETE":
            if str(target_obj_id) == str(admin_id):
                return jsonify({"error": "Admins cannot delete their own account"}), 400

            result = users_collection.delete_one({"_id": target_obj_id})
            if result.deleted_count == 0:
                return jsonify({"error": "User not found"}), 404

            return jsonify({"message": "User deleted successfully"}), 200

        # PUT: update user
        data = request.get_json() or {}
        # Allowed fields (explicit)
        allowed_keys = {
            "firstName", "lastName", "email", "role",
            "phone1", "phone2", "location", "avatarUrl",
            "license_number", "license_expiry"
        }
        update_fields = {k: v for k, v in data.items() if k in allowed_keys and v is not None}

        if not update_fields:
            return jsonify({"error": "No valid fields provided for update"}), 400

        # If email is changing, ensure uniqueness
        if "email" in update_fields:
            existing = users_collection.find_one({"email": update_fields["email"], "_id": {"$ne": target_obj_id}})
            if existing:
                return jsonify({"error": "Email already in use by another account"}), 400

        # If role provided, validate allowed roles
        if "role" in update_fields:
            if update_fields["role"] not in {"admin", "surgeon", "paraprofessional", "farmer", "user"}:
                return jsonify({"error": "Invalid role"}), 400

        # Parse license_expiry if present (expect YYYY-MM-DD)
        if "license_expiry" in update_fields:
            val = update_fields["license_expiry"]
            if isinstance(val, str) and val:
                try:
                    update_fields["license_expiry"] = datetime.strptime(val, "%Y-%m-%d")
                except ValueError:
                    return jsonify({"error": "license_expiry must be YYYY-MM-DD"}), 400
            else:
                # remove if empty or invalid type
                update_fields.pop("license_expiry", None)

        try:
            result = users_collection.update_one({"_id": target_obj_id}, {"$set": update_fields})
            if result.matched_count == 0:
                return jsonify({"error": "User not found"}), 404

            # Return updated user without password hash
            updated = users_collection.find_one({"_id": target_obj_id}, {"password_hash": 0})
            if updated:
                updated["_id"] = str(updated["_id"])
                if "license_expiry" in updated and isinstance(updated["license_expiry"], datetime):
                    updated["license_expiry"] = updated["license_expiry"].isoformat().split("T")[0]
                if "created_at" in updated and isinstance(updated["created_at"], datetime):
                    updated["created_at"] = updated["created_at"].isoformat()
            return jsonify({"message": "User updated successfully", "user": updated}), 200

        except Exception as e:
            app.logger.error(f"Admin manage user error: {e}")
            return jsonify({"error": "An error occurred while updating user"}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)

