<script lang="ts">
  import "./style.css";
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "firebase/app";
  import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyBMzvjbSoyroF8gqb0aA4vyC03j1G_hbpM",
    authDomain: "cloudsapphire-a1490.firebaseapp.com",
    projectId: "cloudsapphire-a1490",
    storageBucket: "cloudsapphire-a1490.appspot.com",
    messagingSenderId: "1058099541572",
    appId: "1:1058099541572:web:72a7d572eb2c9cc1f3ee11",
    measurementId: "G-SRVVMBVQZN",
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const provider = new GoogleAuthProvider();
  const auth = getAuth();

  let email: String;
  let password: String;

  async function loginWithGoogle() {
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  }
</script>

<div class="container">
  <div class="form-container">
    <form id="authForm">
      <h1 id="formTitle">Register</h1>
      <input
        type="email"
        id="email"
        placeholder="Email"
        bind:value={email}
        required
      />
      <input
        type="password"
        id="password"
        placeholder="Password"
        bind:value={password}
        required
      />
      <input type="text" id="username" placeholder="Username" required />
      <input
        type="password"
        id="confirmPassword"
        placeholder="Confirm Password"
        required
      />
      <button type="submit" id="submitBtn">Register</button>
      <button
        type="button"
        on:click={loginWithGoogle}
        class="google-button"
        id="googleLoginBtn">Login with Google</button
      >
      <span id="switchText"
        >Already have an account <a href="/login" id="switchToRegister">Login</a
        ></span
      >
    </form>
  </div>
</div>
