var APP_PREFIX = 'the-greatest-party';
var VERSION = '0.1.1';
var CACHE_NAME = APP_PREFIX + VERSION;
var URLS = [
  '/the-greatest-party/',
  '/the-greatest-party/index.html',
  '/the-greatest-party/manifest.json',
  '/the-greatest-party/favicon.ico',
  '/the-greatest-party/img/the-greatest-party.jpg',
  '/the-greatest-party/css/style.css',
  '/the-greatest-party/css/bootstrap-grid.min.css',
  '/the-greatest-party/css/bootstrap-reboot.min.css',
  '/the-greatest-party/css/bootstrap.min.css',
  '/the-greatest-party/service-worker.js',
  '/the-greatest-party/js/app.js',
  '/the-greatest-party/js/deck.js',
  '/the-greatest-party/js/hand.js',
  '/the-greatest-party/js/bootstrap.min.js',
  '/the-greatest-party/js/handlebars-v4.0.10.js',
  '/the-greatest-party/js/jquery-3.2.1.min.js',
  '/the-greatest-party/sound/clear.mp3',
  '/the-greatest-party/sound/click.mp3',
  '/the-greatest-party/sound/magic.mp3',
  '/the-greatest-party/sound/swoosh.mp3',
  '/the-greatest-party/browserconfig.xml',
  '/the-greatest-party/icons/android-icon-144x144.png',
  '/the-greatest-party/icons/android-icon-192x192.png',
  '/the-greatest-party/icons/android-icon-36x36.png',
  '/the-greatest-party/icons/android-icon-48x48.png',
  '/the-greatest-party/icons/android-icon-72x72.png',
  '/the-greatest-party/icons/android-icon-96x96.png',
  '/the-greatest-party/icons/apple-icon-114x114.png',
  '/the-greatest-party/icons/apple-icon-120x120.png',
  '/the-greatest-party/icons/apple-icon-144x144.png',
  '/the-greatest-party/icons/apple-icon-152x152.png',
  '/the-greatest-party/icons/apple-icon-180x180.png',
  '/the-greatest-party/icons/apple-icon-57x57.png',
  '/the-greatest-party/icons/apple-icon-60x60.png',
  '/the-greatest-party/icons/apple-icon-72x72.png',
  '/the-greatest-party/icons/apple-icon-76x76.png',
  '/the-greatest-party/icons/apple-icon-precomposed.png',
  '/the-greatest-party/icons/apple-icon.png',
  '/the-greatest-party/icons/favicon-16x16.png',
  '/the-greatest-party/icons/favicon-32x32.png',
  '/the-greatest-party/icons/favicon-96x96.png',
  '/the-greatest-party/icons/ms-icon-144x144.png',
  '/the-greatest-party/icons/ms-icon-150x150.png',
  '/the-greatest-party/icons/ms-icon-310x310.png',
  '/the-greatest-party/icons/ms-icon-70x70.png'
];

self.addEventListener('fetch', function (e) {
  console.log('fetch request: ' + e.request.url);
  e.respondWith(
    caches.match(e.request).then(function (request) {
      if (request) {
        console.log('responding with cache: ' + e.request.url);
        return request;
      } else {
        console.log('file is not cached, fetching: ' + e.request.url);
        return fetch(e.request);
      }
    })
  );
});

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log('installing cache: ' + CACHE_NAME)
      return cache.addAll(URLS);
    })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keyList) {
      var cacheWhitelist = keyList.filter(function (key) {
        return key.indexOf(APP_PREFIX);
      });
      cacheWhitelist.push(CACHE_NAME);
      return Promise.all(keyList.map(function (key, i) {
        if (cacheWhitelist.indexOf(key) === -1) {
          console.log('deleting cache: ' + keyList[i]);
          return caches.delete(keyList[i]);
        }
      }));
    })
  );
});
