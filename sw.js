// 432Hz Studio PWA — offline cache (cache-first)
const CACHE = 'hz432-v3';
const ASSETS = [
  './', './index.html', './manifest.webmanifest', './icon192.png', './icon512.png',
  ...[7.83, 40, 111, 136.1, 174, 285, 396, 417, 432, 528, 639, 741, 852, 963]
    .map(f => './tracks/' + f + '.mp3'),
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(hit =>
      hit || fetch(e.request).then(r => {
        if (r.ok && new URL(e.request.url).origin === location.origin) {
          const copy = r.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
        }
        return r;
      })
    )
  );
});
