/* =========================================
   محمل البيانات: js/data_loader.js
   (النسخة الكاملة: تدعم التفسير والصفحات)
   ========================================= */

async function loadJSON(path) {
    try {
        const response = await fetch(`${path}?v=${new Date().getTime()}`);
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

    // 1. تحميل كل الملفات المطلوبة
    const [quranRaw, azkarRaw, pagesRaw, tafseerRaw] = await Promise.all([
        loadJSON('data/quran.json'),
        loadJSON('data/azkar.json'),
        loadJSON('data/pagesquran.json'),
        loadJSON('data/tafseer.json') // ملف التفسير الجديد
    ]);

    // 2. معالجة القرآن
    if (quranRaw) {
        let quranArray = Array.isArray(quranRaw) ? quranRaw : Object.values(quranRaw);
        
        window.quranData = quranArray; // للنظام الجديد
        window.APP_DATA.quran = {};    // للنظام القديم
        
        quranArray.forEach(s => {
            if (s && s.number) window.APP_DATA.quran[s.number] = s;
        });
    } else {
        // بيانات طوارئ
        const dummy = [{ number: 1, name: "الفاتحة", ayahs: [{ text: "بسم الله الرحمن الرحيم", number: 1 }] }];
        window.quranData = dummy;
        window.APP_DATA.quran = { 1: dummy[0] };
    }

    // 3. معالجة التفسير (تحويله لفهرس سريع)
    if (tafseerRaw) {
        window.APP_DATA.tafseer = {};
        // نتوقع أن التفسير مصفوفة كائنات: {sura: 1, aya: 1, text: "..."}
        if (Array.isArray(tafseerRaw)) {
            tafseerRaw.forEach(t => {
                // المفتاح سيكون: رقم السورة_رقم الآية (مثال: 1_1)
                const key = `${t.sura || t.surah}_${t.aya || t.ayah}`;
                window.APP_DATA.tafseer[key] = t.text;
            });
        }
        console.log("✅ تم تحميل التفسير");
    }

    // 4. معالجة الصفحات والأذكار
    if (pagesRaw) window.APP_DATA.pages = pagesRaw;
    if (azkarRaw) window.APP_DATA.azkar = azkarRaw;

    // 5. إطلاق النظام
    window.APP_DATA.isReady = true;
    window.dispatchEvent(new Event('data-ready'));
    console.log("✅ النظام جاهز بالكامل.");
}

initAppData();
