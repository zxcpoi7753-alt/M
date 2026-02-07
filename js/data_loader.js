/* =========================================
   محمل البيانات: js/data_loader.js
   (النسخة الآمنة: تمنع انهيار الموقع عند فقدان البيانات)
   ========================================= */

async function loadJSON(path) {
    try {
        const response = await fetch(path);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (e) {
        console.warn(`⚠️ تعذر تحميل ${path}، سيتم استخدام بيانات الطوارئ.`);
        return null;
    }
}

async function initAppData() {
    console.log("⏳ جاري تحميل البيانات...");

    // 1. تحميل القرآن والأذكار بالتوازي
    const [quran, azkar] = await Promise.all([
        loadJSON('data/quran.json'),
        loadJSON('data/azkar.json')
    ]);

    // 2. فحص القرآن (بيانات الطوارئ لمنع الشاشة البيضاء في المحاكي والورد)
    if (quran) {
        window.quranData = quran;
    } else {
        // بيانات وهمية لكي تعمل الأزرار ولا ينهار الموقع
        window.quranData = [
            { number: 1, name: "الفاتحة", ayahs: [{ text: "بسم الله الرحمن الرحيم" }, { text: "الحمد لله رب العالمين" }] },
            { number: 112, name: "الإخلاص", ayahs: [{ text: "قل هو الله أحد" }, { text: "الله الصمد" }] }
        ];
    }

    // 3. فحص الأذكار (لمنع اختفاء زر الأذكار)
    if (azkar) {
        window.azkarData = azkar;
    } else {
        window.azkarData = {
            "أذكار الصباح": [{ count: 3, content: "سبحان الله وبحمده" }],
            "أذكار المساء": [{ count: 3, content: "أستغفر الله" }]
        };
    }

    // 4. إطلاق إشارة الجاهزية
    window.APP_DATA = { isReady: true };
    window.dispatchEvent(new Event('data-ready'));
    console.log("✅ تم تجهيز البيانات بنجاح");
}

initAppData();
