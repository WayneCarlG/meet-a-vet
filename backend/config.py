import os


class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or ("e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855")
    MONGO_URI = "mongodb://localhost:27017/meet_a_vet"

    # JWT Configuration
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855")
    JWT_ACCESS_TOKEN_EXPIRES = 3600  # 1 hour in seconds
    JWT_TOKEN_LOCATION = ['headers']
    JWT_COOKIE_SECURE = False  # Set to True in production with HTTPS
    JWT_HEADER_NAME = 'Authorization'
    JWT_HEADER_TYPE = 'Bearer'