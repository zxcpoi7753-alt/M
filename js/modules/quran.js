/* =========================================
   الوحدة: المصحف الشريف (مع الفاصلة والتفسير)
   المسار: js/modules/quran.js
   ========================================= */
const { useState, useEffect, useRef } = React;
const CustomModal = window.CustomModal;

window.QuranReader = () => {
    if (!window.APP_DATA || !window.APP_DATA.quran) return <div className="p-4 text-center text-gray-500 mt-10 font-bold">جاري تحميل المصحف...</div>;

    const [view, setView] = useState('list');
    const [activeSurah, setActiveSurah] = useState(null);
    const [search, setSearch] = useState('');
    const [bg, setBg] = useState('white');
    const [fs, setFs] = useState(1.8);
    
    // حالة الفاصلة (Bookmark)
    const [bookmark, setBookmark] = useState(JSON.parse(localStorage.getItem('quran_bookmark')) || null);
    
    // حالة نافذة التفسير
    const [tafsirModal, setTafsirModal] = useState({ show: false, ayah: null, text: '' });
    const longPressTimer = useRef(null);

    const surahKeys = Object.keys(window.APP_DATA.quran);
    const filtered = surahKeys.filter(k => window.APP_DATA.quran[k].name.includes(search));

    // فتح السورة (مع خيار التمرير لآية معينة)
    const open = (id, scrollToAyah = null) => { 
        setActiveSurah({ id, ...window.APP_DATA.quran[id], scrollTarget: scrollToAyah }); 
        setView('reader'); 
    };

    // التمرير التلقائي للآية عند فتح السورة
    useEffect(() => {
        if (view === 'reader' && activeSurah?.scrollTarget) {
            setTimeout(() => {
                const element = document.getElementById(`ayah-${activeSurah.scrollTarget}`);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    element.classList.add('bg-yellow-200'); // تمييز الآية للحظات
                    setTimeout(() => element.classList.remove('bg-yellow-200'), 2000);
                }
            }, 500); // تأخير بسيط لضمان رسم الصفحة
        }
    }, [view, activeSurah]);

    // حفظ الفاصلة
    const saveBookmark = (ayahNum) => {
        const data = { surahId: activeSurah.id, surahName: activeSurah.name, ayahNum: ayahNum };
        localStorage.setItem('quran_bookmark', JSON.stringify(data));
        setBookmark(data);
        setTafsirModal({ show: false, ayah: null, text: '' }); // إغلاق النافذة
        if(window.showGlobalAlert) window.showGlobalAlert('تم الحفظ 🔖', `تم وضع الفاصلة عند آية ${ayahNum} من ${activeSurah.name}`);
    };

    // التعامل مع الضغط المطول
    const handleTouchStart = (ayahObj) => {
        longPressTimer.current = setTimeout(() => {
            if(navigator.vibrate) navigator.vibrate(50);
            const key = `${activeSurah.id}_${ayahObj.num}`;
            const text = window.APP_DATA.tafseer ? window.APP_DATA.tafseer[key] : "جاري التحميل...";
            setTafsirModal({ show: true, ayah: ayahObj, text: text || "لا يوجد تفسير متوفر." });
        }, 800);
    };

    const handleTouchEnd = () => { if (longPressTimer.current) clearTimeout(longPressTimer.current); };

    return (
        <div className="feature-container p-0 h-[550px] flex flex-col bg-white border relative">
            
            {/* نافذة التفسير + زر الحفظ */}
            <CustomModal isOpen={tafsirModal.show} onClose={() => setTafsirModal({ show: false, ayah: null, text: '' })} title="📖 خيارات الآية">
                {tafsirModal.ayah && (
                    <div className="text-right space-y-3">
                        <p className="font-amiri text-lg text-emerald-900 border-b pb-2 leading-loose">﴿ {tafsirModal.ayah.text} ﴾</p>
                        
                        <div className="bg-amber-50 p-3 rounded-xl border border-amber-100">
                            <p className="text-xs font-bold text-amber-800 mb-1">التفسير الميسر:</p>
                            <p className="text-sm font-bold text-gray-700 leading-loose text-justify">{tafsirModal.text}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <button className="bg-emerald-100 text-emerald-700 py-2 rounded-xl font-bold text-xs hover:bg-emerald-200 transition" onClick={() => saveBookmark(tafsirModal.ayah.num)}>
                                🔖 وضع فاصلة هنا
                            </button>
                            <button className="bg-gray-100 text-gray-600 py-2 rounded-xl font-bold text-xs hover:bg-gray-200 transition" onClick={() => {navigator.clipboard.writeText(`${tafsirModal.ayah.text}\n\n${tafsirModal.text}`); alert('تم النسخ')}}>
                                📋 نسخ النص
                            </button>
                        </div>
                    </div>
                )}
            </CustomModal>

            {/* قائمة السور */}
            {view === 'list' && (
                <div className="p-4 flex-1 overflow-hidden flex flex-col animate-in">
                    
                    {/* زر استكمال القراءة (يظهر فقط إذا وجدت فاصلة) */}
                    {bookmark && (
                        <div onClick={() => open(bookmark.surahId, bookmark.ayahNum)} className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-4 rounded-2xl mb-4 shadow-lg cursor-pointer flex justify-between items-center transform hover:scale-[1.02] transition">
                            <div>
                                <p className="text-[10px] font-bold text-emerald-100 mb-1">استكمال القراءة 🔖</p>
                                <h3 className="font-black text-lg">{bookmark.surahName} <span className="text-sm font-normal opacity-80">| آية {bookmark.ayahNum}</span></h3>
                            </div>
                            <div className="bg-white/20 w-10 h-10 rounded-full flex items-center justify-center text-xl">👈</div>
                        </div>
                    )}

                    <input className="w-full p-3 border rounded-xl mb-3 text-sm font-bold bg-gray-50 focus:bg-white transition" placeholder="🔍 ابحث عن سورة..." value={search} onChange={e=>setSearch(e.target.value)} />
                    
                    <div className="grid grid-cols-3 gap-2 overflow-y-auto flex-1 content-start custom-scroll">
                        {filtered.map(id => (
                            <button key={id} onClick={() => open(id)} className="p-3 border rounded-xl bg-white hover:bg-emerald-50 text-xs font-bold flex flex-col items-center gap-1 shadow-sm transition group">
                                <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-[10px] text-gray-500 border group-hover:bg-emerald-200 group-hover:text-emerald-800 transition">{id}</span>
                                <span className="text-gray-700 group-hover:text-emerald-900">{window.APP_DATA.quran[id].name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* وضع القراءة */}
            {view === 'reader' && activeSurah && (
                <div className="flex flex-col h-full animate-in">
                    <div className="p-3 border-b flex justify-between items-center bg-white shadow-sm z-10">
                        <button onClick={()=>setView('list')} className="px-4 py-1.5 bg-gray-100 rounded-lg text-xs font-black text-gray-600 hover:bg-gray-200">فهرس</button>
                        <span className="font-black text-sm text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">{activeSurah.name}</span>
                        <div className="flex gap-1">
                            <button onClick={()=>setBg(bg==='white'?'#fffbf0':'white')} className="w-8 h-8 rounded-full border bg-amber-100 text-xs shadow-sm">🎨</button>
                            <button onClick={()=>setFs(s=>Math.min(3,s+0.2))} className="w-8 h-8 rounded-full border bg-white font-bold shadow-sm">+</button>
                            <button onClick={()=>setFs(s=>Math.max(1,s-0.2))} className="w-8 h-8 rounded-full border bg-white font-bold shadow-sm">-</button>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-5 leading-loose text-justify custom-scroll" style={{backgroundColor: bg, fontSize: `${fs}rem`}} dir="rtl">
                        {activeSurah.id !== "1" && activeSurah.id !== "9" && <div className="text-center font-amiri mb-6 text-emerald-800 text-lg decoration-wavy">بسم الله الرحمن الرحيم</div>}
                        <div className="font-amiri text-gray-800">
                            {activeSurah.ayahs.map(a => (
                                <span 
                                    key={a.num} 
                                    id={`ayah-${a.num}`} // معرف الآية للتمرير
                                    className={`cursor-pointer hover:bg-emerald-100/50 rounded px-1 transition duration-500 ${bookmark?.surahId === activeSurah.id && bookmark?.ayahNum === a.num ? 'bg-yellow-100 decoration-yellow-400 underline decoration-2' : ''}`}
                                    onTouchStart={() => handleTouchStart(a)}
                                    onTouchEnd={handleTouchEnd}
                                    onMouseDown={() => handleTouchStart(a)}
                                    onMouseUp={handleTouchEnd}
                                    onMouseLeave={handleTouchEnd}
                                >
                                    {a.text} <span className="text-emerald-600 text-[0.6em] border border-emerald-500 rounded-full px-2 mx-1 select-none font-sans bg-white shadow-sm">{a.num}</span> 
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="p-2 bg-emerald-50 text-[10px] text-center text-emerald-600 font-bold border-t">
                        💡 اضغط مطولاً لوضع فاصلة أو التفسير
                    </div>
                </div>
            )}
        </div>
    );
};
