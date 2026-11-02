/* global __CACHE_VERSION__, __PRECACHE_URLS__ */
const CACHE_PREFIX = 'dnhs-navigator-';
const CACHE_NAME = CACHE_PREFIX + __CACHE_VERSION__;
const INDEX_URL = new URL('index.html', self.registration.scope).href;

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    // Fetch HTML and its matching bundles together, bypassing the HTTP cache.
    await cache.addAll(__PRECACHE_URLS__.map((url) =>
      new Request(new URL(url, self.registration.scope), { cache: 'reload' })
    ));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names
      .filter((name) => name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME)
      .map((name) => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== 'GET' || !url.href.startsWith(self.registration.scope)) return;

  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        // Always use current HTML online. Keep the build's offline copy intact.
        const response = await fetch(request, { cache: 'no-store' });
        if (response.ok) return response;
        // Pages has no server routes for the installed app's /map start URL.
        if (response.status !== 404) return response;
      } catch {
        // Offline: use the HTML whose JS and CSS were cached during install.
      }
      const cache = await caches.open(CACHE_NAME);
      return cache.match(INDEX_URL);
    })());
    return;
  }

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    return await cache.match(request) || fetch(request);
  })());
});
