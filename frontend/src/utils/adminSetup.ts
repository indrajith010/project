import { auth, db } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';

interface InitialAdminData {
  email: string;
  password: string;
  name: string;
}

export const initializeFirstAdmin = async (adminData: InitialAdminData): Promise<void> => {
  try {
    // Create the admin user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      adminData.email,
      adminData.password
    );

    // Create admin user data in Realtime Database
    await set(ref(db, `users/${userCredential.user.uid}`), {
      id: userCredential.user.uid,
      email: adminData.email,
      name: adminData.name,
      role: 'admin',
      createdAt: Date.now(),
      isFirstAdmin: true // Flag to identify the original admin
    });

    console.log('First admin user created successfully');
  } catch (error: any) {
    console.error('Error creating first admin:', error);
    throw error;
  }
};

export const createDefaultDatabaseRules = async (): Promise<void> => {
  // Note: Database rules should be set in the Firebase Console
  // This is just a reference for the required structure
  const rules = {
    rules: {
      ".read": "auth != null",
      ".write": "auth != null",
      "users": {
        ".read": "auth != null",
        "$uid": {
          ".write": "auth != null && (root.child('users').child(auth.uid).child('role').val() === 'admin' || auth.uid === $uid)"
        }
      },
      "customers": {
        ".read": "auth != null",
        ".write": "auth != null"
      }
    }
  };

  console.log('Please set the following rules in your Firebase Console:');
  console.log(JSON.stringify(rules, null, 2));
};