import os


class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or ("e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855")
    # MONGO_URI = "mongodb://localhost:27017/meet_a_vet"
    MONGO_URI = "mongodb+srv://waynegwasonga:qFlqO66uBdNsxaNV@cluster0.kmuygxr.mongodb.net/?appName=Cluster0"


    # JWT Configuration
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855")
    JWT_ACCESS_TOKEN_EXPIRES = 3600  # 1 hour in seconds
    JWT_TOKEN_LOCATION = ['headers']
    JWT_COOKIE_SECURE = False  # Set to True in production with HTTPS
    JWT_HEADER_NAME = 'Authorization'
    JWT_HEADER_TYPE = 'Bearer'

    #Agora Configuration
    AGORA_APP_ID = os.environ.get("AGORA_APP_ID", "21d5e6cb134b4ca6886400ae74aceabf")
    AGORA_APP_CERTIFICATE = os.environ.get("AGORA_APP_CERTIFICATE", "3060ccb04f88488ebff0f348a10e578e")

    #Daraja Configuration
    DARJA_API_KEY = os.environ.get("DARJA_API_KEY", "dAi54iRAUGPh190tIOc99TxCm4aefNltIDMyV0qZImROWM2V")
    DARJA_API_SECRET = os.environ.get("DARJA_API_SECRET", "Oe4I3Z5AyhNaafPmAOn6YUrWBZu2G2gF0GPi7z1cJd9yUAGSQiSAVYrd19A4PtZa")
    DARJA_SHORTCODE = os.environ.get("DARJA_SHORTCODE", "174379")
    DARJA_PASSKEY = os.environ.get("DARJA_PASSKEY", "ox1cDKMBoocg8QVXweWhaqlAt3r270Bvv8Rkn1PYkhFN5wJb1EfNep61d41ZYhJg4QNX5fQD25qEMYtZzkVAG6KqtBQrK7Y6irFtwZWmYVlmteW9Iqeex0PUJaoA/vTHjT8V35/+UXwNr1PBowxLRfaS3I4P6NiKz9OhpXdpwBLXOHtgoE0mINEKldawxaY8+JpK0PRorufdkQRpL3K326Wdx1FlGhFQvmBWwVdj/v5WrgCXvZCRCiRyTRuTgmVbMkhBLD6Sq3q4fx6D8sPll3t/aENYKxF8OADt7vm11WJ9WoDJBauNae16XkKflGxSikUQmg9jBUCnzmPRzoULTA==")

    AUTH_URL = os.environ.get("AUTH_URL", "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials")
    STK_PUSH_URL = os.environ.get("STK_PUSH_URL", "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest")

    #Ngrok Configuration
    NGROK_AUTH_TOKEN = os.environ.get("NGROK_AUTH_TOKEN","356yo8eOQSsBcRrdF1TUWtgSkNM_5hUHac9MBvYcqgwDNKbiK")
    NGROK_URL = os.environ.get("NGROK_URL","https://unincorporated-unfeminine-gertrudis.ngrok-free.dev")