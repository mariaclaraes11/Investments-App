// Guarda a app no telemóvel para abrir mesmo sem rede.
// Ao mudar ficheiros, sobe o número da versão para os telemóveis receberem a atualização.
const CACHE = 'clarainveste-v1';
const FILES = [
  './', './index.html', './app.js', './styles.css', './manifest.webmanifest',
  './vendor/htm-preact.mjs',
  './vendor/phosphor/regular/style.css', './vendor/phosphor/regular/Phosphor.woff2',
  './vendor/phosphor/fill/style.css', './vendor/phosphor/fill/Phosphor-Fill.woff2',
  './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

// Rede primeiro (para ver sempre a versão mais recente), cache quando não há rede.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then(res => {
        if (res.ok || res.type === 'opaque') {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
        }
        return res;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
