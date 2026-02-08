/* =========================================
   الوحدة: اختبار الحفظ (Test Hifz)
   المسار: js/modules/test.js
   ========================================= */
const { useState, useMemo } = React;

const SURAH_NAMES = ["الفاتحة", "البقرة", "آل عمران", "النساء", "المائدة", "الأنعام", "الأعراف", "الأنفال", "التوبة", "يونس", "هود", "يوسف", "الرعد", "إبراهيم", "الحجر", "النحل", "الإسراء", "الكهف", "مريم", "طه", "الأنبياء", "الحج", "المؤمنون", "النور", "الفرقان", "الشعراء", "النمل", "القصص", "العنكبوت", "الروم", "لقمان", "السجدة", "الأحزاب", "سبأ", "فاطر", "يس", "الصافات", "ص", "الزمر", "غافر", "فصلت", "الشورى", "الزخرف", "الدخان", "الجاثية", "الأحقاف", "محمد", "الفتح", "الحجرات", "ق", "الذاريات", "الطور", "النجم", "القمر", "الرحمن", "الواقعة", "الحديد", "المجادلة", "الحشر", "الممتحنة", "الصف", "الجمعة", "المنافقون", "التغابن", "الطلاق", "التحريم", "الملك", "القلم", "الحاقة", "المعارج", "نوح", "الجن", "المزمل", "المدثر", "القيامة", "الإنسان", "المرسلات", "النبأ", "النازعات", "عبس", "التكوير", "الانفطار", "المطففين", "الانشقاق", "البروج", "الطارق", "الأعلى", "الغاشية", "الفجر", "البلد", "الشمس", "الليل", "الضحى", "الشرح", "التين", "العلق", "القدر", "البينة", "الزلزلة", "العاديات", "القارعة", "التكاثر", "العصر", "الهمزة", "الفيل", "قريش", "الماعون", "الكوثر", "الكافرون", "النصر", "المسد", "الإخلاص", "الفلق", "الناس"];
const JUZ_START = [0, 1, 2, 3, 4, 4, 5, 6, 7, 8, 9, 10, 12, 13, 15, 17, 18, 21, 23, 25, 27, 29, 33, 36, 39, 41, 46, 51, 58, 67, 78];

