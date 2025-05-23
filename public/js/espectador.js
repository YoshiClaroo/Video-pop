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

// Obtener ID desde la URL
const shortId = window.location.pathname.split('/').pop();

// Función para abrir un popunder
function openPopunder(url) {
    const popunder = window.open(url, '_blank', 'noopener,noreferrer');
    if (popunder) {
        popunder.blur();
        window.focus();
    }
}

// Función para cargar un video
function loadVideo(shortId) {
    db.collection('links').doc(shortId).get().then((doc) => {
        if (doc.exists) {
            const data = doc.data();
            document.getElementById('videoSource').src = data.videoUrl;
            document.getElementById('videoPlayer').load();
            // Configurar SmartLink
            const smartLink = data.smartLink || 'https://example.com'; // URL predeterminada si no hay SmartLink
            document.getElementById('smartLink').href = smartLink;
            // Mostrar SmartLink solo si existe
            document.getElementById('smartLink').style.display = data.smartLink ? 'inline-block' : 'none';
            // Abrir popunder al cargar
            openPopunder(smartLink);
            // Actualizar la URL en la barra de navegación sin recargar
            window.history.replaceState(null, '', `/${shortId}`);
        } else {
            window.location.href = '/404.html';
        }
    }).catch((error) => {
        console.error('Error:', error);
        window.location.href = '/404.html';
    });
}

// Cargar el video inicial
loadVideo(shortId);

// Función para obtener un video aleatorio
async function getRandomVideo() {
    try {
        const snapshot = await db.collection('links').get();
        const docs = snapshot.docs;
        if (docs.length === 0) {
            alert('No hay más videos disponibles.');
            return;
        }
        const randomIndex = Math.floor(Math.random() * docs.length);
        const randomDoc = docs[randomIndex];
        const newShortId = randomDoc.id;
        loadVideo(newShortId);
    } catch (error) {
        console.error('Error al obtener video aleatorio:', error);
        alert('Error al cargar el siguiente video.');
    }
}

// Añadir evento al botón "Siguiente"
document.getElementById('nextButton').addEventListener('click', getRandomVideo);
