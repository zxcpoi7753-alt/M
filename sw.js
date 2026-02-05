/* =========================================
   ملف الخدمة: sw.js
   الوظيفة: التخزين المؤقت (Cache) للعمل أوفلاين
   ========================================= */

const CACHE_NAME = 'thuraya-v6-gold';

// قائمة الملفات التي يجب حفظها في ذاكرة الهاتف
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './admin.html',
    './manifest.json',
    './css/style.css',
    './js/firebase.js',
    './js/data_loader.js',
    './js/features.js',
    './js/app.js',
    './js/admin.js',
    // ملفات البيانات (مهمة جداً للأوفلاين)
    './data/quran.json',
    './data/pagesquran.json',
    './data/azkar.json'
];

// 1. عند التثبيت: قم بتحميل وحفظ الملفات
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Opened cache');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// 2. عند طلب ملف: حاول جلبه من الذاكرة أولاً، وإلا فمن الإنترنت
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            // إذا وجد الملف في الكاش، ارجعه
            if (response) {
                return response;
            }
            // وإلا اطلبه من الإنترنت
            return fetch(event.request);
        })
    );
});

// 3. تنظيف الكاش القديم عند تحديث الموقع
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
