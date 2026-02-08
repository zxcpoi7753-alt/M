/* =========================================
   المكون: مسابقة التفسير الاحترافية (اختبر فهمك)
   المسار: js/components/extras/TafseerExam.js
   ========================================= */
const { useState, useEffect, useRef } = React;

const TafseerExam = () => {
    // --- الحالة (State) ---
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState('menu'); // menu, selection, playing, result
    
    // إعدادات اللعبة
    const [isBlitz, setIsBlitz] = useState(false); // تحدي السرعة
    const [selectionType, setSelectionType] = useState(null); 
    const [selectedItems, setSelectedItems] = useState([]);
    
    // بيانات اللعب
    const [questions, setQuestions] = useState([]);
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState(null); // correct, wrong
    const [timeLeft, setTimeLeft] = useState(20); // 20 ثانية للتحدي
    const [mistakes, setMistakes] = useState([]); // قائمة الأخطاء للمراجعة
    const [dbReady, setDbReady] = useState(false);

    // توقيت (Timer)
    const timerRef = useRef(null);

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

    // إدارة التوقيت (Blitz Mode)
    useEffect(() => {
        if (mode === 'playing' && isBlitz) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        finishGame();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timerRef.current);
    }, [mode, isBlitz]);

    const finishGame = () => {
        clearInterval(timerRef.current);
        setMode('result');
    };

    // --- المنطق ---

    const startByLevel = (level) => {
        let targetSurahs = [];
        const all = Object.values(window.APP_DATA.quran);
        
        if (level === 'full') {
            targetSurahs = all;
        } else if (level === 'level1') { // 1-10 أجزاء (الفاتحة -> التوبة)
            targetSurahs = all.filter(s => s.number >= 1 && s.number <= 9);
        } else if (level === 'level2') { // 11-20 جزء (يونس -> العنكبوت)
            targetSurahs = all.filter(s => s.number >= 10 && s.number <= 29);
        } else if (level === 'level3') { // 21-30 جزء (الروم -> الناس)
            targetSurahs = all.filter(s => s.number >= 30 && s.number <= 114);
        }

        generateQuestions(targetSurahs);
    };

    const startCustom = () => {
        const all = Object.values(window.APP_DATA.quran);
        const targets = all.filter(s => selectedItems.includes(s.number));
        generateQuestions(targets);
    };

    const generateQuestions = (targetSurahs) => {
        if (!targetSurahs || targetSurahs.length === 0) return alert("البيانات غير متوفرة");

        const newQuestions = [];
        // في الوضع العادي 5 أسئلة، في التحدي نولد 50 سؤالاً احتياطياً
        const totalQ = isBlitz ? 50 : 5; 

        for (let i = 0; i < totalQ; i++) {
            const randSurah = targetSurahs[Math.floor(Math.random() * targetSurahs.length)];
            // حماية: التأكد من وجود آيات
            if (!randSurah.ayahs || randSurah.ayahs.length === 0) continue;
            
            const randAyah = randSurah.ayahs[Math.floor(Math.random() * randSurah.ayahs.length)];
            
            const key = `${randSurah.number}_${randAyah.num || randAyah.numberInSurah}`;
            const correctTafseer = window.APP_DATA.tafseer[key];

            if (!correctTafseer) { i--; continue; }

            // خيارات خاطئة
            let wrongOptions = [];
            let attempts = 0;
            while (wrongOptions.length < 2 && attempts < 50) {
                const s = targetSurahs[Math.floor(Math.random() * targetSurahs.length)];
                if (s.ayahs) {
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

        setQuestions(newQuestions);
        setScore(0);
        setCurrentQIndex(0);
        setMistakes([]);
        setTimeLeft(20); // إعادة ضبط الوقت
        setMode('playing');
        setFeedback(null);
    };

    const handleAnswer = (option) => {
        if (feedback) return;
        
        const currentQ = questions[currentQIndex];
        const isCorrect = option === currentQ.correct;
        
        setFeedback(isCorrect ? 'correct' : 'wrong');
        
        if (isCorrect) {
            setScore(s => s + 1);
            if (isBlitz) setTimeLeft(t => t + 5); // مكافأة وقت
        } else {
            if (isBlitz) setTimeLeft(t => Math.max(0, t - 5)); // خصم وقت
            // تسجيل الخطأ للمراجعة
            setMistakes(prev => [...prev, {
                q: currentQ.ayahText,
                surah: currentQ.surah,
                wrong: option,
                right: currentQ.correct
            }]);
        }

        // الانتقال للسؤال التالي
        setTimeout(() => {
            setFeedback(null);
            if (currentQIndex < questions.length - 1) {
                setCurrentQIndex(prev => prev + 1);
            } else {
                finishGame();
            }
        }, isBlitz ? 800 : 1500); // تسريع الانتقال في وضع التحدي
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
                            {/* 1. القائمة الرئيسية */}
                            {mode === 'menu' && (
                                <div className="space-y-3 my-auto animate-in">
                                    
                                    {/* زر تفعيل تحدي السرعة */}
                                    <div onClick={() => setIsBlitz(!isBlitz)} className={`p-3 rounded-xl border-2 flex justify-between items-center cursor-pointer transition ${isBlitz ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'}`}>
                                        <div>
                                            <span className="font-bold text-xs block text-gray-800">⚡ تحدي السرعة (20 ثانية)</span>
                                            <span className="text-[9px] text-gray-400 block">إجابة صحيحة +5ث | إجابة خاطئة -5ث</span>
                                        </div>
                                        <div className={`w-10 h-5 rounded-full relative transition ${isBlitz ? 'bg-red-500' : 'bg-gray-300'}`}>
                                            <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all ${isBlitz ? 'right-5' : 'right-0.5'}`}></div>
                                        </div>
                                    </div>

                                    <div className="text-center my-4">
                                        <h3 className="font-black text-gray-800 text-sm">اختر المستوى:</h3>
                                    </div>

                                    <button onClick={() => startByLevel('full')} className="w-full bg-white border-l-4 border-amber-500 p-3 rounded-xl shadow-sm hover:bg-amber-50 transition text-right">
                                        <div className="font-black text-amber-900">🕌 المصحف كاملاً</div>
                                        <div className="text-[10px] text-gray-500">تحدي شامل من الفاتحة إلى الناس</div>
                                    </button>

                                    <button onClick={() => startByLevel('level1')} className="w-full bg-white border-l-4 border-green-500 p-3 rounded-xl shadow-sm hover:bg-green-50 transition text-right">
                                        <div className="font-black text-green-900">📗 الثلث الأول (1-10 أجزاء)</div>
                                        <div className="text-[10px] text-gray-500">من الفاتحة إلى التوبة (طوال السور)</div>
                                    </button>

                                    <button onClick={() => startByLevel('level2')} className="w-full bg-white border-l-4 border-orange-500 p-3 rounded-xl shadow-sm hover:bg-orange-50 transition text-right">
                                        <div className="font-black text-orange-900">📙 الثلث الثاني (11-20 جزء)</div>
                                        <div className="text-[10px] text-gray-500">من يونس إلى العنكبوت (المئين)</div>
                                    </button>

                                    <button onClick={() => startByLevel('level3')} className="w-full bg-white border-l-4 border-blue-500 p-3 rounded-xl shadow-sm hover:bg-blue-50 transition text-right">
                                        <div className="font-black text-blue-900">📘 الثلث الأخير (21-30 جزء)</div>
                                        <div className="text-[10px] text-gray-500">من الروم إلى الناس (المفصل - الأسهل)</div>
                                    </button>

                                    <button onClick={() => { setMode('selection'); setSelectedItems([]); }} className="w-full bg-gray-100 p-3 rounded-xl font-bold text-xs text-gray-600 hover:bg-gray-200">
                                        📖 اختيار سور محددة
                                    </button>
                                </div>
                            )}

                            {/* 2. شاشة اختيار السور (للمخصص) */}
                            {mode === 'selection' && (
                                <div className="flex flex-col h-full animate-in">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-black text-gray-700">اختر السور للاختبار</h3>
                                        <button onClick={() => setMode('menu')} className="text-xs font-bold text-red-500">رجوع</button>
                                    </div>
                                    <div className="flex-1 overflow-y-auto max-h-[300px] grid grid-cols-3 gap-2 mb-4 pr-1 scrollbar-hide">
                                        {Object.values(window.APP_DATA.quran).map(surah => (
                                            <button key={surah.number} onClick={() => setSelectedItems(prev => prev.includes(surah.number) ? prev.filter(x=>x!==surah.number) : [...prev, surah.number])} 
                                                className={`p-2 text-[10px] font-bold rounded-lg border transition ${selectedItems.includes(surah.number) ? 'bg-amber-600 text-white border-amber-600' : 'bg-white text-gray-600'}`}>
                                                {surah.number}. {surah.name}
                                            </button>
                                        ))}
                                    </div>
                                    <button onClick={startCustom} disabled={selectedItems.length === 0} className="w-full bg-amber-600 text-white py-3 rounded-xl font-black shadow-lg disabled:opacity-50">
                                        ابدأ التحدي 🚀
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
                                                <span className={`px-2 py-1 rounded text-white font-mono ${timeLeft < 10 ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`}>
                                                    ⏱️ {timeLeft}s
                                                </span>
                                            )}
                                        </div>
                                        <span>{isBlitz ? '∞' : `${currentQIndex + 1}/${questions.length}`}</span>
                                    </div>
                                    
                                    {/* بطاقة السؤال */}
                                    <div className="bg-white p-6 rounded-2xl border-2 border-amber-50 shadow-sm text-center relative">
                                        <span className="absolute top-0 right-0 bg-amber-100 text-amber-800 text-[9px] font-bold px-3 py-1 rounded-bl-xl">
                                            سورة {questions[currentQIndex].surah}
                                        </span>
                                        <p className="text-[10px] text-gray-400 mb-2">اختر التفسير الصحيح:</p>
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
                                                if (feedback === 'wrong' && !isCorrect) btnClass = "bg-red-50 border-red-200 text-red-800";
                                            }

                                            return (
                                                <button key={idx} onClick={() => handleAnswer(opt)} disabled={!!feedback}
                                                    className={`w-full p-3 rounded-xl border-2 text-xs text-right leading-relaxed transition-all duration-200 ${btnClass}`}>
                                                    {opt}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* 4. النتيجة والمراجعة */}
                            {mode === 'result' && (
                                <div className="text-center animate-in py-6">
                                    <div className="text-6xl mb-2">{score > 0 ? '🏆' : '📚'}</div>
                                    <h3 className="text-xl font-black text-gray-800">انتهى الاختبار</h3>
                                    <p className="text-3xl font-black text-amber-600 mb-6">{score} <span className="text-sm text-gray-400">نقاط</span></p>
                                    
                                    {/* قسم مراجعة الأخطاء */}
                                    {mistakes.length > 0 && (
                                        <div className="mb-6 text-right">
                                            <h4 className="font-bold text-red-500 mb-2 text-sm border-b pb-1">🛑 راجع أخطاءك لتتعلم:</h4>
                                            <div className="space-y-3 max-h-[200px] overflow-y-auto bg-red-50 p-3 rounded-xl border border-red-100">
                                                {mistakes.map((m, i) => (
                                                    <div key={i} className="bg-white p-3 rounded-lg border border-red-100 shadow-sm">
                                                        <p className="font-amiri text-xs font-bold text-gray-800 mb-2">﴿ {m.q} ﴾</p>
                                                        <div className="text-[10px]">
                                                            <p className="text-red-500 line-through mb-1">❌ {m.wrong}</p>
                                                            <p className="text-green-600 font-bold">✅ {m.right}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex gap-2">
                                        <button onClick={() => setMode('menu')} className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold text-xs">القائمة</button>
                                        <button onClick={() => { setMode('menu'); }} className="flex-1 bg-amber-600 text-white py-3 rounded-xl font-bold text-xs shadow-lg">اختبار جديد 🔄</button>
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
