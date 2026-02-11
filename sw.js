/* =========================================
   Service Worker: الحارس الذكي (PWA)
   الإصدار: V6 - (النسخة النهائية للتخزين الضخم)
   ========================================= */

const CACHE_NAME = 'althuraya-offline-v6'; 

// قائمة الملفات (تأكد أن أسماء المجلدات data و js صغيرة كما هنا)
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

  // البيانات (أهم جزء)
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

// 1. التثبيت (تحميل جماعي سريع)
self.addEventListener('install', (evt) => {
  self.skipWaiting();
  console.log('[SW] بدء التحميل V6...');
  
  evt.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // نستخدم Promise.all للسرعة + عدم التوقف عند خطأ واحد
      const promises = ASSETS_TO_CACHE.map(url => 
        fetch(url).then(res => {
            if(res.ok) return cache.put(url, res);
            throw new Error('Not OK');
        }).catch(err => console.warn(`⚠️ تخطي ملف: ${url}`))
      );
      
      await Promise.all(promises);
      
      // إرسال رسالة النجاح
      const clients = await self.clients.matchAll({includeUncontrolled: true});
      clients.forEach(client => client.postMessage({ type: 'CACHE_COMPLETE' }));
    })
  );
});

// 2. التفعيل (تنظيف القديم)
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

// 3. الجلب (Offline First) - هنا التعديل السحري
self.addEventListener('fetch', (evt) => {
  if (evt.request.url.includes('firestore') || evt.request.url.includes('googleapis')) return;

  evt.respondWith(
    // ignoreSearch: true >> هذه هي التي تصلح المشكلة!
    // تعني: لو طلب الموقع quran.json?v=123 أعطه quran.json المخزن فوراً
    caches.match(evt.request, { ignoreSearch: true }).then((res) => {
      return res || fetch(evt.request);
    })
  );
});
