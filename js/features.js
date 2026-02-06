/* =========================================
   ملف الميزات: js/features.js (V5 - الإصلاح النهائي)
   ========================================= */

const { useState, useEffect, useMemo } = React;

// قائمة السور (للعرض والفلترة)
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

// تحديد سور الجزء 30 بدقة (من النبأ 78 إلى الناس 114)
const JUZ_30_START = 78; 

// ============================================================
// 1. حاسبة الجهد (كما هي - تعمل بنجاح)
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
// 2. حاسبة الوقت (By Time)
// ============================================================
window.CalcTime = () => {
    const [y, setY] = useState(0);
    const [m, setM] = useState(0);
    const [d, setD] = useState(0);
    const [res, setRes] = useState(null);
    return (
        <div className="feature-container text-center animate-in">
            <h4 className="font-bold text-amber-800 mb-2 text-sm">🎯 حدد المدة</h4>
            <div className="flex gap-1 mb-2">
                <select className="flex-1 p-2 border rounded text-xs" value={y} onChange={e=>setY(e.target.value)}>{[...Array(16).keys()].map(i=><option value={i}>{i} سنة</option>)}</select>
                <select className="flex-1 p-2 border rounded text-xs" value={m} onChange={e=>setM(e.target.value)}>{[...Array(13).keys()].map(i=><option value={i}>{i} شهر</option>)}</select>
                <select className="flex-1 p-2 border rounded text-xs" value={d} onChange={e=>setD(e.target.value)}>{[...Array(32).keys()].map(i=><option value={i}>{i} يوم</option>)}</select>
            </div>
            <button onClick={()=>{
                const days = (y*365)+(m*30)+parseInt(d);
                if(days>0) setRes((604/days).toFixed(1));
            }} className="w-full bg-amber-500 text-white py-2 rounded-xl font-bold shadow">احسب</button>
            {res && <div className="mt-3 bg-amber-50 p-3 rounded-xl border border-amber-200 font-bold text-amber-800 text-sm">عليك قراءة {res} صفحة يومياً</div>}
        </div>
    );
};

