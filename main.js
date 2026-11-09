// Corre en el mundo de la página. content.js marca <html data-hiber-motion / data-hiber-mobile>.
(() => {
  const on = (k) => document.documentElement?.dataset[k] === '1';
  const UA = 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36';

  // Animaciones por JS (Web Animations): terminan al instante.
  const animate = Element.prototype.animate;
  Element.prototype.animate = function (...a) {
    const r = animate.apply(this, a);
    if (on('hiberMotion')) try { r.finish(); } catch { r.cancel(); } // infinitas: finish() falla
    return r;
  };
  // Muchos sitios respetan "reducir movimiento": se lo decimos.
  const mm = window.matchMedia;
  window.matchMedia = function (q) {
    const r = mm.call(this, q);
    if (on('hiberMotion') && /prefers-reduced-motion/.test(q)) {
      return Object.defineProperty(r, 'matches', { value: /reduce/.test(q) && !/no-preference/.test(q) });
    }
    return r;
  };

  // Modo celu también del lado de JS (el servidor ya lo ve por el encabezado).
  const fake = (proto, key, val) => {
    const d = proto && Object.getOwnPropertyDescriptor(proto, key);
    if (d?.get) Object.defineProperty(proto, key, { ...d, get() { return on('hiberMobile') ? val : d.get.call(this); } });
  };
  fake(Navigator.prototype, 'userAgent', UA);
  fake(Navigator.prototype, 'platform', 'Linux armv8l');
  fake(Navigator.prototype, 'maxTouchPoints', 5);
  fake(window.NavigatorUAData?.prototype, 'mobile', true);
})();
