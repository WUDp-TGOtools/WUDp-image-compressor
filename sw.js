// WUDp Image Compressor service worker: caches the app shell so it works offline after the first visit.
// Bump CACHE when shipping a new version so clients pick up changed files.
const CACHE = "wudp-image-compressor-v1.0.0";
const ASSETS = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "assets/css/main.css",
  "assets/img/logo.png",
  "assets/img/favicon-32.png",
  "assets/img/apple-touch-icon.png",
  "assets/img/icon-192.png",
  "assets/img/icon-512.png",
  "src/app.js",
  "src/i18n.js",
  "src/tour.js",
  "src/help.js",
  "src/worker.js",
  "src/zip.js",
  "src/search.js",
  "src/viewer.js",
  "src/props.js",
  "src/terminal.js",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== "GET" || url.origin !== self.location.origin) return;
  event.respondWith(
    caches.match(event.request).then((hit) => hit || fetch(event.request).then((response) => {
      if (response.ok) {
        const copy = response.clone();
        caches.open(CACHE).then((cache) => cache.put(event.request, copy));
      }
      return response;
    }))
  );
});
