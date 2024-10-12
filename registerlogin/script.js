// Initialize Firebase
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Switch forms
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const switchToRegister = document.getElementById('switchToRegister');
const switchToLogin = document.getElementById('switchToLogin');

switchToRegister.addEventListener('click', () => {
    loginForm.parentElement.style.display = 'none';
    registerForm.parentElement.style.display = 'flex';
});

switchToLogin.addEventListener('click', () => {
    registerForm.parentElement.style.display = 'none';
    loginForm.parentElement.style.display = 'flex';
});

// Login function
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = loginForm[0].value;
    const password = loginForm[1].value;

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            console.log("User logged in:", userCredential.user);
        })
        .catch((error) => {
            console.error("Error logging in:", error);
        });
});

// Register function
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = registerForm[0].value;
    const password = registerForm[1].value;

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            console.log("User registered:", userCredential.user);
        })
        .catch((error) => {
            console.error("Error registering:", error);
        });
});

// Google Login
const googleLoginBtn = document.getElementById('googleLoginBtn');

googleLoginBtn.addEventListener('click', () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
        .then((result) => {
            console.log("User logged in with Google:", result.user);
        })
        .catch((error) => {
            console.error("Error with Google login:", error);
        });
});
