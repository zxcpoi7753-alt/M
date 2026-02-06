/* =========================================
   محمل البيانات: js/data_loader.js (النسخة الآمنة)
   الوظيفة: تحميل البيانات مع حماية ضد الأخطاء
   ========================================= */
window.APP_DATA = { isReady: false };

const loadData = async () => {
    try {
        console.log('جاري تحميل البيانات الأساسية...');
        
        // 1. تحميل البيانات الأساسية (المصحف والأذكار) - هذه لا يمكن الاستغناء عنها
        // تأكد أن أسماء الملفات صحيحة وموجودة في مجلد data
        const [quranRes, azkarRes] = await Promise.all([
            fetch('data/quran.json'),
            fetch('data/azkar.json')
        ]);

        if (!quranRes.ok || !azkarRes.ok) {
            throw new Error("فشل العثور على ملفات المصحف أو الأذكار");
        }

        const quran = await quranRes.json();
        const azkar = await azkarRes.json();

        // 2. محاولة تحميل التفسير (بشكل منفصل)
        let tafseerMap = {};
        try {
            const tafseerRes = await fetch('data/tafseer.json');
            if (tafseerRes.ok) {
                const tafseerRaw = await tafseerRes.json();
                // تحويل التفسير إلى خريطة
                tafseerRaw.forEach(item => {
                    tafseerMap[`${item.number}_${item.aya}`] = item.text;
                });
                console.log('✅ تم تحميل التفسير بنجاح');
            } else {
                console.warn('⚠️ ملف التفسير غير موجود، سيعمل الموقع بدونه.');
            }
        } catch (tafseerError) {
            console.warn('⚠️ خطأ في قراءة ملف التفسير، سيعمل الموقع بدونه:', tafseerError);
        }

        // 3. حفظ البيانات في الذاكرة وإطلاق الموقع
        window.APP_DATA = { 
            isReady: true, 
            quran: quran, 
            azkar: azkar,
            tafseer: tafseerMap // حتى لو فارغة، الموقع سيعمل
        };

        window.dispatchEvent(new Event('data-ready'));
        console.log('🚀 تم تشغيل الموقع بنجاح');

    } catch (error) {
        // هذا الخطأ يظهر فقط إذا فشل تحميل المصحف نفسه
        console.error('خطأ فادح:', error);
        alert('تنبيه: فشل تحميل ملف المصحف (quran.json). تأكد من وجوده في مجلد data');
    }
};

loadData();
