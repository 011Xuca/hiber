// Compartido por background, content script y popup.
// secs = inactividad antes de dormir, en segundos (el popup lo muestra en segundos/minutos/horas).
const P = {
  tranqui: { discard: true, secs: 600, cpu: false, motion: true, fonts: false, trackers: true, bgvideo: false, images: false, mobile: false, lazy: false, preload: false },
  normal:  { discard: true, secs: 300, cpu: true,  motion: true, fonts: false, trackers: true, bgvideo: true,  images: false, mobile: false, lazy: true,  preload: true },
  afondo:  { discard: true, secs: 120, cpu: true,  motion: true, fonts: true,  trackers: true, bgvideo: true,  images: true,  mobile: false, lazy: true,  preload: true },
  celu:    { discard: true, secs: 120, cpu: true,  motion: true, fonts: true,  trackers: true, bgvideo: true,  images: true,  mobile: true,  lazy: true,  preload: true },
};

// Por defecto: nivel Tranqui (duerme tras 10 min). unit/ytads/vq/listas no son parte de los niveles.
const D = { on: true, ...P.tranqui, unit: 'm', ytads: true, vq: false, whitelist: [], sleepList: [], lang: 'system', theme: 'system' };

// Cambiá esto por tu repo de GitHub (usuario/repo). Mientras diga USUARIO no se chequea nada.
const REPO = '011Xuca/hiber';
const newer = (a, b) => { // ¿la versión a es mayor que b? ("1.2.0" > "1.1.9")
  const x = a.split('.').map(Number), y = b.split('.').map(Number);
  for (let i = 0; i < 3; i++) if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) > (y[i] || 0);
  return false;
};
