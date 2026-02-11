/* =========================================
   محمل البيانات: js/data_loader.js
   (تم إزالة ?v=time لإصلاح الأوفلاين)
   ========================================= */

async function loadJSON(path) {
    try {
        // 🔥 التعديل هنا: حذفنا ?v=${new Date().getTime()}
        // الآن سيطلب الملف باسمه الصريح ليجده في الكاش
        const response = await fetch(path); 
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

    // تحميل الملفات
    const [quranRaw, azkarRaw, pagesRaw, tafseerRaw] = await Promise.all([
        loadJSON('data/quran.json'),
        loadJSON('data/azkar.json'),
        loadJSON('data/pagesquran.json'),
        loadJSON('data/tafseer.json')
    ]);

    // 1. معالجة القرآن
    if (quranRaw) {
        let quranArray = [];
        window.APP_DATA.quran = {}; 

        if (!Array.isArray(quranRaw) && typeof quranRaw === 'object') {
            quranArray = Object.keys(quranRaw).map(key => {
                const surah = quranRaw[key];
                surah.number = parseInt(key); 
                window.APP_DATA.quran[key] = surah;
                return surah;
            });
        } else {
            quranArray = quranRaw;
            quranArray.forEach(s => {
                if(s.number) window.APP_DATA.quran[s.number] = s;
            });
        }

        window.quranData = quranArray;
        console.log(`✅ تم معالجة المصحف: ${quranArray.length} سورة`);
    } else {
        const dummy = [{ number: 1, name: "الفاتحة", ayahs: [{ text: "بسم الله الرحمن الرحيم", number: 1 }] }];
        window.quranData = dummy;
        window.APP_DATA.quran = { 1: dummy[0] };
    }

    // 2. معالجة التفسير
    if (tafseerRaw) {
        window.APP_DATA.tafseer = {};
        if (Array.isArray(tafseerRaw)) {
            tafseerRaw.forEach(t => {
                const key = `${t.number}_${t.aya}`;
                window.APP_DATA.tafseer[key] = t.text;
            });
        }
    }

    // 3. معالجة الصفحات والأذكار
    if (pagesRaw) window.APP_DATA.pages = pagesRaw;
    if (azkarRaw) window.APP_DATA.azkar = Array.isArray(azkarRaw) ? azkarRaw : [];

    // إطلاق النظام
    window.APP_DATA.isReady = true;
    window.dispatchEvent(new Event('data-ready'));
    console.log("✅ النظام جاهز.");
}

initAppData();
