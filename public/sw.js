// Basic Service Worker
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installed');
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activated');
});

self.addEventListener('fetch', (event) => {
    // Basic fetch handler (can be expanded later for offline support)
    event.respondWith(fetch(event.request));
});
