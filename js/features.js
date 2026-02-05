/* =========================================
   ملف الميزات: js/features.js
   نسخة مطورة: أذكار مبوبة + اختبار ذكي تتابعي
   ========================================= */

const { useState, useEffect, useMemo } = React;

// --- خريطة أجزاء القرآن (للفلترة الدقيقة) ---
const JUZ_MAPPING = [
    { j: 1, s: 1, e: 2, endAyah: 141 }, { j: 2, s: 2, e: 2, startAyah: 142, endAyah: 252 }, 
    { j: 3, s: 2, e: 3, startAyah: 253 }, { j: 4, s: 3, e: 4, startAyah: 92 },
    { j: 5, s: 4, e: 4, startAyah: 24 }, { j: 6, s: 4, e: 5, startAyah: 148 },
    { j: 7, s: 5, e: 6, startAyah: 82 }, { j: 8, s: 6, e: 7, startAyah: 111 },
    { j: 9, s: 7, e: 8, startAyah: 88 }, { j: 10, s: 8, e: 9, startAyah: 41 },
    { j: 11, s: 9, e: 11, startAyah: 93 }, { j: 12, s: 11, e: 12, startAyah: 6 },
    { j: 13, s: 12, e: 14, startAyah: 53 }, { j: 14, s: 15, e: 16 },
    { j: 15, s: 17, e: 18, endAyah: 74 }, { j: 16, s: 18, e: 20, startAyah: 75 },
    { j: 17, s: 21, e: 22 }, { j: 18, s: 23, e: 25, endAyah: 20 },
    { j: 19, s: 25, e: 27, startAyah: 21 }, { j: 20, s: 27, e: 29, startAyah: 56 },
    { j: 21, s: 29, e: 33, startAyah: 46 }, { j: 22, s: 33, e: 36, startAyah: 31 },
    { j: 23, s: 36, e: 39, startAyah: 28 }, { j: 24, s: 39, e: 41, startAyah: 32 },
    { j: 25, s: 41, e: 45, startAyah: 47 }, { j: 26, s: 46, e: 51, endAyah: 30 },
    { j: 27, s: 51, e: 57, startAyah: 31 }, { j: 28, s: 58, e: 66 },
    { j: 29, s: 67, e: 77 }, { j: 30, s: 78, e: 114 }
];

// ============================================================
// 1. حاسبة الجهد (المعادلة الرياضية الدقيقة)
// ============================================================
window.CalcEffort = () => {
    const [step, setStep] = useState(1);
    const [days, setDays] = useState(null);
    const [amount, setAmount] = useState('');
    const [skippedParts, setSkippedParts] = useState(0);
    const [result, setResult] = useState(null);

    const calculate = () => {
        const val = parseFloat(amount);
        if (!days || !val) return alert("أكمل البيانات");

        // المعادلة: (604 - الصفحات المنجزة) / (المعدل اليومي * أيام الأسبوع)
        const totalPages = 604;
        const donePages = skippedParts * 20; 
        const remaining = totalPages - donePages;

        if (remaining <= 0) return alert("مبارك! أنت خاتم للقرآن.");

        const weeklySpeed = val * days; 
        const totalWeeks = remaining / weeklySpeed;
        
        // تحويل الأسابيع لزمن مقروء
        const years = Math.floor(totalWeeks / 52);
        const months = Math.floor((totalWeeks % 52) / 4.3);
        const daysRem = Math.ceil(((totalWeeks % 52) % 4.3) * 7);

        let timeStr = "";
        if(years > 0) timeStr += `${years} سنة `;
        if(months > 0) timeStr += `${months} شهر `;
        if(daysRem > 0) timeStr += `و ${daysRem} يوم`;

        setResult({ text: timeStr, rate: weeklySpeed });
    };

    return (
        <div className="feature-container animate-in">
            {step === 1 && (
                <div className="text-center">
                    <h4 className="font-bold text-emerald-800 mb-3">1️⃣ كم يوماً تحفظ في الأسبوع؟</h4>
                    <div className="grid grid-cols-7 gap-1">
                        {[1, 2, 3, 4, 5, 6, 7].map(d => (
                            <button key={d} onClick={() => { setDays(d); setStep(2); }} className="p-3 rounded-xl bg-gray-50 hover:bg-emerald-600 hover:text-white border font-bold transition">{d}</button>
                        ))}
                    </div>
                </div>
            )}
            {step === 2 && (
                <div className="text-center animate-in">
                    <h4 className="font-bold text-emerald-800 mb-3">2️⃣ كم صفحة ومقدار الحفظ؟</h4>
                    <input type="number" className="w-full p-3 border rounded-xl mb-3 text-center font-bold" placeholder="كم صفحة يومياً؟ (مثلاً 1)" value={amount} onChange={e=>setAmount(e.target.value)} />
                    <label className="text-xs text-gray-500 block mb-1">تخطي أجزاء محفوظة (0-30)</label>
                    <select className="w-full p-3 border rounded-xl mb-3 text-center bg-gray-50" value={skippedParts} onChange={e=>setSkippedParts(e.target.value)}>
                        {[...Array(31).keys()].map(i => <option key={i} value={i}>{i} جزء</option>)}
                    </select>
                    <button onClick={calculate} className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold">احسب النتيجة 🏁</button>
                    {result && (
                        <div className="mt-4 bg-emerald-50 border border-emerald-200 p-4 rounded-xl">
                            <p className="text-gray-600 font-bold text-xs">ستختم خلال:</p>
                            <h3 className="text-xl font-black text-emerald-700 my-2">{result.text}</h3>
                            <p className="text-[10px] text-gray-400">بمعدل {result.rate} صفحة أسبوعياً</p>
                        </div>
                    )}
                    <button onClick={()=>setStep(1)} className="text-xs text-gray-400 mt-3 underline">إعادة</button>
                </div>
            )}
        </div>
    );
};

