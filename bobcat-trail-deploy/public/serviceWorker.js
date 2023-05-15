const staticBobcatTrail = "dev-bobcat-trail"
const assets = [
    "/",
    "/index.html",
    "/css/style.css",
    "/buildings.js",
    "/courseobj.js",
    "/assets/images/search-icon-2.png",
    "/assets/images/walking.png",
    "/assets/images/remove-map-location-icon.png"
]

self.addEventListener("install", installEvent => {
    installEvent.waitUntil(
        caches.open(staticBobcatTrail).then(cache => {
            cache.addAll(assets)
        })
    )
})

self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(
        caches.match(fetchEvent.request).then(response => {
            return response || fetch(fetchEvent.request)
        })
    )
})