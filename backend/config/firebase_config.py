"""
Firebase configuration and initialization module.
Handles Firebase Admin SDK setup using environment variables.
"""

import os
import json
import firebase_admin
from firebase_admin import credentials, db as firebase_db
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class FirebaseConfig:
    """Firebase configuration manager"""
    
    def __init__(self):
        self.app = None
        self.db_ref = None
        self._init_firebase()
    
    def _get_credentials_from_env(self):
        """Create Firebase credentials from environment variables"""
        try:
            # Create service account info from environment variables
            service_account_info = {
                "type": "service_account",
                "project_id": os.getenv('FIREBASE_PROJECT_ID'),
                "private_key_id": os.getenv('FIREBASE_PRIVATE_KEY_ID'),
                "private_key": os.getenv('FIREBASE_PRIVATE_KEY', '').replace('\\n', '\n'),
                "client_email": os.getenv('FIREBASE_CLIENT_EMAIL'),
                "client_id": os.getenv('FIREBASE_CLIENT_ID'),
                "auth_uri": os.getenv('FIREBASE_AUTH_URI', 'https://accounts.google.com/o/oauth2/auth'),
                "token_uri": os.getenv('FIREBASE_TOKEN_URI', 'https://oauth2.googleapis.com/token'),
                "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
                "client_x509_cert_url": os.getenv('FIREBASE_CERT_URL')
            }
            
            # Validate required fields
            required_fields = ['project_id', 'private_key', 'client_email']
            missing_fields = [field for field in required_fields if not service_account_info.get(field)]
            
            if missing_fields:
                raise ValueError(f"Missing required Firebase environment variables: {missing_fields}")
            
            return credentials.Certificate(service_account_info)
            
        except Exception as e:
            print(f"❌ Error creating Firebase credentials: {e}")
            print("💡 Make sure all Firebase environment variables are set in .env file")
            raise
    
    def _init_firebase(self):
        """Initialize Firebase Admin SDK"""
        if firebase_admin._apps:
            # Already initialized
            self.app = firebase_admin.get_app()
            self.db_ref = firebase_db.reference()
            return
        
        try:
            print("🔄 Initializing Firebase Admin SDK...")
            
            # Get credentials from environment
            cred = self._get_credentials_from_env()
            
            # Initialize Firebase app
            database_url = os.getenv('FIREBASE_DATABASE_URL')
            if not database_url:
                raise ValueError("FIREBASE_DATABASE_URL environment variable is required")
            
            self.app = firebase_admin.initialize_app(cred, {
                'databaseURL': database_url
            })
            
            # Get database reference
            self.db_ref = firebase_db.reference()
            
            print("✅ Firebase initialized successfully")
            print(f"🔗 Connected to: {database_url}")
            
            # Test connection
            self._test_connection()
            
        except Exception as e:
            print(f"❌ Firebase initialization failed: {e}")
            self.app = None
            self.db_ref = None
            raise
    
    def _test_connection(self):
        """Test Firebase connection"""
        try:
            test_ref = self.db_ref.child('health_check')
            test_ref.set({
                'status': 'connected',
                'timestamp': firebase_db.ServerValue.TIMESTAMP
            })
            
            # Read back to verify
            data = test_ref.get()
            if data and data.get('status') == 'connected':
                print("✅ Firebase connection test passed")
                # Clean up test data
                test_ref.delete()
            else:
                raise Exception("Connection test failed - unable to read/write data")
                
        except Exception as e:
            print(f"❌ Firebase connection test failed: {e}")
            raise
    
    def get_database_ref(self):
        """Get Firebase Realtime Database reference"""
        if not self.db_ref:
            raise RuntimeError("Firebase not initialized")
        return self.db_ref
    
    def sync_data(self, path, data):
        """Sync data to Firebase"""
        try:
            if self.db_ref:
                self.db_ref.child(path).set(data)
                return True
        except Exception as e:
            print(f"❌ Firebase sync error for {path}: {e}")
        return False
    
    def delete_data(self, path):
        """Delete data from Firebase"""
        try:
            if self.db_ref:
                self.db_ref.child(path).delete()
                return True
        except Exception as e:
            print(f"❌ Firebase delete error for {path}: {e}")
        return False

# Global Firebase instance
firebase_config = None

def get_firebase():
    """Get Firebase configuration instance"""
    global firebase_config
    if firebase_config is None:
        firebase_config = FirebaseConfig()
    return firebase_config

def get_db_ref():
    """Get Firebase database reference"""
    return get_firebase().get_database_ref()

def sync_to_firebase(path, data):
    """Sync data to Firebase"""
    return get_firebase().sync_data(path, data)

def delete_from_firebase(path):
    """Delete data from Firebase"""
    return get_firebase().delete_data(path)