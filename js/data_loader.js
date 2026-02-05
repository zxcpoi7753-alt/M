window.APP_DATA = { quran: null, pages: null, azkar: null, isReady: false };

async function loadData() {
    try {
        console.log("📥 جاري تحميل البيانات...");
        // لاحظ المسار: data/filename.json
        const [q, p, a] = await Promise.all([
            fetch('data/quran.json').then(r => r.json()),
            fetch('data/pagesquran.json').then(r => r.json()),
            fetch('data/azkar.json').then(r => r.json())
        ]);
        
        window.APP_DATA = { quran: q, pages: p, azkar: a, isReady: true };
        console.log("✅ تم تحميل البيانات بنجاح");
        // إرسال حدث أن البيانات جاهزة
        window.dispatchEvent(new Event('data-ready'));
    } catch (e) {
        console.error("❌ خطأ في تحميل البيانات:", e);
        // في حالة الخطأ، نضع بيانات فارغة لمنع توقف التطبيق
        window.APP_DATA.isReady = true; 
    }
}
loadData();
