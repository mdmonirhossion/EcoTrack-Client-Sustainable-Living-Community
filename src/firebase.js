import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  // Support both naming conventions:
  // - ecotrack-client/.env.example: VITE_FIREBASE_*
  // - existing ecotrack-client/.env: VITE_*
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || import.meta.env.VITE_apiKey,
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ||     import.meta.env.VITE_authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || import.meta.env.VITE_projectId,
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || import.meta.env.VITE_storageBucket,
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ||
    import.meta.env.VITE_messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || import.meta.env.VITE_appId,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export default app;