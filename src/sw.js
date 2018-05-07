const HASH = 'dev'; // Gets replaced on deploy build
const PREFIX = 'oaseprogram';
const CACHE_NAME = `${PREFIX}-${HASH}`;

const FILES = [
  '/',
  '/main.js',
  '/polyfills.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
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
          .filter(key => key != CACHE_NAME && key.startsWith(`${PREFIX}-`))
          .map(key => caches.delete(key))
      )
    )
  );
});

self.addEventListener('fetch', event => {

  const MAX_TIME = new Promise(res => {
    setTimeout(res, 500);
  })

  event.respondWith(caches.open(CACHE_NAME)
    .then(cache => {
      // FOR navigation-fetches, go NETWORK-FIRST with a max-reponsetime of 500ms
      if (event.request.mode == 'navigate') {
        return Promise.race(fetch(event.request)
          .then(fetchResponse => {
            return cache.put(event.request, response.clone())
              .then(_ => fetchResponse)
          })
          , MAX_TIME.then(_ =>  cache.match('/'))
        )
      }

      // ALL OTHER REQUESTS ARE SERVED CACHE-FIRST
      return cache.match(event.request)
        .then(cacheResponse => cacheResponse || fetch(event.request)
          .then(fetchResponse => {
            return cache.put(event.request, fetchResponse.clone())
              .then(_ => fetchResponse);
          })
        )
    })
  );

});
