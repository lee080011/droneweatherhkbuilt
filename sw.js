const CACHE_NAME = 'drone-app-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];

// 安裝階段：快取靜態資源
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('🚀 App 靜態資源已成功快取！');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// 攔截請求
self.addEventListener('fetch', event => {
  if (event.request.url.includes('api.open-meteo.com') || 
      event.request.url.includes('photon.komoot.io') || 
      event.request.url.includes('swpc.noaa.gov') || 
      event.request.url.includes('weather.gov.hk')) {
    return; // 外部 API 直接聯網
  }
  
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      return cachedResponse || fetch(event.request);
    })
  );
});
// sw.js 內容
self.addEventListener('install', (event) => {
    self.skipWaiting(); // 強制新 Service Worker 立即安裝
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim()); // 立即控制所有開放中的分頁
});