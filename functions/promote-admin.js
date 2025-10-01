const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Initialize the Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://coustomer-master-default-rtdb.asia-southeast1.firebasedatabase.app/"  // Update with your database URL
});

/**
 * Script to promote a user to admin role
 * @param {string} uid - The user ID to promote to admin
 * @returns {Promise<void>}
 */
async function promoteToAdmin(uid) {
  if (!uid) {
    console.error('Error: User ID is required');
    process.exit(1);
  }
  
  try {
    // Check if the user exists in Auth
    const userRecord = await admin.auth().getUser(uid);
    console.log(`Found user: ${userRecord.email}`);
    
    // Reference to the user document in the database
    const userRef = admin.database().ref(`/users/${uid}`);
    
    // Get the current user data
    const snapshot = await userRef.once('value');
    
    if (!snapshot.exists()) {
      console.error(`Error: User with ID ${uid} not found in the database`);
      process.exit(1);
    }
    
    const userData = snapshot.val();
    
    // Update the user role to admin
    await userRef.update({
      role: 'admin'
    });
    
    console.log(`Successfully promoted ${userRecord.email} to admin role`);
    process.exit(0);
  } catch (error) {
    console.error('Error promoting user:', error);
    process.exit(1);
  }
}

// Get the user ID from command line arguments
const uid = process.argv[2];

// Run the function
promoteToAdmin(uid);