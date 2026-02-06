/* =========================================
   الوحدة: الأذكار (Azkar)
   المسار: js/modules/azkar.js
   ========================================= */
const { useState, useEffect, useMemo } = React;

window.AzkarApp = () => {
    const [view, setView] = useState('cats');
    const [selCat, setSelCat] = useState(null);
    const [counts, setCounts] = useState({});

    const categories = useMemo(() => {
        if (!window.APP_DATA.azkar) return [];
        return [...new Set(window.APP_DATA.azkar.map(z => z.category))];
    }, []);

    useEffect(() => {
        if (window.APP_DATA.azkar) {
            const init = {};
            window.APP_DATA.azkar.forEach((z, i) => init[i] = z.count || 1);
            setCounts(init);
        }
    }, []);

    const click = (i) => {
        if (counts[i] > 0) {
            setCounts(p => ({...p, [i]: p[i]-1}));
            if(navigator.vibrate) navigator.vibrate(30);
        }
    };

    return (
        <div className="feature-container p-4">
            {view === 'cats' && (
                <div className="grid grid-cols-2 gap-3">
                    {categories.map(c => (
                        <button key={c} onClick={()=>{setSelCat(c); setView('list')}} className="p-4 bg-white border rounded-xl shadow-sm font-bold text-emerald-800 text-sm flex flex-col items-center">
                            <span className="text-2xl mb-1">📿</span> {c}
                        </button>
                    ))}
                    <button onClick={()=>setView('sebha')} className="col-span-2 p-3 bg-amber-50 border border-amber-200 rounded-xl font-bold text-amber-800">السبحة الحرة</button>
                </div>
            )}
            {view === 'list' && (
                <div>
                    <button onClick={()=>setView('cats')} className="mb-2 text-xs text-gray-500 font-bold">⬅️ رجوع</button>
                    <h3 className="text-center font-black text-emerald-800 mb-3 bg-emerald-50 p-2 rounded">{selCat}</h3>
                    <div className="space-y-3 max-h-[400px] overflow-y-auto">
                        {window.APP_DATA.azkar.map((z, i) => {
                            if(z.category !== selCat) return null;
                            return (
                                <div key={i} onClick={()=>click(i)} className={`p-4 bg-white border-r-4 rounded-xl shadow-sm cursor-pointer ${counts[i]===0 ? 'border-gray-300 opacity-50' : 'border-emerald-500'}`}>
                                    <div className="flex justify-between mb-2"><span className="text-xs bg-gray-100 px-2 rounded font-bold">{counts[i]===0 ? 'تم ✅' : `باقي: ${counts[i]}`}</span></div>
                                    <p className="font-amiri text-lg">{z.zekr}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
            {view === 'sebha' && (
                <div className="text-center py-10">
                    <button onClick={()=>setView('cats')} className="absolute top-4 right-4 text-xs font-bold text-gray-500">خروج</button>
                    <div className="sebha-circle mx-auto" onClick={(e)=>{e.target.innerText = parseInt(e.target.innerText)+1; if(navigator.vibrate) navigator.vibrate(30);}}>0</div>
                    <button onClick={(e)=>e.target.previousElementSibling.innerText=0} className="mt-4 text-red-500 font-bold text-xs">تصفير</button>
                </div>
            )}
        </div>
    );
};
