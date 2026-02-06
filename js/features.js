/* =========================================
   ملف الميزات: js/features.js (V7 - Final Fixes)
   ========================================= */

const { useState, useEffect, useMemo } = React;

// قائمة السور (114)
const SURAH_NAMES = [
    "الفاتحة", "البقرة", "آل عمران", "النساء", "المائدة", "الأنعام", "الأعراف", "الأنفال", "التوبة", "يونس",
    "هود", "يوسف", "الرعد", "إبراهيم", "الحجر", "النحل", "الإسراء", "الكهف", "مريم", "طه",
    "الأنبياء", "الحج", "المؤمنون", "النور", "الفرقان", "الشعراء", "النمل", "القصص", "العنكبوت", "الروم",
    "لقمان", "السجدة", "الأحزاب", "سبأ", "فاطر", "يس", "الصافات", "ص", "الزمر", "غافر",
    "فصلت", "الشورى", "الزخرف", "الدخان", "الجاثية", "الأحقاف", "محمد", "الفتح", "الحجرات", "ق",
    "الذاريات", "الطور", "النجم", "القمر", "الرحمن", "الواقعة", "الحديد", "المجادلة", "الحشر", "الممتحنة",
    "الصف", "الجمعة", "المنافقون", "التغابن", "الطلاق", "التحريم", "الملك", "القلم", "الحاقة", "المعارج",
    "نوح", "الجن", "المزمل", "المدثر", "القيامة", "الإنسان", "المرسلات", "النبأ", "النازعات", "عبس",
    "التكوير", "الانفطار", "المطففين", "الانشقاق", "البروج", "الطارق", "الأعلى", "الغاشية", "الفجر", "البلد",
    "الشمس", "الليل", "الضحى", "الشرح", "التين", "العلق", "القدر", "البينة", "الزلزلة", "العاديات",
    "القارعة", "التكاثر", "العصر", "الهمزة", "الفيل", "قريش", "الماعون", "الكوثر", "الكافرون", "النصر",
    "المسد", "الإخلاص", "الفلق", "الناس"
];

// خريطة تقريبية لبداية كل جزء (رقم السورة التي يبدأ عندها الجزء)
// ملاحظة: بعض الأجزاء تبدأ في منتصف سورة، هنا سنأخذ السورة الأقرب للبداية
const JUZ_START_INDEX = [
    0, 1, 2, 3, 4, 4, 5, 6, 7, 8, 9, 10, 12, 13, 15, 17, 18, 21, 23, 25, 27, 29, 33, 36, 39, 41, 46, 51, 58, 67, 78
];

