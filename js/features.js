/* =========================================
   ملف الميزات: js/features.js
   الوظيفة: يحتوي على منطق (الاختبار، المصحف، الأذكار)
   ========================================= */

const { useState, useEffect, useRef } = React;

// ------------------------------------------------------------
// 1. مكون اختبار الحفظ (TestHifz)
// ------------------------------------------------------------
window.TestHifz = () => {
    const [step, setStep] = useState('menu'); // menu, question
    const [qType, setQType] = useState('complete'); // complete, next, prev
    const [qData, setQData] = useState(null);
    const [showDetails, setShowDetails] = useState(false);

    // دالة توليد السؤال
    const generateQuestion = (type = 'complete', nextAyahIndex = null) => {
        // التأكد من وجود البيانات
        if (!window.APP_DATA || !window.APP_DATA.quran) return alert("جاري تحميل بيانات المصحف... حاول بعد ثوانٍ");

        const quran = window.APP_DATA.quran;
        
        // تحديد نطاق البحث (هنا نجعله شاملاً لكل السور المحملة)
        // يمكنك تخصيص النطاق (مثلاً الجزء 30) بتغيير الفلتر:
        // const keys = Object.keys(quran).filter(k => k >= 78);
        const keys = Object.keys(quran);
        
        if (keys.length === 0) return alert("لا توجد بيانات سور متاحة حالياً");

        let sNum, aNum, surahObj;

        if (nextAyahIndex !== null && qData) {
            // حالة "الآية التالية" (زر تابع)
            sNum = qData.surahNum;
            surahObj = quran[sNum];
            aNum = nextAyahIndex + 1;
            if (aNum > surahObj.ayahCount) return alert("انتهت السورة! اختر سؤالاً جديداً.");
        } else {
            // سؤال عشوائي جديد
            sNum = keys[Math.floor(Math.random() * keys.length)];
            surahObj = quran[sNum];
            aNum = Math.floor(Math.random() * surahObj.ayahCount) + 1;
            
            // تصحيح: إذا كان السؤال "ما السابق" والآية هي الأولى، نختار الآية 2
            if (type === 'prev' && aNum === 1) aNum = 2;
        }

        // جلب نص الآية
        const ayahObj = surahObj.ayahs.find(a => a.num == aNum);
        const prevAyahObj = (type === 'prev' || showDetails) ? surahObj.ayahs.find(a => a.num == aNum - 1) : null;

        // البحث عن رقم الصفحة في ملف pagesquran.json
        let pageNum = "غير محدد";
        if (window.APP_DATA.pages) {
            // منطق بحث مبسط عن الصفحة بناءً على السورة والآية
            const p = window.APP_DATA.pages.find(page => {
                // هذا المنطق يفترض أن هيكلة json للصفحات تحتوي على start و end
                return (page.start.surah_number < sNum || (page.start.surah_number == sNum && page.start.verse <= aNum)) &&
                       (page.end.surah_number > sNum || (page.end.surah_number == sNum && page.end.verse >= aNum));
            });
            if (p) pageNum = p.page;
        }

        setQData({
            surahNum: sNum,
            surahName: surahObj.name,
            ayahNum: aNum,
            text: ayahObj.text,
            prevText: prevAyahObj ? prevAyahObj.text : null,
            page: pageNum
        });
        setQType(type);
        setStep('question');
        setShowDetails(false);
    };

    return (
        <div className="feature-container">
            {step === 'menu' && (
                <div className="flex flex-col gap-2">
                    <button onClick={() => generateQuestion('complete')} className="test-option-btn text-emerald-700">🧩 أكمل الآية (عشوائي)</button>
                    <button onClick={() => generateQuestion('next')} className="test-option-btn text-blue-700">⬅️ ما الآية التالية؟</button>
                    <button onClick={() => generateQuestion('prev')} className="test-option-btn text-amber-700">➡️ ما الآية السابقة؟</button>
                </div>
            )}

            {step === 'question' && qData && (
                <div className="text-center animate-in">
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
                        <p className="text-xs font-bold text-gray-400 mb-2">
                            {qType === 'prev' ? 'ما الآية التي قبل هذه الآية:' : 'أكمل بعد هذه الآية:'}
                        </p>
                        <p className="quran-text text-xl mb-2">
                            {qType === 'prev' 
                                ? `(الآية ${qData.ayahNum} من سورة ${qData.surahName})` 
                                : `"${qData.text}"`}
                        </p>
                    </div>

                    {!showDetails ? (
                        <button onClick={() => setShowDetails(true)} className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-lg active:scale-95 transition">
                            👁️ كشف الإجابة والتفاصيل
                        </button>
                    ) : (
                        <div className="bg-white border rounded-xl p-4 animate-in">
                            <div className="text-right space-y-2 text-sm font-bold text-gray-700 mb-4 border-b pb-4">
                                <div className="flex justify-between"><span>📖 السورة:</span> <span className="text-emerald-700">{qData.surahName}</span></div>
                                <div className="flex justify-between"><span>🔢 رقم الآية:</span> <span>{qData.ayahNum}</span></div>
                                <div className="flex justify-between"><span>📄 الصفحة:</span> <span>{qData.page}</span></div>
                                
                                {qType === 'prev' && (
                                    <div className="mt-2 pt-2 border-t border-gray-100">
                                        <p className="text-xs text-gray-400">نص الآية السابقة:</p>
                                        <p className="quran-text text-lg text-emerald-800">{qData.prevText}</p>
                                    </div>
                                )}
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2">
                                <button onClick={() => generateQuestion('complete', qData.ayahNum)} className="py-2 bg-blue-100 text-blue-700 rounded-lg font-bold text-sm">تابع (التالية) ⬅️</button>
                                <button onClick={() => setStep('menu')} className="py-2 bg-gray-100 text-gray-600 rounded-lg font-bold text-sm">سؤال جديد 🔄</button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// ------------------------------------------------------------
// 2. مكون المصحف (QuranReader)
// ------------------------------------------------------------
window.QuranReader = () => {
    const [view, setView] = useState('list'); // list, reader
    const [activeSurah, setActiveSurah] = useState(null);
    const [bookmark, setBookmark] = useState(JSON.parse(localStorage.getItem('quran_bookmark')) || null);

    const openSurah = (id) => {
        if (!window.APP_DATA.quran) return;
        setActiveSurah({ id, ...window.APP_DATA.quran[id] });
        setView('reader');
    };

    const saveBookmark = (ayahNum) => {
        const data = { surahId: activeSurah.id, surahName: activeSurah.name, ayahNum };
        localStorage.setItem('quran_bookmark', JSON.stringify(data));
        setBookmark(data);
        // استخدام التوست الأصلي للعرض (سيتم تمريره عبر الأحداث مستقبلاً أو window.alert للتبسيط الآن)
        if(navigator.vibrate) navigator.vibrate(50);
        alert("تم حفظ العلامة 🔖");
    };

    const resume = () => {
        if (!bookmark) return;
        openSurah(bookmark.surahId);
        // التمرير التلقائي بعد رسم العناصر
        setTimeout(() => {
            const el = document.getElementById(`ayah-${bookmark.ayahNum}`);
            if(el) el.scrollIntoView({behavior: 'smooth', block: 'center'});
        }, 300);
    };

    return (
        <div className="feature-container p-0 overflow-hidden bg-gray-50">
            {view === 'list' && (
                <div className="p-4">
                    {bookmark && (
                        <button onClick={resume} className="w-full bg-amber-100 text-amber-900 border border-amber-300 p-3 rounded-xl mb-4 font-bold flex justify-between items-center shadow-sm">
                            <span>🔖 استكمل: {bookmark.surahName} (آية {bookmark.ayahNum})</span>
                            <span>⬅️</span>
                        </button>
                    )}
                    <h3 className="font-bold text-gray-500 mb-2 text-sm">فهرس السور:</h3>
                    <div className="grid grid-cols-3 gap-2 max-h-[400px] overflow-y-auto pb-4">
                        {window.APP_DATA.quran && Object.keys(window.APP_DATA.quran).map(id => (
                            <button key={id} onClick={() => openSurah(id)} className="bg-white p-3 rounded-lg border text-center shadow-sm active:bg-emerald-50">
                                <span className="block text-[10px] text-gray-400 font-bold">{id}</span>
                                <span className="font-bold text-emerald-800 text-sm">{window.APP_DATA.quran[id].name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {view === 'reader' && activeSurah && (
                <div className="flex flex-col h-[500px]">
                    <div className="bg-emerald-800 text-white p-3 flex justify-between items-center shadow-md z-10">
                        <button onClick={() => setView('list')} className="text-xs bg-emerald-900 px-3 py-1.5 rounded-lg font-bold">فهرس</button>
                        <span className="font-bold text-sm">سورة {activeSurah.name}</span>
                        <span className="text-xs opacity-80">{activeSurah.ayahCount} آية</span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 bg-white relative">
                        {activeSurah.id !== "1" && activeSurah.id !== "9" && (
                            <div className="text-center font-amiri text-xl mb-6 text-emerald-800">بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ</div>
                        )}
                        {activeSurah.ayahs.map(ayah => (
                            <div key={ayah.num} id={`ayah-${ayah.num}`} className="relative border-b border-gray-100 pb-6 mb-4 last:border-0">
                                <p className="quran-text text-right text-xl leading-loose">
                                    {ayah.text} 
                                    <span className="text-emerald-600 text-sm font-sans border border-emerald-200 rounded-full px-2 mx-1 bg-emerald-50 inline-block align-middle">{ayah.num}</span>
                                </p>
                                <button 
                                    onClick={() => saveBookmark(ayah.num)} 
                                    className="absolute left-0 -bottom-3 text-gray-300 hover:text-amber-500 bg-white border px-2 py-1 rounded-full text-xs shadow-sm transition"
                                >
                                    🔖 حفظ
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// ------------------------------------------------------------
// 3. مكون الأذكار والسبحة (AzkarApp)
// ------------------------------------------------------------
window.AzkarApp = () => {
    const [tab, setTab] = useState('azkar'); // azkar, sebha
    const [counts, setCounts] = useState({});
    const [sebhaCount, setSebhaCount] = useState(0);

    // تهيئة العدادات عند التحميل
    useEffect(() => {
        if (window.APP_DATA.azkar) {
            const initialCounts = {};
            window.APP_DATA.azkar.forEach((z, i) => initialCounts[i] = z.count || 0);
            setCounts(initialCounts);
        }
    }, []);

    const handleZekrClick = (index) => {
        if (counts[index] > 0) {
            setCounts(prev => ({ ...prev, [index]: prev[index] - 1 }));
            if (navigator.vibrate) navigator.vibrate(20);
        }
    };

    return (
        <div className="feature-container p-4">
            <div className="flex gap-2 bg-gray-100 p-1 rounded-xl mb-4">
                <button onClick={() => setTab('azkar')} className={`flex-1 py-2 rounded-lg text-xs font-bold transition ${tab==='azkar'?'bg-white shadow text-emerald-700':'text-gray-500'}`}>📿 الأذكار المقيدة</button>
                <button onClick={() => setTab('sebha')} className={`flex-1 py-2 rounded-lg text-xs font-bold transition ${tab==='sebha'?'bg-white shadow text-emerald-700':'text-gray-500'}`}>☝️ السبحة الحرة</button>
            </div>

            {tab === 'azkar' && window.APP_DATA.azkar && (
                <div className="space-y-3 max-h-[350px] overflow-y-auto p-1">
                    {window.APP_DATA.azkar.map((z, i) => (
                        <div 
                            key={i} 
                            onClick={() => handleZekrClick(i)} 
                            className={`bg-white p-4 rounded-xl border-r-4 shadow-sm cursor-pointer transition relative overflow-hidden ${counts[i] === 0 ? 'border-gray-300 opacity-60' : 'border-emerald-500 active:scale-95'}`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded font-bold">{z.category}</span>
                                <span className={`text-xs font-black px-3 py-1 rounded-full ${counts[i]===0?'bg-green-100 text-green-700':'bg-emerald-600 text-white'}`}>
                                    {counts[i] === 0 ? 'تم ✅' : counts[i]}
                                </span>
                            </div>
                            <p className="font-amiri text-base leading-loose text-gray-800">{z.zekr}</p>
                            {z.description && <p className="text-[10px] text-gray-400 mt-2 border-t pt-1">{z.description}</p>}
                        </div>
                    ))}
                </div>
            )}

            {tab === 'sebha' && (
                <div className="text-center py-4">
                    <div 
                        className="sebha-circle" 
                        onClick={() => { setSebhaCount(c => c+1); if(navigator.vibrate) navigator.vibrate(30); }}
                    >
                        {sebhaCount}
                    </div>
                    <p className="text-gray-400 text-xs font-bold mb-6">اضغط داخل الدائرة للتسبيح</p>
                    <div className="flex justify-center gap-4">
                        <button onClick={() => setSebhaCount(c => c > 0 ? c - 1 : 0)} className="bg-gray-200 px-4 py-2 rounded-full font-bold text-gray-600 text-xs">↩️ تراجع</button>
                        <button onClick={() => setSebhaCount(0)} className="bg-red-50 px-4 py-2 rounded-full font-bold text-red-600 text-xs">🔄 تصفير</button>
                    </div>
                </div>
            )}
        </div>
    );
};
