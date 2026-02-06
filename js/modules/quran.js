/* =========================================
   الوحدة: المصحف الشريف (Quran)
   المسار: js/modules/quran.js
   ========================================= */
const { useState, useRef } = React;
const CustomModal = window.CustomModal; // استيراد المودال من UI

window.QuranReader = () => {
    if (!window.APP_DATA || !window.APP_DATA.quran) return <div className="p-4 text-center text-gray-500">جاري تحميل المصحف...</div>;
    const [view, setView] = useState('list'); const [activeSurah, setActiveSurah] = useState(null); const [search, setSearch] = useState(''); const [bg, setBg] = useState('white'); const [fs, setFs] = useState(1.8);
    const [tafsirModal, setTafsirModal] = useState({ show: false, ayah: null });
    const longPressTimer = useRef(null);

    const surahKeys = Object.keys(window.APP_DATA.quran); const filtered = surahKeys.filter(k => window.APP_DATA.quran[k].name.includes(search));
    const open = (id) => { setActiveSurah({ id, ...window.APP_DATA.quran[id] }); setView('reader'); };

    const handleTouchStart = (ayah) => { longPressTimer.current = setTimeout(() => { if(navigator.vibrate) navigator.vibrate(50); setTafsirModal({ show: true, ayah: ayah }); }, 800); };
    const handleTouchEnd = () => { if (longPressTimer.current) clearTimeout(longPressTimer.current); };

    return (
        <div className="feature-container p-0 h-[550px] flex flex-col bg-white border relative">
            <CustomModal isOpen={tafsirModal.show} onClose={() => setTafsirModal({ show: false, ayah: null })} title="📖 تدبر وتفسير">
                {tafsirModal.ayah && (<div className="space-y-3"><p className="font-amiri text-lg text-emerald-900 border-b pb-2">{tafsirModal.ayah.text}</p><div className="text-sm bg-amber-50 p-3 rounded-xl border border-amber-100 font-bold leading-relaxed">تفسير ميسر: (سيتم ربط التفسير قريباً)</div><button className="text-xs bg-gray-100 p-2 rounded w-full font-bold" onClick={() => {navigator.clipboard.writeText(tafsirModal.ayah.text); alert('تم النسخ')}}>📋 نسخ الآية</button></div>)}
            </CustomModal>
            {view === 'list' && (<div className="p-4 flex-1 overflow-hidden flex flex-col"><input className="w-full p-2 border rounded mb-2 text-sm" placeholder="بحث..." value={search} onChange={e=>setSearch(e.target.value)} /><div className="grid grid-cols-3 gap-2 overflow-y-auto flex-1 content-start">{filtered.map(id => (<button key={id} onClick={() => open(id)} className="p-2 border rounded bg-gray-50 hover:bg-emerald-50 text-xs font-bold flex flex-col items-center"><span className="text-[10px] text-gray-400">{id}</span>{window.APP_DATA.quran[id].name}</button>))}</div></div>)}
            {view === 'reader' && activeSurah && (<div className="flex flex-col h-full"><div className="p-2 border-b flex justify-between items-center bg-white shadow-sm z-10"><button onClick={()=>setView('list')} className="px-3 py-1 bg-gray-100 rounded text-xs font-bold">فهرس</button><span className="font-bold text-sm text-emerald-800">{activeSurah.name}</span><div className="flex gap-1"><button onClick={()=>setBg(bg==='white'?'#fffbf0':'white')} className="w-6 h-6 rounded-full border bg-amber-100">🎨</button><button onClick={()=>setFs(s=>Math.min(3,s+0.2))} className="w-6 h-6 rounded-full border font-bold">+</button><button onClick={()=>setFs(s=>Math.max(1,s-0.2))} className="w-6 h-6 rounded-full border font-bold">-</button></div></div><div className="flex-1 overflow-y-auto p-4 leading-loose text-justify" style={{backgroundColor: bg, fontSize: `${fs}rem`}} dir="rtl">{activeSurah.id!=="1"&&activeSurah.id!=="9"&&<div className="text-center font-amiri mb-4 text-emerald-800 text-lg">بسم الله الرحمن الرحيم</div>}<div className="font-amiri text-gray-800">{activeSurah.ayahs.map(a => (<span key={a.num} className="cursor-pointer hover:bg-gray-100 rounded px-1 transition" onTouchStart={() => handleTouchStart(a)} onTouchEnd={handleTouchEnd} onMouseDown={() => handleTouchStart(a)} onMouseUp={handleTouchEnd} onMouseLeave={handleTouchEnd}>{a.text} <span className="text-emerald-600 text-[0.6em] border border-emerald-500 rounded-full px-1 mx-1 select-none font-sans bg-white">{a.num}</span> </span>))}</div></div><div className="p-1 text-center text-[10px] bg-emerald-50 text-emerald-600 font-bold border-t">💡 اضغط مطولاً على الآية للتفسير</div></div>)}
        </div>
    );
};
