/* =========================================
   محمل البيانات: js/data_loader.js
   (مصمم خصيصاً لملفاتك: quran.json, azkar.json)
   ========================================= */

async function loadJSON(path) {
    try {
        // إضافة وقت وهمي لمنع المتصفح من حفظ النسخة القديمة
        const response = await fetch(`${path}?t=${new Date().getTime()}`);
        if (!response.ok) throw new Error("الملف غير موجود");
        return await response.json();
    } catch (e) {
        console.error(`❌ فشل تحميل ${path}`, e);
        return null;
    }
}

async function initAppData() {
    console.log("🚀 بدء تهيئة النظام...");

    // تهيئة الحاويات
    window.APP_DATA = window.APP_DATA || {};
    window.APP_DATA.isReady = false;

    // 1. تحميل الملفات الثلاثة المهمة
    const [quranRaw, azkarRaw, pagesRaw] = await Promise.all([
        loadJSON('data/quran.json'),
        loadJSON('data/azkar.json'),
        loadJSON('data/pagesquran.json')
    ]);

    // 2. هندسة بيانات القرآن (لإرضاء القديم والجديد)
    if (quranRaw) {
        let quranArray = [];
        let quranObject = {};

        // فحص نوع الملف (هل هو مصفوفة [] أم كائن {})
        if (Array.isArray(quranRaw)) {
            quranArray = quranRaw;
            // تحويله لكائن للنظام القديم
            quranRaw.forEach(s => { if(s.number) quranObject[s.number] = s; });
        } else {
            // هو كائن، نحوله لمصفوفة للنظام الجديد
            quranObject = quranRaw;
            quranArray = Object.values(quranRaw);
        }

        // الحفظ في النافذة
        window.quranData = quranArray;       // للمحاكي والورد اليومي
        window.APP_DATA.quran = quranObject; // لاختبر حفظك القديم
        
        console.log(`✅ تم تحميل المصحف: ${quranArray.length} سورة`);
    } else {
        // بيانات طوارئ (إذا فشل التحميل)
        console.error("⚠️ فشل تحميل المصحف! تفعيل الطوارئ.");
        const dummy = [{ number: 1, name: "الفاتحة", ayahs: [{ text: "بسم الله الرحمن الرحيم", number: 1 }] }];
        window.quranData = dummy;
        window.APP_DATA.quran = { 1: dummy[0] };
    }

    // 3. هندسة الأذكار
    if (azkarRaw) {
        window.APP_DATA.azkar = azkarRaw; // للنظام القديم
        window.azkarData = azkarRaw;      // للنظام الجديد
        console.log(`✅ تم تحميل الأذكار`);
    } else {
        window.APP_DATA.azkar = [];
    }

    // 4. هندسة الصفحات
    if (pagesRaw) {
        window.APP_DATA.pages = pagesRaw;
    }

    // 5. إطلاق الموقع
    window.APP_DATA.isReady = true;
    window.dispatchEvent(new Event('data-ready'));
}

initAppData();
