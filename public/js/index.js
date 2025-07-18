import { db } from './firebase.js';
import { collection, doc, setDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js';

console.log("Script index.js cargado correctamente"); // Debug 1

document.getElementById('linkForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log("Formulario enviado"); // Debug 2
    
    const videoUrl = document.getElementById('videoUrl').value;
    console.log("URL ingresada:", videoUrl); // Debug 3

    if (!videoUrl.startsWith('https://')) {
        console.log("URL no válida (no HTTPS)"); // Debug 4
        document.getElementById('generatedUrl').textContent = 'Error: La URL del video debe usar HTTPS.';
        document.getElementById('result').style.display = 'block';
        document.getElementById('result').className = 'error';
        return;
    }

    const shortId = generateShortId();
    console.log("ID generado:", shortId); // Debug 5

    try {
        console.log("Intentando guardar en Firestore..."); // Debug 6
        await setDoc(doc(collection(db, 'links'), shortId), {
            videoUrl,
            createdAt: serverTimestamp()
        });
        console.log("Documento guardado exitosamente"); // Debug 7
        
        const result = `https://vzy.lat/${shortId}`;
        document.getElementById('generatedUrl').innerHTML = `Enlace generado: <a href="${result}" target="_blank">${result}</a>`;
        document.getElementById('result').style.display = 'block';
        document.getElementById('result').className = 'success';
        document.getElementById('copyButton').style.display = 'inline-block';
        
        document.getElementById('copyButton').onclick = () => {
            navigator.clipboard.writeText(result).then(() => {
                alert('Enlace copiado al portapapeles');
            });
        };
        
        setTimeout(() => {
            document.getElementById('result').style.display = 'none';
        }, 30000);
    } catch (error) {
        console.error("Error en Firestore:", error); // Debug 8
        document.getElementById('generatedUrl').textContent = `Error: ${error.message}`;
        document.getElementById('result').style.display = 'block';
        document.getElementById('result').className = 'error';
    }
});

function generateShortId() {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 4; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result + '_mp4';
}
