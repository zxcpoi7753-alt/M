/* =========================================
   الوحدة: المصحف الشريف المطور (وضع الخشوع + فواصل الصفحات)
   المسار: js/modules/quran_reader.js
   ========================================= */
const { useState, useEffect, useRef, useMemo } = React;
const CustomModal = window.CustomModal;

window.QuranReader = () => {
    // حماية التحميل
    if (!window.APP_DATA || !window.APP_DATA.quran) {
        return <div className="p-10 text-center text-gray-500 font-bold animate-pulse">📖 جاري تجهيز المصحف...</div>;
    }

    // --- الحالات (State) ---
    const [view, setView] = useState('list');
    const [activeSurah, setActiveSurah] = useState(null);
    const [search, setSearch] = useState('');
    const [bg, setBg] = useState('white');
    const [fs, setFs] = useState(1.8);
    
    // 🔥 ميزة 1: وضع الخشوع (ملء الشاشة)
    const [isFullScreen, setIsFullScreen] = useState(false);

    const [bookmark, setBookmark] = useState(JSON.parse(localStorage.getItem('quran_bookmark')) || null);
    const [tafsirModal, setTafsirModal] = useState({ show: false, ayah: null, text: '' });
    const longPressTimer = useRef(null);

    // --- المنطق (Logic) ---

    // 1. تصفية السور
    const filtered = Object.keys(window.APP_DATA.quran).filter(k => 
        window.APP_DATA.quran[k].name.includes(search)
    );

    // 2. حساب فواصل الصفحات (ميزة 2)
    const pageBreaks = useMemo(() => {
        if (!activeSurah || !window.APP_DATA.pages) return {};
        const breaks = {};
        // البحث عن الصفحات التي تنتهي في هذه السورة
        window.APP_DATA.pages.forEach(p => {
            if (parseInt(p.end.surah_number) === activeSurah.number) {
                // نربط رقم الآية برقم الصفحة
                breaks[p.end.verse] = p.page;
            }
        });
        return breaks;
    }, [activeSurah]);

    const open = (id, scrollToAyah = null) => { 
        setActiveSurah({ id, ...window.APP_DATA.quran[id], scrollTarget: scrollToAyah }); 
        setView('reader'); 
    };

    // التمرير التلقائي
    useEffect(() => {
        if (view === 'reader' && activeSurah?.scrollTarget) {
            setTimeout(() => {
                const el = document.getElementById(`ayah-${activeSurah.scrollTarget}`);
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    el.classList.add('bg-yellow-200');
                    setTimeout(() => el.classList.remove('bg-yellow-200'), 2000);
                }
            }, 500);
        }
    }, [view, activeSurah]);

    const saveBookmark = (ayahNum) => {
        const data = { surahId: activeSurah.id, surahName: activeSurah.name, ayahNum };
        localStorage.setItem('quran_bookmark', JSON.stringify(data));
        setBookmark(data);
        setTafsirModal({ show: false, ayah: null, text: '' });
        if(window.showGlobalAlert) window.showGlobalAlert('تم الحفظ 🔖', `فاصلة عند آية ${ayahNum}`);
    };

    const handleTouchStart = (ayahObj) => {
        longPressTimer.current = setTimeout(() => {
            if(navigator.vibrate) navigator.vibrate(50);
            const key = `${activeSurah.id}_${ayahObj.num || ayahObj.numberInSurah}`;
            const text = window.APP_DATA.tafseer ? window.APP_DATA.tafseer[key] : "جاري التحميل...";
            setTafsirModal({ show: true, ayah: ayahObj, text: text || "لا يوجد تفسير." });
        }, 800);
    };
    const handleTouchEnd = () => { if (longPressTimer.current) clearTimeout(longPressTimer.current); };

    return (
        <div className={`transition-all duration-500 bg-white shadow-sm overflow-hidden flex flex-col relative animate-in
            ${isFullScreen ? 'fixed inset-0 z-[100] h-screen w-screen rounded-none' : 'rounded-[2rem] border border-gray-100 h-[600px]'}
        `}>
            
            {/* نافذة التفسير */}
            {window.CustomModal && (
                <window.CustomModal isOpen={tafsirModal.show} onClose={() => setTafsirModal({ ...tafsirModal, show: false })} title="📖 خيارات الآية">
                    {tafsirModal.ayah && (
                        <div className="text-right space-y-3">
                            <p className="font-amiri text-lg text-emerald-900 border-b pb-2">﴿ {tafsirModal.ayah.text} ﴾</p>
                            <div className="bg-amber-50 p-3 rounded-xl border border-amber-100 max-h-[200px] overflow-y-auto">
                                <p className="text-xs font-bold text-amber-800 mb-1">التفسير:</p>
                                <p className="text-sm font-bold text-gray-700 leading-loose">{tafsirModal.text}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <button className="bg-emerald-100 text-emerald-700 py-3 rounded-xl font-bold text-xs" onClick={() => saveBookmark(tafsirModal.ayah.num || tafsirModal.ayah.numberInSurah)}>🔖 حفظ فاصلة</button>
                                <button className="bg-gray-100 text-gray-600 py-3 rounded-xl font-bold text-xs" onClick={() => navigator.clipboard.writeText(`${tafsirModal.ayah.text}\n\n${tafsirModal.text}`)}>📋 نسخ</button>
                            </div>
                        </div>
                    )}
                </window.CustomModal>
            )}

            {/* وضع القائمة */}
            {view === 'list' && (
                <div className="p-4 flex-1 flex flex-col h-full">
                    <h3 className="text-center font-black text-emerald-900 mb-4 text-xl">📖 المصحف الشريف</h3>
                    {bookmark && (
                        <div onClick={() => open(bookmark.surahId, bookmark.ayahNum)} className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-4 rounded-2xl mb-4 shadow-lg cursor-pointer flex justify-between items-center hover:scale-[1.02] transition">
                            <div><p className="text-[10px] font-bold text-emerald-100 mb-1">أكمل القراءة 🔖</p><h3 className="font-black text-lg">{bookmark.surahName} <span className="text-sm font-normal opacity-80">| آية {bookmark.ayahNum}</span></h3></div>
                            <div className="bg-white/20 w-10 h-10 rounded-full flex items-center justify-center text-xl">👈</div>
                        </div>
                    )}
                    <input className="w-full p-3 border rounded-xl mb-3 text-sm font-bold bg-gray-50" placeholder="🔍 بحث..." value={search} onChange={e=>setSearch(e.target.value)} />
                    <div className="grid grid-cols-3 gap-2 overflow-y-auto flex-1 content-start scrollbar-hide">
                        {filtered.map(id => (
                            <button key={id} onClick={() => open(id)} className="p-3 border rounded-xl bg-white hover:bg-emerald-50 text-xs font-bold flex flex-col items-center gap-1 shadow-sm">
                                <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-[10px] text-gray-500 border">{id}</span>
                                <span className="text-gray-700 truncate w-full text-center">{window.APP_DATA.quran[id].name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* 🔥 وضع القراءة المطور */}
            {view === 'reader' && activeSurah && (
                <div className="flex flex-col h-full bg-white">
                    {/* شريط الأدوات (يختفي عند التمرير في بعض التطبيقات، هنا نثبته) */}
                    <div className="p-3 border-b flex justify-between items-center bg-gray-50 shadow-sm z-10 sticky top-0">
                        <div className="flex gap-2">
                            <button onClick={()=>setView('list')} className="px-3 py-1.5 bg-white border rounded-lg text-xs font-black text-gray-600 hover:bg-red-50">خروج</button>
                            {/* زر ملء الشاشة */}
                            <button onClick={()=>setIsFullScreen(!isFullScreen)} className={`px-3 py-1.5 border rounded-lg text-xs font-black transition ${isFullScreen ? 'bg-emerald-600 text-white' : 'bg-white text-emerald-600'}`}>
                                {isFullScreen ? 'تصغير ✖' : 'تكبير ⛶'}
                            </button>
                        </div>
                        
                        <span className="font-black text-sm text-emerald-800">{activeSurah.name}</span>
                        
                        <div className="flex gap-1">
                            <button onClick={()=>setBg(bg==='white'?'#fffbf0':'white')} className="w-8 h-8 rounded-full border bg-amber-100 text-xs shadow-sm">🎨</button>
                            <button onClick={()=>setFs(s=>Math.min(3,s+0.2))} className="w-8 h-8 rounded-full border bg-white font-bold shadow-sm">+</button>
                            <button onClick={()=>setFs(s=>Math.max(1,s-0.2))} className="w-8 h-8 rounded-full border bg-white font-bold shadow-sm">-</button>
                        </div>
                    </div>

                    {/* منطقة النص */}
                    <div className="flex-1 overflow-y-auto p-5 leading-loose text-justify scrollbar-hide" style={{backgroundColor: bg, fontSize: `${fs}rem`}} dir="rtl">
                        
                        {/* البسملة */}
                        {activeSurah.id !== "1" && activeSurah.id !== "9" && (
                            <div className="text-center font-amiri mb-8 text-emerald-800 text-lg decoration-wavy select-none">بسم الله الرحمن الرحيم</div>
                        )}

                        <div className="font-amiri text-gray-800">
                            {activeSurah.ayahs.map((a, index) => {
                                const aNum = a.num || a.numberInSurah;
                                // هل هذه الآية هي نهاية صفحة؟
                                const endPageNum = pageBreaks[aNum];

                                return (
                                    <React.Fragment key={aNum}>
                                        <span 
                                            id={`ayah-${aNum}`} 
                                            className={`cursor-pointer hover:bg-emerald-100/50 rounded px-1 transition duration-500 ${bookmark?.surahId === activeSurah.id && bookmark?.ayahNum === aNum ? 'bg-yellow-100 decoration-yellow-400 underline decoration-2' : ''}`}
                                            onTouchStart={() => handleTouchStart(a)}
                                            onTouchEnd={handleTouchEnd}
                                            onMouseDown={() => handleTouchStart(a)}
                                            onMouseUp={handleTouchEnd}
                                            onMouseLeave={handleTouchEnd}
                                        >
                                            {a.text} 
                                            <span className="text-emerald-600 text-[0.6em] border border-emerald-500 rounded-full px-2 mx-1 select-none font-sans bg-white shadow-sm inline-block">{aNum}</span> 
                                        </span>

                                        {/* 🔥 الفاصل الزخرفي للصفحة */}
                                        {endPageNum && (
                                            <div className="w-full my-8 flex items-center justify-center gap-4 opacity-70 select-none pointer-events-none animate-in">
                                                <div className="h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent flex-1"></div>
                                                <div className="text-[10px] text-emerald-800 font-bold border border-emerald-200 px-4 py-1 rounded-full bg-emerald-50 shadow-sm flex items-center gap-2">
                                                    <span>📖</span>
                                                    <span>نهاية صفحة {endPageNum}</span>
                                                </div>
                                                <div className="h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent flex-1"></div>
                                            </div>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    </div>
                    
                    {!isFullScreen && (
                        <div className="p-2 bg-emerald-50 text-[10px] text-center text-emerald-600 font-bold border-t">
                            💡 اضغط مطولاً للتفسير | استخدم ⛶ للتركيز
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
