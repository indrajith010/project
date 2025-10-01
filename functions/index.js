const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Initialize the Firebase Admin SDK
admin.initializeApp();

/**
 * Cloud function that triggers when a new user is created in Firebase Auth
 * and automatically adds them to the Realtime Database
 */
exports.createUserProfile = functions.auth.user().onCreate((user) => {
  // Get the user data we want to save
  const { uid, email, displayName } = user;
  
  // Create a new user object with default values
  const newUser = {
    id: uid,
    email: email || '',
    name: displayName || '',
    role: 'user', // Default role is 'user', admin can be set manually later
    createdAt: admin.database.ServerValue.TIMESTAMP, // Server timestamp
  };
  
  // Reference to the user's document in the database
  const userRef = admin.database().ref(`/users/${uid}`);
  
  console.log(`Creating new user profile for ${email} with uid: ${uid}`);
  
  // Set the user data in the database
  return userRef.set(newUser)
    .then(() => {
      console.log(`Successfully created new user profile for ${email}`);
      return null;
    })
    .catch((error) => {
      console.error('Error creating user profile:', error);
      return null;
    });
});

/**
 * Optional function to clean up user data when a user is deleted from Firebase Auth
 */
exports.deleteUserProfile = functions.auth.user().onDelete((user) => {
  // Get the user ID
  const { uid } = user;
  
  console.log(`Deleting user profile for uid: ${uid}`);
  
  // Reference to the user's document in the database
  const userRef = admin.database().ref(`/users/${uid}`);
  
  // Remove the user data from the database
  return userRef.remove()
    .then(() => {
      console.log(`Successfully deleted user profile for uid: ${uid}`);
      return null;
    })
    .catch((error) => {
      console.error('Error deleting user profile:', error);
      return null;
    });
});