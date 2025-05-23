# VideoPop

Aplicación web para generar enlaces cortos a videos MP4 con SmartLink opcional, popunder activado por botón, y redirección al SmartLink al terminar el video.

## Configuración

1. Configura Firebase:
   - Usa las credenciales en `js/firebase.js`.
   - Habilita Firestore y autenticación anónima.
2. Sube a GitHub y despliega en Netlify desde la terminal.

## Estructura

- `public/index.html`: Formulario para generar enlaces.
- `public/espectador.html`: Reproductor de video con botón Siguiente y popunder.
- `public/404.html`: Página de error.
- `public/css/styles.css`: Estilos.
- `public/js/firebase.js`: Configuración de Firebase.
- `public/js/index.js`: Lógica del formulario.
- `public/js/espectador.js`: Lógica del reproductor y popunder.
- `netlify.toml`: Configuración de redirecciones.
