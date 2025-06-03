import { db } from './firebase.js';
import { doc, getDoc, getDocs, collection } from 'https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js';

const SMART_LINK = 'https://official-permit.com/b.3FVl0pP-3Sp/vMbzmDVPJEZKDK0h2PMrzag/2mNvDNIWxkLVTzYtzVO_DLYm0gMFjcIv';
const shortId = window.location.pathname.split('/').pop() || '';

// Función mejorada para abrir enlaces en nueva pestaña
function openInNewTab(url) {
    setTimeout(() => {
        const newWindow = window.open(url, '_blank');
        if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
            // Fallback en caso de bloqueo de popup
            window.location.href = url;
        }
    }, 300);
}

async function loadVideo(shortId) {
    if (!shortId) {
        window.location.href = '/404.html';
        return;
    }
    try {
        const docRef = doc(db, 'links', shortId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            if (!data.videoUrl?.startsWith('https://')) {
                window.location.href = '/404.html';
                return;
            }
            document.getElementById('videoSource').src = data.videoUrl;
            document.getElementById('videoPlayer').load();
            
            // Configurar redirección al finalizar el video (siempre se ejecutará)
            document.getElementById('videoPlayer').onended = () => {
                if (data.smartLink?.startsWith('https://')) {
                    openInNewTab(data.smartLink);
                } else {
                    openInNewTab(SMART_LINK); // Usar el enlace por defecto si no hay smartLink
                }
            };
            
            window.history.replaceState(null, '', `/${shortId}`);
        } else {
            window.location.href = '/404.html';
        }
    } catch (error) {
        window.location.href = '/404.html';
    }
}

async function getRandomVideo() {
    try {
        const snapshot = await getDocs(collection(db, 'links'));
        const docs = snapshot.docs;
        if (docs.length > 0) {
            const randomDoc = docs[Math.floor(Math.random() * docs.length)];
            openInNewTab(SMART_LINK); // Abre en nueva pestaña al cambiar de video
            loadVideo(randomDoc.id);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Configurar el botón siguiente para abrir en nueva pestaña
document.getElementById('nextButton').addEventListener('click', getRandomVideo);

// Iniciar carga del video
loadVideo(shortId);
