// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-analytics.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCUjd9L2B5GKXYSugaGzS2u84CiKQDArpo",
  authDomain: "cloudsapphire-9321f.firebaseapp.com",
  projectId: "cloudsapphire-9321f",
  storageBucket: "cloudsapphire-9321f.appspot.com",
  messagingSenderId: "912305546515",
  appId: "1:912305546515:web:b373b5c8b7d601e1e5e6e6",
  measurementId: "G-C3PYVE5GQ2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

// Google Sign-In functionality
const googleLoginBtn = document.getElementById('googleLoginBtn');
const provider = new GoogleAuthProvider();

googleLoginBtn.addEventListener('click', () => {
    signInWithPopup(auth, provider)
        .then((result) => {
            console.log("User logged in with Google:", result.user);
        })
        .catch((error) => {
            console.error("Error with Google login:", error);
        });
});

// Email/Password Register function
const registerForm = document.getElementById('registerForm');

registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = registerForm[0].value;
    const password = registerForm[1].value;

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log("User registered:", userCredential.user);
        })
        .catch((error) => {
            console.error("Error registering:", error);
        });
});

// Email/Password Login function
const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = loginForm[0].value;
    const password = loginForm[1].value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log("User logged in:", userCredential.user);
        })
        .catch((error) => {
            console.error("Error logging in:", error);
        });
});
