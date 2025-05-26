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
        document.getElementById('generatedUrl').textContent = 'Error: La URL del video debe usar HTTPS.';
        return;
    }
    if (smartLink && !isValidHttpsUrl(smartLink)) {
        document.getElementById('generatedUrl').textContent = 'Error: El SmartLink debe usar HTTPS.';
        return;
    }

    const shortId = generateShortId();

    try {
        console.log('Intentando escribir:', { shortId, videoUrl, smartLink });
        await setDoc(doc(collection(db, 'links'), shortId), {
            videoUrl,
            smartLink,
            createdAt: serverTimestamp()
        });
        console.log('Escritura exitosa');
        const result = `https://urly.lat/${shortId}`;
        document.getElementById('generatedUrl').innerHTML = `Enlace generado: <a href="${result}" target="_blank">${result}</a>`;
        document.getElementById('copyButton').style.display = 'inline-block';
        document.getElementById('copyButton').onclick = () => {
            navigator.clipboard.writeText(result).then(() => {
                alert('Enlace copiado al portapapeles');
            }).catch((err) => {
                console.error('Error al copiar:', err);
            });
        };
        // Eliminar la URL generada y el botón después de 30 segundos
        setTimeout(() => {
            document.getElementById('generatedUrl').textContent = '';
            document.getElementById('copyButton').style.display = 'none';
        }, 30000);
    } catch (error) {
        console.error('Error al escribir:', error);
        document.getElementById('generatedUrl').textContent = `Error: ${error.message}`;
    }
});
