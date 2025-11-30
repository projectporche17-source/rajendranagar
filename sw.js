
const CACHE_NAME = 'eptp-v2';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('fetch', (event) => {
  // Network first, fall back to cache for HTML/JS
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone and cache valid responses
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});

self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : { title: 'EPTP', body: 'New Message' };
  event.waitUntil(
      self.registration.showNotification(data.title, {
          body: data.body,
          icon: '/icon.png'
      })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
      clients.matchAll({ type: 'window' }).then(clientList => {
          if (clientList.length > 0) return clientList[0].focus();
          return clients.openWindow('/');
      })
  );
});
