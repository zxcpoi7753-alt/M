/* =========================================
   الوحدة: المصحف الشريف الذكي (تفسير + فواصل)
   المسار: js/modules/quran_reader.js
   ========================================= */
const { useState, useEffect, useRef } = React;
const CustomModal = window.CustomModal; // يجب أن تكون معرفة في app.js

window.QuranReader = () => {
    // انتظار البيانات
    if (!window.APP_DATA || !window.APP_DATA.quran) {
        return <div className="p-10 text-center text-gray-500 font-bold animate-pulse">📖 جاري فتح المصحف...</div>;
    }

    const [view, setView] = useState('list'); // list | reader
    const [activeSurah, setActiveSurah] = useState(null);
    const [search, setSearch] = useState('');
    const [bg, setBg] = useState('white'); // لون الخلفية
    const [fs, setFs] = useState(1.8);     // حجم الخط
    
    // استرجاع الفاصلة المحفوظة
    const [bookmark, setBookmark] = useState(JSON.parse(localStorage.getItem('quran_bookmark')) || null);
    
    // نافذة التفسير
    const [tafsirModal, setTafsirModal] = useState({ show: false, ayah: null, text: '' });
    const longPressTimer = useRef(null);

    // تصفية السور
    const surahKeys = Object.keys(window.APP_DATA.quran);
    const filtered = surahKeys.filter(k => window.APP_DATA.quran[k].name.includes(search));

    // دالة فتح السورة
    const open = (id, scrollToAyah = null) => { 
        setActiveSurah({ id, ...window.APP_DATA.quran[id], scrollTarget: scrollToAyah }); 
        setView('reader'); 
    };

    // التمرير التلقائي للآية (Scroll)
    useEffect(() => {
        if (view === 'reader' && activeSurah?.scrollTarget) {
            setTimeout(() => {
                const element = document.getElementById(`ayah-${activeSurah.scrollTarget}`);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    element.classList.add('bg-yellow-200'); // وميض
                    setTimeout(() => element.classList.remove('bg-yellow-200'), 2000);
                }
            }, 500);
        }
    }, [view, activeSurah]);

    // حفظ الفاصلة (Bookmark)
    const saveBookmark = (ayahNum) => {
        const data = { surahId: activeSurah.id, surahName: activeSurah.name, ayahNum: ayahNum };
        localStorage.setItem('quran_bookmark', JSON.stringify(data));
        setBookmark(data);
        setTafsirModal({ show: false, ayah: null, text: '' });
        if(window.showGlobalAlert) window.showGlobalAlert('تم الحفظ 🔖', `تم وضع الفاصلة عند آية ${ayahNum} من ${activeSurah.name}`);
    };

    // التعامل مع الضغط المطول (للهواتف)
    const handleTouchStart = (ayahObj) => {
        longPressTimer.current = setTimeout(() => {
            if(navigator.vibrate) navigator.vibrate(50);
            
            // جلب التفسير من البيانات التي حملها data_loader
            const key = `${activeSurah.id}_${ayahObj.num || ayahObj.numberInSurah}`;
            const text = window.APP_DATA.tafseer ? window.APP_DATA.tafseer[key] : "جاري تحميل التفسير...";
            
            setTafsirModal({ 
                show: true, 
                ayah: ayahObj, 
                text: text || "لا يوجد تفسير متوفر لهذه الآية." 
            });
        }, 800); // زمن الضغطة (0.8 ثانية)
    };

    const handleTouchEnd = () => { if (longPressTimer.current) clearTimeout(longPressTimer.current); };

    return (
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden h-[600px] flex flex-col relative animate-in">
            
            {/* نافذة التفسير المنبثقة */}
            {window.CustomModal && (
                <window.CustomModal isOpen={tafsirModal.show} onClose={() => setTafsirModal({ show: false, ayah: null, text: '' })} title="📖 خيارات الآية">
                    {tafsirModal.ayah && (
                        <div className="text-right space-y-3">
                            <p className="font-amiri text-lg text-emerald-900 border-b pb-2 leading-loose">﴿ {tafsirModal.ayah.text} ﴾</p>
                            
                            <div className="bg-amber-50 p-3 rounded-xl border border-amber-100 max-h-[200px] overflow-y-auto">
                                <p className="text-xs font-bold text-amber-800 mb-1">التفسير الميسر:</p>
                                <p className="text-sm font-bold text-gray-700 leading-loose text-justify">{tafsirModal.text}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <button className="bg-emerald-100 text-emerald-700 py-3 rounded-xl font-bold text-xs hover:bg-emerald-200 transition" onClick={() => saveBookmark(tafsirModal.ayah.num || tafsirModal.ayah.numberInSurah)}>
                                    🔖 حفظ فاصلة
                                </button>
                                <button className="bg-gray-100 text-gray-600 py-3 rounded-xl font-bold text-xs hover:bg-gray-200 transition" onClick={() => {navigator.clipboard.writeText(`${tafsirModal.ayah.text}\n\n${tafsirModal.text}`); if(window.showGlobalAlert) window.showGlobalAlert("نسخ","تم نسخ الآية وتفسيرها")}}>
                                    📋 نسخ النص
                                </button>
                            </div>
                        </div>
                    )}
                </window.CustomModal>
            )}

            {/* 1. قائمة السور */}
            {view === 'list' && (
                <div className="p-4 flex-1 flex flex-col h-full">
                    <h3 className="text-center font-black text-emerald-900 mb-4 text-xl">📖 المصحف الشريف</h3>
                    
                    {/* زر الفاصلة */}
                    {bookmark && (
                        <div onClick={() => open(bookmark.surahId, bookmark.ayahNum)} className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-4 rounded-2xl mb-4 shadow-lg cursor-pointer flex justify-between items-center hover:scale-[1.02] transition">
                            <div>
                                <p className="text-[10px] font-bold text-emerald-100 mb-1">أكمل من حيث توقفت 🔖</p>
                                <h3 className="font-black text-lg">{bookmark.surahName} <span className="text-sm font-normal opacity-80">| آية {bookmark.ayahNum}</span></h3>
                            </div>
                            <div className="bg-white/20 w-10 h-10 rounded-full flex items-center justify-center text-xl">👈</div>
                        </div>
                    )}

                    <input className="w-full p-3 border rounded-xl mb-3 text-sm font-bold bg-gray-50 focus:bg-white transition" placeholder="🔍 ابحث عن سورة..." value={search} onChange={e=>setSearch(e.target.value)} />
                    
                    <div className="grid grid-cols-3 gap-2 overflow-y-auto flex-1 content-start scrollbar-hide">
                        {filtered.map(id => (
                            <button key={id} onClick={() => open(id)} className="p-3 border rounded-xl bg-white hover:bg-emerald-50 text-xs font-bold flex flex-col items-center gap-1 shadow-sm transition group">
                                <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-[10px] text-gray-500 border group-hover:bg-emerald-200 group-hover:text-emerald-800 transition">{id}</span>
                                <span className="text-gray-700 group-hover:text-emerald-900 truncate w-full text-center">{window.APP_DATA.quran[id].name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* 2. وضع القراءة */}
            {view === 'reader' && activeSurah && (
                <div className="flex flex-col h-full bg-white">
                    {/* شريط الأدوات العلوي */}
                    <div className="p-3 border-b flex justify-between items-center bg-gray-50 shadow-sm z-10 sticky top-0">
                        <button onClick={()=>setView('list')} className="px-3 py-1.5 bg-white border rounded-lg text-xs font-black text-gray-600 hover:bg-red-50">خروج</button>
                        <span className="font-black text-sm text-emerald-800">{activeSurah.name}</span>
                        <div className="flex gap-1">
                            <button onClick={()=>setBg(bg==='white'?'#fffbf0':'white')} className="w-8 h-8 rounded-full border bg-amber-100 text-xs shadow-sm flex items-center justify-center">🎨</button>
                            <button onClick={()=>setFs(s=>Math.min(3,s+0.2))} className="w-8 h-8 rounded-full border bg-white font-bold shadow-sm flex items-center justify-center">+</button>
                            <button onClick={()=>setFs(s=>Math.max(1,s-0.2))} className="w-8 h-8 rounded-full border bg-white font-bold shadow-sm flex items-center justify-center">-</button>
                        </div>
                    </div>

                    {/* نص الآيات */}
                    <div className="flex-1 overflow-y-auto p-5 leading-loose text-justify scrollbar-hide" style={{backgroundColor: bg, fontSize: `${fs}rem`}} dir="rtl">
                        {activeSurah.id !== "1" && activeSurah.id !== "9" && <div className="text-center font-amiri mb-6 text-emerald-800 text-lg decoration-wavy">بسم الله الرحمن الرحيم</div>}
                        <div className="font-amiri text-gray-800">
                            {activeSurah.ayahs.map(a => (
                                <span 
                                    key={a.num || a.numberInSurah} 
                                    id={`ayah-${a.num || a.numberInSurah}`} 
                                    className={`cursor-pointer hover:bg-emerald-100/50 rounded px-1 transition duration-500 ${bookmark?.surahId === activeSurah.id && bookmark?.ayahNum === (a.num || a.numberInSurah) ? 'bg-yellow-100 decoration-yellow-400 underline decoration-2' : ''}`}
                                    onTouchStart={() => handleTouchStart(a)}
                                    onTouchEnd={handleTouchEnd}
                                    onMouseDown={() => handleTouchStart(a)}
                                    onMouseUp={handleTouchEnd}
                                    onMouseLeave={handleTouchEnd}
                                >
                                    {a.text} <span className="text-emerald-600 text-[0.6em] border border-emerald-500 rounded-full px-2 mx-1 select-none font-sans bg-white shadow-sm">{a.num || a.numberInSurah}</span> 
                                </span>
                            ))}
                        </div>
                    </div>
                    
                    {/* تلميح سفلي */}
                    <div className="p-2 bg-emerald-50 text-[10px] text-center text-emerald-600 font-bold border-t">
                        💡 اضغط مطولاً على الآية للتفسير أو الحفظ
                    </div>
                </div>
            )}
        </div>
    );
};
