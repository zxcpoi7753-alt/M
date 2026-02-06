/* =========================================
   الوحدة: المصحف الشريف (نوافذ أنيقة)
   المسار: js/modules/quran.js
   ========================================= */
const { useState, useRef } = React;
const CustomModal = window.CustomModal;

window.QuranReader = () => {
    if (!window.APP_DATA || !window.APP_DATA.quran) return <div className="p-4 text-center text-gray-500 mt-10">جاري تحميل المصحف...</div>;

    const [view, setView] = useState('list');
    const [activeSurah, setActiveSurah] = useState(null);
    const [search, setSearch] = useState('');
    const [bg, setBg] = useState('white');
    const [fs, setFs] = useState(1.8);
    
    // حالة نافذة التفسير
    const [tafsirModal, setTafsirModal] = useState({ show: false, ayah: null, text: '' });
    const longPressTimer = useRef(null);

    const surahKeys = Object.keys(window.APP_DATA.quran);
    const filtered = surahKeys.filter(k => window.APP_DATA.quran[k].name.includes(search));

    const open = (id) => { setActiveSurah({ id, ...window.APP_DATA.quran[id] }); setView('reader'); };

    const handleTouchStart = (ayahObj) => {
        longPressTimer.current = setTimeout(() => {
            if(navigator.vibrate) navigator.vibrate(50);
            const key = `${activeSurah.id}_${ayahObj.num}`;
            const text = window.APP_DATA.tafseer ? window.APP_DATA.tafseer[key] : "جاري التحميل...";
            setTafsirModal({ show: true, ayah: ayahObj, text: text || "لا يوجد تفسير متوفر." });
        }, 800);
    };

    const handleTouchEnd = () => { if (longPressTimer.current) clearTimeout(longPressTimer.current); };

    // دالة النسخ الجديدة (أنيقة)
    const handleCopy = () => {
        navigator.clipboard.writeText(`${tafsirModal.ayah.text}\n\nالتفسير:\n${tafsirModal.text}`);
        // إغلاق نافذة التفسير أولاً
        setTafsirModal({ show: false, ayah: null, text: '' });
        // إظهار نافذة النجاح العامة
        if(window.showGlobalAlert) window.showGlobalAlert('تم بنجاح ✅', 'تم نسخ الآية والتفسير إلى الحافظة.');
    };

    return (
        <div className="feature-container p-0 h-[550px] flex flex-col bg-white border relative">
            
            <CustomModal isOpen={tafsirModal.show} onClose={() => setTafsirModal({ show: false, ayah: null, text: '' })} title="📖 التفسير الميسر">
                {tafsirModal.ayah && (
                    <div className="text-right space-y-4">
                        <p className="font-amiri text-xl text-emerald-900 border-b pb-2 leading-loose">﴿ {tafsirModal.ayah.text} ﴾</p>
                        <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 shadow-inner">
                            <p className="text-sm font-bold text-gray-700 leading-loose text-justify">{tafsirModal.text}</p>
                        </div>
                        <button className="w-full bg-gray-100 text-gray-600 py-3 rounded-xl font-bold text-xs hover:bg-gray-200 transition" onClick={handleCopy}>
                            📋 نسخ الآية والتفسير
                        </button>
                    </div>
                )}
            </CustomModal>

            {view === 'list' && (
                <div className="p-4 flex-1 overflow-hidden flex flex-col animate-in">
                    <input className="w-full p-3 border rounded-xl mb-3 text-sm font-bold bg-gray-50 focus:bg-white transition" placeholder="🔍 ابحث عن سورة..." value={search} onChange={e=>setSearch(e.target.value)} />
                    <div className="grid grid-cols-3 gap-2 overflow-y-auto flex-1 content-start custom-scroll">
                        {filtered.map(id => (
                            <button key={id} onClick={() => open(id)} className="p-3 border rounded-xl bg-white hover:bg-emerald-50 text-xs font-bold flex flex-col items-center gap-1 shadow-sm transition">
                                <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-[10px] text-gray-500 border">{id}</span>
                                <span className="text-gray-700">{window.APP_DATA.quran[id].name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {view === 'reader' && activeSurah && (
                <div className="flex flex-col h-full animate-in">
                    <div className="p-3 border-b flex justify-between items-center bg-white shadow-sm z-10">
                        <button onClick={()=>setView('list')} className="px-4 py-1.5 bg-gray-100 rounded-lg text-xs font-black text-gray-600 hover:bg-gray-200">فهرس</button>
                        <span className="font-black text-sm text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">{activeSurah.name}</span>
                        <div className="flex gap-1">
                            <button onClick={()=>setBg(bg==='white'?'#fffbf0':'white')} className="w-8 h-8 rounded-full border bg-amber-100 text-xs shadow-sm hover:scale-110 transition">🎨</button>
                            <button onClick={()=>setFs(s=>Math.min(3,s+0.2))} className="w-8 h-8 rounded-full border bg-white font-bold shadow-sm hover:scale-110 transition">+</button>
                            <button onClick={()=>setFs(s=>Math.max(1,s-0.2))} className="w-8 h-8 rounded-full border bg-white font-bold shadow-sm hover:scale-110 transition">-</button>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-5 leading-loose text-justify custom-scroll" style={{backgroundColor: bg, fontSize: `${fs}rem`}} dir="rtl">
                        {activeSurah.id !== "1" && activeSurah.id !== "9" && <div className="text-center font-amiri mb-6 text-emerald-800 text-lg">بسم الله الرحمن الرحيم</div>}
                        <div className="font-amiri text-gray-800">
                            {activeSurah.ayahs.map(a => (
                                <span key={a.num} className="cursor-pointer hover:bg-emerald-100/50 rounded px-1 transition duration-200" onTouchStart={() => handleTouchStart(a)} onTouchEnd={handleTouchEnd} onMouseDown={() => handleTouchStart(a)} onMouseUp={handleTouchEnd} onMouseLeave={handleTouchEnd}>
                                    {a.text} <span className="text-emerald-600 text-[0.6em] border border-emerald-500 rounded-full px-2 mx-1 select-none font-sans bg-white shadow-sm">{a.num}</span> 
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="p-2 bg-emerald-50 text-[10px] text-center text-emerald-600 font-bold border-t">💡 اضغط مطولاً على أي آية للتفسير</div>
                </div>
            )}
        </div>
    );
};
