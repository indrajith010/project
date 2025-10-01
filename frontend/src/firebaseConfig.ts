

import { initializeApp, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBk0k-i5iCKwvLPu_IIOrPbh2hMcsX9hhk",
  authDomain: "coustomer-master.firebaseapp.com",
  databaseURL: "https://coustomer-master-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "coustomer-master",
  storageBucket: "coustomer-master.appspot.com",
  messagingSenderId: "84374004658",
  appId: "1:84374004658:web:66282b404d8a85751f3aab",
};

// Create a singleton instance
let firebaseApp;

try {
  // Try to get an existing app instance
  firebaseApp = getApp();
} catch {
  // Initialize a new app if none exists
  firebaseApp = initializeApp(firebaseConfig);
}

// Initialize services
const database = getDatabase(firebaseApp);
const authInstance = getAuth(firebaseApp);

// Exports
export const app = firebaseApp;
export const db = database;
export const auth = authInstance;

export default app;
