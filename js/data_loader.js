/* =========================================
   ملف البيانات: js/data_loader.js
   الوظيفة: جلب ملفات JSON من مجلد data
   ========================================= */

// تهيئة حاوية البيانات العالمية
window.APP_DATA = {
    quran: null,
    pages: null,
    azkar: null,
    isReady: false
};

async function loadData() {
    console.log("📥 جاري تحميل البيانات...");

    try {
        // نستخدم Promise.all لتحميل الملفات الثلاثة في وقت واحد لسرعة أكبر
        const [quranRes, pagesRes, azkarRes] = await Promise.all([
            fetch('data/quran.json'),
            fetch('data/pagesquran.json'),
            fetch('data/azkar.json')
        ]);

        // التحقق من صحة التحميل
        if (!quranRes.ok) throw new Error("فشل تحميل ملف القرآن");
        if (!pagesRes.ok) throw new Error("فشل تحميل ملف الصفحات");
        if (!azkarRes.ok) throw new Error("فشل تحميل ملف الأذكار");

        // تحويل البيانات إلى صيغة JS
        const quranData = await quranRes.json();
        const pagesData = await pagesRes.json();
        const azkarData = await azkarRes.json();

        // تخزين البيانات في الحاوية العالمية
        window.APP_DATA = {
            quran: quranData,
            pages: pagesData,
            azkar: azkarData,
            isReady: true
        };

        console.log("✅ تم تحميل كافة البيانات بنجاح");

        // إرسال إشارة (Event) للموقع بأن البيانات جاهزة
        window.dispatchEvent(new Event('data-ready'));

    } catch (error) {
        console.error("❌ خطأ جسيم في تحميل البيانات:", error);
        
        // عرض رسالة خطأ واضحة للمستخدم في حال فشل التحميل
        const errorMsg = document.createElement('div');
        errorMsg.style.cssText = "position:fixed;top:0;left:0;right:0;background:#ef4444;color:white;padding:15px;text-align:center;z-index:9999;font-weight:bold;";
        errorMsg.innerHTML = `⚠️ تنبيه: فشل تحميل ملفات البيانات. تأكد أنك تشغل الموقع عبر Live Server وأن مجلد data يحتوي على الملفات المطلوبة.`;
        document.body.appendChild(errorMsg);
    }
}

// بدء التحميل فور استدعاء الملف
loadData();
