/* =========================================
   محمل البيانات: js/data_loader.js
   (الجسر الشامل: يحل مشكلة التعليق ويدعم القديم والجديد)
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
    console.log("⏳ بدء تحميل البيانات...");

    // تهيئة الحاويات العالمية
    window.APP_DATA = window.APP_DATA || {}; 
    window.APP_DATA.isReady = false;

    // تحميل الملفات بالتوازي
    const [quranArray, azkarArray] = await Promise.all([
        loadJSON('data/quran.json'),
        loadJSON('data/azkar.json')
    ]);

    // 1. معالجة بيانات القرآن (لحل مشكلة اختبر حفظك + المحاكي)
    if (quranArray) {
        // أ) للنظام الجديد (المحاكي والورد اليومي يحتاجونه مصفوفة)
        window.quranData = quranArray; 
        
        // ب) للنظام القديم (اختبر حفظك يحتاجه كائن مفهرس برقم السورة)
        window.APP_DATA.quran = {};
        quranArray.forEach(surah => {
            window.APP_DATA.quran[surah.number] = surah;
        });
    } else {
        console.error("❌ لم يتم العثور على ملف القرآن!");
        // بيانات طوارئ لمنع الشاشة البيضاء
        window.quranData = [];
        window.APP_DATA.quran = {};
    }

    // 2. معالجة بيانات الأذكار
    if (azkarArray) {
        window.APP_DATA.azkar = azkarArray; // للتصميم القديم
        window.azkarData = azkarArray;      // احتياط
    }

    // 3. إطلاق إشارة الجاهزية (هذا يفك تعليق "جاري التحميل")
    window.APP_DATA.isReady = true;
    const event = new Event('data-ready');
    window.dispatchEvent(event);
    console.log("✅ تم تجهيز البيانات بنجاح (القديم والجديد).");
}

initAppData();
