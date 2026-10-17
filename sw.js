// 432Hz Studio PWA — app shell and user-selected offline tracks.
const APP_CACHE = 'hz432-app-v58';
const APP_CACHE_PREFIX = 'hz432-app-v';
const LEGACY_APP_CACHE = /^hz432-v\d+$/;
const TRACK_CACHE = 'hz432-tracks-v1';
// Tone-card covers are never precached: each is cached the first time it is shown.
const COVER_CACHE = 'hz432-covers-v1';
const APP_ASSETS = [
  './', './index.html', './app.css', './app.js', './offline.js', './tuning_lab.js', './settings_transfer.js',
  './manifest.webmanifest', './icon192.png', './icon512.png', './audio_capture.js', './chladni_live.js',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(APP_CACHE)
      .then(cache => cache.addAll(APP_ASSETS))
      .then(() => self.skipWaiting()),
  );
});

async function migrateLegacyTracks(cacheName) {
  const oldCache = await caches.open(cacheName);
  const trackCache = await caches.open(TRACK_CACHE);
  for (const request of await oldCache.keys()) {
    if (!new URL(request.url).pathname.includes('/tracks/')) continue;
    if (await trackCache.match(request)) continue;
    const response = await oldCache.match(request);
    if (response) await trackCache.put(request, response);
  }
}

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    const preservedLegacyCaches = new Set();
    for (const name of names.filter(key => LEGACY_APP_CACHE.test(key))) {
      try {
        await migrateLegacyTracks(name);
      } catch {
        // Keep the legacy cache if its selected tracks could not be migrated.
        preservedLegacyCaches.add(name);
      }
    }
    await Promise.all((await caches.keys())
      .filter(name => (name.startsWith(APP_CACHE_PREFIX) && name !== APP_CACHE)
        || (LEGACY_APP_CACHE.test(name) && !preservedLegacyCaches.has(name)))
      .map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});

function isTrack(url) {
  return url.origin === self.location.origin
    && /\/tracks\/[^/]+\.mp3$/i.test(url.pathname);
}

function isCover(url) {
  return url.origin === self.location.origin
    && /\/tracks\/covers\/[^/]+\.webp$/i.test(url.pathname);
}

async function coverResponse(request) {
  const cache = await caches.open(COVER_CACHE);
  const cached = await cache.match(request, { ignoreSearch: true });
  if (cached) return cached;
  const fresh = await fetch(request);
  if (fresh.ok) await cache.put(request, fresh.clone());
  return fresh;
}

async function cachedTrackResponse(cache, request) {
  const cached = await cache.match(request, { ignoreSearch: true });
  if (!cached) return null;
  const range = request.headers.get('Range');
  if (!range) return cached;

  const match = /^bytes=(\d*)-(\d*)$/i.exec(range.trim());
  if (!match) return cached;
  const bytes = await cached.arrayBuffer();
  const size = bytes.byteLength;
  const suffixLength = Number(match[2]);
  const start = match[1] ? Number(match[1]) : Math.max(0, size - suffixLength);
  const end = match[2] && match[1] ? Math.min(Number(match[2]), size - 1) : size - 1;
  if (start >= size || start > end) {
    return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${size}` } });
  }
  const headers = new Headers(cached.headers);
  headers.set('Accept-Ranges', 'bytes');
  headers.set('Content-Length', String(end - start + 1));
  headers.set('Content-Range', `bytes ${start}-${end}/${size}`);
  return new Response(bytes.slice(start, end + 1), { status: 206, headers });
}

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (isTrack(url)) {
    event.respondWith(caches.open(TRACK_CACHE).then(async cache =>
      (await cachedTrackResponse(cache, request)) || fetch(request)));
    return;
  }

  if (isCover(url)) {
    event.respondWith(coverResponse(request).catch(() => Response.error()));
    return;
  }

  const isAppAsset = request.mode === 'navigate'
    || /\/(?:index\.html|app\.js|app\.css|offline\.js|tuning_lab\.js)$/.test(url.pathname);
  event.respondWith(caches.open(APP_CACHE).then(async cache => {
    if (isAppAsset) {
      try {
        const fresh = await fetch(request);
        if (fresh.ok) await cache.put(request, fresh.clone());
        return fresh;
      } catch {
        return (await cache.match(request, { ignoreSearch: true }))
          || (request.mode === 'navigate' ? await cache.match('./index.html') : null)
          || Response.error();
      }
    }
    return (await cache.match(request, { ignoreSearch: true })) || fetch(request);
  }));
});
