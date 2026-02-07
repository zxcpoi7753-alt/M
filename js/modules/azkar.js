/* =========================================
   الوحدة: الأذكار (Azkar) - التصميم الأصلي + بحث
   المسار: js/modules/azkar.js
   ========================================= */
const { useState, useEffect, useMemo } = React;

const AzkarApp = () => {
    const [view, setView] = useState('cats');
    const [selCat, setSelCat] = useState(null);
    const [counts, setCounts] = useState({});
    const [searchTerm, setSearchTerm] = useState(""); // 🔍 حالة البحث

    // جلب التصنيفات
    const categories = useMemo(() => {
        if (!window.APP_DATA.azkar) return [];
        return [...new Set(window.APP_DATA.azkar.map(z => z.category))];
    }, []);

    // تهيئة العدادات
    useEffect(() => {
        if (window.APP_DATA.azkar) {
            const init = {};
            window.APP_DATA.azkar.forEach((z, i) => init[i] = z.count || 1);
            setCounts(init);
        }
    }, []);

    // فلترة الأذكار حسب البحث والفئة
    const filteredAzkar = useMemo(() => {
        if (!window.APP_DATA.azkar) return [];
        return window.APP_DATA.azkar.map((z, index) => ({...z, originalIndex: index})).filter(z => {
            const matchesCat = z.category === selCat;
            const matchesSearch = z.zekr.includes(searchTerm);
            return matchesCat && matchesSearch;
        });
    }, [selCat, searchTerm]);

    const click = (originalIndex) => {
        if (counts[originalIndex] > 0) {
            setCounts(p => ({...p, [originalIndex]: p[originalIndex]-1}));
            if(navigator.vibrate) navigator.vibrate(30);
            
            // إذا انتهى العدد
            if (counts[originalIndex] === 1) {
                // وميض بسيط أو صوت يمكن إضافته هنا
            }
        }
    };

    return (
        <div className="bg-white rounded-[2rem] border border-emerald-100 shadow-sm overflow-hidden p-4 animate-in">
            {/* واجهة التصنيفات */}
            {view === 'cats' && (
                <div className="space-y-3">
                    <h3 className="text-center font-black text-emerald-800 mb-2">📿 حصن المسلم</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {categories.map(c => (
                            <button key={c} onClick={()=>{setSelCat(c); setView('list')}} className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl shadow-sm font-bold text-emerald-900 text-sm flex flex-col items-center hover:bg-emerald-100 transition">
                                <span className="text-2xl mb-2">✨</span> {c}
                            </button>
                        ))}
                        <button onClick={()=>setView('sebha')} className="col-span-2 p-3 bg-amber-50 border border-amber-200 rounded-xl font-bold text-amber-800 shadow-sm">السبحة الحرة الإلكترونية 👆</button>
                    </div>
                </div>
            )}

            {/* واجهة القائمة والأذكار */}
            {view === 'list' && (
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <button onClick={()=>setView('cats')} className="text-xs bg-gray-100 px-3 py-1 rounded-lg text-gray-600 font-bold hover:bg-red-100">⬅️ رجوع</button>
                        <h3 className="font-black text-emerald-800">{selCat}</h3>
                    </div>

                    {/* 🔍 خانة البحث */}
                    <input 
                        type="text" 
                        placeholder="🔍 ابحث في هذا القسم..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold mb-4 focus:outline-none focus:border-emerald-500"
                    />

                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                        {filteredAzkar.length > 0 ? filteredAzkar.map((z, i) => (
                            <div key={z.originalIndex} onClick={()=>click(z.originalIndex)} className={`relative p-4 bg-white border-r-4 rounded-xl shadow-sm cursor-pointer transition-all ${counts[z.originalIndex]===0 ? 'border-gray-300 opacity-60 bg-gray-50' : 'border-emerald-500 hover:shadow-md'}`}>
                                {/* الترقيم */}
                                <div className="absolute top-2 left-2 text-[10px] text-gray-300 font-black">#{i + 1}</div>
                                
                                <div className="flex justify-between mb-2">
                                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${counts[z.originalIndex]===0 ? 'bg-green-100 text-green-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                        {counts[z.originalIndex]===0 ? 'تم ✅' : `باقي: ${counts[z.originalIndex]}`}
                                    </span>
                                    <span className="text-[10px] text-gray-400 font-bold">{z.count ? `العدد: ${z.count}` : ''}</span>
                                </div>
                                <p className="font-amiri text-lg leading-loose text-gray-800">{z.zekr}</p>
                                {z.reference && <p className="text-[9px] text-gray-400 mt-2">{z.reference}</p>}
                            </div>
                        )) : (
                            <div className="text-center text-gray-400 text-xs py-4">لا توجد نتائج للبحث</div>
                        )}
                    </div>
                </div>
            )}

            {/* واجهة السبحة */}
            {view === 'sebha' && (
                <div className="text-center py-10 relative">
                    <button onClick={()=>setView('cats')} className="absolute top-0 right-0 text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-lg">خروج</button>
                    <h3 className="text-amber-800 font-black mb-6">السبحة الإلكترونية</h3>
                    <div className="w-40 h-40 mx-auto rounded-full bg-gradient-to-br from-amber-400 to-amber-600 shadow-xl flex items-center justify-center text-white text-5xl font-black cursor-pointer active:scale-95 transition-transform select-none ring-4 ring-amber-100" onClick={(e)=>{e.target.innerText = parseInt(e.target.innerText)+1; if(navigator.vibrate) navigator.vibrate(40);}}>
                        0
                    </div>
                    <p className="text-xs text-gray-400 mt-4 font-bold">اضغط على الدائرة للتسبيح</p>
                    <button onClick={(e)=>e.target.parentElement.querySelector('.rounded-full').innerText=0} className="mt-6 text-red-500 font-bold text-xs bg-red-50 px-4 py-2 rounded-xl">تصفير العداد 🔄</button>
                </div>
            )}
        </div>
    );
};

window.AzkarApp = AzkarApp;