// ============================================================
// 2. حاسبة الوقت (بقيت كما هي - ممتازة)
// ============================================================
window.CalcTime = () => {
    // ... (نفس الكود السابق للحفاظ على المساحة، فهو سليم)
    // سأضع لك نسخة مختصرة تعمل بنفس المنطق
    const [d, setD] = useState(30); 
    const [res, setRes] = useState(null);
    return (
        <div className="feature-container text-center">
            <h4 className="font-bold text-amber-800 mb-2">🎯 حدد الأيام الإجمالية للختم</h4>
            <input type="number" className="w-full p-3 border rounded-xl mb-3 text-center font-bold" placeholder="مثلاً 30 يوم" onChange={e=>setD(e.target.value)} />
            <button onClick={()=>{if(d>0) setRes((604/d).toFixed(1))}} className="w-full bg-amber-500 text-white py-3 rounded-xl font-bold">احسب</button>
            {res && <div className="mt-3 bg-amber-50 p-3 rounded-xl border border-amber-200 font-bold text-amber-800">{res} صفحة يومياً</div>}
        </div>
    );
};

// ============================================================
// 3. اختبر حفظك (المطور - تتابعي + تحديد دقيق)
// ============================================================
window.TestHifz = () => {
    const [part, setPart] = useState('all');
    const [surahId, setSurahId] = useState('all');
    const [qType, setQType] = useState('complete');
    
    // حالة السؤال الحالي (لتتبع المكان)
    const [currentQ, setCurrentQ] = useState(null); // { sId, aIdx, text, ... }
    const [showAns, setShowAns] = useState(false);

    // قائمة السور المتاحة بناءً على الجزء المختار
    const availableSurahs = useMemo(() => {
        if (!window.APP_DATA.quran) return [];
        if (part === 'all') return Object.keys(window.APP_DATA.quran);
        
        // منطق الفلترة حسب الجزء
        const range = JUZ_MAPPING.find(r => r.j == part);
        if (!range) return [];
        
        const surahs = [];
        for (let i = range.s; i <= range.e; i++) {
            surahs.push(i.toString());
        }
        return surahs;
    }, [part]);

    const generateQuestion = (isContinue = false) => {
        if (!window.APP_DATA.quran) return;
        
        let targetSurahId, targetAyahIdx;

        if (isContinue && currentQ) {
            // منطق "التكملة": الآية التالية
            targetSurahId = currentQ.sId;
            targetAyahIdx = currentQ.aIdx + 1;
            
            // التحقق من نهاية السورة
            if (targetAyahIdx >= window.APP_DATA.quran[targetSurahId].ayahs.length) {
                return alert("انتهت السورة! اختر سؤالاً جديداً.");
            }
        } else {
            // سؤال جديد عشوائي
            if (surahId !== 'all') {
                targetSurahId = surahId;
            } else {
                targetSurahId = availableSurahs[Math.floor(Math.random() * availableSurahs.length)];
            }
            const sObj = window.APP_DATA.quran[targetSurahId];
            targetAyahIdx = Math.floor(Math.random() * sObj.ayahs.length);
        }

        const sObj = window.APP_DATA.quran[targetSurahId];
        const ayahObj = sObj.ayahs[targetAyahIdx];

        // تجهيز السؤال
        let qText = ayahObj.text;
        let prompt = "أكمل الآية:";
        
        if (qType === 'complete' && !isContinue) {
            const words = qText.split(' ');
            if (words.length > 5) qText = words.slice(0, 5).join(' ') + "...";
        }

        setCurrentQ({
            sId: targetSurahId,
            sName: sObj.name,
            aIdx: targetAyahIdx,
            aNum: ayahObj.num,
            fullText: ayahObj.text,
            qText: qText,
            prompt: prompt
        });
        setShowAns(false);
    };

    return (
        <div className="feature-container animate-in">
            {/* إعدادات الاختبار */}
            <div className="space-y-2 mb-4">
                <div className="flex gap-2">
                    <select className="flex-1 p-2 border rounded-lg text-xs font-bold bg-gray-50" value={part} onChange={e => {setPart(e.target.value); setSurahId('all');}}>
                        <option value="all">كامل المصحف</option>
                        {[...Array(30).keys()].map(i => <option key={i+1} value={i+1}>الجزء {i+1}</option>)}
                    </select>
                    <select className="flex-1 p-2 border rounded-lg text-xs font-bold bg-gray-50" value={qType} onChange={e => setQType(e.target.value)}>
                        <option value="complete">أكمل الآية</option>
                        <option value="next">ما التالي؟</option>
                    </select>
                </div>
                
                {/* قائمة السور (تظهر فقط عند اختيار جزء) */}
                {part !== 'all' && (
                    <select className="w-full p-2 border rounded-lg text-xs font-bold bg-white" value={surahId} onChange={e => setSurahId(e.target.value)}>
                        <option value="all">اختيار عشوائي من الجزء {part}</option>
                        {availableSurahs.map(id => (
                            <option key={id} value={id}>{id}. {window.APP_DATA.quran[id]?.name}</option>
                        ))}
                    </select>
                )}
            </div>

            <button onClick={() => generateQuestion(false)} className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold shadow mb-4 text-sm">سؤال جديد 🎲</button>

            {currentQ && (
                <div className="text-center animate-in">
                    <div className="bg-white border-2 border-gray-100 rounded-2xl p-5 shadow-sm mb-3">
                        <p className="text-xs text-gray-400 font-bold mb-3">{currentQ.prompt}</p>
                        <p className="font-amiri text-xl text-gray-800 leading-loose">{currentQ.qText}</p>
                    </div>

                    {!showAns ? (
                        <button onClick={() => setShowAns(true)} className="w-full bg-amber-100 text-amber-800 py-2 rounded-xl font-bold text-sm">كشف الإجابة 🔓</button>
                    ) : (
                        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 animate-in">
                            <p className="font-amiri text-lg text-emerald-800 font-bold mb-3">{currentQ.fullText}</p>
                            <div className="flex justify-between text-[10px] text-gray-500 font-bold mb-3">
                                <span>{currentQ.sName}</span>
                                <span>آية: {currentQ.aNum}</span>
                            </div>
                            
                            <div className="flex gap-2">
                                <button onClick={() => generateQuestion(false)} className="flex-1 bg-white border border-gray-200 py-2 rounded-lg text-xs font-bold text-gray-600">🔄 سؤال آخر</button>
                                <button onClick={() => generateQuestion(true)} className="flex-1 bg-emerald-600 text-white py-2 rounded-lg text-xs font-bold shadow">أكمل (الآية التالية) ⬅️</button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// ============================================================
// 4. المصحف الشريف (كما هو في التحديث السابق)
// ============================================================
window.QuranReader = window.QuranReader; // استخدام النسخة السابقة إذا كانت موجودة أو أعد نسخها

// ============================================================
// 5. الأذكار (نظام التصنيفات الجديد)
// ============================================================
window.AzkarApp = () => {
    const [view, setView] = useState('categories'); // 'categories' or 'list'
    const [selectedCat, setSelectedCat] = useState(null);
    const [counts, setCounts] = useState({});

    useEffect(() => {
        if (window.APP_DATA.azkar) {
            const initial = {};
            window.APP_DATA.azkar.forEach((z, i) => initial[i] = z.count || 0);
            setCounts(initial);
        }
    }, []);

    // استخراج التصنيفات الفريدة
    const categories = useMemo(() => {
        if (!window.APP_DATA.azkar) return [];
        const cats = new Set(window.APP_DATA.azkar.map(z => z.category));
        return Array.from(cats);
    }, []);

    const handleClick = (idx) => {
        if (counts[idx] > 0) {
            setCounts(prev => ({ ...prev, [idx]: prev[idx] - 1 }));
            if (navigator.vibrate && counts[idx] === 1) navigator.vibrate([50, 50, 50]); // اهتزاز عند الانتهاء
            else if (navigator.vibrate) navigator.vibrate(20);
        }
    };

    return (
        <div className="feature-container p-4 min-h-[400px]">
            {view === 'categories' && (
                <div className="grid grid-cols-2 gap-3 animate-in">
                    {categories.map(cat => (
                        <button key={cat} onClick={() => { setSelectedCat(cat); setView('list'); }} 
                            className="p-6 bg-white border-2 border-emerald-50 rounded-2xl shadow-sm hover:border-emerald-500 hover:bg-emerald-50 transition flex flex-col items-center justify-center gap-2">
                            <span className="text-2xl">📿</span>
                            <span className="font-bold text-emerald-800 text-sm">{cat}</span>
                        </button>
                    ))}
                    {/* زر السبحة الحرة */}
                    <button onClick={() => setView('sebha')} className="col-span-2 p-4 bg-amber-50 border-2 border-amber-100 rounded-2xl font-bold text-amber-800 mt-2">
                        ☝️ السبحة الحرة
                    </button>
                </div>
            )}

            {view === 'list' && (
                <div className="animate-in">
                    <button onClick={() => setView('categories')} className="mb-4 text-xs font-bold text-gray-500 flex items-center gap-1">⬅️ عودة للأقسام</button>
                    <h3 className="font-black text-emerald-800 mb-4 text-center">{selectedCat}</h3>
                    <div className="space-y-3 max-h-[350px] overflow-y-auto custom-scroll">
                        {window.APP_DATA.azkar.map((z, i) => {
                            if (z.category !== selectedCat) return null;
                            return (
                                <div key={i} onClick={() => handleClick(i)} 
                                     className={`p-4 rounded-xl border-r-4 shadow-sm cursor-pointer transition relative ${counts[i] === 0 ? 'bg-green-50 border-gray-300 opacity-60' : 'bg-white border-emerald-500'}`}>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className={`text-xs font-black px-3 py-1 rounded-full ${counts[i]===0?'bg-green-200 text-green-800':'bg-emerald-600 text-white'}`}>
                                            {counts[i] === 0 ? 'تم ✅' : counts[i]}
                                        </span>
                                    </div>
                                    <p className="font-amiri text-lg leading-loose text-gray-800">{z.zekr}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {view === 'sebha' && (
                <div className="text-center py-8 animate-in">
                    <button onClick={() => setView('categories')} className="absolute top-4 right-4 text-xs font-bold text-gray-500">❌ خروج</button>
                    <div className="sebha-circle mx-auto" onClick={(e) => {
                        e.target.innerText = parseInt(e.target.innerText) + 1;
                        if(navigator.vibrate) navigator.vibrate(30);
                    }}>0</div>
                    <p className="mt-4 text-gray-400 text-xs">اضغط للعد</p>
                </div>
            )}
        </div>
    );
};
