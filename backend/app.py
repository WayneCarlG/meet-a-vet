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


if __name__ == '__main__':
    app.run(debug=True)