const FILES_TO_CACHE = [
  'https://cdn.jsdelivr.net/npm/chart.js@2.8.0',
  'https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css',
  './',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png',
  './index.js',
  './styles.css'
];

const CACHE_NAME = 'budget-cache';
const DATA_CACHE_NAME = 'data-budget-cache';

//install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Your files were pre-cached successfully");
        return cache.addAll(FILES_TO_CACHE);
      }) 
      .then(self.skipWaiting())
  );
});

// The activate handler takes care of cleaning up old caches.
self.addEventListener('activate', (event) => {
  const currentCaches = [CACHE_NAME, DATA_CACHE_NAME];
  event.waitUntil(
    caches
      .keys()
      .then((keyList) => {
        return Promise.all(
          keyList.map(key => {
            if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
              console.log("Removing old cache data", key);
              return caches.delete(key);
            };
          })
        )
      })
      .then(() => self.clients.claim())
  );
});

//fetch
self.addEventListener('fetch', (event) => {
  //cache successful requests to API
  if (event.request.url.includes("/api")) {
    event.respondWith(
      caches.open(DATA_CACHE_NAME)
      .then(cache => {
        return fetch(event.request);
      })
      .then(response => {
        //if response is good, clone and store in cache
        if (response.status === 200) {
          cache.put(event.request.url, response.clone());
        };

        return response;

      })
      .catch(err => {
        // Network request failed try to get it from cache
        return cache.match(event.request);
      })
      .catch(err => console.log(err))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);   
    })
  );
});
