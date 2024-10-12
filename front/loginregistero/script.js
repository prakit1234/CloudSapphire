// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCUjd9L2B5GKXYSugaGzS2u84CiKQDArpo",
    authDomain: "cloudsapphire-9321f.firebaseapp.com",
    projectId: "cloudsapphire-9321f",
    storageBucket: "cloudsapphire-9321f.appspot.com",
    messagingSenderId: "912305546515",
    appId: "1:912305546515:web:b373b5c8b7d601e1e5e6e6",
    measurementId: "G-C3PYVE5GQ2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Switch between Login and Register forms
const switchToRegister = document.getElementById('switchToRegister');
const formTitle = document.getElementById('formTitle');
const submitBtn = document.getElementById('submitBtn');
const usernameField = document.getElementById('username');
const confirmPasswordField = document.getElementById('confirmPassword');
const errorMessage = document.createElement('p'); // Create an error message element
errorMessage.style.color = 'red'; // Style for error message
document.querySelector('.form-container').appendChild(errorMessage); // Append to the form

switchToRegister.addEventListener('click', (e) => {
    e.preventDefault();
    formTitle.textContent = "Register";
    submitBtn.textContent = "Register";
    usernameField.style.display = 'block'; // Show username field
    confirmPasswordField.style.display = 'block'; // Show confirm password field
    switchToRegister.parentElement.innerHTML = "Already have an account? <a href='#' id='switchToLogin'>Login</a>";

    document.getElementById('switchToLogin').addEventListener('click', (e) => {
        e.preventDefault();
        formTitle.textContent = "Login";
        submitBtn.textContent = "Login";
        usernameField.style.display = 'none'; // Hide username field
        confirmPasswordField.style.display = 'none'; // Hide confirm password field
        switchToRegister.parentElement.innerHTML = "Don't have an account? <a href='#' id='switchToRegister'>Register</a>";
        errorMessage.textContent = ""; // Clear error message when switching
    });
});

// Handle Form Submission
document.getElementById('authForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (submitBtn.textContent === "Register") {
        const username = document.getElementById('username').value; // Get username

        // Check if passwords match
        if (password !== confirmPasswordField.value) {
            errorMessage.textContent = "Passwords do not match!";
            return;
        }

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log("User registered:", userCredential.user);
                window.location.href = 'dashboard.html'; // Change to your desired page
            })
            .catch((error) => {
                errorMessage.textContent = "Error registering: " + error.message; // Show error message
            });
    } else {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log("User logged in:", userCredential.user);
                window.location.href = 'dashboard.html'; // Change to your desired page
            })
            .catch((error) => {
                errorMessage.textContent = "Error logging in: " + error.message; // Show error message
            });
    }
});

// Google Sign-In functionality
const googleLoginBtn = document.getElementById('googleLoginBtn');

googleLoginBtn.addEventListener('click', () => {
    signInWithPopup(auth, provider)
        .then((result) => {
            console.log("User logged in with Google:", result.user);
            window.location.href = 'dashboard.html'; // Change to your desired page
        })
        .catch((error) => {
            errorMessage.textContent = "Error with Google login: " + error.message; // Show error message
        });
});


