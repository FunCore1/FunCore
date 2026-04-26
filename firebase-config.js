import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDaW20Fgd6MT6G7ng83MZoelzJjQM4ijXc",
  authDomain: "funcore-ef763.firebaseapp.com",
  projectId: "funcore-ef763",
  storageBucket: "funcore-ef763.firebasestorage.app",
  messagingSenderId: "833104940773",
  appId: "1:833104940773:web:63a3f47b3e147b6299ce0c"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);