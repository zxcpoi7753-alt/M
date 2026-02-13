/* =========================================
   Service Worker: الحارس الذكي (Offline)
   الإصدار: V13 - (شامل: الخطوط المحلية + التحديثات)
   ========================================= */

const CACHE_NAME = 'althuraya-offline-v14'; 

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './css/style.css',
  
  // 1. المكتبات المحلية
  './js/react.js',
  './js/react-dom.js',
  './js/tailwindcss.js',
  './js/babel.js',
  './js/html2canvas.js',

  // 2. ملفات النظام
  './js/app.js',
  './js/data_loader.js',
  './js/firebase.js',

  // 3. البيانات الأساسية
  './data/quran.json',
  './data/azkar.json',
  './data/tafseer.json',
  './data/pagesquran.json',
  './data/seerah/prophet.json',

  // 4. الوحدات والمكونات القديمة
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

  './js/components/extras/VirtuousTimes.js',
  './js/components/extras/DailyWird.js',
  './js/components/extras/GlobalCounter.js',
  './js/components/extras/CardMaker.js',
  './js/components/extras/FeelingsPharmacy.js',
  './js/components/extras/QuranExam.js',
  './js/components/extras/TafseerExam.js',
  './js/components/ui/CustomModal.js',

  // 5. ملفات روضة المحبين
  './js/components/seerah/ProphetSeerah.js',
  './js/components/seerah/AsmaHusna.js',
  './js/components/seerah/RawdatHub.js',
   
// 🔥 أضف هذا السطر الجديد:
'./js/components/seerah/DuaSection.js', 

// 🔥 وأضف ملف البيانات:
'./data/duas.json',


  // 6. ملفات الإعدادات الجديدة
  './js/components/settings/GeneralSettings.js',
  './js/components/settings/SettingsModal.js',

  // 🔥 7. ملفات الخطوط المحلية (تعمل بدون نت)
  './fonts/Cairo-Regular.ttf',
  './fonts/Cairo-Medium.ttf',
  './fonts/Cairo-Bold.ttf',
  './fonts/Cairo-Black.ttf',
  './fonts/Amiri-Regular.ttf',
  './fonts/Amiri-Bold.ttf',
  './fonts/Amiri-Slanted.ttf'
];

self.addEventListener('install', (evt) => {
  self.skipWaiting();
  evt.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      const promises = ASSETS_TO_CACHE.map(url => 
        fetch(url).then(res => {
            if(res.ok) return cache.put(url, res);
            throw new Error('Not OK');
        }).catch(err => console.warn(`⚠️ ملف مفقود (يمكن تجاهله): ${url}`))
      );
      await Promise.all(promises);
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
