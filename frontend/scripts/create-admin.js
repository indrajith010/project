import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBk0k-i5iCKwvLPu_IIOrPbh2hMcsX9hhk",
  authDomain: "coustomer-master.firebaseapp.com",
  databaseURL: "https://coustomer-master-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "coustomer-master",
  storageBucket: "coustomer-master.appspot.com",
  messagingSenderId: "84374004658",
  appId: "1:84374004658:web:66282b404d8a85751f3aab",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// Function to create the initial admin user
async function createAdminUser() {
  const email = "admin@example.com";
  const password = "Admin123!";
  const name = "System Administrator";
  
  try {
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Add user data to the database with admin role
    await set(ref(db, `users/${user.uid}`), {
      id: user.uid,
      email: email,
      name: name,
      role: 'admin',
      createdAt: Date.now()
    });
    
    console.log("Admin user created successfully:", user.uid);
    return user;
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.log("Admin user already exists. Trying to sign in...");
      
      // Try to sign in
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("Signed in as:", userCredential.user.email);
        return userCredential.user;
      } catch (signInError) {
        console.error("Error signing in:", signInError);
        throw signInError;
      }
    } else {
      console.error("Error creating admin user:", error);
      throw error;
    }
  }
}

// Execute the function
createAdminUser()
  .then(() => {
    console.log("Script completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Script failed:", error);
    process.exit(1);
  });