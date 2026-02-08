/* =========================================
   محمل البيانات: js/data_loader.js
   (نظام الطوارئ: يجبر الموقع على الفتح دائماً)
   ========================================= */

async function loadJSON(path) {
    try {
        const response = await fetch(path);
        if (!response.ok) throw new Error("404");
        return await response.json();
    } catch (e) {
        console.warn(`⚠️ فشل تحميل ${path}`);
        return null;
    }
}

async function initAppData() {
    console.log("🚀 بدء تشغيل النظام...");
    
    // تهيئة المتغيرات العالمية
    window.APP_DATA = window.APP_DATA || {};
    window.APP_DATA.isReady = false;

    // محاولة تحميل الملفات
    const [quran, azkar] = await Promise.all([
        loadJSON('data/quran.json'),
        loadJSON('data/azkar.json')
    ]);

    // 1. معالجة القرآن (للجهتين)
    if (quran) {
        window.quranData = quran; // للمحاكي والورد
        window.APP_DATA.quran = {}; // لاختبر حفظك
        quran.forEach(s => window.APP_DATA.quran[s.number] = s);
    } else {
        console.error("❌ لم يتم العثور على ملف القرآن، تفعيل وضع الطوارئ.");
        // بيانات طوارئ ليعمل المحاكي
        const dummy = [{ number: 1, name: "الفاتحة (طوارئ)", ayahs: [{ text: "بسم الله الرحمن الرحيم" }] }];
        window.quranData = dummy;
        window.APP_DATA.quran = { 1: dummy[0] };
    }

    // 2. معالجة الأذكار
    if (azkar) {
        window.APP_DATA.azkar = azkar;
        window.azkarData = azkar;
    } else {
        window.APP_DATA.azkar = [{ category: "تنبيه", zekr: "تأكد من ملف data/azkar.json", count: 1 }];
        window.azkarData = window.APP_DATA.azkar;
    }

    // 3. إطلاق الإشارة
    window.APP_DATA.isReady = true;
    window.dispatchEvent(new Event('data-ready'));
    console.log("✅ النظام جاهز.");
}

initAppData();
