/* =========================================
   محمل البيانات: js/data_loader.js
   (الإصدار المستقر: يدعم quran.json و pagesquran.json)
   ========================================= */

async function loadJSON(path) {
    try {
        const response = await fetch(`${path}?v=${new Date().getTime()}`); // منع الكاش
        if (!response.ok) throw new Error("404");
        return await response.json();
    } catch (e) {
        console.error(`❌ فشل تحميل ${path}`, e);
        return null;
    }
}

async function initAppData() {
    console.log("🚀 بدء تهيئة النظام...");

    window.APP_DATA = window.APP_DATA || {};
    window.APP_DATA.isReady = false;

    // تحميل الملفات (نفس الأسماء التي في مجلد data لديك)
    const [quranRaw, azkarRaw, pagesRaw] = await Promise.all([
        loadJSON('data/quran.json'),
        loadJSON('data/azkar.json'),
        loadJSON('data/pagesquran.json')
    ]);

    // 1. معالجة القرآن
    if (quranRaw) {
        let quranArray = [];
        // إذا كان الملف كائن (Object)، نحوله لمصفوفة
        if (!Array.isArray(quranRaw) && typeof quranRaw === 'object') {
             quranArray = Object.values(quranRaw);
        } else {
             quranArray = quranRaw;
        }

        window.quranData = quranArray; // للنظام الجديد
        
        // للنظام القديم (فهرسة برقم السورة)
        window.APP_DATA.quran = {};
        quranArray.forEach(s => {
            if (s && s.number) window.APP_DATA.quran[s.number] = s;
        });
    } else {
        // بيانات طوارئ فقط إذا فشل التحميل تماماً
        console.warn("⚠️ تفعيل بيانات الطوارئ للمصحف");
        const dummy = [{ number: 1, name: "الفاتحة", ayahs: [{ text: "بسم الله الرحمن الرحيم", number: 1 }] }];
        window.quranData = dummy;
        window.APP_DATA.quran = { 1: dummy[0] };
    }

    // 2. معالجة الصفحات (لاختبر حفظك - سؤال الصفحة)
    if (pagesRaw) {
        window.APP_DATA.pages = pagesRaw;
    }

    // 3. معالجة الأذكار
    if (azkarRaw) {
        window.APP_DATA.azkar = azkarRaw;
    }

    // إطلاق النظام
    window.APP_DATA.isReady = true;
    window.dispatchEvent(new Event('data-ready'));
    console.log("✅ البيانات جاهزة.");
}

initAppData();
