/* =========================================
   محمل البيانات: js/data_loader.js
   ========================================= */
window.APP_DATA = { isReady: false };

const loadData = async () => {
    try {
        console.log('جاري تحميل البيانات...');
        
        // نفترض أن ملفاتك موجودة في مجلد data أو في الجذر
        // تأكد من وضع ملف tafseer.json بجانب ملف quran.json
        const [quranRes, azkarRes, tafseerRes] = await Promise.all([
            fetch('data/quran.json'),   // تأكد من المسار
            fetch('data/azkar.json'),   // تأكد من المسار
            fetch('tafseer.json')       // ملف التفسير الجديد
        ]);

        const quran = await quranRes.json();
        const azkar = await azkarRes.json();
        const tafseerRaw = await tafseerRes.json();

        // تحويل التفسير إلى صيغة سريعة البحث (Map)
        // المفتاح سيكون: "رقم_السورة_رقم_الآية"
        const tafseerMap = {};
        tafseerRaw.forEach(item => {
            tafseerMap[`${item.number}_${item.aya}`] = item.text;
        });

        window.APP_DATA = { 
            isReady: true, 
            quran: quran, 
            azkar: azkar,
            tafseer: tafseerMap // أصبح جاهزاً للاستخدام السريع
        };

        // إطلاق حدث أن البيانات جاهزة
        window.dispatchEvent(new Event('data-ready'));
        console.log('تم تحميل البيانات بنجاح ✅');

    } catch (error) {
        console.error('فشل تحميل البيانات:', error);
        alert('فشل تحميل بيانات الموقع، يرجى تحديث الصفحة');
    }
};

loadData();
