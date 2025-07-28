self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('fond-sati-cache-v1').then(function(cache) {
      return cache.addAll([
        '/',
        '/index.html',
        '/manifest.webmanifest',
        '/sw.js',
        '/ikone/icon-192.png',
        '/ikone/icon-512.png'
      ]);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        return response || fetch(event.request);
      })
  );
});