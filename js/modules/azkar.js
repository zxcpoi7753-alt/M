/* =========================================
   موديول: الأذكار (النسخة الآمنة)
   المسار: js/modules/azkar.js
   ========================================= */
const { useState, useEffect } = React;

const AzkarApp = () => {
    const [category, setCategory] = useState(null); // 'morning', 'evening', etc.
    const [count, setCount] = useState(0);
    const [currentZikrIndex, setCurrentZikrIndex] = useState(0);
    
    // بيانات الأذكار (يقرأ من window.azkarData الذي وفره data_loader.js)
    const azkarData = window.azkarData || { 
        "الصباح": [{ content: "سبحان الله", count: 3 }], 
        "المساء": [{ content: "الحمد لله", count: 3 }] 
    };

    const categories = Object.keys(azkarData);

    const handleClick = () => {
        // الاهتزاز عند التسبيح (للهواتف)
        if (navigator.vibrate) navigator.vibrate(50);
        
        const currentZikr = azkarData[category][currentZikrIndex];
        if (count < currentZikr.count) {
            setCount(prev => prev + 1);
        } else {
            // الانتقال للذكر التالي
            if (currentZikrIndex < azkarData[category].length - 1) {
                setCurrentZikrIndex(prev => prev + 1);
                setCount(0);
            } else {
                window.alert("✨ فتح الله عليك! أتممت الأذكار.");
                setCategory(null);
                setCount(0);
                setCurrentZikrIndex(0);
            }
        }
    };

    return (
        <div className="animate-in bg-white rounded-[2rem] border border-emerald-100 shadow-sm overflow-hidden p-6">
            {!category ? (
                <div className="grid grid-cols-2 gap-4">
                    {categories.map(cat => (
                        <button key={cat} onClick={() => setCategory(cat)} className="p-4 bg-emerald-50 rounded-2xl text-emerald-800 font-black hover:bg-emerald-100 transition shadow-sm border border-emerald-100">
                            {cat}
                        </button>
                    ))}
                </div>
            ) : (
                <div className="text-center space-y-6">
                    <div className="flex justify-between items-center mb-4">
                        <button onClick={() => setCategory(null)} className="text-xs font-bold text-gray-400 hover:text-red-500">✕ خروج</button>
                        <span className="text-xs font-bold text-emerald-600">{category} ({currentZikrIndex + 1}/{azkarData[category].length})</span>
                    </div>

                    <div className="min-h-[120px] flex items-center justify-center">
                        <h3 className="text-xl font-amiri font-bold leading-loose text-gray-800">
                            {azkarData[category][currentZikrIndex].content}
                        </h3>
                    </div>

                    <button 
                        onClick={handleClick}
                        className="w-full h-32 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-black text-4xl shadow-lg active:scale-95 transition-transform flex flex-col items-center justify-center gap-2"
                    >
                        <span>{count}</span>
                        <span className="text-xs opacity-70 font-normal">اضغط للتسبيح / الهدف: {azkarData[category][currentZikrIndex].count}</span>
                    </button>
                </div>
            )}
        </div>
    );
};

// تصدير هام جداً (بدونه يختفي الزر)
window.AzkarApp = AzkarApp;
