/* =========================================
   Service Worker: الحارس الذكي (PWA)
   الإصدار: V7 - (مع دعم قسم روضة المحبين)
   ========================================= */

const CACHE_NAME = 'althuraya-offline-v8'; 

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

  // البيانات (بما فيها السيرة الجديدة)
  './data/quran.json',
  './data/azkar.json',
  './data/tafseer.json',
  './data/pagesquran.json',
  './data/seerah/prophet.json',        // 🔥 جديد
  './data/seerah/prophet_profile.json', // 🔥 جديد

  // الوحدات
  './js/modules/quran_reader.js',
  './js/modules/azkar.js',
  './js/modules/calculators.js',
  './js/modules/test.js',
  './js/modules/visitors.js',
  './js/modules/ui.js',

  // المكونات
  './js/components/app/HomeSection.js',
  './js/components/app/TeachersSection.js',
  './js/components/app/SchedulesSection.js',
  './js/components/app/AboutSection.js',

  './js/components/admin/SettingsAdmin.js',
  './js/components/admin/NewsAdmin.js',
  './js/components/admin/TeachersAdmin.js',
  './js/components/admin/SchedulesAdmin.js',
  './js/components/admin/HalaqatAdmin.js',

  // الإضافات
  './js/components/extras/VirtuousTimes.js',
  './js/components/extras/DailyWird.js',
  './js/components/extras/GlobalCounter.js',
  './js/components/extras/CardMaker.js',
  './js/components/extras/FeelingsPharmacy.js',
  './js/components/extras/QuranExam.js',
  './js/components/extras/TafseerExam.js',
  './js/components/ui/CustomModal.js',

  // 🔥 قسم روضة المحبين
  './js/components/seerah/RawdatHub.js',
  './js/components/seerah/ProphetSeerah.js',
  './js/components/seerah/AsmaHusna.js'
];

self.addEventListener('install', (evt) => {
  self.skipWaiting();
  evt.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      const promises = ASSETS_TO_CACHE.map(url => 
        fetch(url).then(res => {
            if(res.ok) return cache.put(url, res);
            throw new Error('Not OK');
        }).catch(err => console.warn(`⚠️ تخطي ملف: ${url}`))
      );
      await Promise.all(promises);
      const clients = await self.clients.matchAll({includeUncontrolled: true});
      clients.forEach(client => client.postMessage({ type: 'CACHE_COMPLETE' }));
    })
  );
});

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

self.addEventListener('fetch', (evt) => {
  if (evt.request.url.includes('firestore') || evt.request.url.includes('googleapis')) return;
  evt.respondWith(
    caches.match(evt.request, { ignoreSearch: true }).then((res) => {
      return res || fetch(evt.request);
    })
  );
});
