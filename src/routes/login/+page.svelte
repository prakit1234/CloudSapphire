<script lang="ts">
  import "./style.css";
  import { goto } from "$app/navigation";
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
  async function login(email: string) {
    goto("/dashboard");
  }
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
        //@ts-ignore
        sessionStorage.setItem("Display Name", user.displayName);
        //@ts-ignore
        sessionStorage.setItem("Email", user.email);
        //@ts-ignore
        login(user.email);
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
      <h1 id="formTitle">Login</h1>
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
      <button type="submit" id="submitBtn">Login</button>
      <button
        type="button"
        class="google-button"
        id="googleLoginBtn"
        on:click={loginWithGoogle}>Login with Google</button
      >
      <span id="switchText"
        >Don't have an account? <a href="/register" id="switchToRegister"
          >Register</a
        ></span
      >
    </form>
  </div>
</div>
