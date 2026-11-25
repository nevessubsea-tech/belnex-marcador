const C = 'belnex-34';

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(C)
      .then(c => c.addAll([
        './',
        './index.html',
        './manifest.json',
        './icon.png'
      ].map(url => new Request(url, {
        cache: 'reload'
      }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k =>
          k.startsWith('belnex-') && k !== C
        ).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (
    e.request.method === 'GET' &&
    new URL(e.request.url).origin === self.location.origin
  ) {
    e.respondWith(
      caches.open(C).then(c =>
        c.match(e.request).then(r =>
          r || fetch(e.request)
        )
      )
    );
  }
});