// ============================================================
// 3. اختبر حفظك (المطور بذكاء + اختيار متعدد)
// ============================================================
window.TestHifz = () => {
    const [scope, setScope] = useState('all'); // all, juz30, custom
    const [selectedSurahs, setSelectedSurahs] = useState([]); // أرقام السور المختارة
    const [qType, setQType] = useState('complete');
    const [currentQ, setCurrentQ] = useState(null);
    const [showAns, setShowAns] = useState(false);

    // إدارة اختيار السور المتعدد
    const toggleSurahSelection = (id) => {
        const idStr = id.toString();
        setSelectedSurahs(prev => 
            prev.includes(idStr) ? prev.filter(x => x !== idStr) : [...prev, idStr]
        );
    };

    // القائمة التي ستظهر للاختيار (تعتمد على النطاق)
    const surahListToDisplay = useMemo(() => {
        if (scope === 'juz30') {
            return SURAH_NAMES.map((n, i) => ({ id: i + 1, name: n })).filter(s => s.id >= JUZ_30_START);
        }
        return SURAH_NAMES.map((n, i) => ({ id: i + 1, name: n }));
    }, [scope]);

    // المنطق الذكي لإخفاء الكلمات
    const getMaskedText = (text) => {
        const words = text.trim().split(/\s+/);
        const count = words.length;
        let showCount = 0;

        // معادلة الذكاء المطلوبة
        if (count <= 3) showCount = Math.max(1, count - 1); // لو 3 يظهر 2، لو 2 يظهر 1
        else if (count === 4) showCount = 3;
        else if (count === 5) showCount = 3;
        else if (count === 6) showCount = 4;
        else if (count === 7) showCount = 4;
        else if (count === 8) showCount = 5;
        else if (count === 9) showCount = 5;
        else if (count >= 10) showCount = 6;

        const visiblePart = words.slice(0, showCount).join(' ');
        return visiblePart + " ...";
    };

    const generate = (isNext = false) => {
        if (!window.APP_DATA.quran) return alert("جاري تحميل البيانات...");

        let sId, sObj, aIdx;

        if (isNext && currentQ) {
            // المتابعة
            sId = currentQ.sId;
            sObj = window.APP_DATA.quran[sId];
            aIdx = currentQ.aIdx + 1;
            if (aIdx >= sObj.ayahs.length) return alert("انتهت السورة.");
        } else {
            // سؤال جديد
            let pool = [];
            if (scope === 'custom' && selectedSurahs.length > 0) {
                pool = selectedSurahs;
            } else if (scope === 'juz30') {
                pool = Object.keys(window.APP_DATA.quran).filter(k => k >= JUZ_30_START);
            } else {
                pool = Object.keys(window.APP_DATA.quran);
            }

            if (pool.length === 0) return alert("الرجاء اختيار سور للاختبار.");
            
            // اختيار سورة عشوائية من القائمة المتاحة
            sId = pool[Math.floor(Math.random() * pool.length)];
            
            // التحقق من توفر بيانات السورة
            if (!window.APP_DATA.quran[sId]) {
                // محاولة البحث عن بديل متوفر
                const available = pool.filter(k => window.APP_DATA.quran[k]);
                if(available.length === 0) return alert("بيانات السور المختارة غير متوفرة حالياً.");
                sId = available[Math.floor(Math.random() * available.length)];
            }

            sObj = window.APP_DATA.quran[sId];
            aIdx = Math.floor(Math.random() * sObj.ayahs.length);
        }

        const ayah = sObj.ayahs[aIdx];
        let qText = ayah.text;
        let prompt = "";

        if (qType === 'complete') {
            prompt = "أكمل الآية:";
            if (!isNext) qText = getMaskedText(ayah.text); // تطبيق الذكاء هنا
        } else if (qType === 'next') {
            prompt = "ما الآية التالية؟";
        } else if (qType === 'prev') {
            prompt = "ما الآية السابقة؟";
        } else if (qType === 'ayahNum') {
            prompt = "ما رقم الآية؟"; qText = ayah.text;
        } else if (qType === 'surahName') {
            prompt = "في أي سورة؟"; qText = ayah.text;
        } else if (qType === 'page') {
            prompt = "رقم الصفحة؟"; qText = ayah.text;
        }

        setCurrentQ({ 
            sId, aIdx, 
            qText, 
            fullText: ayah.text, 
            ansText: ayah.text, // الإجابة الافتراضية
            info: `${sObj.name} - آية ${ayah.num}`,
            prompt 
        });
        
        // تجهيز الإجابة المحددة للأنواع الأخرى
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
            {/* إعدادات النطاق */}
            <div className="mb-3">
                <div className="flex gap-2 mb-2">
                    <select className="flex-1 p-2 border rounded-lg text-xs font-bold bg-gray-50" value={scope} onChange={e=>setScope(e.target.value)}>
                        <option value="all">كامل المصحف</option>
                        <option value="juz30">الجزء 30 فقط</option>
                        <option value="custom">تحديد سور معينة</option>
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

                {/* قائمة اختيار السور (تظهر فقط عند اختيار "تحديد سور") */}
                {scope === 'custom' && (
                    <div className="max-h-40 overflow-y-auto border rounded-lg p-2 bg-gray-50 mb-2 text-right">
                        <p className="text-[10px] text-gray-500 mb-1 sticky top-0 bg-gray-50 font-bold">تم اختيار: {selectedSurahs.length} سورة</p>
                        <div className="grid grid-cols-3 gap-1">
                            {SURAH_NAMES.map((name, i) => (
                                <div key={i} onClick={() => toggleSurahSelection(i+1)} 
                                     className={`text-[10px] p-1 rounded cursor-pointer border text-center ${selectedSurahs.includes((i+1).toString()) ? 'bg-emerald-600 text-white' : 'bg-white'}`}>
                                    {name}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {/* عرض القائمة للجزء 30 فقط للتوضيح */}
                {scope === 'juz30' && <p className="text-[10px] text-gray-400 text-center mb-2">سيتم الاختبار في السور من النبأ إلى الناس</p>}
            </div>

            <button onClick={() => generate(false)} className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold shadow mb-4 text-sm">بدء السؤال 🎲</button>

            {currentQ && (
                <div className="text-center animate-in">
                    <div className="bg-white border-2 border-gray-100 rounded-2xl p-5 shadow-sm mb-3">
                        <p className="text-xs text-gray-400 font-bold mb-3">{currentQ.prompt}</p>
                        <p className="font-amiri text-xl text-gray-800 leading-loose" dir="rtl">{currentQ.qText}</p>
                    </div>

                    {!showAns ? (
                        <button onClick={()=>setShowAns(true)} className="w-full bg-amber-100 text-amber-900 py-2 rounded-xl font-bold text-sm">كشف الإجابة 🔓</button>
                    ) : (
                        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 animate-in">
                            <p className="text-xs text-gray-400 font-bold">الإجابة:</p>
                            <p className="font-amiri text-lg text-emerald-900 font-bold mb-3">{currentQ.ansText}</p>
                            
                            {/* إظهار النص الكامل إذا كان السؤال "أكمل" للتأكد */}
                            {qType === 'complete' && <p className="text-[10px] text-gray-500 border-t pt-1">النص الكامل: {currentQ.fullText}</p>}
                            
                            <p className="text-[10px] text-emerald-600 font-bold mt-2">{currentQ.info}</p>
                            
                            <div className="flex gap-2 mt-3">
                                <button onClick={() => generate(false)} className="flex-1 bg-white border py-2 rounded-lg text-xs font-bold text-gray-600">سؤال جديد</button>
                                {(qType === 'complete' || qType === 'next') && 
                                    <button onClick={() => generate(true)} className="flex-1 bg-emerald-600 text-white py-2 rounded-lg text-xs font-bold shadow">تابع الآية التالية ⬅️</button>
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
// 4. المصحف الشريف (إصلاح الشاشة البيضاء)
// ============================================================
window.QuranReader = () => {
    // التأكد من أن البيانات موجودة قبل الرندر
    if (!window.APP_DATA || !window.APP_DATA.quran) return <div className="p-4 text-center text-gray-500">جاري تحميل المصحف...</div>;

    const [view, setView] = useState('list');
    const [activeSurah, setActiveSurah] = useState(null);
    const [search, setSearch] = useState('');
    const [bg, setBg] = useState('white');
    const [fs, setFs] = useState(1.8); // Font Size

    // قائمة السور المفلترة
    const surahKeys = Object.keys(window.APP_DATA.quran);
    const filtered = surahKeys.filter(k => window.APP_DATA.quran[k].name.includes(search));

    const open = (id) => {
        setActiveSurah({ id, ...window.APP_DATA.quran[id] });
        setView('reader');
    };

    return (
        <div className="feature-container p-0 h-[500px] flex flex-col bg-white border">
            {view === 'list' && (
                <div className="p-4 flex-1 overflow-hidden flex flex-col">
                    <input className="w-full p-2 border rounded-lg mb-2 text-sm" placeholder="بحث..." value={search} onChange={e=>setSearch(e.target.value)} />
                    <div className="grid grid-cols-3 gap-2 overflow-y-auto flex-1 content-start">
                        {filtered.map(id => (
                            <button key={id} onClick={() => open(id)} className="p-2 border rounded bg-gray-50 hover:bg-emerald-50 text-xs font-bold">
                                <div className="text-[10px] text-gray-400">{id}</div>
                                {window.APP_DATA.quran[id].name}
                            </button>
                        ))}
                    </div>
                </div>
            )}
            {view === 'reader' && activeSurah && (
                <div className="flex flex-col h-full">
                    <div className="p-2 border-b flex justify-between items-center bg-gray-100 shadow-sm z-10">
                        <button onClick={()=>setView('list')} className="px-3 py-1 bg-white border rounded text-xs font-bold">فهرس</button>
                        <span className="font-bold text-sm text-emerald-800">{activeSurah.name}</span>
                        <div className="flex gap-1">
                            <button onClick={()=>setBg(bg==='white'?'#fffbf0':'white')} className="w-6 h-6 rounded-full border bg-amber-100 text-[10px]">🎨</button>
                            <button onClick={()=>setFs(s=>Math.min(3,s+0.2))} className="w-6 h-6 rounded-full border bg-white font-bold">+</button>
                            <button onClick={()=>setFs(s=>Math.max(1,s-0.2))} className="w-6 h-6 rounded-full border bg-white font-bold">-</button>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 leading-loose text-justify" style={{backgroundColor: bg, fontSize: `${fs}rem`}} dir="rtl">
                        {activeSurah.id !== "1" && activeSurah.id !== "9" && <div className="text-center font-amiri mb-4 text-emerald-800 text-lg">بسم الله الرحمن الرحيم</div>}
                        <div className="font-amiri text-gray-800">
                            {activeSurah.ayahs.map(a => (
                                <span key={a.num}>
                                    {a.text} <span className="text-emerald-600 text-[0.6em] border border-emerald-500 rounded-full px-1 mx-1 select-none">{a.num}</span> 
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// ============================================================
// 5. الأذكار (النسخة القديمة - Cards)
// ============================================================
window.AzkarApp = () => {
    const [view, setView] = useState('cats');
    const [selCat, setSelCat] = useState(null);
    const [counts, setCounts] = useState({});

    // استخراج الأقسام بأمان
    const categories = useMemo(() => {
        if (!window.APP_DATA.azkar) return [];
        return [...new Set(window.APP_DATA.azkar.map(z => z.category))];
    }, []);

    useEffect(() => {
        if (window.APP_DATA.azkar) {
            const init = {};
            window.APP_DATA.azkar.forEach((z, i) => init[i] = z.count || 1);
            setCounts(init);
        }
    }, []);

    const click = (i) => {
        if (counts[i] > 0) {
            setCounts(p => ({...p, [i]: p[i]-1}));
            if(navigator.vibrate) navigator.vibrate(30);
        }
    };

    return (
        <div className="feature-container p-4">
            {view === 'cats' && (
                <div className="grid grid-cols-2 gap-3">
                    {categories.map(c => (
                        <button key={c} onClick={()=>{setSelCat(c); setView('list')}} className="p-4 bg-white border rounded-xl shadow-sm font-bold text-emerald-800 text-sm flex flex-col items-center">
                            <span className="text-2xl mb-1">📿</span> {c}
                        </button>
                    ))}
                    <button onClick={()=>setView('sebha')} className="col-span-2 p-3 bg-amber-50 border border-amber-200 rounded-xl font-bold text-amber-800">السبحة الحرة</button>
                </div>
            )}
            {view === 'list' && (
                <div>
                    <button onClick={()=>setView('cats')} className="mb-2 text-xs text-gray-500 font-bold">⬅️ رجوع</button>
                    <h3 className="text-center font-black text-emerald-800 mb-3 bg-emerald-50 p-2 rounded">{selCat}</h3>
                    <div className="space-y-3 max-h-[400px] overflow-y-auto">
                        {window.APP_DATA.azkar.map((z, i) => {
                            if(z.category !== selCat) return null;
                            return (
                                <div key={i} onClick={()=>click(i)} className={`p-4 bg-white border-r-4 rounded-xl shadow-sm cursor-pointer ${counts[i]===0 ? 'border-gray-300 opacity-50' : 'border-emerald-500'}`}>
                                    <div className="flex justify-between mb-2"><span className="text-xs bg-gray-100 px-2 rounded font-bold">{counts[i]===0 ? 'تم ✅' : `باقي: ${counts[i]}`}</span></div>
                                    <p className="font-amiri text-lg">{z.zekr}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
            {view === 'sebha' && (
                <div className="text-center py-10">
                    <button onClick={()=>setView('cats')} className="absolute top-4 right-4 text-xs font-bold text-gray-500">خروج</button>
                    <div className="sebha-circle mx-auto" onClick={(e)=>{e.target.innerText = parseInt(e.target.innerText)+1; if(navigator.vibrate) navigator.vibrate(30);}}>0</div>
                    <button onClick={(e)=>e.target.previousElementSibling.innerText=0} className="mt-4 text-red-500 font-bold text-xs">تصفير</button>
                </div>
            )}
        </div>
    );
};
