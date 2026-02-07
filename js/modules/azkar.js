/* =========================================
   الوحدة: الأذكار (Azkar) - التصميم الأصلي + بحث
   المسار: js/modules/azkar.js
   ========================================= */
const { useState, useEffect, useMemo } = React;

window.AzkarApp = () => {
    // التأكد من وجود البيانات
    if (!window.APP_DATA || !window.APP_DATA.azkar) {
        return <div className="text-center p-4 text-gray-500">⏳ جاري تحميل الأذكار...</div>;
    }

    const [view, setView] = useState('cats');
    const [selCat, setSelCat] = useState(null);
    const [counts, setCounts] = useState({});
    const [searchTerm, setSearchTerm] = useState(""); // إضافة البحث

    // استخراج التصنيفات
    const categories = useMemo(() => {
        return [...new Set(window.APP_DATA.azkar.map(z => z.category))];
    }, []);

    // تهيئة العدادات
    useEffect(() => {
        const init = {};
        window.APP_DATA.azkar.forEach((z, i) => init[i] = z.count || 1);
        setCounts(init);
    }, []);

    const click = (originalIndex) => {
        if (counts[originalIndex] > 0) {
            setCounts(p => ({...p, [originalIndex]: p[originalIndex]-1}));
            if(navigator.vibrate) navigator.vibrate(30);
            
            if (counts[originalIndex] === 1 && window.showGlobalAlert) {
                // يمكن إضافة رسالة عند الانتهاء إذا أردت
            }
        }
    };

    // فلترة الأذكار (للبحث والقسم)
    const filteredAzkar = window.APP_DATA.azkar.map((z, i) => ({...z, originalIndex: i})).filter(z => {
        const matchesCat = z.category === selCat;
        const matchesSearch = z.zekr.includes(searchTerm);
        return matchesCat && matchesSearch;
    });

    return (
        <div className="bg-white rounded-[2rem] border border-emerald-100 shadow-sm overflow-hidden p-4 animate-in">
            {view === 'cats' && (
                <div className="space-y-3">
                    <h3 className="text-center font-black text-emerald-800 mb-2">📿 حصن المسلم</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {categories.map(c => (
                            <button key={c} onClick={()=>{setSelCat(c); setView('list')}} className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm font-bold text-emerald-800 text-sm flex flex-col items-center hover:border-emerald-500 transition">
                                <span className="text-2xl mb-1">✨</span> {c}
                            </button>
                        ))}
                        <button onClick={()=>setView('sebha')} className="col-span-2 p-3 bg-amber-50 border border-amber-200 rounded-xl font-bold text-amber-800 shadow-sm">السبحة الحرة 👆</button>
                    </div>
                </div>
            )}
            {view === 'list' && (
                <div>
                    <div className="flex justify-between items-center mb-3">
                        <button onClick={()=>{setView('cats'); setSearchTerm('');}} className="text-xs bg-gray-100 px-3 py-1 rounded text-gray-500 font-bold">⬅️ رجوع</button>
                        <h3 className="text-center font-black text-emerald-800 bg-emerald-50 px-3 py-1 rounded text-sm">{selCat}</h3>
                    </div>
                    
                    {/* خانة البحث */}
                    <input 
                        type="text" 
                        placeholder="🔍 ابحث في هذا القسم..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-2 bg-gray-50 border rounded-lg text-xs font-bold mb-3 focus:outline-none focus:border-emerald-500"
                    />

                    <div className="space-y-3 max-h-[400px] overflow-y-auto">
                        {filteredAzkar.length > 0 ? filteredAzkar.map((z) => (
                            <div key={z.originalIndex} onClick={()=>click(z.originalIndex)} className={`relative p-4 bg-white border-r-4 rounded-xl shadow-sm cursor-pointer ${counts[z.originalIndex]===0 ? 'border-gray-300 opacity-50 bg-gray-50' : 'border-emerald-500'}`}>
                                {/* الترقيم */}
                                <div className="absolute top-2 left-2 text-[10px] text-gray-300 font-black">#{z.originalIndex + 1}</div>
                                
                                <div className="flex justify-between mb-2">
                                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${counts[z.originalIndex]===0 ? 'bg-green-100 text-green-700' : 'bg-emerald-100 text-emerald-700'}`}>{counts[z.originalIndex]===0 ? 'تم ✅' : `باقي: ${counts[z.originalIndex]}`}</span>
                                </div>
                                <p className="font-amiri text-lg leading-loose">{z.zekr}</p>
                                {z.reference && <p className="text-[10px] text-gray-400 mt-2">{z.reference}</p>}
                            </div>
                        )) : <div className="text-center text-gray-400 text-xs">لا توجد نتائج</div>}
                    </div>
                </div>
            )}
            {view === 'sebha' && (
                <div className="text-center py-10 relative">
                    <button onClick={()=>setView('cats')} className="absolute top-4 right-4 text-xs font-bold text-gray-500">خروج</button>
                    <div className="w-32 h-32 mx-auto rounded-full bg-amber-500 shadow-xl flex items-center justify-center text-white text-4xl font-black cursor-pointer active:scale-95 transition-transform select-none ring-4 ring-amber-200" onClick={(e)=>{e.target.innerText = parseInt(e.target.innerText)+1; if(navigator.vibrate) navigator.vibrate(30);}}>0</div>
                    <button onClick={(e)=>e.target.parentElement.querySelector('.rounded-full').innerText=0} className="mt-6 text-red-500 font-bold text-xs bg-red-50 px-3 py-1 rounded">تصفير</button>
                </div>
            )}
        </div>
    );
};
