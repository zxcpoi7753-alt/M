/* =========================================
   المكون: المحاكي القرآني (النسخة الفعالة)
   المسار: js/components/extras/QuranExam.js
   ========================================= */
const { useState, useEffect } = React;

const QuranExam = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [gameState, setGameState] = useState('menu'); // menu, play, result
    const [qData, setQData] = useState(null);
    const [feedback, setFeedback] = useState(null); // success, error
    const [score, setScore] = useState(0);

    const start = () => {
        if (!window.quranData || window.quranData.length === 0) return window.showGlobalAlert("عفواً", "البيانات غير جاهزة");
        
        // اختيار سؤال عشوائي
        const randS = window.quranData[Math.floor(Math.random() * window.quranData.length)];
        const randAIdx = Math.floor(Math.random() * (randS.ayahs.length - 1));
        const qAyah = randS.ayahs[randAIdx];
        const ansAyah = randS.ayahs[randAIdx + 1];

        // خيارات خطأ
        const options = [ansAyah.text];
        while (options.length < 4) {
            const rS = window.quranData[Math.floor(Math.random() * window.quranData.length)];
            const rA = rS.ayahs[Math.floor(Math.random() * rS.ayahs.length)].text;
            if (!options.includes(rA)) options.push(rA);
        }

        setQData({
            surah: randS.name,
            qText: qAyah.text,
            correct: ansAyah.text,
            options: options.sort(() => Math.random() - 0.5)
        });
        setGameState('play');
        setFeedback(null);
    };

    const answer = (opt) => {
        if (feedback) return;
        const isCorrect = opt === qData.correct;
        setFeedback(isCorrect ? 'success' : 'error');
        if (isCorrect) setScore(s => s + 1);
        setTimeout(() => start(), 1500); // السؤال التالي تلقائياً
    };

    return (
        <div className="bg-white rounded-[2rem] border border-gray-200 shadow-sm overflow-hidden mb-4 animate-in">
            <div onClick={() => setIsOpen(!isOpen)} className="p-5 flex justify-between items-center cursor-pointer bg-gradient-to-r from-teal-50 to-white hover:bg-teal-100 transition">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">🧠</span>
                    <div>
                        <h3 className="font-black text-teal-900">المحاكي القرآني</h3>
                        <p className="text-[10px] text-gray-500 font-bold">لعبة إكمال الآيات السريعة</p>
                    </div>
                </div>
                <div className={`transform transition duration-300 ${isOpen ? 'rotate-180' : ''}`}>▼</div>
            </div>

            {isOpen && (
                <div className="p-5 bg-gray-50 border-t min-h-[200px]">
                    {gameState === 'menu' && (
                        <div className="text-center py-4">
                            <p className="text-sm text-gray-600 mb-4">اختبر سرعة استحضارك للآيات</p>
                            <button onClick={start} className="bg-teal-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg w-full">ابدأ التحدي 🚀</button>
                        </div>
                    )}

                    {gameState === 'play' && qData && (
                        <div className="animate-in">
                            <div className="flex justify-between text-xs font-bold text-gray-400 mb-2">
                                <span>النقاط: {score}</span>
                                <span>سورة {qData.surah}</span>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border mb-4 text-center">
                                <p className="font-amiri text-xl font-bold text-gray-800">﴿ {qData.qText} ﴾</p>
                            </div>
                            <div className="space-y-2">
                                {qData.options.map((opt, i) => (
                                    <button key={i} onClick={() => answer(opt)} 
                                        className={`w-full p-3 rounded-xl text-sm font-bold text-right transition-all
                                        ${feedback && opt === qData.correct ? 'bg-green-500 text-white' : ''}
                                        ${feedback === 'error' && opt !== qData.correct ? 'opacity-50' : ''}
                                        ${!feedback ? 'bg-white border hover:bg-gray-50' : ''}
                                        `}>
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
window.QuranExam = QuranExam;
