// Configuración de Firebase (reemplaza con tus credenciales)
const firebaseConfig = {
    apiKey: "TU_API_KEY",
    authDomain: "TU_AUTH_DOMAIN",
    projectId: "TU_PROJECT_ID",
    storageBucket: "TU_STORAGE_BUCKET",
    messagingSenderId: "TU_MESSAGING_SENDER_ID",
    appId: "TU_APP_ID"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

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
    const smartLink = document.getElementById('smartLink').value || ''; // Opcional, vacío si no se proporciona
    const shortId = generateShortId();

    try {
        await db.collection('links').doc(shortId).set({
            videoUrl,
            smartLink,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        const result = `https://videopop.netlify.app/${shortId}`;
        document.getElementById('result').innerHTML = `Enlace generado: <a href="${result}" target="_blank">${result}</a>`;
    } catch (error) {
        document.getElementById('result').textContent = `Error: ${error.message}`;
    }
});
