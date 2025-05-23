# VideoPop

Aplicación web para generar enlaces cortos a videos MP4 con un SmartLink opcional y popunder.

## Configuración

1. Clona el repositorio.
2. Configura Firebase:
   - Crea un proyecto en Firebase.
   - Habilita Firestore y autenticación anónima.
   - Copia las credenciales en `index.js` y `espectador.js`.
3. Despliega en Netlify:
   - Conecta el repositorio de GitHub a Netlify.
   - Configura el directorio `public` como base.
4. Prueba la aplicación en `https://videopop.netlify.app`.

## Estructura

- `public/index.html`: Formulario para generar enlaces.
- `public/espectador.html`: Reproductor de video con botón Siguiente y popunder.
- `public/404.html`: Página de error.
- `public/css/styles.css`: Estilos.
- `public/js/index.js`: Lógica del formulario.
- `public/js/espectador.js`: Lógica del reproductor y popunder.
