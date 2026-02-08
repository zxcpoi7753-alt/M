/* =========================================
   محمل البيانات: js/data_loader.js
   (الإصدار المصحح: يضيف أرقام السور المفقودة)
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

    // تحميل الملفات
    const [quranRaw, azkarRaw, pagesRaw, tafseerRaw] = await Promise.all([
        loadJSON('data/quran.json'),
        loadJSON('data/azkar.json'),
        loadJSON('data/pagesquran.json'),
        loadJSON('data/tafseer.json')
    ]);

    // 1. معالجة القرآن (الإصلاح الجوهري)
    if (quranRaw) {
        let quranArray = [];
        window.APP_DATA.quran = {}; // للنظام القديم

        // فحص هل هو كائن (مفاتيح "1", "2") أم مصفوفة
        if (!Array.isArray(quranRaw) && typeof quranRaw === 'object') {
            // تحويل الكائن إلى مصفوفة + إضافة رقم السورة
            quranArray = Object.keys(quranRaw).map(key => {
                const surah = quranRaw[key];
                // 🔥 هنا الإصلاح: إضافة الرقم للسورة لأنه غير موجود داخل الكائن
                surah.number = parseInt(key); 
                // ملء النظام القديم
                window.APP_DATA.quran[key] = surah;
                return surah;
            });
        } else {
            quranArray = quranRaw;
            quranArray.forEach(s => {
                if(s.number) window.APP_DATA.quran[s.number] = s;
            });
        }

        window.quranData = quranArray; // للنظام الجديد
        console.log(`✅ تم معالجة المصحف: ${quranArray.length} سورة`);
    } else {
        // بيانات طوارئ
        const dummy = [{ number: 1, name: "الفاتحة", ayahs: [{ text: "بسم الله الرحمن الرحيم", number: 1 }] }];
        window.quranData = dummy;
        window.APP_DATA.quran = { 1: dummy[0] };
    }

    // 2. معالجة التفسير
    if (tafseerRaw) {
        window.APP_DATA.tafseer = {};
        if (Array.isArray(tafseerRaw)) {
            tafseerRaw.forEach(t => {
                const key = `${t.number}_${t.aya}`; // حسب ملفك (number للسورة, aya للآية)
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
