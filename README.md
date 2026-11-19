# Hiber

Duerme las pestañas que no usás, bloquea anuncios (incluido YouTube) y recorta RAM, CPU y red.
Chrome, Edge, Brave, Opera, Vivaldi y Firefox. Versión 1.0.2 (ver `CHANGELOG.md`).

## Qué hace

**Ahorra recursos**
- Duerme las pestañas inactivas (no toca las que suenan, reproducen video o tienen un formulario a medio escribir).
- Recorta animaciones, efectos pesados, imágenes y precarga; pausa videos sin sonido en pestañas ocultas.
- Opciones para bloquear fuentes e imágenes y modo celu.
- Varios niveles listos (de más tranqui a más a fondo) y un popup para ajustar cada cosa.

**Bloquea anuncios**
- **Red:** bloquea dominios de rastreadores, anuncios y pop-unders, y rutas típicas de publicidad.
- **Lista pública:** baja la lista de Peter Lowe (unos 3 500 dominios de anuncios) y se actualiza sola cada ~3 días.
  Solo baja nombres de dominio, nunca código. Hay una lista interna de dominios que nunca se bloquean (YouTube, Google,
  CDNs, pagos, reproductores) y se puede apagar desde el popup.
- **Pop-ups y redirecciones** (webs de anime, series y películas): frena las ventanas que se abren al hacer clic en el
  video, en pantalla completa o en cualquier parte; desactiva las capas invisibles que capturan el clic; cierra la
  pestaña de anuncio que igual se abra; descarta los iframes de carteles falsos ("verificá que sos humano", "Sign in").
- **YouTube:** corta el anuncio con la función del propio reproductor; si no toma, lo pasa silenciado y a x2 con "Saltar" visible.
- **Twitch:** durante un corte usa el stream sin anuncios (360p) y vuelve a la calidad completa al terminar; si falla, silencia el anuncio.
- **Kick:** corta los videos de publicidad y los banners sin tocar el directo, que sigue en su calidad normal.

**Extras:** limitador de RAM y CPU (apagado por defecto), video flotante (Alt+P), calidad automática de YouTube y aviso
rojo "!" en el icono cuando hay una versión nueva en GitHub.

**Lo que no hace:** no toca los logins, pagos, descargas ni las redirecciones normales de una web.

## Instalar

**Chrome, Edge, Brave, Opera / Opera GX, Vivaldi** (todos Chromium): abrí la página de extensiones
(`chrome://extensions`, `edge://extensions`, `brave://extensions`, `opera://extensions`), activá **Developer mode**
y tocá **Load unpacked** (en Opera: **Cargar descomprimida**). Elegí esta carpeta.
También podés usar los zips de `dist/` (ver abajo).

**Firefox** (128 o más): corré `node build-firefox.js`, abrí `about:debugging#/runtime/this-firefox`,
**Load Temporary Add-on…** y elegí `firefox/manifest.json`. Es temporal: se borra al cerrar Firefox.
Para dejarla fija hay que firmarla en addons.mozilla.org.

Safari no está soportado.

Para actualizar una versión cargada a mano: tocá **Recargar extensión** (abajo del popup) o la flecha de recarga en la
página de extensiones.

## Generar los zips

```
python build-zips.py
```

Corre `build-firefox.js` y deja `dist/hiber-chrome-<versión>.zip`, `-edge`, `-opera` y `-firefox`.
La versión sale de `version.txt`: subila también a GitHub (rama `main`) para que el aviso de actualización coincida.

Los zips se suben al **release** de GitHub (`hiber-<navegador>-<versión>.zip`, con ese nombre exacto). La página
de Hiber en `011xuca.github.io` y el botón Descargar de Xuca Optimizer buscan el último release y bajan solos el zip
que corresponde al navegador del usuario (Chrome/Brave/Vivaldi → chrome, Edge, Opera, Firefox).

## Qué cambia según el navegador

- Firefox no expone la memoria libre (el popup solo muestra pestañas dormidas) ni puede abrir sus ajustes desde la extensión.
  El limitador de RAM y CPU no funciona en Firefox: no tiene `system.cpu` ni `performance.memory` (los interruptores no hacen nada).
- Chrome y Edge usan un service worker; Firefox usa scripts de fondo. `firefox/` se genera con `node build-firefox.js`:
  no lo edites a mano.
- El popup detecta el navegador y muestra tips propios (Brave Shields, GX Control, pestañas en suspensión de Edge, etc.).

## Privacidad

Hiber no manda datos a ningún servidor. Lo único que hace en la red es bajar la lista pública de dominios
(`pgl.yoyo.org`) cada pocos días y leer `version.txt` de este repo en GitHub (`raw.githubusercontent.com`) cada
12 horas para el aviso de actualización. Los ajustes se guardan en el navegador.

## Límites

- **Los anuncios cambian de dominio todo el tiempo.** Los dominios de pop-ups que rotan pueden colarse hasta que
  aparecen en una lista. Si te sale uno, abrí DevTools → Network, copiá la URL y agregala a `TRACKERS`
  (`background.js`) y a `AD` (`main.js`); las dos listas tienen que quedar iguales.
- **Anuncios de video dentro del reproductor** (por ejemplo una publicidad antes del capítulo) solo se bloquean si
  conocemos el dominio desde el que se sirven.
- **YouTube** cambia su código seguido, así que puede dejar de andar: ahí hay que ajustar `yt.js`.
- Una web legítima podría romperse con la lista pública. Si pasa, apagala desde el popup y avisá cuál fue.

## Archivos

| Archivo | Para qué |
|---|---|
| `manifest.json` | Configuración de la extensión (Chrome/Edge/Opera). |
| `background.js` | Reglas de red, lista pública, dormir pestañas, cierre de pestañas de anuncio. |
| `content.js` | Ajustes visuales y de carga en cada página; oculta carteles de anuncios. |
| `main.js` | Corre en la página y en los iframes: frena pop-ups y redirecciones de anuncios. |
| `yt.js` | Bloqueo de anuncios de YouTube. |
| `popup.html` / `popup.js` | La ventana de la extensión. |
| `defaults.js` | Ajustes por defecto y niveles. |
| `build-firefox.js`, `build-zips.py` | Generan `firefox/` y los zips de `dist/`. |
