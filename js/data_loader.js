/* =========================================
   محمل البيانات: js/data_loader.js
   (تم التصحيح لضمان عمل المحاكي والورد اليومي)
   ========================================= */

// دالة لجلب ملف JSON
async function loadJSON(path) {
    try {
        const response = await fetch(path);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (e) {
        console.error(`Failsed to load ${path}:`, e);
        return null;
    }
}

// تحميل جميع البيانات عند بدء الموقع
async function initAppData() {
    console.log("⏳ جاري تحميل بيانات المصحف...");
    
    // 1. تحميل ملف القرآن (تأكد أن الملف موجود في data/quran.json)
    const quran = await loadJSON('data/quran.json');
    
    if (quran) {
        // تعريف المتغير عالمياً لكي يراه المحاكي والورد اليومي
        window.quranData = quran;
        
        // إطلاق حدث يخبر الموقع أن البيانات جاهزة
        window.APP_DATA = { isReady: true, quran: quran };
        const event = new Event('data-ready');
        window.dispatchEvent(event);
        
        console.log(`✅ تم تحميل المصحف: ${quran.length} سورة`);
    } else {
        console.error("❌ فشل تحميل ملف القرآن! تأكد من وجود المجلد data والملف quran.json");
        // بيانات طوارئ وهمية لكي لا يعلق الموقع
        window.quranData = [
            { number: 1, name: "الفاتحة", ayahs: [{ text: "بسم الله الرحمن الرحيم" }, { text: "الحمد لله رب العالمين" }] },
            { number: 112, name: "الإخلاص", ayahs: [{ text: "قل هو الله أحد" }] }
        ];
        window.dispatchEvent(new Event('data-ready'));
    }
}

// تشغيل التحميل
initAppData();
