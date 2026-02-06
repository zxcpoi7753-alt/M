/* =========================================
   المكون: المحاكي القرآني (النسخة المتصلة بقاعدة البيانات + نظام الصلاحيات)
   المسار: js/components/extras/QuranExam.js
   ========================================= */
const { useState, useEffect } = React;

const QuranExam = () => {
    // --- الحالة (State) ---
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState('menu'); // menu, selection, playing, result
    const [selectionType, setSelectionType] = useState(null); // 'surah' or 'juz'
    const [selectedItems, setSelectedItems] = useState([]); // IDs of selected surahs or juzs
    
    const [questions, setQuestions] = useState([]);
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [history, setHistory] = useState([]);
    const [feedback, setFeedback] = useState(null);
    const [dbReady, setDbReady] = useState(false);

    // التحقق من وجود قاعدة البيانات
    useEffect(() => {
        if (window.quranData && window.quranData.length > 0) {
            setDbReady(true);
        } else {
            // محاولة الانتظار قليلاً في حال تأخر التحميل
            const checkDb = setInterval(() => {
                if (window.quranData && window.quranData.length > 0) {
                    setDbReady(true);
                    clearInterval(checkDb);
                }
            }, 500);
        }
    }, []);

    // --- خريطة الأجزاء (تقريبية لأوائل السور) ---
    // هذا الفهرس يحدد السورة التي يبدأ بها كل جزء (للتبسيط سنختار السور كاملة)
    const juzStartSurah = [
        1, 2, 3, 4, 4, 5, 6, 7, 8, 9, 10, 12, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 37, 41, 46, 51, 58, 67, 78
    ];

    // --- نظام الصلاحيات اليومي ---
    const checkDailyLimit = () => {
        const today = new Date().toDateString();
        const storageKey = 'quran_exam_surah_limit';
        const data = JSON.parse(localStorage.getItem(storageKey) || '{}');

        if (data.date !== today) {
            return { count: 0, allowed: true }; // يوم جديد
        }
        return { count: data.count, allowed: data.count < 3 };
    };

    const incrementDailyLimit = () => {
        if (selectionType !== 'surah') return; // نحسب فقط اختيار السور
        const today = new Date().toDateString();
        const storageKey = 'quran_exam_surah_limit';
        const data = JSON.parse(localStorage.getItem(storageKey) || '{}');
        const currentCount = (data.date === today) ? data.count : 0;
        
        localStorage.setItem(storageKey, JSON.stringify({
            date: today,
            count: currentCount + 1
        }));
    };

    // --- التعامل مع الاختيار ---
    const handleModeSelect = (type) => {
        if (type === 'surah') {
            const limit = checkDailyLimit();
            if (!limit.allowed) {
                if(window.showGlobalAlert) window.showGlobalAlert('عفواً 🛑', 'لقد استنفدت عدد مرات اختيار السور المسموحة اليوم (3 مرات). جرب اختيار الأجزاء.');
                else alert('لقد استنفدت عدد مرات اختيار السور المسموحة اليوم (3 مرات).');
                return;
            }
        }
        setSelectionType(type);
        setSelectedItems([]);
        setMode('selection');
    };

    const toggleSelection = (id) => {
        setSelectedItems(prev => 
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    // --- المحرك: توليد الأسئلة من قاعدة البيانات ---
    const startExam = () => {
        if (selectedItems.length === 0) return alert("الرجاء اختيار سورة أو جزء واحد على الأقل");

        // 1. تحديد السور المطلوبة بناءً على الاختيار
        let targetSurahs = [];
        
        if (selectionType === 'surah') {
            // جلب السور المختارة مباشرة من قاعدة البيانات
            targetSurahs = window.quranData.filter(s => selectedItems.includes(s.number));
            incrementDailyLimit(); // خصم محاولة
        } else if (selectionType === 'juz') {
            // تحويل أرقام الأجزاء إلى سور
            selectedItems.forEach(juzNum => {
                // الجزء يبدأ من سورة X وينتهي عند سورة Y
                const startIdx = juzStartSurah[juzNum - 1]; 
                const endIdx = juzStartSurah[juzNum] || 115; // الجزء التالي أو نهاية المصحف
                
                const surahsInJuz = window.quranData.filter(s => s.number >= startIdx && s.number < endIdx);
                targetSurahs = [...targetSurahs, ...surahsInJuz];
            });
        }

        // إزالة التكرار (في حال تداخل الأجزاء)
        targetSurahs = [...new Set(targetSurahs)];

        if (targetSurahs.length === 0) return alert("حدث خطأ في جلب البيانات");

        // 2. توليد الأسئلة
        const newQuestions = [];
        const totalQuestions = 10; // عدد الأسئلة في الاختبار

        for (let i = 0; i < totalQuestions; i++) {
            // اختر سورة عشوائية من القائمة المحددة
            const randomSurah = targetSurahs[Math.floor(Math.random() * targetSurahs.length)];
            
            // تأكد أن السورة فيها آيات كافية
            if (!randomSurah.ayahs || randomSurah.ayahs.length < 2) continue;

            // اختر آية عشوائية (ليست الأخيرة)
            const ayahIndex = Math.floor(Math.random() * (randomSurah.ayahs.length - 1));
            
            const questionAyah = randomSurah.ayahs[ayahIndex].text; // نص الآية
            const correctNextAyah = randomSurah.ayahs[ayahIndex + 1].text; // نص الآية التالية

            // توليد خيارات خاطئة (من نفس النطاق لزيادة الصعوبة)
            let wrongOptions = [];
            let attempts = 0;
            while (wrongOptions.length < 3 && attempts < 50) {
                const s = targetSurahs[Math.floor(Math.random() * targetSurahs.length)];
                const a = s.ayahs[Math.floor(Math.random() * s.ayahs.length)].text;
                if (a !== correctNextAyah && a !== questionAyah && !wrongOptions.includes(a)) {
                    wrongOptions.push(a);
                }
                attempts++;
            }

            // دمج الخيارات
            const options = [...wrongOptions, correctNextAyah].sort(() => Math.random() - 0.5);

            newQuestions.push({
                surah: randomSurah.name,
                question: questionAyah,
                correctAnswer: correctNextAyah,
                options: options
            });
        }

        if (newQuestions.length === 0) return alert("لم نتمكن من توليد أسئلة لهذا النطاق");

        setQuestions(newQuestions);
        setMode('playing');
        setCurrentQIndex(0);
        setScore(0);
        setHistory([]);
        setFeedback(null);
    };

    // --- معالجة الإجابة ---
    const handleAnswer = (selectedOption) => {
        if (feedback) return;
        const currentQ = questions[currentQIndex];
        const isCorrect = selectedOption === currentQ.correctAnswer;
        setFeedback({ selected: selectedOption, isCorrect });
        if (isCorrect) setScore(prev => prev + 1);
        
        const record = { ...currentQ, userAnswer: selectedOption, isCorrect };
        setHistory(prev => [...prev, record]);

        setTimeout(() => {
            setFeedback(null);
            if (currentQIndex < questions.length - 1) setCurrentQIndex(prev => prev + 1);
            else setMode('result');
        }, 1200);
    };

    // --- الواجهة ---
    return (
        <div className="bg-white rounded-[2rem] border border-gray-200 shadow-sm overflow-hidden mb-6 animate-in">
            <div onClick={() => setIsOpen(!isOpen)} className="p-5 flex justify-between items-center cursor-pointer bg-gradient-to-r from-teal-50 to-white hover:bg-teal-100 transition">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">🧠</span>
                    <div>
                        <h3 className="font-black text-teal-900">المحاكي القرآني</h3>
                        <p className="text-[10px] text-gray-500 font-bold">اختبر حفظك من المصحف مباشرة</p>
                    </div>
                </div>
                <div className={`transform transition duration-300 ${isOpen ? 'rotate-180' : ''}`}>▼</div>
            </div>

            {isOpen && (
                <div className="p-5 bg-gray-50 border-t min-h-[300px] flex flex-col">
                    
                    {!dbReady ? (
                        <div className="text-center py-10 text-gray-500">⏳ جاري تحميل المصحف...</div>
                    ) : (
                        <>
                            {/* 1. القائمة الرئيسية */}
                            {mode === 'menu' && (
                                <div className="space-y-4 my-auto">
                                    <div className="text-center mb-6">
                                        <h3 className="font-black text-gray-800 text-lg">حدد نطاق الاختبار</h3>
                                        <p className="text-xs text-gray-500">يمكنك الاختبار في سور محددة أو أجزاء كاملة</p>
                                    </div>
                                    <button onClick={() => handleModeSelect('juz')} className="w-full bg-white border-2 border-teal-100 p-4 rounded-2xl flex items-center justify-between hover:border-teal-500 transition group">
                                        <span className="font-bold text-teal-800">📚 اختيار أجزاء كاملة</span>
                                        <span className="text-2xl group-hover:scale-125 transition">⬅️</span>
                                    </button>
                                    <button onClick={() => handleModeSelect('surah')} className="w-full bg-white border-2 border-indigo-100 p-4 rounded-2xl flex items-center justify-between hover:border-indigo-500 transition group relative overflow-hidden">
                                        <div className="z-10">
                                            <span className="font-bold text-indigo-800 block text-right">📖 اختيار سور معينة</span>
                                            <span className="text-[9px] text-gray-400 font-bold block text-right mt-1">
                                                (المتبقي اليوم: {3 - checkDailyLimit().count})
                                            </span>
                                        </div>
                                        <span className="text-2xl group-hover:scale-125 transition z-10">⬅️</span>
                                        {/* شريط التقدم الخلفي */}
                                        <div className="absolute left-0 top-0 h-full bg-indigo-50 transition-all" style={{width: `${(checkDailyLimit().count / 3) * 100}%`}}></div>
                                    </button>
                                </div>
                            )}

                            {/* 2. شاشة الاختيار */}
                            {mode === 'selection' && (
                                <div className="flex flex-col h-full">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-black text-gray-700">
                                            {selectionType === 'surah' ? 'اختر السور (يمكنك دمج أكثر من سورة)' : 'اختر الأجزاء'}
                                        </h3>
                                        <button onClick={() => setMode('menu')} className="text-xs font-bold text-red-500">إلغاء ✕</button>
                                    </div>
                                    
                                    <div className="flex-1 overflow-y-auto max-h-[300px] grid grid-cols-3 gap-2 mb-4 pr-1 scrollbar-hide">
                                        {selectionType === 'surah' ? (
                                            window.quranData.map(surah => (
                                                <button 
                                                    key={surah.number} 
                                                    onClick={() => toggleSelection(surah.number)}
                                                    className={`p-2 text-[10px] font-bold rounded-lg border transition ${selectedItems.includes(surah.number) ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-200'}`}
                                                >
                                                    {surah.number}. {surah.name}
                                                </button>
                                            ))
                                        ) : (
                                            Array.from({length: 30}, (_, i) => i + 1).map(juz => (
                                                <button 
                                                    key={juz} 
                                                    onClick={() => toggleSelection(juz)}
                                                    className={`p-3 text-xs font-bold rounded-xl border transition ${selectedItems.includes(juz) ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-gray-600 border-gray-200'}`}
                                                >
                                                    الجزء {juz}
                                                </button>
                                            ))
                                        )}
                                    </div>

                                    <div className="pt-3 border-t bg-gray-50">
                                        <button 
                                            onClick={startExam} 
                                            disabled={selectedItems.length === 0}
                                            className="w-full bg-emerald-600 text-white py-3 rounded-xl font-black shadow-lg disabled:opacity-50 hover:bg-emerald-700 transition"
                                        >
                                            ابدأ الاختبار ({selectedItems.length} مختار)
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* 3. شاشة اللعب (نفس السابق مع تحسينات) */}
                            {mode === 'playing' && (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center text-xs font-bold text-gray-500 mb-2">
                                        <span>سؤال {currentQIndex + 1} / {questions.length}</span>
                                        <span>النقاط: {score}</span>
                                    </div>
                                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden"><div className="h-full bg-teal-500 transition-all duration-500" style={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }}></div></div>

                                    <div className="bg-white p-6 rounded-2xl border-2 border-teal-50 shadow-sm text-center">
                                        <span className="text-[10px] bg-gray-100 px-2 py-1 rounded text-gray-500 mb-2 inline-block">سورة {questions[currentQIndex].surah}</span>
                                        <h2 className="font-amiri text-2xl font-bold text-gray-800 leading-loose">﴿ {questions[currentQIndex].question} ﴾</h2>
                                        <p className="text-xs text-teal-600 font-bold mt-2">أكمل الآية التالية 👇</p>
                                    </div>

                                    <div className="grid gap-3">
                                        {questions[currentQIndex].options.map((opt, idx) => {
                                            let btnClass = "bg-white border-gray-200 text-gray-700 hover:border-teal-300";
                                            if (feedback) {
                                                if (opt === questions[currentQIndex].correctAnswer) btnClass = "bg-green-100 border-green-500 text-green-800";
                                                else if (opt === feedback.selected && !feedback.isCorrect) btnClass = "bg-red-100 border-red-500 text-red-800";
                                                else btnClass = "opacity-40";
                                            }
                                            return <button key={idx} onClick={() => handleAnswer(opt)} disabled={!!feedback} className={`p-4 rounded-xl border-2 font-amiri text-lg font-bold transition-all duration-200 ${btnClass} text-right`}>{idx + 1}. {opt}</button>;
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* 4. النتيجة */}
                            {mode === 'result' && (
                                <div className="text-center animate-in">
                                    <div className="mb-6">
                                        <div className="text-6xl mb-2">{score === questions.length ? '👑' : score >= 5 ? '👍' : '📚'}</div>
                                        <h3 className="text-2xl font-black text-gray-800">النتيجة: {score} / {questions.length}</h3>
                                    </div>
                                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden text-right mb-6 max-h-[300px] overflow-y-auto">
                                        {history.map((rec, i) => (
                                            <div key={i} className="p-3 border-b text-sm">
                                                <div className="flex justify-between"><span className="font-amiri font-bold">﴿ {rec.question} ﴾</span><span className={`text-[10px] px-2 rounded-full ${rec.isCorrect?'bg-green-100 text-green-700':'bg-red-100 text-red-700'}`}>{rec.isCorrect?'صح':'خطأ'}</span></div>
                                                {!rec.isCorrect && <div className="text-xs mt-1 text-green-700">الصواب: {rec.correctAnswer}</div>}
                                            </div>
                                        ))}
                                    </div>
                                    <button onClick={() => setMode('menu')} className="w-full bg-gray-800 text-white py-3 rounded-xl font-bold">القائمة الرئيسية</button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

window.QuranExam = QuranExam;