window.TestHifz = () => {
    // التحقق من توفر البيانات في APP_DATA
    if (!window.APP_DATA || !window.APP_DATA.quran) {
        return <div className="text-center p-6 text-gray-500 font-bold animate-pulse">⏳ جاري تحميل بيانات الاختبار...</div>;
    }

    const [scope, setScope] = useState('all');
    const [selJuz, setSelJuz] = useState(1);
    const [selSurah, setSelSurah] = useState('all');
    const [customList, setCustomList] = useState([]);
    const [qType, setQType] = useState('complete');
    const [currQ, setCurrQ] = useState(null);
    const [showAns, setShowAns] = useState(false);

    // استخدام النافذة الأنيقة بدلاً من alert
    const notify = (title, msg) => {
        if (window.showGlobalAlert) window.showGlobalAlert(title, msg);
        else alert(msg);
    };

    const generate = (isNext) => {
        let sId, sObj, aIdx;
        
        if (isNext && currQ) {
            sId = currQ.sId; sObj = window.APP_DATA.quran[sId]; aIdx = currQ.aIdx + 1;
            if (aIdx >= sObj.ayahs.length) return notify("انتهت السورة", "لقد وصلت لنهاية السورة.");
        } else {
            let pool = [];
            if (scope === 'all') pool = Object.keys(window.APP_DATA.quran);
            else if (scope === 'custom') pool = customList;
            else if (scope === 'juz') {
                const start = JUZ_START[selJuz-1] || 0;
                const end = JUZ_START[selJuz] || 114;
                pool = Object.keys(window.APP_DATA.quran).filter(id => id > start && id <= end + 5);
                if (selSurah !== 'all') pool = [selSurah];
            }

            if (pool.length === 0) return notify("تنبيه", "يرجى اختيار نطاق صحيح للسور.");
            sId = pool[Math.floor(Math.random() * pool.length)];
            sObj = window.APP_DATA.quran[sId];
            if (!sObj || !sObj.ayahs) return notify("خطأ", "بيانات السورة غير متوفرة.");
            aIdx = Math.floor(Math.random() * sObj.ayahs.length);
        }

        const ayah = sObj.ayahs[aIdx];
        let qText = ayah.text, prompt = "أكمل الآية:", ansText = ayah.text;

        if (qType === 'complete' && !isNext) {
            const words = ayah.text.split(" ");
            qText = words.slice(0, Math.min(5, Math.floor(words.length / 2))).join(" ") + " ...";
        } else if (qType === 'next') {
            prompt = "ما الآية التالية؟";
            ansText = (aIdx + 1 < sObj.ayahs.length) ? sObj.ayahs[aIdx + 1].text : "نهاية السورة";
        } else if (qType === 'prev') {
            prompt = "ما الآية السابقة؟";
            ansText = (aIdx > 0) ? sObj.ayahs[aIdx - 1].text : "بداية السورة";
        } else if (qType === 'ayahNum') {
            prompt = "ما رقم هذه الآية؟";
            ansText = ayah.numberInSurah || ayah.num || ayah.number;
        } else if (qType === 'surahName') {
            prompt = "في أي سورة تقع هذه الآية؟";
            ansText = sObj.name;
        } else if (qType === 'page') {
            prompt = "ما رقم الصفحة؟";
            ansText = "غير متوفر";
            if (window.APP_DATA.pages) {
                // منطق البحث عن الصفحة في الملف الجديد
                const p = window.APP_DATA.pages.find(pg => 
                    (pg.start.surah_number < sId || (pg.start.surah_number == sId && pg.start.verse <= (ayah.numberInSurah || ayah.number))) &&
                    (pg.end.surah_number > sId || (pg.end.surah_number == sId && pg.end.verse >= (ayah.numberInSurah || ayah.number)))
                );
                if (p) ansText = p.page;
            }
        }

        setCurrQ({ sId, aIdx, qText, fullText: ayah.text, ansText, prompt, info: `${sObj.name} - آية ${ayah.numberInSurah || ayah.num || ayah.number}` });
        setShowAns(false);
    };

    return (
        <div className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm animate-in">
            <h3 className="text-center font-black text-indigo-900 mb-4">🧠 اختبر حفظك (الكلاسيكي)</h3>
            
            <div className="grid grid-cols-2 gap-2 mb-3">
                <select className="p-2 border rounded-xl text-xs font-bold bg-gray-50" value={scope} onChange={e => setScope(e.target.value)}>
                    <option value="all">كل المصحف</option>
                    <option value="juz">جزء معين</option>
                    <option value="custom">سور محددة</option>
                </select>
                <select className="p-2 border rounded-xl text-xs font-bold bg-gray-50" value={qType} onChange={e => setQType(e.target.value)}>
                    <option value="complete">أكمل الآية</option>
                    <option value="next">الآية التالية</option>
                    <option value="prev">الآية السابقة</option>
                    <option value="page">رقم الصفحة</option>
                    <option value="ayahNum">رقم الآية</option>
                    <option value="surahName">اسم السورة</option>
                </select>
            </div>

            {scope === 'juz' && (
                <div className="mb-3 animate-in">
                    <select className="w-full p-2 border rounded-xl text-xs font-bold mb-2" value={selJuz} onChange={e => setSelJuz(e.target.value)}>
                        {[...Array(30)].map((_, i) => <option key={i} value={i+1}>الجزء {i+1}</option>)}
                    </select>
                </div>
            )}

            {scope === 'custom' && (
                <div className="h-32 overflow-y-auto border rounded-xl p-2 bg-gray-50 mb-3 grid grid-cols-3 gap-1 animate-in">
                    {SURAH_NAMES.map((n, i) => (
                        <div key={i} onClick={() => setCustomList(p => p.includes(String(i+1)) ? p.filter(x => x !== String(i+1)) : [...p, String(i+1)])}
                             className={`text-[9px] p-1 rounded cursor-pointer border text-center font-bold ${customList.includes(String(i+1)) ? 'bg-indigo-600 text-white' : 'bg-white'}`}>
                            {n}
                        </div>
                    ))}
                </div>
            )}

            <button onClick={() => generate(false)} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-black shadow-lg hover:bg-indigo-700 transition mb-4">
                طرح سؤال جديد 🎲
            </button>

            {currQ && (
                <div className="text-center animate-in">
                    <div className="bg-white border-2 border-indigo-50 rounded-2xl p-6 mb-3 shadow-sm relative">
                        <span className="absolute top-2 right-2 text-[10px] bg-gray-100 px-2 rounded text-gray-500">{currQ.prompt}</span>
                        <p className="font-amiri text-xl leading-loose font-bold text-gray-800 mt-2" dir="rtl">{currQ.qText}</p>
                    </div>

                    {!showAns ? (
                        <button onClick={() => setShowAns(true)} className="w-full bg-amber-100 text-amber-900 py-3 rounded-xl font-bold">👁️ كشف الإجابة</button>
                    ) : (
                        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 animate-in">
                            <p className="font-amiri text-lg text-emerald-900 font-bold mb-2">{currQ.ansText}</p>
                            {qType === 'complete' && <p className="text-xs text-gray-500 border-t border-emerald-200 pt-2 mb-2">{currQ.fullText}</p>}
                            <p className="text-[10px] text-emerald-600 font-bold bg-white inline-block px-2 py-1 rounded border border-emerald-100">{currQ.info}</p>
                            
                            <div className="flex gap-2 mt-4">
                                <button onClick={() => generate(false)} className="flex-1 bg-white border border-gray-300 py-2 rounded-xl text-xs font-bold text-gray-600">سؤال جديد</button>
                                {(qType === 'complete' || qType === 'next') && (
                                    <button onClick={() => generate(true)} className="flex-1 bg-emerald-600 text-white py-2 rounded-xl text-xs font-bold">التالي ⬅️</button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
