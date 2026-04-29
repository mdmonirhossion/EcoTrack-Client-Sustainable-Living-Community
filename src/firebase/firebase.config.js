import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCpVZkUIguVF0VXfpszL9qlZT8QddDmglQ",
  authDomain: "ecotrack-app-202c8.firebaseapp.com",
  projectId: "ecotrack-app-202c8",
  storageBucket: "ecotrack-app-202c8.firebasestorage.app",
  messagingSenderId: "330976468362",
  appId: "1:330976468362:web:7b68946809337239d77c73"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
