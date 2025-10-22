from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt

mongo = PyMongo()
bcrypt = Bcrypt()

def get_users_collection():

    return mongo.db.users