// JavaScript functionality to switch forms and handle login/register
const switchToRegister = document.getElementById('switchToRegister');
const formTitle = document.getElementById('formTitle');
const submitBtn = document.getElementById('submitBtn');

switchToRegister.addEventListener('click', (e) => {
    e.preventDefault();
    formTitle.textContent = "Register";
    submitBtn.textContent = "Register";
    switchToRegister.parentElement.innerHTML = "Already have an account? <a href='#' id='switchToLogin'>Login</a>";
    
    document.getElementById('switchToLogin').addEventListener('click', (e) => {
        e.preventDefault();
        formTitle.textContent = "Login";
        submitBtn.textContent = "Login";
        switchToRegister.parentElement.innerHTML = "Don't have an account? <a href='#' id='switchToRegister'>Register</a>";
    });
});

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Switch between Login and Register forms
const switchToRegister = document.getElementById('switchToRegister');
const formTitle = document.getElementById('formTitle');
const submitBtn = document.getElementById('submitBtn');

switchToRegister.addEventListener('click', (e) => {
    e.preventDefault();
    formTitle.textContent = "Register";
    submitBtn.textContent = "Register";
    switchToRegister.parentElement.innerHTML = "Already have an account? <a href='#' id='switchToLogin'>Login</a>";
    
    document.getElementById('switchToLogin').addEventListener('click', (e) => {
        e.preventDefault();
        formTitle.textContent = "Login";
        submitBtn.textContent = "Login";
        switchToRegister.parentElement.innerHTML = "Don't have an account? <a href='#' id='switchToRegister'>Register</a>";
    });
});

// Register function
document.getElementById('authForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (submitBtn.textContent === "Register") {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log("User registered:", userCredential.user);
            })
            .catch((error) => {
                console.error("Error registering:", error);
            });
    } else {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log("User logged in:", userCredential.user);
            })
            .catch((error) => {
                console.error("Error logging in:", error);
            });
    }
});

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


