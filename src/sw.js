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

  event.respondWith(new Promise(resolve => {
    // FOR navigation-fetches, go NETWORK-FIRST with a max-reponsetime of 500ms
    if (event.request.mode == 'navigate') {
      const MAX_TIME = new Promise(res => {
        setTimeout(res, 500);
      });
      return resolve(Promise.race(fetch(event.request)
        .then(fetchResponse => {
          return caches.open(APP_CACHE_NAME)
            .then(cache => cache.put(event.request, response.clone()))
            .then(_ => fetchResponse);
        }), MAX_TIME.then(_ => caches.match('/'))
      ));
    }

    // ALL OTHER REQUESTS ARE SERVED CACHE-FIRST
    return caches.match(event.request)
      .then(cacheResponse => cacheResponse || fetch(event.request)
        .then(fetchResponse => {
          return caches.open(STATIC_CACHE_NAME)
            .then(cache => cache.put(event.request, response.clone()))
            .then(_ => fetchResponse);
        })
      )
  }));

});
