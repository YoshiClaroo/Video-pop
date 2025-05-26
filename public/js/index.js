import { db } from './firebase.js';
import { collection, doc, setDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js';

// Generar ID corto
function generateShortId() {
    return Math.random().toString(36).substr(2, 8);
}

document.getElementById('linkForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const videoUrl = document.getElementById('videoUrl').value;

    if (!videoUrl.endsWith('.mp4')) {
        document.getElementById('generatedUrl').textContent = 'Error: La URL debe apuntar a un archivo .mp4';
        return;
    }

    const shortId = generateShortId();

    try {
        await setDoc(doc(collection(db, 'adultLinks'), shortId), {
            videoUrl,
            createdAt: serverTimestamp(),
            adultContent: true
        });
        
        const result = `https://tudominio.com/viewer.html?v=${shortId}`;
        document.getElementById('generatedUrl').innerHTML = `
            <strong>Enlace generado:</strong><br>
            <a href="${result}" target="_blank">${result}</a><br><br>
            <small>Este enlace es para contenido adulto. Asegúrate de cumplir con todas las leyes locales.</small>
        `;
        
        document.getElementById('copyButton').style.display = 'inline-block';
        document.getElementById('copyButton').onclick = () => {
            navigator.clipboard.writeText(result);
            alert('Enlace copiado!');
        };
    } catch (error) {
        document.getElementById('generatedUrl').textContent = `Error: ${error.message}`;
    }
});
