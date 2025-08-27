// import { collection, addDoc, getDocs } from "firebase/firestore";
// import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";

// const firebaseConfig = {
//   apiKey: "AIzaSyBk0k-i5iCKwvLPu_IIOrPbh2hMcsX9hhk",
//   authDomain: "coustomer-master.firebaseapp.com",
//   projectId: "coustomer-master",
//   storageBucket: "coustomer-master.firebasestorage.app",
//   messagingSenderId: "84374004658",
//   appId: "1:84374004658:web:66282b404d8a85751f3aab",
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// // Firestore reference
// export const db = getFirestore(app);


// ---------------------------------------------------------


// import { initializeApp } from "firebase/app";
// import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";

// const firebaseConfig = {
//   apiKey: "AIzaSyBk0k-i5iCKwvLPu_IIOrPbh2hMcsX9hhk",
//   authDomain: "coustomer-master.firebaseapp.com",
//   projectId: "coustomer-master",
//   storageBucket: "coustomer-master.firebasestorage.app",
//   messagingSenderId: "84374004658",
//   appId: "1:84374004658:web:66282b404d8a85751f3aab",
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// // Firestore reference
// export const db = getFirestore(app);



// ----------------------------------------


import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBk0k-i5iCKwvLPu_IIOrPbh2hMcsX9hhk",
  authDomain: "coustomer-master.firebaseapp.com",
  projectId: "coustomer-master",
  storageBucket: "coustomer-master.appspot.com", // ✅ fix here
  messagingSenderId: "84374004658",
  appId: "1:84374004658:web:66282b404d8a85751f3aab",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
