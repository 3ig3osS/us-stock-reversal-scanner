const CACHE_NAME = 'us-reversal-scanner-v3-shell';
const SHELL = ['./', './index.html', './manifest.webmanifest'];
self.addEventListener('install', event => { event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', event => { event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', event => { const req = event.request; const url = new URL(req.url); if (req.method !== 'GET' || url.origin !== self.location.origin) return; event.respondWith(fetch(req).then(res => { if (res.ok) { const copy = res.clone(); caches.open(CACHE_NAME).then(cache => cache.put(req, copy)); } return res; }).catch(() => caches.match(req).then(cached => cached || caches.match('./index.html')))); });
