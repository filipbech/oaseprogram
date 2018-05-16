const HASH = 'dev'; // Gets replaced on deploy build
const PREFIX = 'oaseprogram';
const APP_CACHE_NAME = `${PREFIX}-app-${HASH}`;
const STATIC_CACHE_NAME = `${PREFIX}-assets`;

const FILES = [
  '/',
  '/main.js',
  '/polyfills.js',
  '/runtime.js',
  '/styles.css',
  '/assets/map.jpg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(APP_CACHE_NAME)
      .then(cache => cache.addAll(FILES)
          .then(() => self.skipWaiting())
      )
  );
});

self.addEventListener('activate', event => {
  // Delete non-matching caches that has the prefix
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
        keys
          .filter(key => key != APP_CACHE_NAME && key.startsWith(`${PREFIX}-app-`))
          .map(key => caches.delete(key))
      )
    )
  );
});

self.addEventListener('fetch', event => {

  if (event.request.url.indexOf('google-analytics') > -1) {
    return;
  }

  event.respondWith(caches
    .match(event.request)
    .then(cacheResponse => cacheResponse || fetch(event.request))
  );

});

self.addEventListener('message', event => {

  if (event.data.type == 'download') {
    downloadFiles(event.data.list)
      .then(() => {
        event.ports[0].postMessage({
          success: true
        });
      }).catch(err => {
        event.ports[0].postMessage({
          error: err
        });
      });
  }

});


const downloadFiles = list => caches
  .open(STATIC_CACHE_NAME)
  .then(cache => cache.addAll(items)
);
