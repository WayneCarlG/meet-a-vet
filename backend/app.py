import os
from flask import Flask, jsonify, request, make_response
from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt
from datetime import datetime
from bson.objectid import ObjectId
from flask_cors import CORS
from config import Config
from flask_jwt_extended import JWTManager, create_access_token, JWTManager,jwt_required, get_jwt_identity, set_access_cookies

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
    return "Welcome to the Farm Application API!"

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



if __name__ == '__main__':
    app.run(debug=True, port=5000)

