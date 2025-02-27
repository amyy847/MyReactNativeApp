// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDpLbvw6FQGYVKYBsDfZ4gA34EendfMJxY",
  authDomain: "go-drives-demo-app.firebaseapp.com",
  projectId: "go-drives-demo-app",
  storageBucket: "go-drives-demo-app.firebasestorage.app",
  messagingSenderId: "355879481843",
  appId: "1:355879481843:web:04b961da04a59a9cb16286",
  measurementId: "G-Q60BDM4N00"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { auth };