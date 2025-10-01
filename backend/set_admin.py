import firebase_admin
from firebase_admin import credentials, auth

# 1. Load the service account key
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)

# 2. Replace with your Firebase Auth user's UID
uid = "vIei3El5PMP4Xzv4KZUbBebfdwU2"

# 3. Set admin claim
auth.set_custom_user_claims(uid, {"admin": True})

print(f"✅ User {uid} is now an admin")
