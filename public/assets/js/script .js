function generateUrl() {
    const videoUrl = document.getElementById('videoUrl').value.trim();
    
    if (!videoUrl) {
        alert("¡Debes pegar una URL válida!");
        return;
    }

    // Codifica la URL para pasarla como parámetro
    const encodedUrl = encodeURIComponent(videoUrl);
    const generatedUrl = `https://videopop.netlify.app/index.html?id=${encodedUrl}`;
    
    // Muestra el resultado
    document.getElementById('result').innerHTML = `
        <h3>URL Generada:</h3>
        <input type="text" value="${generatedUrl}" readonly>
        <button onclick="copyUrl()">Copiar URL</button>
    `;
}

function copyUrl() {
    const urlInput = document.querySelector('#result input');
    urlInput.select();
    document.execCommand('copy');
    alert("¡URL copiada al portapapeles!");
}
