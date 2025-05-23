import { db, auth } from './firebase.js';
import { collection, doc, setDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js';
import { signInAnonymously } from 'https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js';

// Validar que la URL use HTTPS
function isValidHttpsUrl(url) {
    return url.startsWith('https://');
}

// Generar ID corto (6 caracteres)
function generateShortId() {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Iniciar sesión anónima al cargar la página
signInAnonymously(auth)
    .then(() => {
        console.log('Usuario anónimo autenticado');
    })
    .catch((error) => {
        console.error('Error en autenticación anónima:', error);
        document.getElementById('result').textContent = `Error de autenticación: ${error.message}`;
    });

// Manejar el formulario
document.getElementById('linkForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const videoUrl = document.getElementById('videoUrl').value;
    const smartLink = document.getElementById('smartLink').value || '';

    // Validar URLs
    if (!isValidHttpsUrl(videoUrl)) {
        document.getElementById('result').textContent = 'Error: La URL del video debe usar HTTPS.';
        return;
    }
    if (smartLink && !isValidHttpsUrl(smartLink)) {
        document.getElementById('result').textContent = 'Error: El SmartLink debe usar HTTPS.';
        return;
    }

    const shortId = generateShortId();

    try {
        await setDoc(doc(collection(db, 'links'), shortId), {
            videoUrl,
            smartLink,
            createdAt: serverTimestamp()
        });
        const result = `https://videopop.netlify.app/${shortId}`;
        document.getElementById('result').innerHTML = `Enlace generado: <a href="${result}" target="_blank">${result}</a>`;
    } catch (error) {
        document.getElementById('result').textContent = `Error: ${error.message}`;
    }
});
