/*
  === SERVICE WORKER VERSION 1 ===

  IMPORTANT:
  - This file must be named sw-v1.js
  - CACHE_NAME must match the version number
  - index.html must register this file:
        navigator.serviceWorker.register("/Slurry_Mixing_Calculator/sw-v1.js");

  When you release Version 2:
  - Duplicate this file as sw-v2.js
  - Update CACHE_NAME to "Slurry_Mixing_Calculator-v2"
  - Update index.html to register sw-v2.js
*/

// Expose version to the client
const APP_VERSION = "1";

const CACHE_NAME = "Slurry_Mixing_Calculator-cache-v1";

const urlsToCache = [
  "/Slurry_Mixing_Calculator/",

/*  "/Slurry_Mixing_Calculator", 
"/Slurry_Mixing_Calculator/"
"/Slurry_Mixing_Calculator"
These behave the same on GitHub Pages, but keeping both is harmless.
If you want to simplify, you can remove the second one — but it’s not required.*/

/*  "./", */
  
  "/Slurry_Mixing_Calculator/index.html",

/*  "/Slurry_Mixing_Calculator/styles.css",
  "/Slurry_Mixing_Calculator/script.js",  */

  "/Slurry_Mixing_Calculator/icons/icon-192.png",
  "/Slurry_Mixing_Calculator/icons/icon-512.png",
  "/Slurry_Mixing_Calculator/manifest.json"
];

self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    Promise.all([
      caches.keys().then(keys =>
        Promise.all(
          keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
        )
      ),
      self.clients.claim()
    ])
  );
});

self.addEventListener("fetch", event => {

  // Network-first for navigations (index.html)
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put("/Slurry_Mixing_Calculator/index.html", clone);
          });
          return response;
        })
        .catch(() => {
          return caches.match("/Slurry_Mixing_Calculator/index.html");
        })
    );
    return;
  }

  // Cache-first for everything else
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});

// Respond to version requests from the page
self.addEventListener("message", event => {
  if (event.data === "GET_VERSION") {
    event.source.postMessage({ version: APP_VERSION });
  }
});



