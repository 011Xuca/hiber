# Changelog

## 1.0.2

### Nuevo
- **Anuncios de Kick** (interruptor nuevo, encendido por defecto): corta los videos de publicidad (SDK de Google IMA) y los banners (GPT/doubleclick y sus subastas) que pide kick.com, y oculta el hueco del banner de arriba del canal. El directo sigue con su calidad normal: Kick no mete los anuncios dentro del stream. Funciona aunque "Bloquear anuncios" esté apagado y no toca otros sitios. El cartel +18 de los canales maduros sigue funcionando igual (se acepta una vez y Kick lo recuerda).

### Cambios
- **Se quitó "YouTube a 480p máx."** (clave `vq`): ya no existe el tope fijo de calidad. Queda "YouTube: calidad automática".
- **Se quitó "Twitch en 360p sin anuncios"**: ya no se pide todo Twitch en 360p. "Anuncios de Twitch" sigue usando el stream sin anuncios solo durante el corte, y la calidad completa vuelve al terminar.
- **Tips del popup**: solo sugieren funciones que tenés apagadas; ya no aparecen consejos sobre las que ya están activas (p. ej. los de Brave y Opera sobre "Bloquear anuncios"). Suman tips para "Anuncios de Twitch" y "Anuncios de Kick". Se sacó el tip de Chrome sobre "Precargar páginas", que se contradecía con "Deshabilitar precarga de páginas" de la extensión.
- **Nuevo color: violeta claro** (`#A78BFA`; `#6D28D9` en el tema claro del popup). El borde y la luna del ícono pasan del celeste al violeta, con el mismo fondo gris oscuro. El popup usa ese violeta en los botones, interruptores, títulos, selección y foco; su fondo oscuro es el gris del ícono.
- **Firefox**: el manifest ya no pide `system.memory` ni `system.cpu`, que Firefox no tiene (daban aviso de permiso desconocido).
- **Build**: `build-zips.py` frena si `version.txt`, `manifest.json` y `CHANGELOG.md` no tienen la misma versión, y revisa que cada zip traiga todos los archivos que pide su manifest. Los dos scripts andan desde cualquier carpeta.

### Arreglos
- El interruptor **"Anuncios de Twitch"** no hacía nada (Twitch obedecía al de YouTube). Ahora cada uno maneja lo suyo.
- **Aviso de actualización**: si GitHub responde con un error o algo que no es una versión (404, límite de pedidos, portal de Wi-Fi), se ignora en vez de guardarlo como "versión nueva".

## 1.0.1

### Nuevo
- **Limitador de RAM y CPU** (apagado por defecto): topes configurables desde 1 GB y 1 %. Duerme pestañas al pasarse, avisa con una notificación y se desactiva solo si los límites son imposibles o el navegador se cuelga. Opción de "límite estricto". La CPU es la de todo el equipo: actúa si pasa el tope 3 minutos seguidos y solo con pestañas inactivas.
- **Video flotante** (activado por defecto, se puede apagar): botón ⧉ sobre los videos, atajo Alt+P y apertura automática al cambiar de pestaña o minimizar (Chrome pide permiso del sitio). Baja YouTube a 360p mientras flota.
- **Anuncios de Twitch** (ajuste propio, separado del de YouTube): durante un corte el reproductor usa el stream sin anuncios (360p) y vuelve a la calidad completa al terminar; si eso falla, el anuncio se silencia. El carrusel de la portada sale sin anuncio.
- **Twitch en 360p sin anuncios** (apagado por defecto): pide todos los directos en 360p, que vienen sin anuncios.
- **Twitch, sonido**: la portada y el directorio quedan silenciados salvo que los desmutees vos; los canales arrancan con sonido.
- **YouTube: calidad automática** (apagada por defecto): fija la mejor calidad que aprovecha tu pantalla y tu red (la red solo se estima en Chrome).
- **Aviso de actualización**: icono rojo "!" en la extensión cuando hay una versión nueva en GitHub.

### Cambios
- **Anuncios de YouTube**: ya no se filtran las respuestas del reproductor (YouTube lo detecta y pausa el video). El anuncio se corta con la función del propio reproductor; si no toma, corre silenciado y a x2 con "Saltar" visible.
- El CSS ya no oculta el botón "Saltar" ni el cebo `#player-ads`, y se deja pasar una petición de Google que YouTube usa para detectar bloqueadores.
- Se quitó el fondo gris que dejaba la página sin clics.

### Límites conocidos
- La RAM del limitador es una estimación; la CPU es la de todo el equipo.
- Twitch y YouTube cambian seguido: si vuelven los anuncios, revisar `twitch.js` y `yt.js`.
- El método de Twitch está probado en Chrome sin sesión; falta probar Firefox, VODs y cuentas con sesión.
- Firefox: sin probar.
