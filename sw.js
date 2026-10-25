const CACHE = "pp-mvnphvr1";
const FILES = ["./","./assets/encode.worker-BgkKNcgQ.js","./assets/index-CVYklrI_.css","./assets/index-qUr6U_5B.js","./assets/regions.worker-ESgDrMUY.js","./icons/apple-touch-icon.png","./icons/icon-192.png","./icons/icon-512.png","./icons/icon-maskable-512.png","./index.html","./manifest.webmanifest","./voices/colour-black.m4a","./voices/colour-blue.m4a","./voices/colour-brown.m4a","./voices/colour-green.m4a","./voices/colour-grey.m4a","./voices/colour-orange.m4a","./voices/colour-pink.m4a","./voices/colour-purple.m4a","./voices/colour-rainbow.m4a","./voices/colour-red.m4a","./voices/colour-white.m4a","./voices/colour-yellow.m4a","./voices/done-1.m4a","./voices/done-2.m4a","./voices/done-3.m4a","./voices/home-pick.m4a","./voices/lights-off.m4a","./voices/manifest.json"];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('pp-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
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
