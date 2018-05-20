const HASH = 'dev2'; // Gets replaced on deploy build
const PREFIX = 'oaseprogram';
const APP_CACHE_NAME = `${PREFIX}-app-${HASH}`;
const STATIC_CACHE_NAME = `${PREFIX}-assets`;

const FILES = [
  '/',
  '/main.js',
  '/polyfills.js',
  '/runtime.js',
  '/styles.js',
  // '/styles.css',
  '/assets/map.jpg',
  '/breuertextwebltd-bold.woff',
  '/breuertextwebltd-regular.woff',
  '/rooney_bold.woff2',
  '/rooney_light.woff2'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(APP_CACHE_NAME)
      .then(cache => cache.addAll(FILES)
          .then(() => {
            console.log('installed and cached');
            return self.skipWaiting()
          })
      )
  );
});

self.addEventListener('activate', event => {
  console.log('starting delete-cache');
  // Delete non-matching caches that has the prefix
  event.waitUntil(Promise.all([
    caches.keys().then(keys => Promise.all(
        keys
          .filter(key => key != APP_CACHE_NAME && key.startsWith(`${PREFIX}-app-`))
          .map(key => {
            console.log('deleting cache', key);
            return caches.delete(key)
          })
      )
    ), clients.claim()])
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
  console.log('in sw: message', event);
  if (event.data.type == 'download') {
    console.log('all images download started')
    downloadFiles(event.data.list)
      .then(() => {
        console.log('all images download ended')
        event.ports[0].postMessage({
          success: true
        });
      }).catch(err => {
        console.log('imagedownloads failed');
        event.ports[0].postMessage({
          error: err
        });
      });
  }

});

const downloadFiles = list => caches
  .open(STATIC_CACHE_NAME)
  .then(cache => cache.addAll(list));
