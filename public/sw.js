const CACHE_NAME = 'qrcar-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg'
];

// Install Service Worker and cache core shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate and remove old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch interceptor utilizing Stale-While-Revalidate strategy
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // Bypass caching for Supabase REST endpoints, external APIs, and local Vite HMR websocket
  if (
    requestUrl.origin !== self.location.origin ||
    event.request.method !== 'GET' ||
    requestUrl.pathname.includes('/rest/v1/') ||
    requestUrl.pathname.includes('ws') ||
    requestUrl.pathname.includes('hot')
  ) {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        const fetchedResponse = fetch(event.request)
          .then((networkResponse) => {
            // Cache successful GET requests from local origin
            if (networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(() => {
            // Offline fallback: return cached response if request fails
            return cachedResponse;
          });

        return cachedResponse || fetchedResponse;
      });
    })
  );
});
