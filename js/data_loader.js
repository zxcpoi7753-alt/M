/* =========================================
   محمل البيانات: js/data_loader.js (صامت وآمن)
   ========================================= */
window.APP_DATA = { isReady: false };

const loadData = async () => {
    try {
        console.log('جاري تحميل البيانات...');
        
        const [quranRes, azkarRes] = await Promise.all([
            fetch('data/quran.json'),
            fetch('data/azkar.json')
        ]);

        if (!quranRes.ok || !azkarRes.ok) throw new Error("فشل في الملفات الأساسية");

        const quran = await quranRes.json();
        const azkar = await azkarRes.json();

        let tafseerMap = {};
        try {
            const tafseerRes = await fetch('data/tafseer.json');
            if (tafseerRes.ok) {
                const tafseerRaw = await tafseerRes.json();
                tafseerRaw.forEach(item => { tafseerMap[`${item.number}_${item.aya}`] = item.text; });
            }
        } catch (e) { console.warn('لم يتم تحميل التفسير'); }

        window.APP_DATA = { isReady: true, quran, azkar, tafseer: tafseerMap };
        window.dispatchEvent(new Event('data-ready'));
        console.log('✅ تم التحميل');

    } catch (error) {
        console.error('❌ خطأ فادح:', error);
        // تم إزالة الـ alert المزعج من هنا
        // سيظهر الموقع فارغاً أو يمكن لـ app.js اكتشاف المشكلة لاحقاً
    }
};

loadData();
