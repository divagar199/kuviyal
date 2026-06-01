import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? import.meta.env.VITE_FIREBASE_AUTH_DOMAIN
    : window.location.hostname,
};

if (!firebaseConfig.apiKey || !firebaseConfig.authDomain) {
  console.warn(
    "Firebase config is missing. Make sure VITE_FIREBASE_API_KEY and VITE_FIREBASE_AUTH_DOMAIN are set in your environment."
  );
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });