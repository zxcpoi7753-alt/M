/* =========================================
   المكون: المحاكي القرآني (النسخة الآمنة)
   المسار: js/components/extras/QuranExam.js
   ========================================= */
const { useState, useEffect } = React;

const QuranExam = () => {
    const [isOpen, setIsOpen] = useState(false);
    // حالة فحص البيانات: هل المصحف موجود؟
    const isDataReady = window.quranData && window.quranData.length > 0;

    return (
        <div className="bg-white rounded-[2rem] border border-gray-200 shadow-sm overflow-hidden mb-6 animate-in">
            {/* 1. رأس القائمة (يظهر دائماً) */}
            <div onClick={() => setIsOpen(!isOpen)} className="p-5 flex justify-between items-center cursor-pointer bg-gradient-to-r from-teal-50 to-white hover:bg-teal-100 transition">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">🧠</span>
                    <div>
                        <h3 className="font-black text-teal-900">المحاكي القرآني</h3>
                        <p className="text-[10px] text-gray-500 font-bold">
                            {isDataReady ? "جاهز للاختبار" : "جاري تحميل المصحف..."}
                        </p>
                    </div>
                </div>
                <div className={`transform transition duration-300 ${isOpen ? 'rotate-180' : ''}`}>▼</div>
            </div>

            {/* 2. المحتوى الداخلي */}
            {isOpen && (
                <div className="p-5 bg-gray-50 border-t min-h-[200px] flex items-center justify-center">
                    {!isDataReady ? (
                        <div className="text-center text-gray-500 animate-pulse">
                            ⏳ يرجى الانتظار، يتم تجهيز بيانات المصحف...
                            <br/><span className="text-[10px] text-red-400">(إذا طال الانتظار، تأكد من ملف data/quran.json)</span>
                        </div>
                    ) : (
                        <div className="text-center space-y-4 w-full">
                            <h3 className="font-black text-gray-800">أهلاً بك في نظام الاختبارات</h3>
                            <p className="text-xs text-gray-500">اختر نوع الاختبار للبدء</p>
                            <button className="w-full bg-teal-600 text-white py-3 rounded-xl font-bold shadow-lg" onClick={() => alert('سيبدأ الاختبار الآن (الكود يعمل!)')}>
                                ابدأ اختبار تجريبي
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// تصدير المكون (هام جداً)
window.QuranExam = QuranExam;
