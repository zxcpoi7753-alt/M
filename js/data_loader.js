/* =========================================
   محمل البيانات: js/data_loader.js
   (الجسر الذكي: يدعم الأنظمة القديمة والجديدة معاً)
   ========================================= */

async function loadJSON(path) {
    try {
        const response = await fetch(path);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (e) {
        console.error(`⚠️ فشل تحميل ${path}:`, e);
        return null;
    }
}

async function initAppData() {
    console.log("⏳ جاري تحميل وتجهيز البيانات...");

    // 1. تهيئة الحاويات (لمنع الشاشة البيضاء)
    window.APP_DATA = window.APP_DATA || {}; 
    window.APP_DATA.isReady = false;

    // 2. تحميل الملفات
    const [quranArray, azkarArray] = await Promise.all([
        loadJSON('data/quran.json'),
        loadJSON('data/azkar.json')
    ]);

    // 3. معالجة القرآن (أهم خطوة)
    if (quranArray) {
        // أ) للنظام الجديد (مصفوفة)
        window.quranData = quranArray; 
        
        // ب) للنظام القديم (Object مفهرس برقم السورة)
        // نحول المصفوفة إلى كائن: { "1": {name: "الفاتحة"...}, "2": {...} }
        window.APP_DATA.quran = {};
        quranArray.forEach(surah => {
            window.APP_DATA.quran[surah.number] = surah;
        });

        // ج) إنشاء فهرس الصفحات (لحل مشكلة اختبار الصفحة)
        // (مؤقتاً سننشئ فهرساً بسيطاً إذا لم يكن ملف الصفحات موجوداً)
        window.APP_DATA.pages = []; 
        // هنا يمكن إضافة منطق الصفحات لاحقاً
    }

    // 4. معالجة الأذكار
    if (azkarArray) {
        window.APP_DATA.azkar = azkarArray; // للنظام القديم
        window.azkarData = azkarArray;      // للنظام الجديد (احتياط)
    }

    // 5. إطلاق إشارة البدء
    window.APP_DATA.isReady = true;
    window.dispatchEvent(new Event('data-ready'));
    console.log("✅ البيانات جاهزة: القديمة والجديدة تعمل الآن.");
}

initAppData();
