/* =========================================
   محمل البيانات: js/data_loader.js
   (النسخة المنيعة: تجبر الموقع على الفتح حتى لو الملفات مفقودة)
   ========================================= */

async function loadJSON(path) {
    try {
        console.log(`📡 محاولة تحميل: ${path}`);
        const response = await fetch(path);
        if (!response.ok) throw new Error(`خطأ 404: الملف غير موجود`);
        const data = await response.json();
        console.log(`✅ تم تحميل ${path} بنجاح`);
        return data;
    } catch (e) {
        console.error(`❌ فشل تحميل ${path}:`, e);
        return null;
    }
}

async function initAppData() {
    console.log("⏳ بدء تشغيل النظام...");

    // تهيئة الحاويات
    window.APP_DATA = window.APP_DATA || {}; 
    window.APP_DATA.isReady = false;

    // محاولة تحميل الملفات
    const [quranArray, azkarArray] = await Promise.all([
        loadJSON('data/quran.json'),
        loadJSON('data/azkar.json')
    ]);

    // --- معالجة القرآن ---
    if (quranArray) {
        window.quranData = quranArray; // للنظام الجديد
        window.APP_DATA.quran = {};    // للنظام القديم
        quranArray.forEach(s => window.APP_DATA.quran[s.number] = s);
    } else {
        console.warn("⚠️ تم تفعيل بيانات طوارئ القرآن (الملف غير موجود أو تالف)");
        // بيانات وهمية لكي يظهر المحاكي ولا يختفي
        const dummyQuran = [
            { number: 1, name: "الفاتحة (تجريبي)", ayahs: [{ text: "بسم الله الرحمن الرحيم" }, { text: "الحمد لله رب العالمين" }] },
            { number: 112, name: "الإخلاص (تجريبي)", ayahs: [{ text: "قل هو الله أحد" }] }
        ];
        window.quranData = dummyQuran;
        window.APP_DATA.quran = { 1: dummyQuran[0], 112: dummyQuran[1] };
    }

    // --- معالجة الأذكار ---
    if (azkarArray) {
        window.APP_DATA.azkar = azkarArray;
        window.azkarData = azkarArray;
    } else {
        console.warn("⚠️ تم تفعيل بيانات طوارئ الأذكار");
        const dummyAzkar = [
            { category: "أذكار الصباح", zekr: "سبحان الله (بيانات تجريبية)", count: 3 },
            { category: "أذكار المساء", zekr: "الحمد لله (بيانات تجريبية)", count: 3 }
        ];
        window.APP_DATA.azkar = dummyAzkar;
        window.azkarData = dummyAzkar;
    }

    // --- إجبار الموقع على الفتح ---
    window.APP_DATA.isReady = true;
    window.dispatchEvent(new Event('data-ready'));
    console.log("🚀 تم إطلاق الموقع (سواء ببيانات حقيقية أو طوارئ)");
}

initAppData();