// ============================================================
// 1. حاسبة الجهد (By Effort) - سليمة
// ============================================================
window.CalcEffort = () => {
    const [step, setStep] = useState(1);
    const [days, setDays] = useState(null);
    const [amount, setAmount] = useState('');
    const [skippedParts, setSkippedParts] = useState(0);
    const [result, setResult] = useState(null);
    const [showMaxWarning, setShowMaxWarning] = useState(false);

    const validateAmount = () => {
        let val = parseFloat(amount);
        if (isNaN(val)) return;
        if (val < 0.1) setAmount(0.1);
        else if (val > 1812) { setAmount(1812); setShowMaxWarning(true); } 
        else setShowMaxWarning(false);
    };

    const calculate = () => {
        const val = parseFloat(amount);
        if (!days || !val) return alert("أكمل البيانات");
        const remaining = 604 - (skippedParts * 20);
        if (remaining <= 0) return alert("مبارك! أنت خاتم.");
        const weekly = val * days;
        const weeks = remaining / weekly;
        const years = Math.floor(weeks / 52);
        const months = Math.floor((weeks % 52) / 4.3);
        setResult({ rate: `${val} صفحة يومياً`, duration: `${years > 0 ? years + ' سنة ' : ''}${months} شهر` });
    };

    return (
        <div className="feature-container animate-in">
            {showMaxWarning && <div className="bg-red-50 text-red-800 p-2 text-xs font-bold rounded mb-2 text-center">⚠ الحد الأقصى 3 ختمات</div>}
            {step === 1 && (
                <div className="text-center">
                    <h4 className="font-bold text-emerald-800 mb-3 text-sm">1️⃣ أيام الحفظ في الأسبوع؟</h4>
                    <div className="grid grid-cols-7 gap-1">
                        {[1, 2, 3, 4, 5, 6, 7].map(d => (
                            <button key={d} onClick={() => { setDays(d); setStep(2); }} className="aspect-square rounded-xl bg-gray-50 hover:bg-emerald-600 hover:text-white border font-black text-sm">{d}</button>
                        ))}
                    </div>
                </div>
            )}
            {step === 2 && (
                <div className="text-center animate-in">
                    <h4 className="font-bold text-emerald-800 mb-2 text-sm">2️⃣ المقدار والتخطي</h4>
                    <input type="number" step="0.1" className="w-full p-3 border rounded-xl mb-3 text-center font-bold" placeholder="صفحة يومياً" value={amount} onChange={e=>setAmount(e.target.value)} onBlur={validateAmount} />
                    <select className="w-full p-2 border rounded-xl text-center font-bold bg-gray-50 text-sm mb-3" value={skippedParts} onChange={(e) => setSkippedParts(e.target.value)}>
                        {[...Array(31).keys()].map(i => <option key={i} value={i}>تخطي {i} جزء</option>)}
                    </select>
                    <button onClick={calculate} className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold shadow-lg">احسب</button>
                    {result && (
                        <div className="mt-4 bg-emerald-50 border border-emerald-200 p-4 rounded-xl">
                            <h3 className="text-emerald-800 font-black text-lg mb-1">🎉 النتيجة</h3>
                            <p className="text-xs text-gray-500 mb-2">المدة المتوقعة: {result.duration}</p>
                            <p className="font-amiri text-sm text-emerald-800 font-bold mb-2">﴿ وَلَقَدْ يَسَّرْنَا الْقُرْآنَ لِلذِّكْرِ ﴾</p>
                        </div>
                    )}
                    <button onClick={() => {setStep(1); setResult(null);}} className="text-[10px] text-gray-400 mt-2 underline">إعادة</button>
                </div>
            )}
        </div>
    );
};

// ============================================================
// 2. حاسبة الوقت (By Time) - تمت إعادة "تخطي الأجزاء"
// ============================================================
window.CalcTime = () => {
    const [y, setY] = useState(0);
    const [m, setM] = useState(0);
    const [d, setD] = useState(0);
    const [skippedParts, setSkippedParts] = useState(0); // تمت الإعادة
    const [res, setRes] = useState(null);
    const [showLateMsg, setShowLateMsg] = useState(false);

    const calculate = () => {
        let years = parseInt(y);
        if (years >= 15) { years = 15; setShowLateMsg(true); } else { setShowLateMsg(false); }

        const totalDays = (years * 365) + (parseInt(m) * 30) + parseInt(d);
        if (totalDays <= 0) return alert("حدد المدة");

        // حساب الصفحات المتبقية بعد التخطي
        const remainingPages = 604 - (skippedParts * 20);
        if (remainingPages <= 0) return alert("أنت خاتم أصلاً! 🎉");

        const daily = (remainingPages / totalDays).toFixed(1);
        setRes({ daily, totalDays, remainingPages });
    };

    return (
        <div className="feature-container animate-in">
            <h4 className="font-bold text-amber-800 mb-2 text-center text-sm">🎯 حدد المدة المستهدفة</h4>
            
            <div className="flex gap-1 mb-2">
                <select className="flex-1 p-2 border rounded text-xs font-bold text-center" value={y} onChange={e=>setY(e.target.value)}>{[...Array(16).keys()].map(i=><option value={i}>{i} سنة</option>)}</select>
                <select className="flex-1 p-2 border rounded text-xs font-bold text-center" value={m} onChange={e=>setM(e.target.value)}>{[...Array(13).keys()].map(i=><option value={i}>{i} شهر</option>)}</select>
                <select className="flex-1 p-2 border rounded text-xs font-bold text-center" value={d} onChange={e=>setD(e.target.value)}>{[...Array(32).keys()].map(i=><option value={i}>{i} يوم</option>)}</select>
            </div>

            {/* زر التخطي (تمت إعادته) */}
            <div className="mb-3">
                <select className="w-full p-2 border rounded-xl text-center font-bold bg-gray-50 text-sm" value={skippedParts} onChange={(e) => setSkippedParts(e.target.value)}>
                    {[...Array(31).keys()].map(i => <option key={i} value={i}>تخطي {i} جزء محفوظ</option>)}
                </select>
            </div>

            <button onClick={calculate} className="w-full bg-amber-500 text-white py-2 rounded-xl font-bold shadow">احسب خطتي</button>
            
            {showLateMsg && <div className="bg-blue-50 text-blue-800 p-2 text-center text-xs mb-2 font-bold rounded mt-2">«وَمَن تَأَخَّرَ فَلَا إِثْمَ عَلَيْهِ ۚ لِمَنِ اتَّقَىٰ»</div>}

            {res && (
                <div className="mt-3 bg-gradient-to-br from-amber-50 to-white p-3 rounded-xl border border-amber-200 text-center animate-in">
                    <p className="text-xs text-gray-500">بناءً على {res.totalDays} يوم ومتبقي {res.remainingPages} صفحة</p>
                    <p className="text-xl font-black text-amber-800 mt-1">📖 {res.daily} صفحة يومياً</p>
                    <button onClick={() => alert("اللهم أعني على ذكرك وشكرك وحسن عبادتك")} className="bg-emerald-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow mt-2">🤲 دعاء الختمة</button>
                </div>
            )}
        </div>
    );
};

