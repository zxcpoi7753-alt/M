/* =========================================
   ملف الميزات: js/features.js
   الوظيفة: المنطق الذكي (الحاسبات، المصحف، الاختبار)
   ========================================= */

const { useState, useEffect, useRef } = React;

// ------------------------------------------------------------
// 1. حاسبة جهد الطالب (By Effort) - نظام الخطوات
// ------------------------------------------------------------
window.CalcEffort = () => {
    const [step, setStep] = useState(1);
    const [days, setDays] = useState(null);
    const [amount, setAmount] = useState(null);
    const [completed, setCompleted] = useState(0);
    const [result, setResult] = useState(null);
    const [showMaxWarning, setShowMaxWarning] = useState(false); // تحذير العجلة

    // خيارات المقدار
    const presetAmounts = [0.5, 1, 2, 3, 4, 5];

    const handleCustomAmount = (val) => {
        let v = parseFloat(val);
        if (isNaN(v)) return;
        
        // القيد: الحد الأقصى 3 ختمات (تقريباً 1812 صفحة، لكن سنضع حداً منطقياً للحفظ مثلاً 20 صفحة للحفظ، و 1812 للتلاوة)
        // هنا سنفترض أن المستخدم قد يدخل عدداً كبيراً للتلاوة
        if (v > 1812) { 
            setShowMaxWarning(true);
            setTimeout(() => setShowMaxWarning(false), 6000);
            setAmount(1812); 
        } else if (v < 0.1) {
            setAmount(0.1);
        } else {
            setAmount(v);
        }
    };

    const calculate = () => {
        const totalPages = 604 - (completed * 20); 
        if (totalPages <= 0) return alert("مبارك! أنت خاتم للقرآن أصلاً 🎉");

        const weeklyOutput = amount * days;
        const totalWeeks = totalPages / weeklyOutput;
        const totalDays = totalWeeks * 7;

        let resText = "";
        if (totalDays < 30) {
            resText = `${Math.ceil(totalDays)} يوم`;
        } else if (totalDays < 365) {
            resText = `${Math.floor(totalDays / 30)} شهر و ${Math.ceil(totalDays % 30)} يوم`;
        } else {
            resText = `${Math.floor(totalDays / 365)} سنة و ${Math.floor((totalDays % 365) / 30)} شهر`;
        }
        setResult(resText);
    };

    return (
        <div className="feature-container animate-in">
            {/* تنبيه العجلة - يظهر عند تخطي الحد */}
            {showMaxWarning && (
                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-4 rounded shadow-sm animate-in">
                    <p className="font-amiri text-lg text-amber-900 text-center font-bold">﴿ وَلَا تَعْجَلْ بِالْقُرْآنِ مِن قَبْلِ أَن يُقْضَىٰ إِلَيْكَ وَحْيُهُ ﴾</p>
                    <p className="text-xs text-amber-700 text-center mt-1">الحد الأقصى اليومي هو 3 ختمات</p>
                </div>
            )}

            {/* الخطوة 1: الأيام */}
            {step === 1 && (
                <div className="text-center">
                    <h4 className="font-bold text-emerald-800 mb-4 text-sm">1️⃣ كم يوماً تحفظ في الأسبوع؟</h4>
                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {[1, 2, 3, 4, 5, 6, 7].map(d => (
                            <button key={d} onClick={() => { setDays(d); setStep(2); }} className="aspect-square rounded-xl bg-gray-50 hover:bg-emerald-600 hover:text-white border font-black transition text-sm">
                                {d}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* الخطوة 2: المقدار */}
            {step === 2 && (
                <div className="text-center animate-in">
                    <h4 className="font-bold text-emerald-800 mb-4 text-sm">2️⃣ كم مقدار الحفظ اليومي؟ (صفحات)</h4>
                    <div className="grid grid-cols-3 gap-2 mb-4">
                        {presetAmounts.map(a => (
                            <button key={a} onClick={() => { setAmount(a); }} className={`py-2 rounded-xl border font-bold transition text-sm ${amount === a ? 'bg-emerald-600 text-white shadow-md' : 'bg-white hover:bg-gray-50'}`}>
                                {a}
                            </button>
                        ))}
                    </div>
                    <div className="mb-4">
                        <input type="number" step="0.1" className="w-full p-2 border rounded-xl text-center font-black outline-none bg-gray-50 text-sm" 
                               placeholder="أو اكتب رقماً.." 
                               onChange={(e) => handleCustomAmount(e.target.value)}
                               value={amount || ''} />
                    </div>
                    {amount && <button onClick={() => setStep(3)} className="w-full bg-emerald-600 text-white py-2 rounded-xl font-bold shadow text-sm">التالي ⬅️</button>}
                </div>
            )}

            {/* الخطوة 3: الأجزاء والحساب */}
            {step === 3 && (
                <div className="text-center animate-in">
                    <h4 className="font-bold text-emerald-800 mb-4 text-sm">3️⃣ الجزء الذي تريد البدء منه؟</h4>
                    <p className="text-[10px] text-gray-400 mb-2">عدد الأجزاء التي أتممتها (0 - 30)</p>
                    <input type="number" max="30" min="0" className="w-full p-2 border rounded-xl text-center font-black mb-4 bg-gray-50" 
                           value={completed} 
                           onChange={(e) => setCompleted(Math.min(30, Math.max(0, parseInt(e.target.value) || 0)))} />
                    
                    <button onClick={calculate} className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold shadow-lg mb-4 text-sm">احسب النتيجة 🏁</button>

                    {result && (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 animate-in">
                            <p className="text-gray-600 text-xs font-bold mb-2">بناءً على جهدك، ستختم خلال:</p>
                            <h3 className="text-xl font-black text-emerald-800 mb-2">{result}</h3>
                            <button onClick={() => alert("اللهم ارحمني بالقرآن واجعله لي إماماً ونوراً وهدىً ورحمة..")} 
                                    className="bg-amber-400 text-white text-[10px] font-bold px-4 py-1 rounded-full shadow hover:bg-amber-500 mt-2">
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

// ------------------------------------------------------------
// 2. حاسبة الوقت (By Time)
// ------------------------------------------------------------
window.CalcTime = () => {
    const [y, setY] = useState(0); // السنة تبدأ من 0 بشكل افتراضي
    const [m, setM] = useState(0);
    const [d, setD] = useState(0);
    const [result, setResult] = useState(null);
    const [showDelayMsg, setShowDelayMsg] = useState(false);

    const calculate = () => {
        let years = parseInt(y) || 0;
        let months = parseInt(m) || 0;
        let days = parseInt(d) || 0;

        // القيد: الحد الأقصى 15 سنة
        if (years >= 15) {
            setShowDelayMsg(true);
            years = 15; // نثبتها على 15
        } else {
            setShowDelayMsg(false);
        }

        const totalDays = (years * 365) + (months * 30) + days;
        if (totalDays <= 0) return alert("الرجاء تحديد مدة زمنية");

        const dailyPages = (604 / totalDays).toFixed(1);
        setResult(dailyPages);
    };

    return (
        <div className="feature-container animate-in">
            <h4 className="text-center font-bold text-amber-800 mb-4 text-sm">🎯 حدد المدة.. ونحدد لك الورد</h4>
            
            <div className="flex gap-2 mb-4">
                <div className="flex-1">
                    <label className="text-[10px] font-bold block text-center text-gray-400">سنة (0-15)</label>
                    <select className="w-full p-2 border rounded-lg font-bold text-center bg-gray-50 text-sm" value={y} onChange={e => setY(e.target.value)}>
                        {[...Array(16).keys()].map(i => <option key={i} value={i}>{i}</option>)}
                    </select>
                </div>
                <div className="flex-1">
                    <label className="text-[10px] font-bold block text-center text-gray-400">شهر</label>
                    <select className="w-full p-2 border rounded-lg font-bold text-center bg-gray-50 text-sm" value={m} onChange={e => setM(e.target.value)}>
                        {[...Array(13).keys()].map(i => <option key={i} value={i}>{i}</option>)}
                    </select>
                </div>
                <div className="flex-1">
                    <label className="text-[10px] font-bold block text-center text-gray-400">يوم</label>
                    <select className="w-full p-2 border rounded-lg font-bold text-center bg-gray-50 text-sm" value={d} onChange={e => setD(e.target.value)}>
                        {[...Array(32).keys()].map(i => <option key={i} value={i}>{i}</option>)}
                    </select>
                </div>
            </div>

            <button onClick={calculate} className="w-full bg-amber-500 text-white py-3 rounded-xl font-bold shadow-lg mb-4 text-sm">احسب خطتي ⏱️</button>

            {/* رسالة التأخير عند اختيار 15 سنة فأكثر */}
            {showDelayMsg && (
                <div className="bg-blue-50 border border-blue-200 p-2 rounded-lg mb-3 animate-in text-center">
                    <p className="font-amiri text-base text-blue-800 font-bold">«وَمَن تَأَخَّرَ فَلَا إِثْمَ عَلَيْهِ ۚ لِمَنِ اتَّقَىٰ»</p>
                    <p className="text-[10px] text-blue-600 font-bold">التأخير ليس حرجاً ما دمت مستمراً</p>
                </div>
            )}

            {result && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center animate-in">
                    <p className="text-gray-600 text-xs font-bold mb-2">لكي تختم في هذا الوقت، عليك قراءة:</p>
                    <h3 className="text-2xl font-black text-amber-600 mb-2">{result} <span className="text-xs text-gray-500">صفحة يومياً</span></h3>
                    <button onClick={() => alert("اللهم ارحمني بالقرآن واجعله لي إماماً ونوراً وهدىً ورحمة..")} 
                            className="bg-emerald-600 text-white text-[10px] font-bold px-4 py-1 rounded-full shadow hover:bg-emerald-700 mt-2">
                        🤲 دعاء الختمة
                    </button>
                </div>
            )}
        </div>
    );
};

// ------------------------------------------------------------
// 3. الممتحن الآلي (TestHifz)
// ------------------------------------------------------------
window.TestHifz = () => {
    const [step, setStep] = useState('menu');
    const [qType, setQType] = useState('complete');
    const [qData, setQData] = useState(null);
    const [showDetails, setShowDetails] = useState(false);

    const generateQuestion = (type = 'complete', nextAyahIndex = null) => {
        if (!window.APP_DATA || !window.APP_DATA.quran) return alert("البيانات قيد التحميل...");
        const quran = window.APP_DATA.quran;
        const keys = Object.keys(quran); 
        
        let sNum, aNum, surahObj;
        if (nextAyahIndex && qData) {
            sNum = qData.surahNum; surahObj = quran[sNum]; aNum = nextAyahIndex + 1;
            if (aNum > surahObj.ayahCount) return alert("انتهت السورة");
        } else {
            sNum = keys[Math.floor(Math.random() * keys.length)];
            surahObj = quran[sNum];
            aNum = Math.floor(Math.random() * surahObj.ayahCount) + 1;
            if (type === 'prev' && aNum === 1) aNum = 2;
        }

        const ayahObj = surahObj.ayahs.find(a => a.num == aNum);
        const prevAyahObj = (type === 'prev' || showDetails) ? surahObj.ayahs.find(a => a.num == aNum - 1) : null;
        
        let pageNum = "-";
        if(window.APP_DATA.pages) {
            const p = window.APP_DATA.pages.find(pg => (pg.start.surah_number < sNum || (pg.start.surah_number == sNum && pg.start.verse <= aNum)) && (pg.end.surah_number > sNum || (pg.end.surah_number == sNum && pg.end.verse >= aNum)));
            if(p) pageNum = p.page;
        }

        setQData({ surahNum: sNum, surahName: surahObj.name, ayahNum: aNum, text: ayahObj.text, prevText: prevAyahObj?.text, page: pageNum });
        setQType(type); setStep('question'); setShowDetails(false);
    };

    return (
        <div className="feature-container">
            {step === 'menu' && (
                <div className="flex flex-col gap-2">
                    <button onClick={() => generateQuestion('complete')} className="test-option-btn text-emerald-700 text-sm">🧩 أكمل الآية (عشوائي)</button>
                    <button onClick={() => generateQuestion('next')} className="test-option-btn text-blue-700 text-sm">⬅️ ما الآية التالية؟</button>
                    <button onClick={() => generateQuestion('prev')} className="test-option-btn text-amber-700 text-sm">➡️ ما الآية السابقة؟</button>
                </div>
            )}
            {step === 'question' && qData && (
                <div className="text-center animate-in">
                    <div className="bg-white border rounded-xl p-4 mb-4 shadow-sm">
                        <p className="text-[10px] font-bold text-gray-400 mb-2">{qType === 'prev' ? 'ما الآية السابقة لـ:' : 'أكمل بعد:'}</p>
                        <p className="font-amiri text-xl text-gray-800 leading-loose">
                            {qType === 'prev' ? `(الآية ${qData.ayahNum} من ${qData.surahName})` : `"${qData.text}"`}
                        </p>
                    </div>
                    {!showDetails ? (
                        <button onClick={() => setShowDetails(true)} className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-lg text-sm">👁️ كشف الإجابة</button>
                    ) : (
                        <div className="bg-white border rounded-xl p-4 animate-in mt-2">
                            <div className="text-right text-xs font-bold text-gray-700 mb-3 border-b pb-2">
                                <p>📖 السورة: <span className="text-emerald-700">{qData.surahName}</span></p>
                                <p>🔢 الآية: {qData.ayahNum} | الصفحة: {qData.page}</p>
                                {qType === 'prev' && <p className="mt-2 font-amiri text-lg text-emerald-800">{qData.prevText}</p>}
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => generateQuestion('complete', qData.ayahNum)} className="flex-1 bg-blue-100 text-blue-700 py-2 rounded font-bold text-xs">التالية ⬅️</button>
                                <button onClick={() => setStep('menu')} className="flex-1 bg-gray-100 py-2 rounded font-bold text-xs">سؤال جديد 🔄</button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// ------------------------------------------------------------
// 4. المصحف الشريف (QuranReader) - التصميم النظيف المتصل
// ------------------------------------------------------------
window.QuranReader = () => {
    const [view, setView] = useState('list');
    const [activeSurah, setActiveSurah] = useState(null);
    const [bookmark, setBookmark] = useState(JSON.parse(localStorage.getItem('quran_bookmark')) || null);
    const [search, setSearch] = useState('');
    const [fontSize, setFontSize] = useState(2.0); // حجم الخط الافتراضي

    const openSurah = (id) => {
        if (!window.APP_DATA.quran) return;
        setActiveSurah({ id, ...window.APP_DATA.quran[id] });
        setView('reader');
    };

    const saveBookmark = (ayahNum) => {
        const data = { surahId: activeSurah.id, surahName: activeSurah.name, ayahNum };
        localStorage.setItem('quran_bookmark', JSON.stringify(data));
        setBookmark(data);
        if(navigator.vibrate) navigator.vibrate(50);
        alert(`تم حفظ العلامة عند الآية ${ayahNum}`);
    };

    const resume = () => {
        if (!bookmark) return;
        openSurah(bookmark.surahId);
        setTimeout(() => {
            const el = document.getElementById(`ayah-${bookmark.ayahNum}`);
            if(el) {
                el.scrollIntoView({behavior: 'smooth', block: 'center'});
                el.classList.add('bg-yellow-100');
                setTimeout(()=>el.classList.remove('bg-yellow-100'), 2000);
            }
        }, 300);
    };

    // فلترة السور
    const filteredSurahs = window.APP_DATA.quran ? Object.keys(window.APP_DATA.quran).filter(id => 
        window.APP_DATA.quran[id].name.includes(search)
    ) : [];

    return (
        <div className="feature-container p-0 overflow-hidden bg-white h-[600px] flex flex-col border border-gray-200">
            {view === 'list' && (
                <div className="p-4 flex flex-col h-full">
                    {bookmark && (
                        <button onClick={resume} className="w-full bg-emerald-50 text-emerald-900 border border-emerald-200 p-3 rounded-xl mb-3 font-bold flex justify-between items-center shadow-sm text-xs">
                            <span>🔖 استكمل: {bookmark.surahName} (آية {bookmark.ayahNum})</span>
                            <span>⬅️</span>
                        </button>
                    )}
                    
                    <input type="text" placeholder="🔍 ابحث عن سورة..." className="w-full p-3 border rounded-xl mb-3 font-bold text-sm bg-gray-50 outline-none focus:border-emerald-500" value={search} onChange={e => setSearch(e.target.value)} />
                    
                    <div className="grid grid-cols-3 gap-2 overflow-y-auto flex-1 pb-4 content-start custom-scroll">
                        {filteredSurahs.map(id => (
                            <button key={id} onClick={() => openSurah(id)} className="bg-white p-2 rounded-lg border text-center shadow-sm hover:bg-emerald-50 h-20 flex flex-col items-center justify-center transition">
                                <span className="text-[10px] text-gray-400 font-bold block">{id}</span>
                                <span className="font-bold text-emerald-800 text-sm">{window.APP_DATA.quran[id].name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {view === 'reader' && activeSurah && (
                <div className="flex flex-col h-full bg-white">
                    {/* شريط الأدوات */}
                    <div className="bg-white border-b p-2 flex justify-between items-center shadow-sm z-20 sticky top-0">
                        <button onClick={() => setView('list')} className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg font-bold border">فهرس</button>
                        <span className="font-bold text-sm text-emerald-800">سورة {activeSurah.name}</span>
                        <div className="flex items-center gap-1 bg-gray-100 rounded-lg px-1 border">
                            <button onClick={() => setFontSize(f => Math.max(1, f - 0.2))} className="text-lg font-bold px-2 text-gray-600">-</button>
                            <span className="text-[10px] text-gray-400">حجم</span>
                            <button onClick={() => setFontSize(f => Math.min(4, f + 0.2))} className="text-lg font-bold px-2 text-gray-600">+</button>
                        </div>
                    </div>

                    {/* منطقة القراءة (نص متصل + خلفية بيضاء نظيفة) */}
                    <div className="flex-1 overflow-y-auto p-5 bg-white relative leading-loose text-justify custom-scroll" dir="rtl">
                        {activeSurah.id !== "1" && activeSurah.id !== "9" && (
                            <div className="text-center font-amiri text-xl mb-6 text-emerald-800">بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ</div>
                        )}
                        
                        <div style={{ fontSize: `${fontSize}rem`, lineHeight: '1.9' }} className="font-amiri text-gray-800 text-justify">
                            {activeSurah.ayahs.map(ayah => (
                                <span key={ayah.num} id={`ayah-${ayah.num}`} className="inline">
                                    {ayah.text} 
                                    {/* علامة الآية (دائرة مزخرفة بسيطة) */}
                                    <span 
                                        onClick={(e) => { e.stopPropagation(); saveBookmark(ayah.num); }}
                                        className="inline-flex items-center justify-center text-[0.45em] w-[1.8em] h-[1.8em] border border-emerald-600 rounded-full mx-1 text-emerald-700 bg-white cursor-pointer align-middle relative top-[-2px] hover:bg-emerald-100 select-none"
                                        title="حفظ العلامة"
                                    >
                                        {ayah.num}
                                        {bookmark?.surahId === activeSurah.id && bookmark?.ayahNum === ayah.num && <span className="absolute -top-3 text-amber-500 text-lg">🔖</span>}
                                    </span>
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

// ------------------------------------------------------------
// 5. الأذكار والسبحة (كما هي - ممتازة)
// ------------------------------------------------------------
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

    const clickZekr = (i) => {
        if(counts[i] > 0) {
            setCounts(prev => ({...prev, [i]: prev[i]-1}));
            if(navigator.vibrate) navigator.vibrate(20);
        }
    };

    return (
        <div className="feature-container p-4">
            <div className="flex gap-2 bg-gray-100 p-1 rounded-xl mb-4">
                <button onClick={() => setTab('azkar')} className={`flex-1 py-2 rounded-lg text-xs font-bold ${tab==='azkar'?'bg-white shadow text-emerald-700':'text-gray-500'}`}>📿 الأذكار</button>
                <button onClick={() => setTab('sebha')} className={`flex-1 py-2 rounded-lg text-xs font-bold ${tab==='sebha'?'bg-white shadow text-emerald-700':'text-gray-500'}`}>☝️ السبحة</button>
            </div>

            {tab === 'azkar' && window.APP_DATA.azkar && (
                <div className="space-y-3 max-h-[350px] overflow-y-auto custom-scroll">
                    {window.APP_DATA.azkar.map((z, i) => (
                        <div key={i} onClick={() => clickZekr(i)} className={`bg-white p-4 rounded-xl border-r-4 shadow-sm cursor-pointer transition ${counts[i] === 0 ? 'opacity-50 border-gray-300' : 'border-emerald-500 active:scale-95'}`}>
                            <div className="flex justify-between mb-2">
                                <span className="text-[10px] bg-gray-100 px-2 py-1 rounded">{z.category}</span>
                                <span className={`text-xs font-black px-3 py-1 rounded-full ${counts[i]===0?'bg-green-100 text-green-700':'bg-emerald-600 text-white'}`}>{counts[i]===0?'تم ✅':counts[i]}</span>
                            </div>
                            <p className="font-amiri text-lg leading-loose">{z.zekr}</p>
                        </div>
                    ))}
                </div>
            )}

            {tab === 'sebha' && (
                <div className="text-center py-6">
                    <div className="sebha-circle" onClick={() => {setSebhaCount(c=>c+1); if(navigator.vibrate) navigator.vibrate(30);}}>
                        {sebhaCount}
                    </div>
                    <div className="flex justify-center gap-4 mt-6">
                        <button onClick={() => setSebhaCount(c => c > 0 ? c - 1 : 0)} className="bg-gray-200 px-4 py-2 rounded-full font-bold text-xs text-gray-600">↩️ تراجع</button>
                        <button onClick={() => setSebhaCount(0)} className="bg-red-50 px-4 py-2 rounded-full font-bold text-red-600 text-xs">🔄 تصفير</button>
                    </div>
                </div>
            )}
        </div>
    );
};
