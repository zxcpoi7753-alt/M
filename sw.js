/* =========================================
   Service Worker: الحارس الذكي (PWA)
   الإصدار: V3 - تخزين شامل للبيانات والخطوط
   ========================================= */

const CACHE_NAME = 'althuraya-offline-v3'; // تغيير الرقم يفرض تحديث الكاش عند المستخدمين

// قائمة الملفات التي سيتم تخزينها إجبارياً
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './admin.html',
  './manifest.json',
  './css/style.css',
  
  // الخطوط (مهمة جداً للأوفلاين)
  './css/fonts/Amiri-Bold.ttf',
  './css/fonts/Cairo-Black.ttf',

  // المكتبات الأساسية
  './js/tailwindcss.js',
  './js/react.js',
  './js/react-dom.js',
  './js/babel.js',
  './js/html2canvas.js',
  './js/firebase.js',

  // ملفات التشغيل
  './js/app.js',
  './js/admin.js',
  './js/data_loader.js',

  // البيانات الضخمة (هنا السر!)
  './data/quran.json',
  './data/azkar.json',
  './data/tafseer.json',
  './data/pagesquran.json',

  // المكونات والوحدات
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

// 1. التثبيت: تحميل كل الملفات دفعة واحدة
self.addEventListener('install', (evt) => {
  console.log('[ServiceWorker] جاري التثبيت وتخزين الملفات...');
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting(); // تفعيل الخدمة فوراً
});

// 2. التفعيل: تنظيف الكاش القديم
self.addEventListener('activate', (evt) => {
  console.log('[ServiceWorker] تم التفعيل وتنظيف القديم');
  evt.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('[ServiceWorker] حذف الكاش القديم:', key);
          return caches.delete(key);
        }
      }));
    })
  );
  self.clients.claim();
});

// 3. الاستدعاء: استراتيجية "الكاش أولاً" (Cache First)
// هذه الاستراتيجية تجعل التطبيق صاروخياً وتعمل بدون نت
self.addEventListener('fetch', (evt) => {
  // استثناء طلبات الفايربيس أو الروابط الخارجية (لتبقى متصلة بالنت)
  if (evt.request.url.includes('firestore') || evt.request.url.includes('googleapis')) {
    return; // دعها تذهب للشبكة
  }

  evt.respondWith(
    caches.match(evt.request).then((cacheRes) => {
      // إذا وجد الملف في الكاش، ارجعه فوراً (أسرع وأوفلاين)
      // إذا لم يوجد، اذهب للإنترنت واجلبه
      return cacheRes || fetch(evt.request).then(fetchRes => {
          return caches.open(CACHE_NAME).then(cache => {
              // خزن الملف الجديد للمرة القادمة
              cache.put(evt.request.url, fetchRes.clone());
              return fetchRes;
          });
      });
    }).catch(() => {
        // إذا فشل كل شيء (لا كاش ولا نت)، يمكن عرض صفحة "أنت غير متصل"
        // لكن بما أننا خزننا كل شيء في التثبيت، لن نحتاج لهذا غالباً
    })
  );
});
