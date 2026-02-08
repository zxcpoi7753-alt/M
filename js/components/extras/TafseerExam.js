/* =========================================
   المكون: مسابقة التفسير (اختبر فهمك)
   المسار: js/components/extras/TafseerExam.js
   ========================================= */
const { useState, useEffect, useMemo } = React;

const TafseerExam = () => {
    // --- الحالة (State) ---
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState('menu'); // menu, selection, playing, result
    const [selectionType, setSelectionType] = useState(null); // 'surah', 'juz'
    const [selectedItems, setSelectedItems] = useState([]);
    
    const [questions, setQuestions] = useState([]);
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState(null); // null, 'correct', 'wrong'
    const [dbReady, setDbReady] = useState(false);

    // خريطة الأجزاء (بداية كل جزء)
    const juzStartSurah = [1, 2, 3, 4, 4, 5, 6, 7, 8, 9, 10, 12, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 37, 41, 46, 51, 58, 67, 78];

    // التحقق من جاهزية البيانات
    useEffect(() => {
        const check = setInterval(() => {
            if (window.APP_DATA && window.APP_DATA.quran && window.APP_DATA.tafseer) {
                setDbReady(true);
                clearInterval(check);
            }
        }, 500);
        return () => clearInterval(check);
    }, []);

    // --- المنطق ---

    const toggleSelection = (id) => {
        setSelectedItems(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    const generateQuestions = () => {
        if (selectedItems.length === 0) return window.showGlobalAlert("تنبيه", "اختر سورة أو جزءاً واحداً على الأقل");

        // 1. تحديد السور المستهدفة
        let targetSurahs = [];
        const allSurahs = Object.values(window.APP_DATA.quran);

        if (selectionType === 'surah') {
            targetSurahs = allSurahs.filter(s => selectedItems.includes(s.number));
        } else if (selectionType === 'juz') {
            selectedItems.forEach(juz => {
                const start = juzStartSurah[juz - 1];
                const end = juzStartSurah[juz] || 115;
                const inJuz = allSurahs.filter(s => s.number >= start && s.number < end);
                targetSurahs.push(...inJuz);
            });
        }

        // 2. توليد الأسئلة
        const newQuestions = [];
        const totalQ = 5; // عدد الأسئلة في الجولة

        for (let i = 0; i < totalQ; i++) {
            // اختيار سورة وآية عشوائية
            const randSurah = targetSurahs[Math.floor(Math.random() * targetSurahs.length)];
            const randAyah = randSurah.ayahs[Math.floor(Math.random() * randSurah.ayahs.length)];
            
            // جلب التفسير الصحيح
            // ملاحظة: مفتاح التفسير في data_loader هو "رقم السورة_رقم الآية"
            const key = `${randSurah.number}_${randAyah.num || randAyah.numberInSurah}`;
            const correctTafseer = window.APP_DATA.tafseer[key];

            // إذا لم نجد تفسيراً (نادر)، نعيد المحاولة
            if (!correctTafseer) { i--; continue; }

            // جلب خيارين خاطئين (من سور أخرى لزيادة الصعوبة أو نفس السورة)
            let wrongOptions = [];
            let attempts = 0;
            while (wrongOptions.length < 2 && attempts < 50) {
                const s = targetSurahs[Math.floor(Math.random() * targetSurahs.length)];
                const a = s.ayahs[Math.floor(Math.random() * s.ayahs.length)];
                const k = `${s.number}_${a.num || a.numberInSurah}`;
                const t = window.APP_DATA.tafseer[k];
                
                if (t && t !== correctTafseer && !wrongOptions.includes(t)) {
                    wrongOptions.push(t);
                }
                attempts++;
            }

            newQuestions.push({
                surah: randSurah.name,
                ayahText: randAyah.text,
                ayahNum: randAyah.num || randAyah.numberInSurah,
                correct: correctTafseer,
                options: [...wrongOptions, correctTafseer].sort(() => Math.random() - 0.5)
            });
        }

        setQuestions(newQuestions);
        setScore(0);
        setCurrentQIndex(0);
        setMode('playing');
        setFeedback(null);
    };

    const handleAnswer = (option) => {
        if (feedback) return;
        const currentQ = questions[currentQIndex];
        const isCorrect = option === currentQ.correct;
        
        setFeedback(isCorrect ? 'correct' : 'wrong');
        if (isCorrect) setScore(s => s + 1);

        // الانتقال للسؤال التالي
        setTimeout(() => {
            setFeedback(null);
            if (currentQIndex < questions.length - 1) {
                setCurrentQIndex(prev => prev + 1);
            } else {
                setMode('result');
            }
        }, 1500); // وقت أطول قليلاً لقراءة التفسير الصحيح
    };

    return (
        <div className="bg-white rounded-[2rem] border border-gray-200 shadow-sm overflow-hidden mb-6 animate-in">
            {/* الرأس */}
            <div onClick={() => setIsOpen(!isOpen)} className="p-5 flex justify-between items-center cursor-pointer bg-gradient-to-r from-amber-50 to-white hover:bg-amber-100 transition">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">💡</span>
                    <div>
                        <h3 className="font-black text-amber-900">اختبر فهمك (التفسير)</h3>
                        <p className="text-[10px] text-gray-500 font-bold">
                            {dbReady ? "جاهز للتحدي" : "جاري تحميل التفسير..."}
                        </p>
                    </div>
                </div>
                <div className={`transform transition duration-300 ${isOpen ? 'rotate-180' : ''}`}>▼</div>
            </div>

            {isOpen && (
                <div className="p-5 bg-gray-50 border-t min-h-[300px] flex flex-col">
                    {!dbReady ? (
                        <div className="text-center py-10 text-gray-400 animate-pulse">⏳ نجهز لك المعاني...</div>
                    ) : (
                        <>
                            {/* 1. القائمة الرئيسية */}
                            {mode === 'menu' && (
                                <div className="space-y-4 my-auto animate-in">
                                    <div className="text-center mb-6">
                                        <h3 className="font-black text-gray-800">ما هو نطاق الاختبار؟</h3>
                                        <p className="text-xs text-gray-500">اختر من أين نأتي بأسئلة التفسير</p>
                                    </div>
                                    <button onClick={() => { setSelectionType('juz'); setMode('selection'); setSelectedItems([]); }} className="w-full bg-white border-2 border-amber-100 p-4 rounded-2xl flex items-center justify-between hover:border-amber-500 transition shadow-sm">
                                        <span className="font-bold text-amber-800">📚 أجزاء كاملة</span>
                                        <span>⬅️</span>
                                    </button>
                                    <button onClick={() => { setSelectionType('surah'); setMode('selection'); setSelectedItems([]); }} className="w-full bg-white border-2 border-orange-100 p-4 rounded-2xl flex items-center justify-between hover:border-orange-500 transition shadow-sm">
                                        <span className="font-bold text-orange-800">📖 سور محددة</span>
                                        <span>⬅️</span>
                                    </button>
                                </div>
                            )}

                            {/* 2. شاشة الاختيار */}
                            {mode === 'selection' && (
                                <div className="flex flex-col h-full animate-in">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-black text-gray-700">{selectionType === 'surah' ? 'اختر السور' : 'اختر الأجزاء'}</h3>
                                        <button onClick={() => setMode('menu')} className="text-xs font-bold text-red-500 bg-red-50 px-3 py-1 rounded-lg">إلغاء</button>
                                    </div>
                                    <div className="flex-1 overflow-y-auto max-h-[300px] grid grid-cols-3 gap-2 mb-4 pr-1 scrollbar-hide">
                                        {selectionType === 'surah' ? (
                                            Object.values(window.APP_DATA.quran).map(surah => (
                                                <button key={surah.number} onClick={() => toggleSelection(surah.number)} className={`p-2 text-[10px] font-bold rounded-lg border transition ${selectedItems.includes(surah.number) ? 'bg-orange-600 text-white border-orange-600' : 'bg-white text-gray-600'}`}>
                                                    {surah.number}. {surah.name}
                                                </button>
                                            ))
                                        ) : (
                                            Array.from({length: 30}, (_, i) => i + 1).map(juz => (
                                                <button key={juz} onClick={() => toggleSelection(juz)} className={`p-3 text-xs font-bold rounded-xl border transition ${selectedItems.includes(juz) ? 'bg-amber-600 text-white border-amber-600' : 'bg-white text-gray-600'}`}>
                                                    الجزء {juz}
                                                </button>
                                            ))
                                        )}
                                    </div>
                                    <button onClick={generateQuestions} disabled={selectedItems.length === 0} className="w-full bg-amber-600 text-white py-3 rounded-xl font-black shadow-lg disabled:opacity-50 hover:bg-amber-700 transition">
                                        ابدأ التحدي ({selectedItems.length}) 🚀
                                    </button>
                                </div>
                            )}

                            {/* 3. شاشة اللعب */}
                            {mode === 'playing' && questions[currentQIndex] && (
                                <div className="space-y-4 animate-in">
                                    <div className="flex justify-between text-xs font-bold text-gray-400">
                                        <span>سؤال {currentQIndex + 1} / {questions.length}</span>
                                        <span>النتيجة: {score}</span>
                                    </div>
                                    
                                    {/* بطاقة السؤال */}
                                    <div className="bg-white p-6 rounded-2xl border-2 border-amber-50 shadow-sm text-center relative overflow-hidden">
                                        <span className="absolute top-0 right-0 bg-amber-100 text-amber-800 text-[9px] font-bold px-3 py-1 rounded-bl-xl">
                                            سورة {questions[currentQIndex].surah}
                                        </span>
                                        <p className="text-xs text-gray-500 mb-2">ما معنى قوله تعالى:</p>
                                        <h2 className="font-amiri text-xl font-bold text-gray-800 leading-loose">
                                            ﴿ {questions[currentQIndex].ayahText} ﴾
                                        </h2>
                                    </div>

                                    {/* الخيارات */}
                                    <div className="space-y-2">
                                        {questions[currentQIndex].options.map((opt, idx) => {
                                            const isSelected = feedback; 
                                            const isCorrect = opt === questions[currentQIndex].correct;
                                            
                                            let btnClass = "bg-white border-gray-200 text-gray-600 hover:border-amber-300";
                                            if (feedback) {
                                                if (isCorrect) btnClass = "bg-green-100 border-green-500 text-green-800 font-bold";
                                                else btnClass = "bg-red-50 border-red-200 text-red-300 opacity-50";
                                            }

                                            return (
                                                <button 
                                                    key={idx} 
                                                    onClick={() => handleAnswer(opt)} 
                                                    disabled={!!feedback}
                                                    className={`w-full p-4 rounded-xl border-2 text-sm text-right transition-all duration-300 ${btnClass}`}
                                                >
                                                    {opt}
                                                    {feedback && isCorrect && <span className="float-left">✅</span>}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* 4. النتيجة */}
                            {mode === 'result' && (
                                <div className="text-center animate-in py-10">
                                    <div className="text-6xl mb-4">{score === questions.length ? '🥇' : score >= questions.length/2 ? '🥈' : '🥉'}</div>
                                    <h3 className="text-2xl font-black text-gray-800 mb-2">النتيجة النهائية</h3>
                                    <p className="text-4xl font-black text-amber-600 mb-6">{score} <span className="text-lg text-gray-400">/ {questions.length}</span></p>
                                    
                                    <div className="flex gap-2">
                                        <button onClick={() => setMode('menu')} className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold">القائمة</button>
                                        <button onClick={generateQuestions} className="flex-1 bg-amber-600 text-white py-3 rounded-xl font-bold shadow-lg">إعادة المحاولة 🔄</button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

window.TafseerExam = TafseerExam;
