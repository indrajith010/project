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
from firebase_admin import credentials, db as firebase_db
from datetime import datetime

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SERVICE_FILE = os.path.join(BASE_DIR, "service-account.json")

# Database URL for your Firebase Realtime Database
DATABASE_URL = 'https://coustomer-master-default-rtdb.firebaseio.com/'

# initialize once
if not firebase_admin._apps:
    try:
        # First verify service account file exists
        if not os.path.exists(SERVICE_FILE):
            raise FileNotFoundError(f"Service account file not found at {SERVICE_FILE}")
        
        # Initialize with service account
        print(f"🔄 Initializing Firebase with service account from {SERVICE_FILE}")
        cred = credentials.Certificate(SERVICE_FILE)
        
        # Initialize the app
        print(f"🔄 Connecting to Firebase RTDB at {DATABASE_URL}")
        firebase_admin.initialize_app(cred, {
            'databaseURL': DATABASE_URL
        })
        
        # Test the connection with error handling
        print("🔄 Testing Firebase connection...")
        try:
            ref = firebase_db.reference('test')
            ref.set({'status': 'connected', 'timestamp': datetime.utcnow().isoformat()})
            test_data = ref.get()
            
            if test_data and isinstance(test_data, dict) and test_data.get('status') == 'connected':
                print(f"✅ Successfully connected to Firebase RTDB at {DATABASE_URL}")
                print("✅ Read/write permissions verified")
                ref.delete()  # Clean up test data
            else:
                raise Exception(f"Connection test failed. Got unexpected response: {test_data}")
                
        except firebase_admin.exceptions.FirebaseError as fe:
            raise Exception(f"Firebase operation failed. This might be a permissions issue. Error: {str(fe)}")
        except Exception as e:
            raise Exception(f"Connection test failed: {str(e)}")
            
    except FileNotFoundError as fnf:
        print("❌ Service account file error:")
        print(f"   {str(fnf)}")
        print("⚠️  Please make sure:")
        print("   1. You have downloaded the service account JSON from Firebase Console")
        print("   2. The file is named 'service-account.json' and is in the backend folder")
        raise
    except firebase_admin.exceptions.FirebaseError as fe:
        print("❌ Firebase configuration error:")
        print(f"   {str(fe)}")
        print("⚠️  Please verify:")
        print("   1. Your service account has the necessary permissions")
        print("   2. The database URL is correct")
        print("   3. The Realtime Database is created in your Firebase project")
        print(f"   4. You can access {DATABASE_URL} in the Firebase Console")
        raise
    except Exception as e:
        print(f"❌ Firebase initialization failed: {str(e)}")
        print("⚠️  Common solutions:")
        print("   1. Verify your Firebase project settings")
        print("   2. Check if Realtime Database is enabled")
        print("   3. Verify database rules allow read/write")
        print("   4. Ensure service account has required permissions")
        raise

# Get database reference
db = firebase_db.reference()
