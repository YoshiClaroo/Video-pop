document.getElementById('generateBtn').addEventListener('click', function() {
    const videoUrl = document.getElementById('videoUrl').value.trim();
    const resultDiv = document.getElementById('result');
    
    if (!videoUrl) {
        resultDiv.innerHTML = '<p class="error">⚠️ ¡Debes pegar una URL válida!</p>';
        return;
    }

    // Codifica la URL para parámetros
    const encodedUrl = encodeURIComponent(videoUrl);
    const generatedUrl = `${window.location.origin}/index.html?id=${encodedUrl}`;
    
    resultDiv.innerHTML = `
        <p class="success">✅ URL generada con éxito!</p>
        <div class="url-box">
            <input type="text" value="${generatedUrl}" id="generatedUrl" readonly>
            <button onclick="copyToClipboard()">📋 Copiar</button>
        </div>
    `;
});

function copyToClipboard() {
    const urlInput = document.getElementById('generatedUrl');
    urlInput.select();
    document.execCommand('copy');
    alert('URL copiada al portapapeles!');
}
