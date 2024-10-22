// Initialize Supabase
const SUPABASE_URL = 'https://tdijndlgrelaackyrnal.supabase.co';
const SUPABASE_KEY = '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'; 
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Switch between Login and Register forms
const switchToRegister = document.getElementById('switchToRegister');
const formTitle = document.getElementById('formTitle');
const submitBtn = document.getElementById('submitBtn');
const usernameField = document.getElementById('username');
const confirmPasswordField = document.getElementById('confirmPassword');
const errorMessage = document.createElement('p');
errorMessage.style.color = 'red';
document.querySelector('.form-container').appendChild(errorMessage);

switchToRegister.addEventListener('click', (e) => {
    e.preventDefault();
    formTitle.textContent = "Register";
    submitBtn.textContent = "Register";
    usernameField.style.display = 'block';
    confirmPasswordField.style.display = 'block';
    switchToRegister.parentElement.innerHTML = "Already have an account? <a href='#' id='switchToLogin'>Login</a>";

    // Add listener for Login switch
    document.getElementById('switchToLogin').addEventListener('click', (e) => {
        e.preventDefault();
        formTitle.textContent = "Login";
        submitBtn.textContent = "Login";
        usernameField.style.display = 'none';
        confirmPasswordField.style.display = 'none';
        switchToRegister.parentElement.innerHTML = "Don't have an account? <a href='#' id='switchToRegister'>Register</a>";
        errorMessage.textContent = ""; // Clear error message
    });
});

// Handle Form Submission for Registration and Login
document.getElementById('authForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (submitBtn.textContent === "Register") {
        const username = usernameField.value;

        // Check if passwords match
        if (password !== confirmPasswordField.value) {
            errorMessage.textContent = "Passwords do not match!";
            return;
        }

        // Register user with Supabase
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: { username: username }
            }
        });

        if (error) {
            errorMessage.textContent = "Error registering: " + error.message;
        } else {
            console.log("User registered:", data.user);
            window.location.href = 'dashboard.html'; // Redirect to dashboard
        }
    } else {
        // Login user with Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) {
            errorMessage.textContent = "Error logging in: " + error.message;
        } else {
            console.log("User logged in:", data.user);
            window.location.href = 'dashboard.html'; // Redirect to dashboard
        }
    }
});

// Google Sign-In functionality with Supabase
const googleLoginBtn = document.getElementById('googleLoginBtn');

googleLoginBtn.addEventListener('click', async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google'
    });

    if (error) {
        errorMessage.textContent = "Error with Google login: " + error.message;
    } else {
        console.log("User logged in with Google:", data);
        window.location.href = 'dashboard.html'; // Redirect to dashboard
    }
});
