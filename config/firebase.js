import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // ✅ Import Storage

const firebaseConfig = {
  apiKey: "AIzaSyDpLbvw6FQGYVKYBsDfZ4gA34EendfMJxY",
  authDomain: "go-drives-demo-app.firebaseapp.com",
  projectId: "go-drives-demo-app",
  storageBucket: "go-drives-demo-app.appspot.com", // ✅ Fixed
  messagingSenderId: "355879481843",
  appId: "1:355879481843:web:04b961da04a59a9cb16286",
  measurementId: "G-Q60BDM4N00"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // ✅ Add Storage

export { auth, db, storage }; // ✅ Export storage
