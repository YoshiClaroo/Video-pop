import { db } from './firebase.js';
import { doc, getDoc, getDocs, collection } from 'https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js';

// SmartLink fijo
const SMART_LINK = 'https://www.profitableratecpm.com/mvh7pt5g?key=07703abc2b91e6b793816f68a5afc2a5';

// Obtener ID desde la URL
const shortId = window.location.pathname.split('/').pop();

// Función para cargar un video
async function loadVideo(shortId) {
    try {
        console.log('Cargando video para shortId:', shortId);
        const docRef = doc(db, 'links', shortId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            console.log('Datos del documento:', data);
            const videoPlayer = document.getElementById('videoPlayer');
            document.getElementById('videoSource').src = data.videoUrl;
            videoPlayer.load();
            const smartLink = data.smartLink || '';
            // Ejecutar popunder al cargar la página
            try {
                console.log('Ejecutando popunder con:', smartLink || SMART_LINK);
                if (typeof window['c79f89cf83cc0c9791096572f5636faa']?.popunder === 'function') {
                    window['c79f89cf83cc0c9791096572f5636faa'].popunder(smartLink || SMART_LINK);
                } else {
                    console.warn('Función popunder no disponible');
                }
            } catch (popunderError) {
                console.error('Error al ejecutar popunder:', popunderError);
            }
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
        console.error('Error en loadVideo:', error);
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
        // Abrir el SmartLink en una nueva pestaña
        window.open(SMART_LINK, '_blank', 'noopener,noreferrer');
        // Cargar el nuevo video
        loadVideo(newShortId);
    } catch (error) {
        console.error('Error al obtener video aleatorio:', error);
        alert('Error al cargar el siguiente video.');
    }
}

// Añadir evento al botón "Siguiente"
document.getElementById('nextButton').addEventListener('click', getRandomVideo);
