/* =========================================
   موديول: اختبر حفظك (النسخة القديمة الآمنة)
   المسار: js/modules/test.js
   ========================================= */
const { useState } = React;

const TestHifz = () => {
    // حماية: إذا لم توجد بيانات، لا تنهار الصفحة
    if (!window.quranData) return <div className="text-center p-4">⚠️ بانتظار تحميل المصحف...</div>;

    const [question, setQuestion] = useState(null);
    const [showAnswer, setShowAnswer] = useState(false);

    const generateQuestion = () => {
        const randomSurah = window.quranData[Math.floor(Math.random() * window.quranData.length)];
        // تأكد أن السورة لها آيات
        if (!randomSurah.ayahs || randomSurah.ayahs.length === 0) return generateQuestion();
        
        const randomAyahIndex = Math.floor(Math.random() * randomSurah.ayahs.length);
        
        setQuestion({
            surah: randomSurah.name,
            ayah: randomSurah.ayahs[randomAyahIndex].text,
            nextAyah: randomSurah.ayahs[randomAyahIndex + 1]?.text || "نهاية السورة"
        });
        setShowAnswer(false);
    };

    return (
        <div className="bg-white p-6 rounded-[2rem] border border-gray-200 shadow-sm animate-in text-center">
            {!question ? (
                <div className="space-y-4">
                    <div className="text-6xl mb-4">🧠</div>
                    <h3 className="font-black text-gray-800">اختبار الحفظ السريع</h3>
                    <p className="text-xs text-gray-500">يظهر لك آية عشوائية وعليك تذكر ما بعدها.</p>
                    <button onClick={generateQuestion} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-black shadow-lg">ابدأ الاختبار</button>
                </div>
            ) : (
                <div className="space-y-6">
                    <span className="text-[10px] bg-indigo-50 text-indigo-800 px-3 py-1 rounded-full font-bold">سورة {question.surah}</span>
                    <h3 className="font-amiri text-xl font-bold leading-loose text-gray-800">﴿ {question.ayah} ﴾</h3>
                    
                    <div className="p-4 bg-gray-50 rounded-xl min-h-[80px] flex items-center justify-center">
                        {showAnswer ? (
                            <p className="font-amiri text-lg text-emerald-600 font-bold animate-in">﴿ {question.nextAyah} ﴾</p>
                        ) : (
                            <p className="text-gray-400 text-sm font-bold">؟ ؟ ؟</p>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <button onClick={() => setShowAnswer(true)} className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold text-sm">إظهار الإجابة</button>
                        <button onClick={generateQuestion} className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold text-sm shadow-lg">آية أخرى 🔄</button>
                    </div>
                </div>
            )}
        </div>
    );
};

window.TestHifz = TestHifz;
