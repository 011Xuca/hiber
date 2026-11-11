# Changelog

## 1.0.1

### Nuevo
- **Limitador de RAM y CPU** (apagado por defecto): topes configurables desde 1 GB y 1 %. Duerme pestañas al pasarse, avisa con una notificación y se desactiva solo si los límites son imposibles o el navegador se cuelga. Opción de "límite estricto".
- **Video flotante** (activado por defecto, se puede apagar): botón ⧉ sobre los videos, atajo Alt+P y apertura automática al cambiar de pestaña o minimizar (Chrome pide permiso del sitio). Baja YouTube a 360p mientras flota.
- **Anuncios de Twitch**: se silencian durante el anuncio y el carrusel de la portada sale sin anuncio (360p).
- **Twitch, sonido**: la portada y el directorio quedan silenciados salvo que los desmutees vos; los canales arrancan con sonido.
- **YouTube: calidad automática** (apagada por defecto): fija la mejor calidad que aprovecha tu pantalla y tu red.
- **Aviso de actualización**: icono rojo "!" en la extensión cuando hay una versión nueva en GitHub.

### Cambios
- **Anuncios de YouTube**: ya no se filtran las respuestas del reproductor (YouTube lo detecta y pausa el video). El anuncio se corta con la función del propio reproductor; si no toma, corre silenciado y a x2 con "Saltar" visible.
- El CSS ya no oculta el botón "Saltar" ni el cebo `#player-ads`, y se deja pasar una petición de Google que YouTube usa para detectar bloqueadores.
- Se quitó el fondo gris que dejaba la página sin clics.

### Límites conocidos
- La RAM del limitador es una estimación; la CPU es la de todo el equipo.
- Twitch y YouTube cambian seguido: si vuelven los anuncios, revisar `twitch.js` y `yt.js`.
- Firefox: sin probar.
