/* =========================================
   ملف الميزات: js/features.js (النسخة الشاملة - V4 Final)
   ========================================= */

const { useState, useEffect, useMemo } = React;

// --- قائمة السور (114 سورة) لضمان ظهورها في القائمة ---
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

// ============================================================
// 1. حاسبة الجهد (By Effort)
// ============================================================
window.CalcEffort = () => {
    const [step, setStep] = useState(1);
    const [days, setDays] = useState(null);
    const [amount, setAmount] = useState('');
    const [skippedParts, setSkippedParts] = useState(0);
    const [result, setResult] = useState(null);
    const [showMaxWarning, setShowMaxWarning] = useState(false);

    // التحقق من المدخلات
    const handleAmountChange = (e) => setAmount(e.target.value);
    const validateAmount = () => {
        let val = parseFloat(amount);
        if (isNaN(val)) return;
        if (val < 0.1) setAmount(0.1);
        else if (val > 1812) { setAmount(1812); setShowMaxWarning(true); } 
        else setShowMaxWarning(false);
    };

    const calculate = () => {
        const val = parseFloat(amount);
        if (!days || !val) return alert("الرجاء إكمال البيانات");
        const remainingPages = 604 - (skippedParts * 20);
        if (remainingPages <= 0) return alert("لقد أتممت الحفظ سابقاً!");
        const weeklyRate = val * days;
        const totalWeeks = remainingPages / weeklyRate;
        const totalYears = Math.floor(totalWeeks / 52);
        const totalMonths = Math.floor((totalWeeks % 52) / 4.3);
        
        setResult({ rate: `${val} صفحة`, duration: `${totalYears} سنة و ${totalMonths} شهر` });
    };

    return (
        <div className="feature-container animate-in">
            {showMaxWarning && <div className="bg-red-50 text-red-800 p-2 text-center text-xs mb-2 font-bold rounded">⚠ الحد الأقصى 3 ختمات يومياً</div>}
            {step === 1 && (
                <div className="text-center">
                    <h4 className="font-bold text-emerald-800 mb-3 text-sm">1️⃣ أيام الحفظ في الأسبوع؟</h4>
                    <div className="grid grid-cols-7 gap-1">
                        {[1, 2, 3, 4, 5, 6, 7].map(d => (
                            <button key={d} onClick={() => { setDays(d); setStep(2); }} className="aspect-square rounded-xl bg-gray-50 hover:bg-emerald-600 hover:text-white border-2 font-black text-sm">{d}</button>
                        ))}
                    </div>
                </div>
            )}
            {step === 2 && (
                <div className="text-center animate-in">
                    <h4 className="font-bold text-emerald-800 mb-2 text-sm">2️⃣ المقدار والتخطي</h4>
                    <input type="number" step="0.1" className="w-full p-3 border rounded-xl mb-3 text-center font-bold" placeholder="صفحة يومياً" value={amount} onChange={handleAmountChange} onBlur={validateAmount} />
                    <select className="w-full p-2 border rounded-xl text-center font-bold bg-gray-50 text-sm mb-3" value={skippedParts} onChange={(e) => setSkippedParts(e.target.value)}>
                        {[...Array(31).keys()].map(i => <option key={i} value={i}>تخطي {i} جزء</option>)}
                    </select>
                    <button onClick={calculate} className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold shadow-lg">احسب النتيجة 🏁</button>
                    
                    {result && (
                        <div className="mt-4 bg-gradient-to-br from-emerald-50 to-white border border-emerald-200 rounded-2xl p-4 shadow-inner text-center animate-in">
                            <h3 className="text-emerald-800 font-black text-lg mb-1">🎉 النتيجة المتوقعة</h3>
                            <p className="text-xs text-gray-500 mb-2">معدل: {result.rate} يومياً</p>
                            <div className="bg-white rounded-xl p-2 border border-emerald-100 mb-2">
                                <p className="text-2xl font-black text-emerald-600">⏳ {result.duration}</p>
                            </div>
                            <p className="font-amiri text-sm text-emerald-800 font-bold mb-2">﴿ وَلَقَدْ يَسَّرْنَا الْقُرْآنَ لِلذِّكْرِ ﴾</p>
                            <button onClick={() => alert("اللهم اجعل القرآن ربيع قلوبنا..")} className="bg-amber-400 text-white text-xs font-bold px-4 py-2 rounded-full shadow">🤲 دعاء الختمة</button>
                        </div>
                    )}
                    <button onClick={() => {setStep(1); setResult(null);}} className="text-[10px] text-gray-400 mt-2 underline">إعادة</button>
                </div>
            )}
        </div>
    );
};

