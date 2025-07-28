const CACHE_NAME = "satnica-v1";
const FILES_TO_CACHE = [
  "/Satnica/",
  "/Satnica/index.html",
  "/Satnica/style.css",
  "/Satnica/app.js",
  "/Satnica/manifest.webmanifest",
  "/Satnica/ikone/icon-192.png",
  "/Satnica/ikone/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});
