import firebase_admin
from firebase_admin import credentials, auth, db
import uuid
import getpass
import sys

def create_admin_user():
    print("===== Create Initial Admin User =====")
    
    # Initialize Firebase Admin SDK
    try:
        cred = credentials.Certificate("serviceAccountKey.json")
        firebase_admin.initialize_app(cred, {
            'databaseURL': 'https://coustomer-master-default-rtdb.asia-southeast1.firebasedatabase.app/'
        })
        print("✅ Firebase Admin SDK initialized")
    except Exception as e:
        print(f"❌ Failed to initialize Firebase Admin SDK: {e}")
        return
    
    try:
        # Collect user information
        email = input("Enter admin email: ")
        name = input("Enter admin name: ")
        password = getpass.getpass("Enter admin password (min 6 characters): ")
        
        if len(password) < 6:
            print("❌ Password must be at least 6 characters")
            return
            
        # Create user with Firebase Auth
        user = auth.create_user(
            email=email,
            password=password,
            display_name=name,
            email_verified=True
        )
        
        print(f"✅ User created with UID: {user.uid}")
        
        # Store user in Realtime Database with admin role
        ref = db.reference(f'users/{user.uid}')
        ref.set({
            'id': user.uid,
            'email': email,
            'name': name,
            'role': 'admin',
            'createdAt': {".sv": "timestamp"}
        })
        
        print(f"✅ User {email} set as admin in the database")
        print("\n===== Admin User Created Successfully =====")
        print(f"Email: {email}")
        print(f"User ID: {user.uid}")
        print("You can now log in with these credentials")
        
    except Exception as e:
        if "ALREADY_EXISTS" in str(e):
            print(f"❌ User with email {email} already exists")
            
            # Attempt to update existing user to admin
            try:
                user = auth.get_user_by_email(email)
                ref = db.reference(f'users/{user.uid}')
                current_data = ref.get()
                
                if current_data and current_data.get('role') == 'admin':
                    print(f"✅ User {email} is already an admin")
                else:
                    ref.update({
                        'role': 'admin'
                    })
                    print(f"✅ Updated {email} to admin role")
            except Exception as update_error:
                print(f"❌ Failed to update user: {update_error}")
        else:
            print(f"❌ Error creating admin user: {e}")

if __name__ == "__main__":
    create_admin_user()