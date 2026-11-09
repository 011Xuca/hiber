# Hiber

Duerme las pestañas que no usás, bloquea anuncios (incluido YouTube) y recorta RAM, CPU y red.

## Instalar

**Chrome, Edge, Brave, Opera / Opera GX, Vivaldi** (todos Chromium): abrí la página de extensiones
(`chrome://extensions`, `edge://extensions`, `brave://extensions`, `opera://extensions`), activá **Developer mode**
y tocá **Load unpacked** (en Opera: **Cargar descomprimida**). Elegí esta carpeta.

**Firefox** (128 o más): corré `node build-firefox.js`, abrí `about:debugging#/runtime/this-firefox`,
**Load Temporary Add-on…** y elegí `firefox/manifest.json`. Es temporal: se borra al cerrar Firefox.
Para dejarla fija hay que firmarla en addons.mozilla.org.

Safari no está soportado.

## Qué cambia según el navegador

- Firefox no expone la memoria libre (el popup solo muestra pestañas dormidas) ni puede abrir sus ajustes desde la extensión.
- El popup detecta el navegador y muestra tips propios (Brave Shields, GX Control, pestañas en suspensión de Edge, etc.).

## Anuncios de YouTube

`yt.js` quita los datos de anuncios del reproductor y, si igual aparece uno, lo silencia, lo adelanta y toca "Saltar".
YouTube cambia su código seguido, así que puede dejar de andar: ahí hay que ajustar `yt.js`.
