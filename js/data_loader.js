/* =========================================
   محمل البيانات: js/data_loader.js (مع التفسير)
   ========================================= */
window.APP_DATA = { isReady: false };

const loadData = async () => {
    try {
        console.log('جاري تحميل البيانات...');
        
        // جلب الملفات الثلاثة معاً
        const [quranRes, azkarRes, tafseerRes] = await Promise.all([
            fetch('data/quran.json'),
            fetch('data/azkar.json'),
            fetch('data/tafseer.json') // تأكد أن الملف داخل مجلد data
        ]);

        const quran = await quranRes.json();
        const azkar = await azkarRes.json();
        const tafseerRaw = await tafseerRes.json();

        // تحويل التفسير إلى خريطة لسهولة البحث (المفتاح: رقم السورة_رقم الآية)
        const tafseerMap = {};
        tafseerRaw.forEach(item => {
            tafseerMap[`${item.number}_${item.aya}`] = item.text;
        });

        window.APP_DATA = { 
            isReady: true, 
            quran: quran, 
            azkar: azkar,
            tafseer: tafseerMap 
        };

        window.dispatchEvent(new Event('data-ready'));
        console.log('تم تحميل البيانات والتفسير بنجاح ✅');

    } catch (error) {
        console.error('فشل تحميل البيانات:', error);
        // لا تظهر تنبيه للمستخدم فوراً لتجنب الإزعاج، يكفي الكونسول
    }
};

loadData();
