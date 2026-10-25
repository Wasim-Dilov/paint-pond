const CACHE = "pp-mvo1mzdl";
const FILES = ["./","./assets/cover-4omx9Hf2.jpg","./assets/cover-BPxmwLF8.jpg","./assets/cover-BR_kow9-.jpg","./assets/cover-BTtllIOB.jpg","./assets/cover-CKSboRfX.jpg","./assets/cover-CNbsW0cK.jpg","./assets/cover-CNvGUl4i.jpg","./assets/cover-CQDKmYEe.jpg","./assets/cover-CsO9SpwH.jpg","./assets/cover-DDrXJWXb.jpg","./assets/cover-DRt9yoLb.jpg","./assets/cover-DXjJhKYu.jpg","./assets/cover-GzROJYQB.jpg","./assets/cover-K_3E_J8m.jpg","./assets/cover-QaLDOALY.jpg","./assets/cover-etsSfHQP.jpg","./assets/encode.worker-BgkKNcgQ.js","./assets/flood.worker-BqG8S5_0.js","./assets/index-CsxUWaTg.js","./assets/index-QqBXshpj.css","./assets/regions.worker-ESgDrMUY.js","./icons/apple-touch-icon.png","./icons/icon-192.png","./icons/icon-512.png","./icons/icon-maskable-512.png","./index.html","./manifest.webmanifest","./voices/colour-black.m4a","./voices/colour-blue.m4a","./voices/colour-brown.m4a","./voices/colour-green.m4a","./voices/colour-grey.m4a","./voices/colour-orange.m4a","./voices/colour-pink.m4a","./voices/colour-purple.m4a","./voices/colour-rainbow.m4a","./voices/colour-red.m4a","./voices/colour-white.m4a","./voices/colour-yellow.m4a","./voices/done-1.m4a","./voices/done-2.m4a","./voices/done-3.m4a","./voices/home-pick.m4a","./voices/lights-off.m4a","./voices/manifest.json","./voices/tool-crayon.m4a","./voices/tool-eraser.m4a","./voices/tool-fill.m4a","./voices/tool-glitter.m4a","./voices/tool-glow.m4a","./voices/tool-marker.m4a","./voices/tool-paint.m4a","./voices/tool-pencil.m4a","./voices/tool-rainbow.m4a","./voices/tool-smudge.m4a","./voices/tool-spray.m4a","./voices/tool-sticker.m4a","./voices/tool-watercolour.m4a","./voices/who-pick.m4a"];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith('pp-') && k !== CACHE).map((k) => caches.delete(k)))));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then((hit) => {
      if (hit) return hit;
      return fetch(req).then((res) => {
        if (res.ok && res.type === 'basic') {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      }).catch(() => (req.mode === 'navigate' ? caches.match('./index.html') : Response.error()));
    }),
  );
});
