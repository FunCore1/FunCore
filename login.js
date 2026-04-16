console.log("LOGIN JS LOADED");

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDaW20Fgd6MT6G7ng83MZoelzJjQM4ijXc",
  authDomain: "funcore-ef763.firebaseapp.com",
  projectId: "funcore-ef763",
  storageBucket: "funcore-ef763.firebasestorage.app",
  messagingSenderId: "833104940773",
  appId: "1:833104940773:web:63a3f47b3e147b6299ce0c"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 🔁 Toggle mode
let isLogin = true;

window.toggleMode = function () {
  console.log("TOGGLE CLICKED");

  isLogin = !isLogin;

  const title = document.getElementById("formTitle");
  const btn = document.getElementById("mainBtn");
  const text = document.getElementById("toggleText");

  if (isLogin) {
    title.innerText = "Login";
    btn.innerText = "Login";
    text.innerHTML = `Don't have an account? <span onclick="toggleMode()">Sign Up</span>`;
  } else {
    title.innerText = "Sign Up";
    btn.innerText = "Create Account";
    text.innerHTML = `Already have an account? <span onclick="toggleMode()">Login</span>`;
  }
};

// 🔐 Handle Login + Signup
window.handleAuth = async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // validation
  if (!email || !password) {
    alert("Enter email and password");
    return;
  }

  if (password.length < 6) {
    alert("Password must be at least 6 characters");
    return;
  }

  try {
    if (isLogin) {
      // LOGIN
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      if (!userCredential.user.emailVerified) {
        alert("Please verify your email first!");
        return;
      }

      alert("Login successful!");
      closeModal();

    } else {
      // SIGNUP
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(userCredential.user);
        alert("Account created! Check your email (also spam folder).");
        toggleMode();
    }

  } catch (err) {
    alert(err.message);
  }
};

// 🌐 Google Login
window.googleLogin = async () => {
  const provider = new GoogleAuthProvider();

  try {
    await signInWithPopup(auth, provider);
    closeModal();
  } catch (err) {
    alert(err.message);
  }
};