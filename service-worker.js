// ======================================
// BOODSCHAPPENLIJST PWA - SERVICE WORKER
// ======================================

const CACHE_NAME = "boodschappenlijst-v7";

const APP_BESTANDEN = [
    "/Shopping-List/",
    "/Shopping-List/index.html",
    "/Shopping-List/style.css",
    "/Shopping-List/script.js",
    "/Shopping-List/manifest.json"
];


// ======================================
// INSTALL
// ======================================

self.addEventListener(
    "install",
    event => {

        event.waitUntil(

            caches.open(CACHE_NAME)
                .then(cache => {

                    return cache.addAll(
                        APP_BESTANDEN
                    );

                })

        );

        self.skipWaiting();

    }
);


// ======================================
// ACTIVATE
// ======================================

self.addEventListener(
    "activate",
    event => {

        event.waitUntil(

            caches.keys()
                .then(cacheNamen => {

                    return Promise.all(

                        cacheNamen
                            .filter(
                                naam =>
                                    naam !== CACHE_NAME
                            )
                            .map(
                                naam =>
                                    caches.delete(naam)
                            )

                    );

                })

        );

        self.clients.claim();

    }
);


// ======================================
// FETCH
// ======================================

self.addEventListener(
    "fetch",
    event => {

        event.respondWith(

            caches.match(event.request)
                .then(cachedResponse => {

                    if (cachedResponse) {

                        return cachedResponse;

                    }


                    return fetch(event.request)
                        .then(response => {

                            /*
                             * Alleen geldige responses
                             * cachen.
                             */

                            if (
                                !response ||
                                response.status !== 200 ||
                                response.type === "opaque"
                            ) {

                                return response;

                            }


                            const responseKopie =
                                response.clone();


                            caches.open(CACHE_NAME)
                                .then(cache => {

                                    cache.put(
                                        event.request,
                                        responseKopie
                                    );

                                });


                            return response;

                        });

                })

        );

    }
);