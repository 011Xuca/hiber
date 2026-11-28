# Changelog
## 1.0.4
### Arreglos
- **Hiber por sitio**: al apagar Hiber en una página, a veces la pestaña se recargaba antes de que las reglas estuvieran aplicadas y el sitio seguía detectando el bloqueador. Ahora el popup espera a que las reglas estén listas para recargar, y la excepción del sitio se agrega primero.

## 1.0.3

### Nuevo
- **Aviso de bloqueos**: si Hiber corta pedidos que la página necesitaba (scripts, datos, marcos) y la página queda sin terminar de cargar o casi sin contenido, aparece un cartel chico abajo a la derecha con lo bloqueado y el botón **"Pausar Hiber aquí"**, que deja pasar todo en ese sitio y recarga. Sale una sola vez por carga, se va solo a los 25 s y nunca aparece con un video en pantalla completa. Usa el permiso nuevo `webRequest`, que solo observa los pedidos (no los puede bloquear ni leer su contenido).
- **Sitios pausados**: lista nueva en el popup ("Sitios donde Hiber no bloquea nada"), donde se agregan los que pausás desde el aviso y se pueden sacar a mano. En esos sitios Hiber no bloquea, no oculta anuncios ni cambia cabeceras.

- **Hiber por sitio (como el escudo de Brave)**: tarjeta arriba del popup con un interruptor para apagar Hiber solo en la página que tenés abierta; recarga la pestaña. Usa la misma lista de "Sitios donde Hiber no bloquea nada".
- **Popup reorganizado**: el bloqueador de anuncios va primero y abierto; el resto de los ajustes quedan en categorías desplegables (dormir pestañas, control de recursos, velocidad, sitios) que se abren al entrar.

### Cambios
- **Versión celu**: ahora se parece a pedir la web móvil de verdad. Además del user-agent y `sec-ch-ua-mobile`, manda la plataforma Android (`sec-ch-ua-platform`, versión y modelo) y del lado de JavaScript responde "Android" en `userAgentData` (también en `getHighEntropyValues`) y "puntero táctil, sin hover" en `(pointer: coarse)` / `(hover: none)`. Antes la plataforma seguía diciendo Windows y algunos sitios se confundían.
- **Listas de sitios** ("nunca se duermen" / "siempre se duermen"): ahora comparan el dominio, no el texto (si la entrada lleva una ruta, como youtube.com/watch, se sigue comparando como texto). Antes "x.com" también calzaba con "box.com" o con una búsqueda que lo nombrara.
- **Firefox**: el grupo "Control de recursos" (limitadores de RAM y CPU) ya no se muestra, porque Firefox no permite medir esos datos y los limitadores nunca habrían disparado.

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
- Si el navegador no avisaba de instalación ni de inicio (p. ej. al reactivar la extensión), las alarmas de dormir pestañas y del limitador no se creaban; ahora se crean al cargar.
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
