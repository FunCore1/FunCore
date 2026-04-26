console.log("LOGIN JS LOADED");

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification,
  signOut,
  onAuthStateChanged
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

let isLogin = true;

const loginModal = document.getElementById("loginModal");
const settingsModal = document.getElementById("settingsModal");

const authBtn = document.getElementById("authBtn");
const heroStartBtn = document.getElementById("heroStartBtn");
const settingsBtn = document.getElementById("settingsBtn");
const logoutBtn = document.getElementById("logoutBtn");
const userEmail = document.getElementById("userEmail");

const closeLoginBtn = document.getElementById("closeLoginBtn");
const closeSettingsBtn = document.getElementById("closeSettingsBtn");

const formTitle = document.getElementById("formTitle");
const mainBtn = document.getElementById("mainBtn");
const toggleText = document.getElementById("toggleText");
const toggleModeBtn = document.getElementById("toggleModeBtn");
const googleLoginBtn = document.getElementById("googleLoginBtn");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const usernameInput = document.getElementById("username");
const saveUsernameBtn = document.getElementById("saveUsernameBtn");

function openModal() {
  if (!loginModal) return;
  loginModal.classList.add("active");
  loginModal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  if (!loginModal) return;
  loginModal.classList.remove("active");
  loginModal.setAttribute("aria-hidden", "true");
}

function openSettingsModal() {
  if (!settingsModal) return;
  settingsModal.classList.add("active");
  settingsModal.setAttribute("aria-hidden", "false");
}

function closeSettingsModal() {
  if (!settingsModal) return;
  settingsModal.classList.remove("active");
  settingsModal.setAttribute("aria-hidden", "true");
}

window.openModal = openModal;
window.closeModal = closeModal;

function updateAuthUI(user) {
  if (user) {
    if (authBtn) authBtn.style.display = "none";
    if (heroStartBtn) heroStartBtn.style.display = "none";
    if (settingsBtn) settingsBtn.style.display = "inline-block";
    if (logoutBtn) logoutBtn.style.display = "inline-block";
    if (userEmail) userEmail.textContent = user.displayName || user.email || "User";
  } else {
    if (authBtn) authBtn.style.display = "inline-block";
    if (heroStartBtn) heroStartBtn.style.display = "inline-block";
    if (settingsBtn) settingsBtn.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "none";
    if (userEmail) userEmail.textContent = "";
  }
}

function toggleMode() {
  isLogin = !isLogin;

  if (isLogin) {
    formTitle.innerText = "Login";
    mainBtn.innerText = "Login";
    toggleText.innerHTML = `Don't have an account? <span id="toggleModeBtn">Sign Up</span>`;
  } else {
    formTitle.innerText = "Sign Up";
    mainBtn.innerText = "Create Account";
    toggleText.innerHTML = `Already have an account? <span id="toggleModeBtn">Login</span>`;
  }

  document.getElementById("toggleModeBtn")?.addEventListener("click", toggleMode);
}

async function handleAuth() {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

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
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      if (!userCredential.user.emailVerified) {
        await signOut(auth);
        alert("Please verify your email first.");
        return;
      }

      alert("Login successful!");
      closeModal();
    } else {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);
      await signOut(auth);

      alert("Account created! Verification email sent. Check inbox/spam, then login.");
      toggleMode();
    }
  } catch (err) {
    if (err.code === "auth/email-already-in-use") {
      alert("This email is already registered.");
    } else if (err.code === "auth/invalid-email") {
      alert("Invalid email address.");
    } else if (err.code === "auth/weak-password") {
      alert("Password is too weak.");
    } else if (err.code === "auth/operation-not-allowed") {
      alert("Email/Password sign-in is not enabled in Firebase Console.");
    } else if (err.code === "auth/invalid-credential") {
      alert("Invalid email or password.");
    } else {
      alert(err.message);
    }

    console.error(err);
  }
}

async function googleLogin() {
  const provider = new GoogleAuthProvider();

  try {
    await signInWithPopup(auth, provider);
    closeModal();
    alert("Google login successful!");
  } catch (err) {
    alert(err.message);
    console.error(err);
  }
}

async function logoutUser() {
  try {
    await signOut(auth);
    closeSettingsModal();
    alert("Logged out successfully!");
  } catch (err) {
    alert(err.message);
    console.error(err);
  }
}

async function saveUsername() {
  const username = usernameInput.value.trim();

  if (!username) {
    alert("Please enter a username");
    return;
  }

  alert("Username saved feature is UI-only right now. If you want, I can connect it to Firebase Firestore next.");
  closeSettingsModal();
}

authBtn?.addEventListener("click", openModal);
heroStartBtn?.addEventListener("click", openModal);
closeLoginBtn?.addEventListener("click", closeModal);
closeSettingsBtn?.addEventListener("click", closeSettingsModal);

mainBtn?.addEventListener("click", handleAuth);
googleLoginBtn?.addEventListener("click", googleLogin);
toggleModeBtn?.addEventListener("click", toggleMode);

settingsBtn?.addEventListener("click", openSettingsModal);
logoutBtn?.addEventListener("click", logoutUser);
saveUsernameBtn?.addEventListener("click", saveUsername);

window.addEventListener("click", (e) => {
  if (e.target === loginModal) closeModal();
  if (e.target === settingsModal) closeSettingsModal();
});

onAuthStateChanged(auth, (user) => {
  updateAuthUI(user);
});