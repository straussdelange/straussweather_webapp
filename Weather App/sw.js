const cacheName = "static cache-v1";
const resourcesToPrecache = [
  '/',
  'index.html',
  'main.css',
  'background.jpg',
  'icons/icon-192x192.png',
  'icons/icon-512x512.png',
  'app.js',
  'sw.js',
  'manifest.json',
  'fallback.json'
  ];

self.addEventListener("install", async function () {
  const cache = await caches.open(cacheName);
  cache.addAll(resourcesToPrecache);
});

self.addEventListener("activate", event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", event => {
  const request = event.request;
  const url = new URL(request.url);
  if (url.origin === location.origin) {
    event.respondWith(cacheFirst(request));
  } else {
    event.respondWith(networkFirst(request));
  }
});

async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  return cachedResponse || fetch(request);
}

async function networkFirst(request) {
  const dynamicCache = await caches.open("weather-dynamic");
  try {
    const networkResponse = await fetch(request);
    dynamicCache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (err) {
    const cachedResponse = await dynamicCache.match(request);
    return cachedResponse || await caches.match("./fallback.json");
  }
}