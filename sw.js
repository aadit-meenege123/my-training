const C = 'mytraining-v8';
const FILES = ['./', './index.html', './style.css', './data.js', './app.js', './manifest.json', './icon-180.png', './icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(C).then(c => c.addAll(FILES)).catch(() => { })); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== C).map(x => caches.delete(x)))).then(() => self.clients.claim())); });
// network-first so updates show up immediately; cache is the offline fallback
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request, { cache: 'no-cache' }).then(r => { if (r.ok && new URL(e.request.url).origin === location.origin) { const c = r.clone(); caches.open(C).then(x => x.put(e.request, c)); } return r; }).catch(() => caches.match(e.request)));
});
