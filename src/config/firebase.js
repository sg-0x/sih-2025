import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA2rLcXVAmJZtHxN4TXy4qmKJFWlVf9TLA",
  authDomain: "sih2025-f718e.firebaseapp.com",
  projectId: "sih2025-f718e",
  storageBucket: "sih2025-f718e.firebasestorage.app",
  messagingSenderId: "753671979434",
  appId: "1:753671979434:web:c0eeca65cb54aaae88abd3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
