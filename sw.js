/* =========================================
   Service Worker: الحارس الذكي (المتسامح - Anti-Freeze)
   الإصدار: V5 - يكمل التحميل حتى لو نقص ملف
   ========================================= */

const CACHE_NAME = 'althuraya-offline-v5'; 

// قائمة الملفات (حتى لو أخطأت في اسم واحد، لن يتوقف التطبيق)
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './admin.html',
  './manifest.json',
  './css/style.css',
  
  // الخطوط
  './css/fonts/Amiri-Bold.ttf',
  './css/fonts/Cairo-Black.ttf',

  // المكتبات (تأكد أنها موجودة في مجلد js)
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

  // البيانات
  './data/quran.json',
  './data/azkar.json',
  './data/tafseer.json',
  './data/pagesquran.json',

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

  './js/components/extras/VirtuousTimes.js',
  './js/components/extras/DailyWird.js',
  './js/components/extras/GlobalCounter.js',
  './js/components/extras/CardMaker.js',
  './js/components/extras/FeelingsPharmacy.js',
  './js/components/extras/QuranExam.js',
  './js/components/extras/TafseerExam.js',
  './js/components/ui/CustomModal.js'
];

// 1. التثبيت (النسخة الذكية: لا تتوقف عند الخطأ)
self.addEventListener('install', (evt) => {
  self.skipWaiting();
  console.log('[SW] بدء التحميل الذكي...');
  
  evt.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // نمر على الملفات واحداً تلو الآخر
      for (const url of ASSETS_TO_CACHE) {
          try {
              const res = await fetch(url);
              if (res.ok) {
                  await cache.put(url, res);
              } else {
                  console.warn(`⚠️ ملف مفقود (404): ${url}`); // يسجل الخطأ ولا يتوقف
              }
          } catch (error) {
              console.warn(`❌ تعذر تحميل: ${url}`); // يسجل الخطأ ولا يتوقف
          }
      }
      
      console.log('[SW] اكتملت العملية (تم تجاهل الملفات المفقودة)');
      
      // إبلاغ التطبيق بالنجاح
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
      }).catch(() => {
          // إذا فشل كل شيء، لا تفعل شيئاً (أو اعرض صفحة خطأ مخصصة)
      });
    })
  );
});
