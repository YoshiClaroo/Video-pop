import { db } from './firebase.js';
import { collection, doc, setDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js';

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
        console.log('Intentando escribir en Firestore:', { shortId, videoUrl, smartLink });
        await setDoc(doc(collection(db, 'links'), shortId), {
            videoUrl,
            smartLink,
            createdAt: serverTimestamp()
        });
        console.log('Escritura exitosa');
        const result = `https://videopop.netlify.app/${shortId}`;
        document.getElementById('result').innerHTML = `Enlace generado: <a href="${result}" target="_blank">${result}</a>`;
    } catch (error) {
        console.error('Error al escribir en Firestore:', error);
        document.getElementById('result').textContent = `Error: ${error.message}`;
    }
});
