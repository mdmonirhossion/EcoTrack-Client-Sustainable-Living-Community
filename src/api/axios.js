import axios from 'axios';
import { auth } from '../firebase/firebase.config';

const api = axios.create({
  // Default to the backend port (5001). If VITE_API_URL is set, it will override this.
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:5001',
  headers: { 'Content-Type': 'application/json' },
});

// Attach Firebase ID token to every request
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
