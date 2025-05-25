import { db } from './firebase.js';
import { doc, getDoc, getDocs, collection } from 'https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js';

// SmartLink fijo de Adsterra
const SMART_LINK = 'https://lakns.com/link?z=9377267&var={SOURCE_ID}&ymid={CLICK_ID}';

// Obtener ID desde la URL
const shortId = window.location.pathname.split('/').pop() || '';

// Función para cargar un video
async function loadVideo(shortId) {
    if (!shortId) {
        console.error('shortId no válido:', shortId);
        window.location.href = '/404.html';
        return;
    }
    try {
        console.log('Cargando video para shortId:', shortId);
        const docRef = doc(db, 'links', shortId);
        console.log('Consultando Firestore para:', `links/${shortId}`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            console.log('Datos del documento:', data);
            if (!data.videoUrl || !data.videoUrl.startsWith('https://')) {
                console.error('videoUrl no válido:', data.videoUrl);
                window.location.href = '/404.html';
                return;
            }
            const videoPlayer = document.getElementById('videoPlayer');
            document.getElementById('videoSource').src = data.videoUrl;
            videoPlayer.load();
            const smartLink = data.smartLink && data.smartLink.startsWith('https://') ? data.smartLink : '';
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
            console.warn('Documento no encontrado para shortId:', shortId);
            window.location.href = '/404.html';
        }
    } catch (error) {
        console.error('Error en loadVideo:', error.message, error.stack);
        window.location.href = '/404.html';
    }
}

// Cargar el video inicial
loadVideo(shortId);

// Función para obtener un video aleatorio
async function getRandomVideo() {
    try {
        console.log('Obteniendo video aleatorio');
        const snapshot = await getDocs(collection(db, 'links'));
        const docs = snapshot.docs;
        if (docs.length === 0) {
            console.warn('No hay videos disponibles');
            alert('No hay más videos disponibles.');
            return;
        }
        const randomIndex = Math.floor(Math.random() * docs.length);
        const randomDoc = docs[randomIndex];
        const newShortId = randomDoc.id;
        console.log('Video aleatorio seleccionado:', newShortId);
        window.open(SMART_LINK, '_blank', 'noopener,noreferrer');
        loadVideo(newShortId);
    } catch (error) {
        console.error('Error al obtener video aleatorio:', error.message, error.stack);
        alert('Error al cargar el siguiente video.');
    }
}

// Añadir evento al botón "Siguiente"
document.getElementById('nextButton').addEventListener('click', getRandomVideo);
