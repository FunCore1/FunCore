import { auth } from "./firebase-config.js";
import {
  onAuthStateChanged,
  signOut,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

window.addEventListener("DOMContentLoaded", () => {
  const loginModal = document.getElementById("loginModal");
  const settingsModal = document.getElementById("settingsModal");

  const userText = document.getElementById("userEmail");
  const authBtn = document.getElementById("authBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const settingsBtn = document.getElementById("settingsBtn");
  const closeLoginBtn = document.getElementById("closeLoginBtn");
  const closeSettingsBtn = document.getElementById("closeSettingsBtn");
  const saveUsernameBtn = document.getElementById("saveUsernameBtn");
  const usernameInput = document.getElementById("username");

  window.openModal = function () {
    if (!loginModal) return;
    loginModal.style.display = "flex";
    loginModal.setAttribute("aria-hidden", "false");
  };

  window.closeModal = function () {
    if (!loginModal) return;
    loginModal.style.display = "none";
    loginModal.setAttribute("aria-hidden", "true");
  };

  window.openSettingsModal = function () {
    if (!settingsModal) return;
    settingsModal.style.display = "flex";
    settingsModal.setAttribute("aria-hidden", "false");

    if (auth.currentUser && usernameInput) {
      usernameInput.value = auth.currentUser.displayName || "";
    }
  };

  window.closeSettingsModal = function () {
    if (!settingsModal) return;
    settingsModal.style.display = "none";
    settingsModal.setAttribute("aria-hidden", "true");
  };

  authBtn?.addEventListener("click", window.openModal);
  closeLoginBtn?.addEventListener("click", window.closeModal);
  settingsBtn?.addEventListener("click", window.openSettingsModal);
  closeSettingsBtn?.addEventListener("click", window.closeSettingsModal);

  logoutBtn?.addEventListener("click", async () => {
    try {
      await signOut(auth);
      window.closeSettingsModal?.();
      alert("Logged out successfully.");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  });

  saveUsernameBtn?.addEventListener("click", async () => {
    const username = usernameInput?.value.trim();

    if (!auth.currentUser) {
      alert("Please login first.");
      return;
    }

    if (!username) {
      alert("Please enter a username.");
      return;
    }

    try {
      await updateProfile(auth.currentUser, { displayName: username });
      if (userText) userText.textContent = username;
      alert("Username updated successfully.");
      window.closeSettingsModal?.();
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  });

  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      if (userText) userText.textContent = "";
      if (authBtn) authBtn.style.display = "inline-flex";
      if (settingsBtn) settingsBtn.style.display = "none";
      if (logoutBtn) logoutBtn.style.display = "none";
      return;
    }

    try {
      await user.reload();
    } catch (error) {
      console.error(error);
    }

    const isPasswordUser = user.providerData.some((p) => p.providerId === "password");

    if (isPasswordUser && !user.emailVerified) {
      alert("Please verify your email first.");
      await signOut(auth);
      window.openModal?.();
      return;
    }

    if (authBtn) authBtn.style.display = "none";
    if (settingsBtn) settingsBtn.style.display = "inline-flex";
    if (logoutBtn) logoutBtn.style.display = "inline-flex";

    if (userText) {
      userText.textContent = user.displayName || user.email || "User";
    }
  });
});