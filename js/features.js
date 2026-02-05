/* =========================================
   ملف الميزات: js/features.js
   الوظيفة: المنطق الذكي (الحاسبات، المصحف، الاختبار، الأذكار)
   ========================================= */

const { useState, useEffect, useMemo, useRef } = React;

// ============================================================
// 1. حاسبة جهد الطالب (By Effort)
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

        if (val < 0.1) {
            setAmount(0.1);
        } else if (val > 1812) {
            setAmount(1812);
            setShowMaxWarning(true); // إظهار تحذير العجلة
        } else {
            setShowMaxWarning(false);
        }
    };

    const calculate = () => {
        const val = parseFloat(amount);
        if (!days || !val) return alert("الرجاء إكمال البيانات");

        // المعادلة: 604 - (الأجزاء المنجزة * 20)
        const remainingPages = 604 - (skippedParts * 20);
        if (remainingPages <= 0) return alert("لقد أتممت حفظ القرآن سابقاً! 🎉");

        const weeklyRate = val * days; // كم صفحة في الأسبوع
        const totalWeeks = remainingPages / weeklyRate;
        const totalMonths = totalWeeks / 4.3;
        const totalYears = totalMonths / 12;

        let timeString = "";
        if (totalWeeks < 1) timeString = "أقل من أسبوع";
        else if (totalMonths < 1) timeString = `${Math.ceil(totalWeeks)} أسبوع`;
        else if (totalYears < 1) timeString = `${Math.floor(totalMonths)} شهر و ${Math.ceil((totalMonths % 1) * 30)} يوم`;
        else timeString = `${Math.floor(totalYears)} سنة و ${Math.floor(totalMonths % 12)} شهر`;

        setResult({
            rate: `${val} صفحة يومياً (${days} أيام/أسبوع)`,
            duration: timeString,
            remaining: remainingPages
        });
    };

    return (
        <div className="feature-container animate-in">
            {/* تحذير العجلة */}
            {showMaxWarning && (
                <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-4 rounded shadow-sm animate-pulse">
                    <p className="font-amiri text-lg text-red-800 text-center font-bold">﴿ وَلَا تَعْجَلْ بِالْقُرْآنِ مِن قَبْلِ أَن يُقْضَىٰ إِلَيْكَ وَحْيُهُ ﴾</p>
                    <p className="text-xs text-red-600 text-center mt-1">الحد الأقصى 3 ختمات يومياً</p>
                </div>
            )}

            {/* الخطوة 1: الأيام */}
            {step === 1 && (
                <div className="text-center">
                    <h4 className="font-bold text-emerald-800 mb-3 text-sm">1️⃣ كم يوماً تحفظ في الأسبوع؟</h4>
                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {[1, 2, 3, 4, 5, 6, 7].map(d => (
                            <button key={d} onClick={() => { setDays(d); setStep(2); }} className="aspect-square rounded-xl bg-gray-50 hover:bg-emerald-600 hover:text-white border-2 border-gray-100 font-black transition text-sm shadow-sm">
                                {d}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* الخطوة 2: المقدار وتخطي الأجزاء */}
            {step === 2 && (
                <div className="text-center animate-in">
                    <h4 className="font-bold text-emerald-800 mb-2 text-sm">2️⃣ مقدار الحفظ والأجزاء السابقة</h4>
                    
                    <div className="mb-4">
                        <label className="text-xs text-gray-400 block mb-1">المقدار اليومي (صفحات)</label>
                        <input type="number" step="0.1" className="w-full p-3 border-2 border-emerald-100 rounded-xl text-center font-black bg-white focus:border-emerald-500 outline-none" 
                               placeholder="مثلاً: 1" 
                               value={amount} 
                               onChange={handleAmountChange} 
                               onBlur={validateAmount} // التحقق عند الخروج من الحقل
                        />
                    </div>

                    <div className="mb-4">
                        <label className="text-xs text-gray-400 block mb-1">تخطي أجزاء محفوظة (0-30)</label>
                        <select className="w-full p-2 border rounded-xl text-center font-bold bg-gray-50 text-sm" 
                                value={skippedParts} 
                                onChange={(e) => setSkippedParts(parseInt(e.target.value))}>
                            {[...Array(31).keys()].map(i => <option key={i} value={i}>{i} جزء</option>)}
                        </select>
                    </div>

                    <button onClick={calculate} className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-emerald-700 transition">احسب النتيجة 🏁</button>
                    
                    {/* بطاقة النتيجة الجديدة */}
                    {result && (
                        <div className="mt-4 bg-gradient-to-br from-emerald-50 to-white border border-emerald-200 rounded-2xl p-5 shadow-inner text-center animate-in">
                            <h3 className="text-emerald-800 font-black text-lg mb-1">🎉 النتيجة المتوقعة</h3>
                            <p className="text-xs text-gray-500 mb-3">معدل الحفظ: {result.rate}</p>
                            
                            <div className="bg-white rounded-xl p-3 border border-emerald-100 mb-3">
                                <p className="text-xs text-gray-400 font-bold">ستختم خلال:</p>
                                <p className="text-2xl font-black text-emerald-600 mt-1">⏳ {result.duration}</p>
                            </div>

                            <p className="font-amiri text-sm text-emerald-800 mb-3 leading-loose font-bold">﴿ وَلَقَدْ يَسَّرْنَا الْقُرْآنَ لِلذِّكْرِ فَهَلْ مِن مُّدَّكِرٍ ﴾</p>
                            
                            <button onClick={() => alert("اللهم اجعل القرآن العظيم ربيع قلوبنا ونور صدورنا وجلاء أحزاننا وذهاب همومنا..")} 
                                    className="bg-amber-400 text-white text-xs font-bold px-5 py-2 rounded-full shadow hover:bg-amber-500">
                                🤲 دعاء الختمة
                            </button>
                        </div>
                    )}
                    <button onClick={() => {setStep(1); setResult(null);}} className="text-[10px] text-gray-400 mt-4 underline">إعادة الحساب</button>
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
    const [skippedParts, setSkippedParts] = useState(0);
    const [result, setResult] = useState(null);
    const [showLateMsg, setShowLateMsg] = useState(false);

    const calculate = () => {
        let years = parseInt(y);
        
        // قيد الـ 15 سنة
        if (years >= 15) {
            years = 15;
            setShowLateMsg(true);
        } else {
            setShowLateMsg(false);
        }

        const totalDays = (years * 365) + (parseInt(m) * 30) + parseInt(d);
        if (totalDays <= 0) return alert("حدد مدة زمنية");

        const remainingPages = 604 - (skippedParts * 20);
        if (remainingPages <= 0) return alert("أنت خاتم أصلاً!");

        const daily = (remainingPages / totalDays).toFixed(1);
        setResult({ daily, totalDays, remainingPages });
    };

    return (
        <div className="feature-container animate-in">
            <h4 className="text-center font-bold text-amber-800 mb-3 text-sm">🎯 خطط بوقتك</h4>
            
            <div className="flex gap-2 mb-3">
                <div className="flex-1"><label className="text-[10px] block text-center text-gray-400 font-bold">سنة (0-15)</label><select className="w-full p-2 border rounded-lg text-center bg-gray-50 text-xs font-bold" value={y} onChange={e => {setY(e.target.value); if(e.target.value>=15) setShowLateMsg(true); else setShowLateMsg(false);}}>{[...Array(16).keys()].map(i=><option value={i}>{i}</option>)}</select></div>
                <div className="flex-1"><label className="text-[10px] block text-center text-gray-400 font-bold">شهر</label><select className="w-full p-2 border rounded-lg text-center bg-gray-50 text-xs font-bold" value={m} onChange={e => setM(e.target.value)}>{[...Array(13).keys()].map(i=><option value={i}>{i}</option>)}</select></div>
                <div className="flex-1"><label className="text-[10px] block text-center text-gray-400 font-bold">يوم</label><select className="w-full p-2 border rounded-lg text-center bg-gray-50 text-xs font-bold" value={d} onChange={e => setD(e.target.value)}>{[...Array(32).keys()].map(i=><option value={i}>{i}</option>)}</select></div>
            </div>

            <div className="mb-4">
                <label className="text-xs text-gray-400 block mb-1 text-center font-bold">تخطي أجزاء محفوظة (0-30)</label>
                <select className="w-full p-2 border rounded-xl text-center font-bold bg-gray-50 text-sm" value={skippedParts} onChange={(e) => setSkippedParts(parseInt(e.target.value))}>
                    {[...Array(31).keys()].map(i => <option key={i} value={i}>{i} جزء</option>)}
                </select>
            </div>

            <button onClick={calculate} className="w-full bg-amber-500 text-white py-3 rounded-xl font-bold shadow-lg text-sm mb-3">احسب خطتي</button>

            {/* رسالة التأخير */}
            {showLateMsg && (
                <div className="bg-blue-50 border border-blue-200 p-2 rounded-lg mb-3 text-center animate-in">
                    <p className="font-amiri text-sm text-blue-800 font-bold">«وَمَن تَأَخَّرَ فَلَا إِثْمَ عَلَيْهِ ۚ لِمَنِ اتَّقَىٰ»</p>
                    <p className="text-[10px] text-blue-600 font-bold">نصيحة: التأخير ليس حرجاً، المهم الاستمرار.</p>
                </div>
            )}

            {/* بطاقة النتيجة */}
            {result && (
                <div className="bg-gradient-to-br from-amber-50 to-white border border-amber-200 rounded-2xl p-5 shadow-inner text-center animate-in">
                    <h3 className="text-amber-800 font-black text-lg mb-1">📌 خطتك المقترحة</h3>
                    <p className="text-xs text-gray-500 mb-3">بناءً على اختيارك لـ {result.totalDays} يوم</p>
                    <p className="text-xs text-gray-400 mb-3">مع تخطي {skippedParts} أجزاء سابقة</p>
                    
                    <div className="bg-white rounded-xl p-3 border border-amber-100 mb-3">
                        <p className="text-xs text-gray-400 font-bold">المطلوب منك (قراءة/حفظ):</p>
                        <p className="text-3xl font-black text-amber-600 mt-1">{result.daily} <span className="text-sm text-gray-400">صفحة يومياً</span></p>
                    </div>

                    <p className="font-amiri text-sm text-amber-800 mb-3 font-bold">نسأل الله أن يبارك في وقتك ويثبتك.</p>
                    
                    <button onClick={() => alert("اللهم ذكرني منه ما نسيت وعلمني منه ما جهلت..")} 
                            className="bg-emerald-600 text-white text-xs font-bold px-5 py-2 rounded-full shadow hover:bg-emerald-700">
                        🤲 دعاء الختمة
                    </button>
                </div>
            )}
        </div>
    );
};

// ============================================================
// 3. اختبر حفظك (الممتحن الشامل)
// ============================================================
window.TestHifz = () => {
    const [partFilter, setPartFilter] = useState('all'); // 'all' or 1-30
    const [qType, setQType] = useState('complete');
    const [question, setQuestion] = useState(null);
    const [showAns, setShowAns] = useState(false);

    // دالة مساعدة لتحديد نطاق السور للجزء
    const getSurahsByPart = (part) => {
        // تقريب بسيط: كل جزء حوالي 20 صفحة، أو نستخدم النطاق الكامل إذا اخترنا "الكل"
        // للتبسيط في هذا الكود سنعتمد على أن المستخدم يختار "نطاق تقريبي" أو "كل المصحف"
        // لأن ملف quran.json لا يحتوي على رقم الجزء مباشرة لكل سورة.
        if (part === 'all') return Object.keys(window.APP_DATA.quran);
        
        // منطق تقريبي للأجزاء (يمكن تحسينه بملف بيانات أدق مستقبلاً)
        // الجزء 30: النبأ (78) - الناس (114)
        if (part == 30) return Object.keys(window.APP_DATA.quran).filter(k => k >= 78);
        if (part == 29) return Object.keys(window.APP_DATA.quran).filter(k => k >= 67 && k <= 77);
        // ... (يمكن إضافة المزيد)
        // حالياً سنعيد الكل ما عدا 30 و 29 للتبسيط
        return Object.keys(window.APP_DATA.quran);
    };

    const generate = () => {
        if(!window.APP_DATA.quran) return;
        const surahKeys = getSurahsByPart(partFilter);
        const sId = surahKeys[Math.floor(Math.random() * surahKeys.length)];
        const surah = window.APP_DATA.quran[sId];
        const ayahIdx = Math.floor(Math.random() * surah.ayahCount); // Index 0-based
        const ayah = surah.ayahs[ayahIdx]; // ayah object {num, text}

        let qText = ayah.text;
        let ansText = "";
        let prompt = "";

        // منطق الأسئلة الستة
        if (qType === 'complete') {
            const words = ayah.text.split(' ');
            if(words.length > 4) {
                qText = words.slice(0, 4).join(' ') + "...";
                ansText = ayah.text;
            } else {
                ansText = ayah.text; // الآية قصيرة
            }
            prompt = "أكمل الآية التالية:";
        } else if (qType === 'next') {
            // الآية التالية
            if(ayahIdx + 1 < surah.ayahs.length) {
                ansText = surah.ayahs[ayahIdx + 1].text;
                prompt = "ما الآية التي تلي هذه الآية؟";
            } else {
                ansText = "آخر آية في السورة";
                prompt = "ما الآية التي تلي:";
            }
        } else if (qType === 'prev') {
            if(ayahIdx > 0) {
                ansText = surah.ayahs[ayahIdx - 1].text;
                prompt = "ما الآية التي تسبق هذه الآية؟";
            } else {
                ansText = "أول آية في السورة";
                prompt = "ما الآية التي تسبق:";
            }
        } else if (qType === 'ayahNum') {
            prompt = "ما رقم هذه الآية؟";
            ansText = ayah.num;
        } else if (qType === 'surahName') {
            prompt = "في أي سورة تقع هذه الآية؟";
            ansText = surah.name;
        } else if (qType === 'page') {
            prompt = "في أي صفحة تقع هذه الآية؟";
            // البحث في pagesquran.json
            const p = window.APP_DATA.pages.find(pg => 
                (pg.start.surah_number < sId || (pg.start.surah_number == sId && pg.start.verse <= ayah.num)) &&
                (pg.end.surah_number > sId || (pg.end.surah_number == sId && pg.end.verse >= ayah.num))
            );
            ansText = p ? p.page : "غير محدد";
        }

        setQuestion({ text: qText, answer: ansText, prompt, details: { s: surah.name, a: ayah.num } });
        setShowAns(false);
    };

    return (
        <div className="feature-container animate-in">
            <div className="flex gap-2 mb-3">
                <select className="flex-1 p-2 border rounded-lg text-xs font-bold bg-gray-50" value={partFilter} onChange={e=>setPartFilter(e.target.value)}>
                    <option value="all">كامل المصحف</option>
                    <option value="30">الجزء 30 (عم)</option>
                    <option value="29">الجزء 29 (تبارك)</option>
                </select>
                <select className="flex-1 p-2 border rounded-lg text-xs font-bold bg-gray-50" value={qType} onChange={e=>setQType(e.target.value)}>
                    <option value="complete">أكمل الآية</option>
                    <option value="next">الآية التالية</option>
                    <option value="prev">الآية السابقة</option>
                    <option value="ayahNum">رقم الآية</option>
                    <option value="surahName">اسم السورة</option>
                    <option value="page">رقم الصفحة</option>
                </select>
            </div>

            <button onClick={generate} className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold shadow mb-4 text-sm">ابدأ الاختبار 🎲</button>

            {question && (
                <div className="text-center animate-in">
                    <div className="bg-white border-2 border-gray-100 rounded-2xl p-5 shadow-sm mb-3">
                        <p className="text-xs text-gray-400 font-bold mb-3">{question.prompt}</p>
                        <p className="font-amiri text-xl text-gray-800 leading-loose">
                            {question.text}
                        </p>
                    </div>

                    {!showAns ? (
                        <button onClick={()=>setShowAns(true)} className="w-full bg-amber-100 text-amber-800 py-2 rounded-xl font-bold text-sm">كشف الإجابة 🔓</button>
                    ) : (
                        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 animate-in">
                            <p className="text-xs text-gray-400 font-bold mb-2">الإجابة الصحيحة:</p>
                            <p className="font-amiri text-lg text-emerald-800 font-bold mb-3">{question.answer}</p>
                            <div className="border-t border-emerald-200 pt-2 flex justify-between text-[10px] text-gray-500 font-bold">
                                <span>سورة: {question.details.s}</span>
                                <span>آية: {question.details.a}</span>
                            </div>
                            <button onClick={generate} className="w-full bg-white border border-gray-200 mt-3 py-2 rounded-lg text-xs font-bold text-gray-600">سؤال تالي ⬅️</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// ============================================================
// 4. المصحف الشريف (المطور)
// ============================================================
window.QuranReader = () => {
    const [view, setView] = useState('list');
    const [activeSurah, setActiveSurah] = useState(null);
    const [bgMode, setBgMode] = useState('white'); // 'white' or 'cream'
    const [search, setSearch] = useState('');
    const [fontSize, setFontSize] = useState(1.8);
    const [searchResultVerses, setSearchResultVerses] = useState([]);

    const openSurah = (id) => {
        if (!window.APP_DATA.quran) return;
        setActiveSurah({ id, ...window.APP_DATA.quran[id] });
        setView('reader');
    };

    // البحث المزدوج (سور + آيات)
    useEffect(() => {
        if(search.length > 2) {
            // بحث في الآيات
            const results = [];
            const quran = window.APP_DATA.quran;
            Object.keys(quran).forEach(sId => {
                quran[sId].ayahs.forEach(a => {
                    if(a.text.includes(search)) {
                        results.push({ sId, sName: quran[sId].name, ...a });
                    }
                });
            });
            setSearchResultVerses(results.slice(0, 5)); // أول 5 نتائج فقط
        } else {
            setSearchResultVerses([]);
        }
    }, [search]);

    const saveBookmark = (ayahNum) => {
        const data = { surahId: activeSurah.id, surahName: activeSurah.name, ayahNum };
        localStorage.setItem('quran_bookmark', JSON.stringify(data));
        if(navigator.vibrate) navigator.vibrate(50);
        alert(`تم حفظ العلامة: ${activeSurah.name} آية ${ayahNum}`);
    };

    // فلترة السور بالاسم
    const filteredSurahs = window.APP_DATA.quran ? Object.keys(window.APP_DATA.quran).filter(id => window.APP_DATA.quran[id].name.includes(search)) : [];

    return (
        <div className="feature-container p-0 overflow-hidden h-[600px] flex flex-col border border-gray-200 bg-white">
            {view === 'list' && (
                <div className="p-4 flex flex-col h-full">
                    {/* البحث */}
                    <div className="relative">
                        <input type="text" placeholder="🔍 ابحث عن سورة أو آية..." className="w-full p-3 border rounded-xl mb-3 font-bold text-sm bg-gray-50 outline-none focus:border-emerald-500" value={search} onChange={e => setSearch(e.target.value)} />
                        {/* نتائج بحث الآيات */}
                        {searchResultVerses.length > 0 && (
                            <div className="absolute top-12 left-0 right-0 bg-white border shadow-xl rounded-xl z-50 max-h-40 overflow-y-auto">
                                {searchResultVerses.map((r, i) => (
                                    <div key={i} onClick={() => openSurah(r.sId)} className="p-2 border-b text-xs hover:bg-gray-50 cursor-pointer">
                                        <span className="font-bold text-emerald-600">{r.sName} ({r.num}):</span> {r.text.substring(0, 30)}...
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-3 gap-2 overflow-y-auto flex-1 content-start custom-scroll">
                        {filteredSurahs.map(id => (
                            <button key={id} onClick={() => openSurah(id)} className="bg-white p-2 rounded-lg border text-center shadow-sm hover:bg-emerald-50 h-20 flex flex-col items-center justify-center">
                                <span className="text-[10px] text-gray-400 font-bold block">{id}</span>
                                <span className="font-bold text-emerald-800 text-sm">{window.APP_DATA.quran[id].name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {view === 'reader' && activeSurah && (
                <div className="flex flex-col h-full">
                    {/* الهيدر والأدوات */}
                    <div className="bg-white border-b p-2 flex justify-between items-center shadow-sm z-20">
                        <button onClick={() => setView('list')} className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg font-bold border">فهرس</button>
                        <div className="flex gap-2">
                            {/* تغيير الخلفية */}
                            <button onClick={() => setBgMode('white')} className={`w-6 h-6 rounded-full border ${bgMode==='white'?'ring-2 ring-emerald-500':''}`} style={{background:'white'}}></button>
                            <button onClick={() => setBgMode('cream')} className={`w-6 h-6 rounded-full border ${bgMode==='cream'?'ring-2 ring-emerald-500':''}`} style={{background:'#fffbf0'}}></button>
                        </div>
                        <div className="flex items-center gap-1 bg-gray-100 rounded-lg px-1 border">
                            <button onClick={() => setFontSize(f => Math.max(1, f - 0.2))} className="text-lg font-bold px-2 text-gray-600">-</button>
                            <button onClick={() => setFontSize(f => Math.min(3.5, f + 0.2))} className="text-lg font-bold px-2 text-gray-600">+</button>
                        </div>
                    </div>

                    {/* منطقة القراءة */}
                    <div className={`flex-1 overflow-y-auto p-5 relative leading-loose text-justify custom-scroll transition-colors duration-300`} 
                         style={{ backgroundColor: bgMode === 'white' ? '#ffffff' : '#fffbf0' }} dir="rtl">
                        
                        {activeSurah.id !== "1" && activeSurah.id !== "9" && <div className="text-center font-amiri text-xl mb-6 text-emerald-800">بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ</div>}
                        
                        <div style={{ fontSize: `${fontSize}rem`, lineHeight: '1.9' }} className="font-amiri text-gray-800 text-justify">
                            {activeSurah.ayahs.map(ayah => (
                                <span key={ayah.num} id={`ayah-${ayah.num}`} className="inline">
                                    {ayah.text} 
                                    <span onClick={(e) => {e.stopPropagation(); saveBookmark(ayah.num);}} className="inline-flex items-center justify-center text-[0.45em] w-[1.8em] h-[1.8em] border border-emerald-600 rounded-full mx-1 text-emerald-700 bg-white cursor-pointer hover:bg-emerald-100 select-none relative top-[-2px]">{ayah.num}</span>
                                    {" "}
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
// 5. الأذكار (العودة للتصميم القديم - Cards)
// ============================================================
window.AzkarApp = () => {
    const [tab, setTab] = useState('azkar');
    const [counts, setCounts] = useState({});
    const [sebhaCount, setSebhaCount] = useState(0);

    useEffect(() => {
        if (window.APP_DATA.azkar) {
            const initial = {};
            window.APP_DATA.azkar.forEach((z, i) => initial[i] = z.count || 0);
            setCounts(initial);
        }
    }, []);

    const handleClick = (i) => {
        if (counts[i] > 0) {
            setCounts(prev => ({ ...prev, [i]: prev[i] - 1 }));
            if (navigator.vibrate) navigator.vibrate(30);
        }
    };

    return (
        <div className="feature-container p-4">
            <div className="flex gap-2 bg-gray-100 p-1 rounded-xl mb-4">
                <button onClick={() => setTab('azkar')} className={`flex-1 py-2 rounded-lg text-xs font-bold transition ${tab==='azkar'?'bg-white shadow text-emerald-700':'text-gray-500'}`}>📿 الأذكار</button>
                <button onClick={() => setTab('sebha')} className={`flex-1 py-2 rounded-lg text-xs font-bold transition ${tab==='sebha'?'bg-white shadow text-emerald-700':'text-gray-500'}`}>☝️ السبحة</button>
            </div>

            {tab === 'azkar' && window.APP_DATA.azkar && (
                <div className="space-y-3 max-h-[400px] overflow-y-auto p-1 custom-scroll">
                    {window.APP_DATA.azkar.map((z, i) => (
                        <div key={i} onClick={() => handleClick(i)} 
                             className={`bg-white p-4 rounded-xl border-r-4 shadow-sm cursor-pointer transition relative overflow-hidden ${counts[i] === 0 ? 'border-gray-300 opacity-60 bg-green-50' : 'border-emerald-500 active:scale-95'}`}>
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[10px] bg-gray-100 px-2 py-1 rounded font-bold text-gray-600">{z.category}</span>
                                <span className={`text-xs font-black px-3 py-1 rounded-full ${counts[i]===0?'bg-green-100 text-green-700':'bg-emerald-600 text-white'}`}>
                                    {counts[i] === 0 ? 'تم ✅' : counts[i]}
                                </span>
                            </div>
                            <p className="font-amiri text-lg leading-loose text-gray-800">{z.zekr}</p>
                            {z.description && <p className="text-[10px] text-gray-400 mt-2 border-t pt-1">{z.description}</p>}
                        </div>
                    ))}
                </div>
            )}

            {tab === 'sebha' && (
                <div className="text-center py-8">
                    <div className="sebha-circle" onClick={() => {setSebhaCount(c=>c+1); if(navigator.vibrate) navigator.vibrate(30);}}>
                        {sebhaCount}
                    </div>
                    <div className="flex justify-center gap-4 mt-8">
                        <button onClick={() => setSebhaCount(c => c > 0 ? c - 1 : 0)} className="bg-gray-200 px-5 py-2 rounded-full font-bold text-xs text-gray-600 shadow-sm">↩️ تراجع</button>
                        <button onClick={() => setSebhaCount(0)} className="bg-red-50 px-5 py-2 rounded-full font-bold text-red-600 text-xs shadow-sm">🔄 تصفير</button>
                    </div>
                </div>
            )}
        </div>
    );
};
