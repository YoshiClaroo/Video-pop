import { db } from './firebase.js';
import { collection, doc, setDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js';

// Configuración
const CONFIG = {
    DOMAIN: 'vzy.lat',
    TIMEOUT: 30000, // 30 segundos
    ID_LENGTH: 4, // Longitud del ID corto
    ID_SUFFIX: '_mp4' // Sufijo para los IDs
};

// Validar URL HTTPS mejorado
function isValidHttpsUrl(url) {
    try {
        const urlObj = new URL(url);
        return urlObj.protocol === 'https:';
    } catch {
        return false;
    }
}

// Generar ID corto mejorado
function generateShortId() {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    for (let i = 0; i < CONFIG.ID_LENGTH; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return result + CONFIG.ID_SUFFIX;
}

// Mostrar mensaje de error
function showError(message) {
    const resultElement = document.getElementById('result');
    resultElement.style.display = 'block';
    resultElement.style.background = '#fee';
    resultElement.style.borderLeftColor = '#f44336';
    document.getElementById('generatedUrl').textContent = message;
    document.getElementById('copyButton').style.display = 'none';
}

// Mostrar resultado exitoso
function showSuccess(generatedUrl) {
    const resultElement = document.getElementById('result');
    resultElement.style.display = 'block';
    resultElement.style.background = '#e9f7ef';
    resultElement.style.borderLeftColor = '#28a745';
    
    document.getElementById('generatedUrl').innerHTML = 
        `✅ Enlace generado:<br><a href="${generatedUrl}" target="_blank">${generatedUrl}</a>`;
    document.getElementById('copyButton').style.display = 'inline-block';
}

// Manejar el formulario
document.getElementById('linkForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const videoUrl = document.getElementById('videoUrl').value.trim();
    const smartLink = document.getElementById('smartLink').value.trim();
    
    // Validar URL del video
    if (!videoUrl) {
        showError('⚠️ Por favor, ingresa una URL de video');
        return;
    }
    
    if (!isValidHttpsUrl(videoUrl)) {
        showError('❌ La URL debe usar HTTPS y ser válida');
        return;
    }
    
    // Verificar si es un archivo MP4 (validación básica)
    if (!videoUrl.toLowerCase().endsWith('.mp4')) {
        showError('⚠️ Asegúrate que la URL termine con .mp4');
        return;
    }
    
    const shortId = generateShortId();
    
    try {
        // Guardar en Firestore incluyendo el smartLink si existe
        await setDoc(doc(collection(db, 'links'), shortId), {
            videoUrl,
            smartLink: smartLink || null,
            createdAt: serverTimestamp(),
            clicks: 0
        });
        
        const generatedUrl = `https://${CONFIG.DOMAIN}/${shortId}`;
        showSuccess(generatedUrl);
        
        // Configurar botón de copiar
        document.getElementById('copyButton').onclick = () => {
            navigator.clipboard.writeText(generatedUrl).then(() => {
                const copyBtn = document.getElementById('copyButton');
                copyBtn.textContent = '✔️ Copiado!';
                setTimeout(() => {
                    copyBtn.textContent = 'Copiar';
                }, 2000);
            }).catch((err) => {
                console.error('Error al copiar:', err);
                showError('Error al copiar al portapapeles');
            });
        };
        
        // Ocultar después del timeout
        setTimeout(() => {
            document.getElementById('result').style.display = 'none';
        }, CONFIG.TIMEOUT);
        
    } catch (error) {
        console.error('Error al guardar en Firestore:', error);
        showError('🔥 Error al generar el enlace. Intenta nuevamente.');
    }
});
