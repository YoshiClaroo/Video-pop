# VideoPop

Aplicación web para generar enlaces cortos a videos MP4 con SmartLink opcional, popunder por clic, y redirección al SmartLink. URLs públicas para compartir en Facebook.

## Configuración

1. Configura Firebase:
   - Usa las credenciales en `js/firebase.js`.
   - Habilita Firestore.
   - Actualiza las reglas en la consola de Firebase.
2. Sube los archivos a tu repositorio y despliega en Netlify.

## Estructura

- `public/index.html`: Formulario con botón Copiar que desaparece.
- `public/espectador.html`: Reproductor con Siguiente y popunder por clic.
- `public/404.html`: Página de error.
- `public/css/styles.css`: Estilos.
- `public/js/firebase.js`: Configuración de Firebase.
- `public/js/index.js`: Lógica del formulario.
- `public/js/espectador.js`: Lógica del reproductor.
- `netlify.toml`: Redirecciones.
- `firestore.rules`: Reglas de Firestore.
