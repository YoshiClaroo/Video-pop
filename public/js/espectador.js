import { db } from './firebase.js';
import { doc, getDoc, getDocs, collection } from 'https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js';

// Obtener ID desde la URL
const shortId = window.location.pathname.split('/').pop();

// Función para cargar un video
async function loadVideo(shortId) {
    try {
        const docRef = doc(db, 'links', shortId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            const videoPlayer = document.getElementById('videoPlayer');
            document.getElementById('videoSource').src = data.videoUrl;
            videoPlayer.load();
            const smartLink = data.smartLink || '';
            document.getElementById('smartLink').href = smartLink;
            document.getElementById('smartLink').style.display = smartLink ? 'inline-block' : 'none';
            document.getElementById('popunderButton').style.display = smartLink ? 'inline-block' : 'none';
            document.getElementById('popunderButton').onclick = () => {
                window[n.slice(0, 16) + n.slice(0, 16)]?.popunder?.(smartLink || 'https://example.com');
            };
            // Redirigir al SmartLink al terminar el video
            if (smartLink) {
                videoPlayer.onended = () => {
                    window.open(smartLink, '_blank', 'noopener,noreferrer');
                };
            } else {
                videoPlayer.onended = null;
            }
            window.history.replaceState(null, '', `/${shortId}`);
        } else {
            window.location.href = '/404.html';
        }
    } catch (error) {
        console.error('Error:', error);
        window.location.href = '/404.html';
    }
}

// Cargar el video inicial
loadVideo(shortId);

// Función para obtener un video aleatorio
async function getRandomVideo() {
    try {
        const snapshot = await getDocs(collection(db, 'links'));
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
