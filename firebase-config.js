// Firebase configuration and initialization
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyC-GitnL2v0lkn2GlJ_xC6D4OJP4h_Ppik",
  authDomain: "class-47337.firebaseapp.com",
  projectId: "class-47337",
  storageBucket: "class-47337.firebasestorage.app",
  messagingSenderId: "202217661154",
  appId: "1:202217661154:web:a141035b8db2626421f4bb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
