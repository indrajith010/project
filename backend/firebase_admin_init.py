# import os
# import firebase_admin
# from firebase_admin import credentials, firestore
# from dotenv import load_dotenv

# # Load .env so we can read GOOGLE_APPLICATION_CREDENTIALS etc.
# load_dotenv()

# _app = None
# _db = None

# def init_firebase():
#     global _app, _db
#     if _app is not None and _db is not None:
#         return _db

#     creds_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
#     if not creds_path or not os.path.exists(creds_path):
#         raise RuntimeError(
#             "Service account JSON not found. "
#             "Set GOOGLE_APPLICATION_CREDENTIALS in .env to an ABSOLUTE path, e.g. "
#             r"C:\Users\MK\Desktop\project\backend\service-account.json"
#         )

#     cred = credentials.Certificate(creds_path)
#     _app = firebase_admin.initialize_app(cred)
#     _db = firestore.client()
#     return _db

# def get_db():
#     return init_firebase()


# ---------------------------------------------------------


# import firebase_admin
# from firebase_admin import credentials, firestore


# # Service account JSON path (Firebase Console → Project Settings → Service Accounts → Generate new private key)
# cred = credentials.Certificate("service-account.json")

# # Initialize app
# if not firebase_admin._apps:  # prevent re-initialization
#     firebase_admin.initialize_app(cred)

# # Firestore DB
# db = firestore.client()

# ---------------------------------------------------------


# import os
# from firebase_admin import credentials, firestore, initialize_app

# # Current file directory (backend/firebase_admin_init.py)
# BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# # Point to your service account JSON
# cred = credentials.Certificate(os.path.join(BASE_DIR, "service-account.json"))

# # Initialize Firebase app
# initialize_app(cred)

# # Firestore database client
# db = firestore.client()

# # ---------------------------------------------------------

import os
import firebase_admin
from firebase_admin import credentials, firestore

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SERVICE_FILE = os.path.join(BASE_DIR, "service-account.json")  # same folder

# initialize once
if not firebase_admin._apps:
    cred = credentials.Certificate(SERVICE_FILE)
    firebase_admin.initialize_app(cred)

db = firestore.client()
