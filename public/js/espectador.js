import { db } from './firebase.js';
import { doc, getDoc, getDocs, collection } from 'https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js';

const SMART_LINK = 'https://diclotrans.com/redirect?id=51228&auth=bd95c00167af1fda747b24a4947c250f90bf6168';
const shortId = window.location.pathname.split('/').pop() || '';

async function loadVideo(shortId) {
    if (!shortId) {
        console.error('shortId no válido:', shortId);
        window.location.href = '/404.html';
        return;
    }
    try {
        const docRef = doc(db, 'links', shortId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            if (!data.videoUrl || !data.videoUrl.startsWith('https://')) {
                window.location.href = '/404.html';
                return;
            }
            const videoPlayer = document.getElementById('videoPlayer');
            document.getElementById('videoSource').src = data.videoUrl;
            videoPlayer.load();
            const smartLink = data.smartLink && data.smartLink.startsWith('https://') ? data.smartLink : '';
            if (smartLink) {
                videoPlayer.onended = () => {
                    window.open(smartLink, '_blank');
                };
            }
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
        if (docs.length === 0) return;
        const randomDoc = docs[Math.floor(Math.random() * docs.length)];
        window.open(SMART_LINK, '_blank');
        loadVideo(randomDoc.id);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Botón Siguiente
document.getElementById('nextButton').addEventListener('click', getRandomVideo);

// Cargar video inicial
loadVideo(shortId);
