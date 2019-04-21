var CACHE_NAME = 'my-blog-cache-v1'
// Read only
var urlsToCache = ["/","/archives/","/about/","/2018/09/09/debounce-and-throttle.html","/2019/04/21/my-promise.html","/404.html","/README.md","/about/index.html","/app.js","/archives/index.html","/assets/fonts/sourcesanspro.woff","/assets/fonts/sourcesanspro.woff2","/atom.xml","/css/main.css","/favicon.png","/index.html","/manifest.json","/sw.js"]

self.addEventListener('install', function (event) {
  // install
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then(function (cache) {
      return cache.addAll(urlsToCache)
    })
  )
})

self.addEventListener('activate', function (event) {
  console.log('Activated. Ready to start serving content!')
})

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      // Cache hit - return
      if (response) {
        return response
      }

      return fetch(event.request)
    })
  )
})

self.addEventListener('push', function (event) {
  var title = 'Yay a message.';
  var body = 'We have received a push message.';
  var icon = '/favicon.png';
  var tag = 'simple-push-example-tag';
  event.waitUntil(
    self.registration.showNotification(title, {
      body: body,
      icon: icon,
      tag: tag
    })
  )
})