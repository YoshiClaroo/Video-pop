import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js';

const firebaseConfig = {
    apiKey: "AIzaSyCgNxF0TYCUc_t3raN37ypEC6KHBqJIXuU",
    authDomain: "video-pop-13c53.firebaseapp.com",
    projectId: "video-pop-13c53",
    storageBucket: "video-pop-13c53.firebasestorage.app",
    messagingSenderId: "682309905603",
    appId: "1:682309905603:web:2b84ac53d103cba0558676",
    measurementId: "G-42VFTCV7ME"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
