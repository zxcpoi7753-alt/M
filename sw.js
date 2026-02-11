/* =========================================
   Service Worker: الحارس الذكي (PWA)
   الإصدار: V4 - مع إشعار اكتمال التحميل
   ========================================= */

const CACHE_NAME = 'althuraya-offline-v4'; // قمنا بتغيير الإصدار لتحديث الكاش

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './admin.html',
  './manifest.json',
  './css/style.css',
  
  // الخطوط
  './css/fonts/Amiri-Bold.ttf',
  './css/fonts/Cairo-Black.ttf',

  // المكتبات
  './js/tailwindcss.js',
  './js/react.js',
  './js/react-dom.js',
  './js/babel.js',
  './js/html2canvas.js',
  './js/firebase.js',

  // ملفات النظام
  './js/app.js',
  './js/admin.js',
  './js/data_loader.js',

  // البيانات (تأكد أن المسارات صحيحة 100%)
  './data/quran.json',
  './data/azkar.json',
  './data/tafseer.json',
  './data/pagesquran.json',

  // الوحدات والمكونات
  './js/modules/quran_reader.js',
  './js/modules/azkar.js',
  './js/modules/calculators.js',
  './js/modules/test.js',
  './js/modules/visitors.js',
  './js/modules/ui.js',

  './js/components/app/HomeSection.js',
  './js/components/app/TeachersSection.js',
  './js/components/app/SchedulesSection.js',
  './js/components/app/AboutSection.js',

  './js/components/admin/SettingsAdmin.js',
  './js/components/admin/NewsAdmin.js',
  './js/components/admin/TeachersAdmin.js',
  './js/components/admin/SchedulesAdmin.js',
  './js/components/admin/HalaqatAdmin.js',

  './js/components/extras/VirtuousTimes.js',
  './js/components/extras/DailyWird.js',
  './js/components/extras/GlobalCounter.js',
  './js/components/extras/CardMaker.js',
  './js/components/extras/FeelingsPharmacy.js',
  './js/components/extras/QuranExam.js',
  './js/components/extras/TafseerExam.js',
  './js/components/ui/CustomModal.js'
];

// 1. التثبيت والتحميل
self.addEventListener('install', (evt) => {
  self.skipWaiting();
  console.log('[SW] بدء تحميل الملفات...');
  
  evt.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // محاولة تحميل الملفات وإذا نجحت نرسل رسالة
      await cache.addAll(ASSETS_TO_CACHE);
      console.log('[SW] تم تحميل كل الملفات بنجاح!');
      
      // إرسال رسالة للصفحة بأن التحميل اكتمل
      const clients = await self.clients.matchAll({includeUncontrolled: true});
      clients.forEach(client => {
          client.postMessage({ type: 'CACHE_COMPLETE' });
      });
    })
  );
});

// 2. التفعيل
self.addEventListener('activate', (evt) => {
  evt.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }));
    })
  );
  self.clients.claim();
});

// 3. الجلب (Offline First)
self.addEventListener('fetch', (evt) => {
  if (evt.request.url.includes('firestore') || evt.request.url.includes('googleapis')) return;
  evt.respondWith(
    caches.match(evt.request).then((res) => {
      return res || fetch(evt.request).then(fetchRes => {
          return caches.open(CACHE_NAME).then(cache => {
              cache.put(evt.request.url, fetchRes.clone());
              return fetchRes;
          });
      });
    })
  );
});
