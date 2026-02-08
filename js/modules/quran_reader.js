/* =========================================
   الوحدة: المصحف الشريف (Quran Reader) - النسخة المتوافقة
   المسار: js/modules/quran_reader.js
   ========================================= */
const { useState, useMemo } = React;

window.QuranReader = () => {
    // 1. التأكد من وجود البيانات
    if (!window.quranData || window.quranData.length === 0) {
        return <div className="text-center p-10 text-gray-500 animate-pulse">📖 جاري تجهيز المصحف الشريف...</div>;
    }

    const [selectedSurah, setSelectedSurah] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    // تصفية السور حسب البحث
    const filteredSurahs = useMemo(() => {
        return window.quranData.filter(s => s.name.includes(searchTerm));
    }, [searchTerm]);

    return (
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden animate-in">
            {/* واجهة قائمة السور */}
            {!selectedSurah ? (
                <div className="p-4">
                    <h3 className="text-center font-black text-emerald-900 mb-4">📖 المصحف الشريف</h3>
                    
                    {/* خانة البحث */}
                    <input 
                        type="text" 
                        placeholder="🔍 ابحث عن سورة..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold mb-4 focus:outline-none focus:border-emerald-500"
                    />

                    <div className="grid grid-cols-3 gap-2 max-h-[400px] overflow-y-auto pr-1">
                        {filteredSurahs.map(s => (
                            <button 
                                key={s.number} 
                                onClick={() => setSelectedSurah(s)}
                                className="p-3 bg-emerald-50 hover:bg-emerald-100 rounded-xl text-center border border-emerald-100 transition"
                            >
                                <div className="text-[10px] text-gray-400 font-bold mb-1">#{s.number}</div>
                                <div className="text-sm font-black text-emerald-800">{s.name}</div>
                                <div className="text-[9px] text-gray-500">{s.ayahs.length} آية</div>
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                /* واجهة قراءة السورة */
                <div className="relative h-[500px] flex flex-col">
                    {/* شريط العنوان */}
                    <div className="p-4 border-b bg-emerald-50 flex justify-between items-center sticky top-0 z-10">
                        <button onClick={() => setSelectedSurah(null)} className="px-4 py-2 bg-white rounded-lg text-xs font-bold text-gray-700 shadow-sm hover:bg-gray-50">⬅️ القائمة</button>
                        <h3 className="font-black text-emerald-900 text-lg">سورة {selectedSurah.name}</h3>
                        <div className="w-16"></div> {/* فراغ للتوازن */}
                    </div>

                    {/* محتوى الآيات */}
                    <div className="flex-1 overflow-y-auto p-6 bg-[#fffdf5]">
                        <div className="max-w-2xl mx-auto text-center leading-[2.5] text-2xl text-gray-800 font-amiri" dir="rtl">
                            {/* البسملة (إلا في التوبة رقم 9) */}
                            {selectedSurah.number !== 9 && (
                                <div className="text-emerald-700 font-bold mb-6 text-xl">﷽</div>
                            )}
                            
                            {/* عرض الآيات */}
                            {selectedSurah.ayahs.map((ayah, i) => (
                                <span key={i}>
                                    {ayah.text} 
                                    <span className="text-emerald-600 text-xl inline-block mx-1 font-bold"> ﴿{ayah.numberInSurah || (i + 1)}﴾ </span>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