// ============================================================
// 3. اختبر حفظك (إصلاح الأجزاء + تخصيص)
// ============================================================
window.TestHifz = () => {
    const [scope, setScope] = useState('all'); // all, juz, custom
    const [selectedJuz, setSelectedJuz] = useState(1);
    const [selectedSurahInJuz, setSelectedSurahInJuz] = useState('all'); // 'all' or specific surah ID within the Juz
    const [customSurahs, setCustomSurahs] = useState([]);
    
    const [qType, setQType] = useState('complete');
    const [currentQ, setCurrentQ] = useState(null);
    const [showAns, setShowAns] = useState(false);

    // حساب السور داخل الجزء المختار
    const surahsInSelectedJuz = useMemo(() => {
        // نحدد بداية الجزء ونهاية الجزء تقريباً
        // الجزء 30: النبأ (78) -> الناس (114)
        if (selectedJuz == 30) return SURAH_NAMES.map((n,i)=>({id:i+1, name:n})).filter(s => s.id >= 78);
        
        // لبقية الأجزاء (تقريب رياضي بسيط: كل جزء 20 صفحة، لكن بما أننا لا نملك قاعدة بيانات صفحات دقيقة في المتصفح،
        // سنستخدم خريطة تقريبية أو نكتفي بإظهار كل السور في القائمة إذا اختار "جزء" ونترك الاختيار للمستخدم)
        // الحل الأفضل: سنعرض قائمة السور كاملة ولكن "نحاول" فلترتها، أو نعرض كل السور ونترك المستخدم يختار
        // بناءً على طلبك: "اضهار الأجزاء كلها وعند النقر على جزء يظهر زر السور كلها الخاصة بهذا الجزء"
        
        // سنستخدم تقريب بسيط بناءً على الفهرس
        const startSurahIndex = JUZ_START_INDEX[selectedJuz - 1] || 0; // إذا اخترت جزء 1 يعطي 0
        const endSurahIndex = JUZ_START_INDEX[selectedJuz] || 114;
        
        return SURAH_NAMES.map((n, i) => ({ id: i + 1, name: n })).filter(s => s.id > startSurahIndex && s.id <= endSurahIndex + 5); // +5 هامش أمان
    }, [selectedJuz]);

    const toggleCustomSurah = (id) => {
        const idStr = id.toString();
        setCustomSurahs(prev => prev.includes(idStr) ? prev.filter(x => x !== idStr) : [...prev, idStr]);
    };

    // منطق إخفاء الكلمات
    const getMaskedText = (text) => {
        const words = text.trim().split(/\s+/);
        const count = words.length;
        let showCount = 0;
        if (count <= 3) showCount = Math.max(1, count - 1);
        else if (count <= 5) showCount = 3;
        else if (count <= 7) showCount = 4;
        else if (count <= 9) showCount = 5;
        else showCount = 6;
        return words.slice(0, showCount).join(' ') + " ...";
    };

    const generate = (isNext = false) => {
        if (!window.APP_DATA.quran) return alert("جاري تحميل البيانات...");

        let sId, sObj, aIdx;

        if (isNext && currentQ) {
            sId = currentQ.sId;
            sObj = window.APP_DATA.quran[sId];
            aIdx = currentQ.aIdx + 1;
            if (aIdx >= sObj.ayahs.length) return alert("انتهت السورة.");
        } else {
            // تجميع قائمة السور المتاحة للاختيار منها
            let pool = [];
            
            if (scope === 'custom') {
                pool = customSurahs;
            } else if (scope === 'juz') {
                if (selectedSurahInJuz !== 'all') {
                    pool = [selectedSurahInJuz];
                } else {
                    // كل سور الجزء المختار
                    // ملاحظة: يجب التأكد أن أرقام السور صحيحة وتوجد في quran.json
                    // سنستخدم الفلتر الذي بنيناه
                    pool = surahsInSelectedJuz.map(s => s.id.toString());
                }
            } else {
                pool = Object.keys(window.APP_DATA.quran);
            }

            if (pool.length === 0) return alert("الرجاء تحديد سور للاختبار.");

            // تنظيف القائمة (التأكد من وجود السور في البيانات)
            const validPool = pool.filter(id => window.APP_DATA.quran[id]);
            if (validPool.length === 0) return alert("بيانات السور المختارة غير متوفرة.");

            sId = validPool[Math.floor(Math.random() * validPool.length)];
            sObj = window.APP_DATA.quran[sId];
            aIdx = Math.floor(Math.random() * sObj.ayahs.length);
        }

        const ayah = sObj.ayahs[aIdx];
        let qText = ayah.text;
        let prompt = "";

        if (qType === 'complete') {
            prompt = "أكمل الآية:";
            if (!isNext) qText = getMaskedText(ayah.text);
        } else if (qType === 'next') prompt = "ما التالي؟";
        else if (qType === 'prev') prompt = "ما السابق؟";
        else if (qType === 'ayahNum') { prompt = "رقم الآية؟"; qText = ayah.text; }
        else if (qType === 'surahName') { prompt = "اسم السورة؟"; qText = ayah.text; }
        else if (qType === 'page') { prompt = "رقم الصفحة؟"; qText = ayah.text; }

        setCurrentQ({ 
            sId, aIdx, qText, fullText: ayah.text, ansText: ayah.text, 
            info: `${sObj.name} - آية ${ayah.num}`, prompt 
        });

        // تخصيص الإجابة
        if(qType === 'next') setCurrentQ(prev => ({...prev, ansText: (aIdx+1 < sObj.ayahs.length ? sObj.ayahs[aIdx+1].text : "نهاية السورة")}));
        if(qType === 'prev') setCurrentQ(prev => ({...prev, ansText: (aIdx>0 ? sObj.ayahs[aIdx-1].text : "بداية السورة")}));
        if(qType === 'ayahNum') setCurrentQ(prev => ({...prev, ansText: ayah.num}));
        if(qType === 'surahName') setCurrentQ(prev => ({...prev, ansText: sObj.name}));
        if(qType === 'page') {
             const p = window.APP_DATA.pages ? window.APP_DATA.pages.find(pg => 
                (pg.start.surah_number < parseInt(sId) || (pg.start.surah_number == parseInt(sId) && pg.start.verse <= ayah.num)) &&
                (pg.end.surah_number > parseInt(sId) || (pg.end.surah_number == parseInt(sId) && pg.end.verse >= ayah.num))
            ) : null;
            setCurrentQ(prev => ({...prev, ansText: p ? p.page : "-"}));
        }

        setShowAns(false);
    };

    return (
        <div className="feature-container animate-in">
            {/* 1. اختيار النطاق */}
            <div className="flex gap-2 mb-2">
                <select className="flex-1 p-2 border rounded-lg text-xs font-bold bg-gray-50" value={scope} onChange={e=>setScope(e.target.value)}>
                    <option value="all">كامل المصحف</option>
                    <option value="juz">اختيار جزء</option>
                    <option value="custom">تحديد سور</option>
                </select>
                <select className="flex-1 p-2 border rounded-lg text-xs font-bold bg-gray-50" value={qType} onChange={e=>setQType(e.target.value)}>
                    <option value="complete">أكمل الآية</option>
                    <option value="next">التالي</option>
                    <option value="prev">السابق</option>
                    <option value="ayahNum">رقم الآية</option>
                    <option value="surahName">اسم السورة</option>
                    <option value="page">الصفحة</option>
                </select>
            </div>

            {/* 2. إعدادات النطاق الفرعية */}
            {scope === 'juz' && (
                <div className="mb-2 space-y-2 animate-in">
                    <select className="w-full p-2 border rounded-lg text-xs font-bold bg-white" value={selectedJuz} onChange={e=>setSelectedJuz(parseInt(e.target.value))}>
                        {[...Array(30).keys()].map(i => <option key={i+1} value={i+1}>الجزء {i+1}</option>)}
                    </select>
                    <select className="w-full p-2 border rounded-lg text-xs font-bold bg-white" value={selectedSurahInJuz} onChange={e=>setSelectedSurahInJuz(e.target.value)}>
                        <option value="all">-- اختبار في كامل الجزء {selectedJuz} --</option>
                        {surahsInSelectedJuz.map(s => (
                            <option key={s.id} value={s.id}>{s.id}. {s.name}</option>
                        ))}
                    </select>
                </div>
            )}

            {scope === 'custom' && (
                <div className="max-h-40 overflow-y-auto border rounded-lg p-2 bg-gray-50 mb-2 text-right animate-in">
                    <p className="text-[10px] text-gray-500 mb-1 sticky top-0 bg-gray-50 font-bold">اختر السور:</p>
                    <div className="grid grid-cols-3 gap-1">
                        {SURAH_NAMES.map((name, i) => (
                            <div key={i} onClick={() => toggleCustomSurah(i+1)} 
                                 className={`text-[10px] p-1 rounded cursor-pointer border text-center ${customSurahs.includes((i+1).toString()) ? 'bg-emerald-600 text-white' : 'bg-white'}`}>
                                {name}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <button onClick={() => generate(false)} className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold shadow mb-3 text-sm">بدء السؤال 🎲</button>

            {currentQ && (
                <div className="text-center animate-in">
                    <div className="bg-white border-2 border-gray-100 rounded-2xl p-4 shadow-sm mb-3">
                        <p className="text-xs text-gray-400 font-bold mb-2">{currentQ.prompt}</p>
                        <p className="font-amiri text-lg text-gray-800 leading-loose" dir="rtl">{currentQ.qText}</p>
                    </div>

                    {!showAns ? (
                        <button onClick={()=>setShowAns(true)} className="w-full bg-amber-100 text-amber-900 py-2 rounded-xl font-bold text-sm">كشف الإجابة 🔓</button>
                    ) : (
                        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 animate-in">
                            <p className="font-amiri text-lg text-emerald-900 font-bold mb-2">{currentQ.ansText}</p>
                            {qType === 'complete' && <p className="text-[10px] text-gray-500 border-t pt-1 mb-2">النص الكامل: {currentQ.fullText}</p>}
                            <p className="text-[10px] text-emerald-600 font-bold">{currentQ.info}</p>
                            
                            <div className="flex gap-2 mt-3">
                                <button onClick={() => generate(false)} className="flex-1 bg-white border py-2 rounded-lg text-xs font-bold text-gray-600">سؤال جديد</button>
                                {(qType === 'complete' || qType === 'next') && 
                                    <button onClick={() => generate(true)} className="flex-1 bg-emerald-600 text-white py-2 rounded-lg text-xs font-bold shadow">تابع الآية ⬅️</button>
                                }
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// ============================================================
// 4. المصحف الشريف (كما هو)
// ============================================================
window.QuranReader = window.QuranReader; 

// ============================================================
// 5. الأذكار (كما هي)
// ============================================================
window.AzkarApp = window.AzkarApp;