// ============================================================
// 2. حاسبة الوقت (By Time) - التصميم الموحد
// ============================================================
window.CalcTime = () => {
    const [y, setY] = useState(0);
    const [m, setM] = useState(0);
    const [d, setD] = useState(0);
    const [skippedParts, setSkippedParts] = useState(0);
    const [result, setResult] = useState(null);
    const [showLateMsg, setShowLateMsg] = useState(false);

    const calculate = () => {
        let years = parseInt(y);
        if (years >= 15) { years = 15; setShowLateMsg(true); } else { setShowLateMsg(false); }
        
        const totalDays = (years * 365) + (parseInt(m) * 30) + parseInt(d);
        if (totalDays <= 0) return alert("حدد المدة");
        
        const remainingPages = 604 - (skippedParts * 20);
        if (remainingPages <= 0) return alert("أنت خاتم أصلاً!");
        
        const daily = (remainingPages / totalDays).toFixed(1);
        setResult({ daily, days: totalDays });
    };

    return (
        <div className="feature-container animate-in">
            <h4 className="text-center font-bold text-amber-800 mb-3 text-sm">🎯 حدد المدة المستهدفة</h4>
            <div className="flex gap-1 mb-3">
                <select className="flex-1 p-2 border rounded-lg text-center bg-gray-50 text-xs font-bold" value={y} onChange={e => setY(e.target.value)}>{[...Array(16).keys()].map(i=><option value={i}>{i} سنة</option>)}</select>
                <select className="flex-1 p-2 border rounded-lg text-center bg-gray-50 text-xs font-bold" value={m} onChange={e => setM(e.target.value)}>{[...Array(13).keys()].map(i=><option value={i}>{i} شهر</option>)}</select>
                <select className="flex-1 p-2 border rounded-lg text-center bg-gray-50 text-xs font-bold" value={d} onChange={e => setD(e.target.value)}>{[...Array(32).keys()].map(i=><option value={i}>{i} يوم</option>)}</select>
            </div>
            <div className="mb-3">
                <select className="w-full p-2 border rounded-xl text-center font-bold bg-gray-50 text-sm" value={skippedParts} onChange={(e) => setSkippedParts(e.target.value)}>
                    {[...Array(31).keys()].map(i => <option key={i} value={i}>تخطي {i} جزء محفوظ</option>)}
                </select>
            </div>
            <button onClick={calculate} className="w-full bg-amber-500 text-white py-3 rounded-xl font-bold shadow-lg text-sm mb-3">احسب خطتي</button>
            
            {showLateMsg && <div className="bg-blue-50 text-blue-800 p-2 text-center text-xs mb-2 font-bold rounded">«وَمَن تَأَخَّرَ فَلَا إِثْمَ عَلَيْهِ ۚ لِمَنِ اتَّقَىٰ»</div>}

            {result && (
                <div className="bg-gradient-to-br from-amber-50 to-white border border-amber-200 rounded-2xl p-4 shadow-inner text-center animate-in">
                    <h3 className="text-amber-800 font-black text-lg mb-1">📌 الخطتة المقترحة</h3>
                    <div className="bg-white rounded-xl p-3 border border-amber-100 mb-2">
                        <p className="text-xs text-gray-400 font-bold">الورد اليومي:</p>
                        <p className="text-3xl font-black text-amber-600 mt-1">{result.daily} <span className="text-sm text-gray-400">صفحة</span></p>
                    </div>
                    <p className="font-amiri text-sm text-amber-800 font-bold mb-2">نسأل الله أن يبارك في وقتك.</p>
                    <button onClick={() => alert("اللهم ذكرني منه ما نسيت..")} className="bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow">🤲 دعاء الختمة</button>
                </div>
            )}
        </div>
    );
};

