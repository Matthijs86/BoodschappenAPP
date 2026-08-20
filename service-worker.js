// ======================================
// BOODSCHAPPENLIJST PWA - SERVICE WORKER
// ======================================

const CACHE_NAME = "boodschappenlijst-v10";

const APP_BESTANDEN = [
    "/BoodschappenAPP/",
    "/BoodschappenAPP/index.html",
    "/BoodschappenAPP/style.css",
    "/BoodschappenAPP/script.js",
    "/BoodschappenAPP/manifest.json",
    "/BoodschappenAPP/icon-192.png",
    "/BoodschappenAPP/icon-512.png"
];


// ======================================
// INSTALL
// ======================================

self.addEventListener("install", event => {

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(APP_BESTANDEN))
    );

    self.skipWaiting();
});


// ======================================
// ACTIVATE
// ======================================

self.addEventListener("activate", event => {

    event.waitUntil(
        caches.keys()
            .then(cacheNamen => {

                return Promise.all(
                    cacheNamen
                        .filter(naam => naam !== CACHE_NAME)
                        .map(naam => caches.delete(naam))
                );

            })
    );

    self.clients.claim();
});


// ======================================
// FETCH
// ======================================

self.addEventListener("fetch", event => {

    // Alleen HTTP/HTTPS verzoeken verwerken.
    // Chrome-extensies en andere protocollen overslaan.
    if (
        event.request.url.startsWith("chrome-extension://") ||
        !event.request.url.startsWith("http")
    ) {
        return;
    }

    event.respondWith(

        caches.match(event.request)
            .then(cachedResponse => {

                if (cachedResponse) {
                    return cachedResponse;
                }

                return fetch(event.request)
                    .then(response => {

                        if (
                            !response ||
                            response.status !== 200 ||
                            response.type === "opaque"
                        ) {
                            return response;
                        }

                        const responseKopie = response.clone();

                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(
                                    event.request,
                                    responseKopie
                                );
                            })
                            .catch(error => {
                                console.log(
                                    "Cache overslaan:",
                                    error
                                );
                            });

                        return response;
                    });

            })
            .catch(() => {

                return caches.match(
                    "/BoodschappenAPP/index.html"
                );

            })

    );

});
