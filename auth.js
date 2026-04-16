import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

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

// ✅ Wait for DOM
window.addEventListener("DOMContentLoaded", () => {

  const modal = document.getElementById("loginModal");
  const userText = document.getElementById("userEmail");
  const btn = document.getElementById("authBtn");

  let firstCheck = true;

  onAuthStateChanged(auth, async (user) => {

    // ❌ Not logged in
    if (!user) {
      if (firstCheck) {
        modal.style.display = "flex";
        firstCheck = false;
      }

      // reset button
      if (btn) {
        btn.innerText = "Get Started →";
        btn.onclick = openModal;
      }

      if (userText) userText.innerText = "";

      return;
    }

    // 🔄 reload user to check verification
    await user.reload();

    // ❌ Block unverified users
    if (!user.emailVerified) {
      alert("Please verify your email first (check spam folder)");

      modal.style.display = "flex";

      await signOut(auth);
      return;
    }

    // ✅ Verified user
    modal.style.display = "none";

    if (userText) {
      userText.innerText = user.email;
    }

    // 🔥 Change button to logout
    if (btn) {
      btn.innerText = "Logout";
      btn.onclick = logout;
    }

  });

});

// 🚪 Logout function
window.logout = () => {
  signOut(auth).then(() => {
    document.getElementById("loginModal").style.display = "flex";
  });
};