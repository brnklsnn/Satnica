self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("satnica-cache").then(cache => {
      return cache.addAll([
        "./",
        "./index.html",
        "./manifest.webmanifest",
        "./style.css",
        "./app.js"
      ]);
    })
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request);
    })
  );
});
