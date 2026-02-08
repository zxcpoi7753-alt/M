/* =========================================
   المكون: مسابقة التفسير (التحديث الذهبي: مؤقت لكل سؤال + اختيار الأجزاء)
   المسار: js/components/extras/TafseerExam.js
   ========================================= */
const { useState, useEffect, useRef, useMemo } = React;

const TafseerExam = () => {
    // --- الحالة (State) ---
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState('menu'); // menu, selection, playing, result
    
    // إعدادات اللعبة
    const [isBlitz, setIsBlitz] = useState(false); // تحدي السرعة
    const [selectionType, setSelectionType] = useState(null); // 'surah' or 'juz'
    const [selectedItems, setSelectedItems] = useState([]);
    
    // بيانات اللعب
    const [questions, setQuestions] = useState([]);
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState(null); // correct, wrong, timeout
    const [timeLeft, setTimeLeft] = useState(20); // المؤقت
    const [mistakes, setMistakes] = useState([]);
    const [dbReady, setDbReady] = useState(false);

    const timerRef = useRef(null);

    // خريطة بداية الأجزاء
    const juzStartSurah = [1, 2, 3, 4, 4, 5, 6, 7, 8, 9, 10, 12, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 37, 41, 46, 51, 58, 67, 78];

    // التحقق من البيانات
    useEffect(() => {
        const check = setInterval(() => {
            if (window.APP_DATA && window.APP_DATA.quran && window.APP_DATA.tafseer) {
                setDbReady(true);
                clearInterval(check);
            }
        }, 500);
        return () => clearInterval(check);
    }, []);

    // --- إدارة المؤقت (لكل سؤال) ---
    useEffect(() => {
        if (mode === 'playing' && isBlitz && !feedback) {
            // إعادة ضبط الوقت عند كل سؤال جديد
            setTimeLeft(20); 
            
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current);
                        handleAnswer(null, true); // انتهى الوقت
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timerRef.current);
    }, [currentQIndex, mode, isBlitz, feedback]);

    // --- المنطق ---

    const toggleSelection = (id) => {
        setSelectedItems(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    const startExam = () => {
        if (selectedItems.length === 0 && selectionType !== 'full') return alert("الرجاء تحديد الاختيار");

        let targetSurahs = [];
        const allSurahs = Object.values(window.APP_DATA.quran);

        if (selectionType === 'full') {
            targetSurahs = allSurahs;
        } else if (selectionType === 'surah') {
            targetSurahs = allSurahs.filter(s => selectedItems.includes(s.number));
        } else if (selectionType === 'juz') {
            selectedItems.forEach(juz => {
                const start = juzStartSurah[juz - 1];
                const end = juzStartSurah[juz] || 115;
                // إضافة هامش بسيط للتأكد من شمول السور
                const inJuz = allSurahs.filter(s => s.number >= start && s.number < end + 2);
                targetSurahs.push(...inJuz);
            });
        }

        // إزالة التكرار
        targetSurahs = [...new Set(targetSurahs)];

        // توليد الأسئلة
        const newQuestions = [];
        const totalQ = 10; // عدد الأسئلة في الاختبار

        for (let i = 0; i < totalQ; i++) {
            const randSurah = targetSurahs[Math.floor(Math.random() * targetSurahs.length)];
            if (!randSurah || !randSurah.ayahs) continue;
            
            const randAyah = randSurah.ayahs[Math.floor(Math.random() * randSurah.ayahs.length)];
            const key = `${randSurah.number}_${randAyah.num || randAyah.numberInSurah}`;
            const correctTafseer = window.APP_DATA.tafseer[key];

            if (!correctTafseer) { i--; continue; }

            // خيارات خاطئة
            let wrongOptions = [];
            let attempts = 0;
            while (wrongOptions.length < 2 && attempts < 50) {
                const s = targetSurahs[Math.floor(Math.random() * targetSurahs.length)];
                if (s && s.ayahs) {
                    const a = s.ayahs[Math.floor(Math.random() * s.ayahs.length)];
                    const k = `${s.number}_${a.num || a.numberInSurah}`;
                    const t = window.APP_DATA.tafseer[k];
                    if (t && t !== correctTafseer && !wrongOptions.includes(t)) wrongOptions.push(t);
                }
                attempts++;
            }

            newQuestions.push({
                surah: randSurah.name,
                ayahText: randAyah.text,
                correct: correctTafseer,
                options: [...wrongOptions, correctTafseer].sort(() => Math.random() - 0.5)
            });
        }

        if (newQuestions.length === 0) return alert("لا توجد بيانات كافية لهذا النطاق");

        setQuestions(newQuestions);
        setScore(0);
        setCurrentQIndex(0);
        setMistakes([]);
        setMode('playing');
        setFeedback(null);
    };

    const handleAnswer = (option, isTimeout = false) => {
        if (feedback) return;
        clearInterval(timerRef.current); // إيقاف المؤقت فوراً

        const currentQ = questions[currentQIndex];
        const isCorrect = option === currentQ.correct;
        
        if (isTimeout) setFeedback('timeout');
        else setFeedback(isCorrect ? 'correct' : 'wrong');
        
        if (isCorrect) {
            setScore(s => s + 1);
        } else {
            // تسجيل الخطأ
            setMistakes(prev => [...prev, {
                q: currentQ.ayahText,
                surah: currentQ.surah,
                wrong: isTimeout ? "انتهى الوقت ⏳" : option,
                right: currentQ.correct
            }]);
        }

        // الانتقال للسؤال التالي
        setTimeout(() => {
            setFeedback(null);
            if (currentQIndex < questions.length - 1) {
                setCurrentQIndex(prev => prev + 1);
            } else {
                setMode('result');
            }
        }, 2000); // وقت لقراءة الإجابة الصحيحة
    };

    // --- الواجهة ---
    return (
        <div className="bg-white rounded-[2rem] border border-gray-200 shadow-sm overflow-hidden mb-6 animate-in">
            {/* الرأس */}
            <div onClick={() => setIsOpen(!isOpen)} className="p-5 flex justify-between items-center cursor-pointer bg-gradient-to-r from-amber-50 to-white hover:bg-amber-100 transition">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">💡</span>
                    <div>
                        <h3 className="font-black text-amber-900">اختبر فهمك (التفسير)</h3>
                        <p className="text-[10px] text-gray-500 font-bold">
                            {dbReady ? "مسابقة المعاني والتدبر" : "جاري تحميل التفسير..."}
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
                            {/* 1. القائمة الرئيسية (الخيارات الثلاثة المطلوبة) */}
                            {mode === 'menu' && (
                                <div className="space-y-4 my-auto animate-in">
                                    
                                    {/* زر تفعيل تحدي السرعة */}
                                    <div onClick={() => setIsBlitz(!isBlitz)} className={`p-3 rounded-xl border-2 flex justify-between items-center cursor-pointer transition ${isBlitz ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'}`}>
                                        <div>
                                            <span className="font-bold text-xs block text-gray-800">⚡ تحدي السرعة (20 ثانية/سؤال)</span>
                                            <span className="text-[9px] text-gray-400 block">أجب قبل نفاذ الوقت!</span>
                                        </div>
                                        <div className={`w-10 h-5 rounded-full relative transition ${isBlitz ? 'bg-red-500' : 'bg-gray-300'}`}>
                                            <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all ${isBlitz ? 'right-5' : 'right-0.5'}`}></div>
                                        </div>
                                    </div>

                                    <div className="text-center my-4">
                                        <h3 className="font-black text-gray-800 text-sm">حدد نطاق الاختبار:</h3>
                                    </div>

                                    {/* الخيار 1: المصحف كامل */}
                                    <button onClick={() => { setSelectionType('full'); setSelectedItems(['all']); setTimeout(startExam, 100); }} 
                                        className="w-full bg-white border-l-4 border-amber-500 p-4 rounded-xl shadow-sm hover:bg-amber-50 transition text-right group">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <div className="font-black text-amber-900 text-sm">🕌 المصحف كاملاً</div>
                                                <div className="text-[10px] text-gray-500">أسئلة عشوائية من كل القرآن</div>
                                            </div>
                                            <span className="group-hover:-translate-x-2 transition">⬅️</span>
                                        </div>
                                    </button>

                                    {/* الخيار 2: جزء معين */}
                                    <button onClick={() => { setSelectionType('juz'); setMode('selection'); setSelectedItems([]); }} 
                                        className="w-full bg-white border-l-4 border-teal-500 p-4 rounded-xl shadow-sm hover:bg-teal-50 transition text-right group">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <div className="font-black text-teal-900 text-sm">📚 جزء معين</div>
                                                <div className="text-[10px] text-gray-500">اختر جزءاً واحداً أو أكثر</div>
                                            </div>
                                            <span className="group-hover:-translate-x-2 transition">⬅️</span>
                                        </div>
                                    </button>

                                    {/* الخيار 3: سورة معينة */}
                                    <button onClick={() => { setSelectionType('surah'); setMode('selection'); setSelectedItems([]); }} 
                                        className="w-full bg-white border-l-4 border-indigo-500 p-4 rounded-xl shadow-sm hover:bg-indigo-50 transition text-right group">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <div className="font-black text-indigo-900 text-sm">📖 سورة معينة</div>
                                                <div className="text-[10px] text-gray-500">اختر سورة محددة للمراجعة</div>
                                            </div>
                                            <span className="group-hover:-translate-x-2 transition">⬅️</span>
                                        </div>
                                    </button>
                                </div>
                            )}

                            {/* 2. شاشة الاختيار (للأجزاء والسور) */}
                            {mode === 'selection' && (
                                <div className="flex flex-col h-full animate-in">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-black text-gray-700">
                                            {selectionType === 'surah' ? 'اختر السور' : 'اختر الأجزاء'}
                                        </h3>
                                        <button onClick={() => setMode('menu')} className="text-xs font-bold text-red-500 bg-red-50 px-3 py-1 rounded-lg">إلغاء</button>
                                    </div>
                                    
                                    <div className="flex-1 overflow-y-auto max-h-[300px] grid grid-cols-3 gap-2 mb-4 pr-1 scrollbar-hide">
                                        {selectionType === 'surah' ? (
                                            Object.values(window.APP_DATA.quran).map(surah => (
                                                <button key={surah.number} onClick={() => toggleSelection(surah.number)} 
                                                    className={`p-2 text-[10px] font-bold rounded-lg border transition ${selectedItems.includes(surah.number) ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600'}`}>
                                                    {surah.number}. {surah.name}
                                                </button>
                                            ))
                                        ) : (
                                            Array.from({length: 30}, (_, i) => i + 1).map(juz => (
                                                <button key={juz} onClick={() => toggleSelection(juz)} 
                                                    className={`p-3 text-xs font-bold rounded-xl border transition ${selectedItems.includes(juz) ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-gray-600'}`}>
                                                    الجزء {juz}
                                                </button>
                                            ))
                                        )}
                                    </div>
                                    
                                    <button onClick={startExam} disabled={selectedItems.length === 0} className="w-full bg-emerald-600 text-white py-3 rounded-xl font-black shadow-lg disabled:opacity-50 hover:bg-emerald-700 transition">
                                        ابدأ التحدي ({selectedItems.length}) 🚀
                                    </button>
                                </div>
                            )}

                            {/* 3. شاشة اللعب */}
                            {mode === 'playing' && questions[currentQIndex] && (
                                <div className="space-y-4 animate-in">
                                    {/* الشريط العلوي */}
                                    <div className="flex justify-between items-center text-xs font-bold text-gray-500">
                                        <div className="flex items-center gap-2">
                                            <span>النقاط: {score}</span>
                                            {isBlitz && (
                                                <span className={`px-2 py-1 rounded text-white font-mono shadow-sm ${timeLeft < 5 ? 'bg-red-600 animate-bounce' : timeLeft < 10 ? 'bg-orange-500' : 'bg-emerald-500'}`}>
                                                    ⏱️ {timeLeft}s
                                                </span>
                                            )}
                                        </div>
                                        <span>{currentQIndex + 1} / {questions.length}</span>
                                    </div>
                                    
                                    {/* بطاقة السؤال */}
                                    <div className="bg-white p-6 rounded-2xl border-2 border-amber-50 shadow-sm text-center relative">
                                        <span className="absolute top-0 right-0 bg-amber-100 text-amber-800 text-[9px] font-bold px-3 py-1 rounded-bl-xl">
                                            سورة {questions[currentQIndex].surah}
                                        </span>
                                        <p className="text-[10px] text-gray-400 mb-2">ما معنى قوله تعالى:</p>
                                        <h2 className="font-amiri text-lg font-bold text-gray-800 leading-loose">
                                            ﴿ {questions[currentQIndex].ayahText} ﴾
                                        </h2>
                                    </div>

                                    {/* الخيارات */}
                                    <div className="space-y-2">
                                        {questions[currentQIndex].options.map((opt, idx) => {
                                            const isCorrect = opt === questions[currentQIndex].correct;
                                            let btnClass = "bg-white border-gray-200 text-gray-600 hover:border-amber-300";
                                            
                                            if (feedback) {
                                                if (isCorrect) btnClass = "bg-green-100 border-green-500 text-green-800 font-bold";
                                                else btnClass = "opacity-40 bg-gray-50";
                                                
                                                if (feedback === 'wrong' && !isCorrect) btnClass = "bg-red-50 border-red-200 text-red-800 opacity-50";
                                            }

                                            return (
                                                <button key={idx} onClick={() => handleAnswer(opt)} disabled={!!feedback}
                                                    className={`w-full p-3 rounded-xl border-2 text-xs text-right leading-relaxed transition-all duration-200 ${btnClass}`}>
                                                    {opt}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    {feedback === 'timeout' && <div className="text-center text-red-500 font-bold text-xs animate-pulse">انتهى الوقت! ⌛</div>}
                                </div>
                            )}

                            {/* 4. النتيجة والمراجعة */}
                            {mode === 'result' && (
                                <div className="text-center animate-in py-6">
                                    <div className="text-6xl mb-2">{score === questions.length ? '🏆' : score > questions.length/2 ? '👍' : '📚'}</div>
                                    <h3 className="text-xl font-black text-gray-800">النتيجة النهائية</h3>
                                    <p className="text-3xl font-black text-amber-600 mb-6">{score} <span className="text-sm text-gray-400">/ {questions.length}</span></p>
                                    
                                    {/* مراجعة الأخطاء */}
                                    {mistakes.length > 0 && (
                                        <div className="mb-6 text-right">
                                            <h4 className="font-bold text-red-500 mb-2 text-sm border-b pb-1">🛑 راجع أخطاءك لتستفيد:</h4>
                                            <div className="space-y-3 max-h-[250px] overflow-y-auto bg-red-50 p-3 rounded-xl border border-red-100">
                                                {mistakes.map((m, i) => (
                                                    <div key={i} className="bg-white p-3 rounded-lg border border-red-100 shadow-sm">
                                                        <p className="font-amiri text-xs font-bold text-gray-800 mb-2">﴿ {m.q} ﴾</p>
                                                        <div className="text-[10px] space-y-1">
                                                            <p className="text-red-500 line-through">❌ {m.wrong}</p>
                                                            <p className="text-green-600 font-bold">✅ {m.right}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex gap-2">
                                        <button onClick={() => setMode('menu')} className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold text-xs">القائمة</button>
                                        <button onClick={() => { setMode('menu'); }} className="flex-1 bg-amber-600 text-white py-3 rounded-xl font-bold text-xs shadow-lg">إعادة الاختبار 🔄</button>
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