// ============================================================
// 3. اختبر حفظك (الممتحن الشامل - 6 أنواع أسئلة)
// ============================================================
window.TestHifz = () => {
    const [part, setPart] = useState('all');
    const [surahIdx, setSurahIdx] = useState('all'); // 0-113 based index
    const [qType, setQType] = useState('complete');
    const [currentQ, setCurrentQ] = useState(null);
    const [showAns, setShowAns] = useState(false);

    // توليد السؤال
    const generate = (isNext = false) => {
        if (!window.APP_DATA.quran) return alert("جاري تحميل المصحف...");

        let sId, sObj, aIdx;

        if (isNext && currentQ) {
            // منطق المتابعة (الآية التالية)
            sId = currentQ.sId;
            sObj = window.APP_DATA.quran[sId];
            aIdx = currentQ.aIdx + 1;
            if (aIdx >= sObj.ayahs.length) return alert("انتهت السورة! اختر سؤالاً جديداً.");
        } else {
            // سؤال جديد
            if (surahIdx !== 'all') {
                sId = (parseInt(surahIdx) + 1).toString(); // تحويل الفهرس لرقم سورة (string)
            } else {
                // اختيار عشوائي (مع مراعاة الجزء إذا تم تحديده تقريبياً)
                const keys = Object.keys(window.APP_DATA.quran);
                if (part !== 'all') {
                    // فلترة بسيطة للجزء (كل جزء 20 صفحة تقريباً، أو نعتمد على العشوائية العامة للتبسيط حالياً)
                    // هنا سنختار من الكل إذا كان التحديد "جزء" لأن ملف البيانات لا يحتوي رقم الجزء بدقة لكل سورة
                    // ولكن المستخدم طلب "أن تظهر القائمة كاملة"، لذا سنختار عشوائياً من الكل إذا اختار جزءاً ولم يحدد سورة
                    sId = keys[Math.floor(Math.random() * keys.length)]; 
                } else {
                    sId = keys[Math.floor(Math.random() * keys.length)];
                }
            }
            
            sObj = window.APP_DATA.quran[sId];
            if (!sObj) return alert("عفواً، بيانات هذه السورة غير متوفرة في الملف الحالي.");
            aIdx = Math.floor(Math.random() * sObj.ayahs.length);
        }

        const ayah = sObj.ayahs[aIdx];
        
        // إعداد السؤال والإجابة حسب النوع
        let qText = "", ansText = "", prompt = "", details = "";
        
        // 1. أكمل الآية
        if (qType === 'complete') {
            prompt = "أكمل الآية التالية:";
            const words = ayah.text.split(' ');
            qText = words.length > 5 && !isNext ? words.slice(0, 5).join(' ') + "..." : ayah.text; // إذا متابعة نعرضها كاملة
            ansText = ayah.text;
        } 
        // 2. الآية التالية
        else if (qType === 'next') {
            prompt = "ما الآية التي تلي هذه الآية؟";
            qText = ayah.text;
            ansText = (aIdx + 1 < sObj.ayahs.length) ? sObj.ayahs[aIdx+1].text : "آخر آية في السورة";
        }
        // 3. الآية السابقة
        else if (qType === 'prev') {
            prompt = "ما الآية التي تسبق هذه الآية؟";
            qText = ayah.text;
            ansText = (aIdx > 0) ? sObj.ayahs[aIdx-1].text : "أول آية في السورة";
        }
        // 4. رقم الآية
        else if (qType === 'ayahNum') {
            prompt = "ما رقم هذه الآية؟";
            qText = ayah.text;
            ansText = `الآية رقم ${ayah.num}`;
        }
        // 5. اسم السورة
        else if (qType === 'surahName') {
            prompt = "في أي سورة تقع هذه الآية؟";
            qText = ayah.text;
            ansText = `سورة ${sObj.name}`;
        }
        // 6. رقم الصفحة
        else if (qType === 'page') {
            prompt = "في أي صفحة تقع هذه الآية؟";
            qText = ayah.text;
            // البحث في pagesquran
            const p = window.APP_DATA.pages ? window.APP_DATA.pages.find(pg => 
                (pg.start.surah_number < parseInt(sId) || (pg.start.surah_number == parseInt(sId) && pg.start.verse <= ayah.num)) &&
                (pg.end.surah_number > parseInt(sId) || (pg.end.surah_number == parseInt(sId) && pg.end.verse >= ayah.num))
            ) : null;
            ansText = p ? `صفحة ${p.page}` : "غير محدد";
        }

        setCurrentQ({ sId, aIdx, qText, ansText, prompt, fullInfo: `${sObj.name} - آية ${ayah.num}` });
        setShowAns(false);
    };

    return (
        <div className="feature-container animate-in">
            <div className="space-y-2 mb-3">
                <div className="flex gap-2">
                    <select className="flex-1 p-2 border rounded-lg text-xs font-bold bg-gray-50" value={part} onChange={e=>setPart(e.target.value)}>
                        <option value="all">كامل المصحف</option>
                        {[...Array(30).keys()].map(i=><option key={i} value={i+1}>جزء {i+1}</option>)}
                    </select>
                    <select className="flex-1 p-2 border rounded-lg text-xs font-bold bg-gray-50" value={qType} onChange={e=>setQType(e.target.value)}>
                        <option value="complete">أكمل الآية</option>
                        <option value="next">ما التالي؟</option>
                        <option value="prev">ما السابق؟</option>
                        <option value="ayahNum">رقم الآية</option>
                        <option value="surahName">اسم السورة</option>
                        <option value="page">رقم الصفحة</option>
                    </select>
                </div>
                {/* القائمة الكاملة للسور (114) */}
                <select className="w-full p-2 border rounded-lg text-xs font-bold bg-white" value={surahIdx} onChange={e=>setSurahIdx(e.target.value)}>
                    <option value="all">-- اختيار سورة عشوائية --</option>
                    {SURAH_NAMES.map((name, idx) => (
                        <option key={idx} value={idx}>{idx+1}. {name}</option>
                    ))}
                </select>
            </div>

            <button onClick={() => generate(false)} className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold shadow mb-3 text-sm">سؤال جديد 🎲</button>

            {currentQ && (
                <div className="text-center animate-in">
                    <div className="bg-white border-2 border-gray-100 rounded-2xl p-5 shadow-sm mb-3">
                        <p className="text-xs text-gray-400 font-bold mb-3">{currentQ.prompt}</p>
                        <p className="font-amiri text-xl text-gray-800 leading-loose">{currentQ.qText}</p>
                    </div>

                    {!showAns ? (
                        <button onClick={()=>setShowAns(true)} className="w-full bg-amber-100 text-amber-900 py-2 rounded-xl font-bold text-sm">كشف الإجابة 🔓</button>
                    ) : (
                        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 animate-in">
                            <p className="font-amiri text-lg text-emerald-800 font-bold mb-3">{currentQ.ansText}</p>
                            <p className="text-[10px] text-gray-500 font-bold mb-3">{currentQ.fullInfo}</p>
                            
                            <div className="flex gap-2">
                                <button onClick={() => generate(false)} className="flex-1 bg-white border border-gray-200 py-2 rounded-lg text-xs font-bold text-gray-600">🔄 سؤال آخر</button>
                                {/* زر الإكمال يظهر فقط إذا كان السؤال "أكمل" أو "التالي" */}
                                {(qType === 'complete' || qType === 'next') && 
                                    <button onClick={() => generate(true)} className="flex-1 bg-emerald-600 text-white py-2 rounded-lg text-xs font-bold shadow">أكمل (الآية التالية) ⬅️</button>
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
// 5. الأذكار (النظام الذي أعجبك - الأقسام)
// ============================================================
window.AzkarApp = () => {
    const [view, setView] = useState('cats');
    const [selCat, setSelCat] = useState(null);
    const [counts, setCounts] = useState({});

    // استخراج الأقسام تلقائياً
    const categories = useMemo(() => {
        if (!window.APP_DATA.azkar) return [];
        return [...new Set(window.APP_DATA.azkar.map(z => z.category))];
    }, []);

    const clickZekr = (i) => {
        if((counts[i]||0) < (window.APP_DATA.azkar[i].count||1)) {
           setCounts(p => ({...p, [i]: (p[i]||0) + 1}));
           if(navigator.vibrate) navigator.vibrate(20);
        }
    };

    return (
        <div className="feature-container p-4">
            {view === 'cats' && (
                <div className="grid grid-cols-2 gap-3 animate-in">
                    {categories.map(cat => (
                        <button key={cat} onClick={()=>{setSelCat(cat); setView('list')}} className="p-5 bg-white border-2 border-emerald-50 rounded-2xl hover:border-emerald-500 font-bold text-emerald-800 text-sm shadow-sm flex flex-col items-center gap-2">
                            <span className="text-xl">📿</span>
                            <span>{cat}</span>
                        </button>
                    ))}
                    <button onClick={() => setView('sebha')} className="col-span-2 p-4 bg-amber-50 border-2 border-amber-100 rounded-2xl font-bold text-amber-800 mt-2">☝️ السبحة الحرة</button>
                </div>
            )}

            {view === 'list' && (
                <div className="animate-in">
                    <button onClick={()=>setView('cats')} className="mb-3 text-xs font-bold text-gray-500 flex items-center gap-1">⬅️ القائمة الرئيسية</button>
                    <h3 className="text-center font-black text-emerald-800 mb-4 bg-emerald-50 p-2 rounded-xl">{selCat}</h3>
                    <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scroll">
                        {window.APP_DATA.azkar.map((z, i) => {
                            if(z.category !== selCat) return null;
                            const done = (counts[i]||0);
                            const total = z.count || 1;
                            const remaining = total - done;
                            
                            return (
                                <div key={i} onClick={()=>clickZekr(i)} className={`p-4 bg-white border-r-4 rounded-xl shadow-sm cursor-pointer relative overflow-hidden ${remaining===0 ? 'border-gray-300 opacity-60 bg-green-50' : 'border-emerald-500'}`}>
                                    <div className="flex justify-between mb-2">
                                        <span className={`text-xs px-2 py-1 rounded font-bold ${remaining===0 ? 'bg-green-200 text-green-800' : 'bg-gray-100 text-gray-600'}`}>{remaining===0 ? 'تم ✅' : `باقي: ${remaining}`}</span>
                                    </div>
                                    <p className="font-amiri text-lg leading-loose">{z.zekr}</p>
                                    {remaining===0 && <div className="absolute inset-0 flex items-center justify-center bg-white/50 text-green-600 font-black text-2xl rotate-12">تم الإنجاز</div>}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {view === 'sebha' && (
                <div className="text-center py-8 animate-in">
                    <button onClick={() => setView('cats')} className="absolute top-4 right-4 text-xs font-bold text-gray-500">❌ خروج</button>
                    <div className="sebha-circle mx-auto" onClick={(e) => { e.target.innerText = parseInt(e.target.innerText) + 1; if(navigator.vibrate) navigator.vibrate(30); }}>0</div>
                    <div className="flex justify-center gap-4 mt-8">
                        <button onClick={(e) => e.target.parentElement.previousElementSibling.innerText = Math.max(0, parseInt(e.target.parentElement.previousElementSibling.innerText)-1)} className="bg-gray-200 px-4 py-2 rounded-full text-xs font-bold">تراجع</button>
                        <button onClick={(e) => e.target.parentElement.previousElementSibling.innerText = 0} className="bg-red-50 text-red-600 px-4 py-2 rounded-full text-xs font-bold">تصفير</button>
                    </div>
                </div>
            )}
        </div>
    );
};
