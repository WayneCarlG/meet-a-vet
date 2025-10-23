from flask import Flask, jsonify, request
from config import Config
from models import mongo, bcrypt, get_users_collection
from datetime import datetime
from bson.objectid import ObjectId
from flask_cors import CORS

app = Flask(__name__)
app.config.from_object(Config)

CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

mongo.init_app(app)
bcrypt.init_app(app)

@app.route('/register', methods=['POST'])
def register():
    data =  request.get.json()
    email = data.get('email')
    password = data.get('password')
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    role = data.get('role')

    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400
    users_collection = get_users_collection()
    if users_collection.find_one({'email': email}):
        return jsonify({'error': 'Email already exists'}), 400
    user = {
        'email': email,
        'password': hashed_password,
        'role': role,
        'created_at': datetime.utcnow()
    }
    users_collection.insert_one(user)
    return jsonify({'message': 'User registered successfully'
    'user_email':email,
    'role': role
    }), 201


if __name__ == '__main__':
    app.run(debug=True)