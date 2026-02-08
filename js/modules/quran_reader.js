/* =========================================
   الوحدة: المصحف الشريف المطور (بحث ذكي + حفظ الصفحات + وضع ليلي)
   المسار: js/modules/quran_reader.js
   ========================================= */
const { useState, useEffect, useRef, useMemo } = React;
const CustomModal = window.CustomModal;

// دالة تطبيع النص (إزالة التشكيل لتوحيد البحث)
const normalizeArabic = (text) => {
    if (!text) return "";
    return text
        .replace(/([^\u0621-\u063A\u0641-\u064A\u0660-\u0669a-zA-Z 0-9])/g, '') // إزالة التشكيل
        .replace(/(آ|إ|أ)/g, 'ا')
        .replace(/(ة)/g, 'ه')
        .replace(/(ئ|ؤ)/g, 'ء')
        .replace(/(ى)/g, 'ي');
};

window.QuranReader = () => {
    // حماية التحميل
    if (!window.APP_DATA || !window.APP_DATA.quran) {
        return <div className="p-10 text-center text-gray-500 font-bold animate-pulse">📖 جاري تجهيز المصحف...</div>;
    }

    // --- الحالات (State) ---
    const [view, setView] = useState('list');
    const [activeSurah, setActiveSurah] = useState(null);
    
    // البحث
    const [surahSearch, setSurahSearch] = useState('');
    const [ayahSearch, setAyahSearch] = useState('');
    
    // المظهر
    const [bg, setBg] = useState('white');
    const [fs, setFs] = useState(1.8);
    const [isFullScreen, setIsFullScreen] = useState(false);

    // البيانات المحفوظة
    const [bookmark, setBookmark] = useState(JSON.parse(localStorage.getItem('quran_bookmark')) || null);
    const [readPages, setReadPages] = useState(JSON.parse(localStorage.getItem('quran_pages_read')) || []);
    
    // النوافذ
    const [tafsirModal, setTafsirModal] = useState({ show: false, ayah: null, text: '' });
    const longPressTimer = useRef(null);

    // --- المنطق (Logic) ---

    // 1. منطق البحث المتقدم
    const searchResults = useMemo(() => {
        // أ) بحث في السور فقط
        if (!ayahSearch) {
            return {
                type: 'surah',
                data: Object.keys(window.APP_DATA.quran).filter(k => 
                    normalizeArabic(window.APP_DATA.quran[k].name).includes(normalizeArabic(surahSearch))
                )
            };
        }
        // ب) بحث عميق في الآيات
        else {
            const term = normalizeArabic(ayahSearch);
            if (term.length < 3) return { type: 'ayah', data: [] }; // لا تبحث إلا بعد 3 حروف للأداء
            
            let results = [];
            Object.values(window.APP_DATA.quran).forEach(surah => {
                surah.ayahs.forEach(ayah => {
                    if (normalizeArabic(ayah.text).includes(term)) {
                        results.push({ ...ayah, surahName: surah.name, surahId: surah.number });
                    }
                });
            });
            return { type: 'ayah', data: results.slice(0, 50) }; // عرض أول 50 نتيجة فقط
        }
    }, [surahSearch, ayahSearch]);

    // 2. حساب فواصل الصفحات
    const pageBreaks = useMemo(() => {
        if (!activeSurah || !window.APP_DATA.pages) return {};
        const breaks = {};
        window.APP_DATA.pages.forEach(p => {
            if (parseInt(p.end.surah_number) === parseInt(activeSurah.number)) {
                breaks[p.end.verse] = p.page;
            }
        });
        return breaks;
    }, [activeSurah]);

    // 3. التحكم في ملء الشاشة
    useEffect(() => {
        document.body.style.overflow = isFullScreen ? 'hidden' : 'auto';
        return () => { document.body.style.overflow = 'auto'; };
    }, [isFullScreen]);

    // دوال المساعدة
    const open = (id, scrollToAyah = null) => { 
        setActiveSurah({ id, ...window.APP_DATA.quran[id], scrollTarget: scrollToAyah }); 
        setView('reader'); 
    };

    const togglePageRead = (pageNum) => {
        let newPages;
        if (readPages.includes(pageNum)) {
            newPages = readPages.filter(p => p !== pageNum);
        } else {
            newPages = [...readPages, pageNum];
            if(window.showGlobalAlert) window.showGlobalAlert('أحسنت! 🎉', `تم تسجيل قراءة الصفحة ${pageNum}`);
        }
        setReadPages(newPages);
        localStorage.setItem('quran_pages_read', JSON.stringify(newPages));
    };

    const cycleBackground = () => {
        if (bg === 'white') setBg('#fffbf0'); // كريمي
        else if (bg === '#fffbf0') setBg('#1f2937'); // ليلي (Dark)
        else setBg('white'); // أبيض
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
        <div className={`transition-all duration-300 shadow-sm overflow-hidden flex flex-col animate-in
            ${isFullScreen 
                ? 'fixed top-0 left-0 w-screen h-screen z-[9999] rounded-none m-0' 
                : 'relative rounded-[2rem] border border-gray-100 h-[650px] z-10'
            }
            bg-white
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
                                <button className="bg-emerald-100 text-emerald-700 py-3 rounded-xl font-bold text-xs" onClick={() => {
                                    const data = { surahId: activeSurah.id, surahName: activeSurah.name, ayahNum: tafsirModal.ayah.num || tafsirModal.ayah.numberInSurah };
                                    localStorage.setItem('quran_bookmark', JSON.stringify(data));
                                    setBookmark(data);
                                    setTafsirModal({ ...tafsirModal, show: false });
                                    if(window.showGlobalAlert) window.showGlobalAlert('تم الحفظ', 'تم وضع الفاصلة');
                                }}>🔖 حفظ فاصلة</button>
                                <button className="bg-gray-100 text-gray-600 py-3 rounded-xl font-bold text-xs" onClick={() => navigator.clipboard.writeText(`${tafsirModal.ayah.text}\n\n${tafsirModal.text}`)}>📋 نسخ</button>
                            </div>
                        </div>
                    )}
                </window.CustomModal>
            )}

            {/* --- وضع القائمة والبحث --- */}
            {view === 'list' && (
                <div className="p-4 flex-1 flex flex-col h-full bg-white">
                    <h3 className="text-center font-black text-emerald-900 mb-4 text-xl">📖 المصحف الشريف</h3>
                    
                    {bookmark && (
                        <div onClick={() => open(bookmark.surahId, bookmark.ayahNum)} className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-4 rounded-2xl mb-4 shadow-lg cursor-pointer flex justify-between items-center hover:scale-[1.02] transition">
                            <div><p className="text-[10px] font-bold text-emerald-100 mb-1">أكمل القراءة 🔖</p><h3 className="font-black text-lg">{bookmark.surahName} <span className="text-sm font-normal opacity-80">| آية {bookmark.ayahNum}</span></h3></div>
                            <div className="bg-white/20 w-10 h-10 rounded-full flex items-center justify-center text-xl">👈</div>
                        </div>
                    )}
                    
                    {/* شريط البحث المزدوج */}
                    <div className="flex gap-2 mb-3">
                        <input className="flex-1 p-3 border rounded-xl text-xs font-bold bg-gray-50 focus:bg-white focus:border-emerald-500 transition" 
                            placeholder="🔍 اسم السورة..." value={surahSearch} onChange={e=>{setSurahSearch(e.target.value); setAyahSearch('');}} />
                        <input className="flex-[1.5] p-3 border rounded-xl text-xs font-bold bg-gray-50 focus:bg-white focus:border-emerald-500 transition" 
                            placeholder="🔍 ابحث في الآيات..." value={ayahSearch} onChange={e=>{setAyahSearch(e.target.value); setSurahSearch('');}} />
                    </div>

                    <div className="overflow-y-auto flex-1 content-start scrollbar-hide">
                        {searchResults.type === 'surah' ? (
                            <div className="grid grid-cols-3 gap-2">
                                {searchResults.data.map(id => (
                                    <button key={id} onClick={() => open(id)} className="p-3 border rounded-xl bg-white hover:bg-emerald-50 text-xs font-bold flex flex-col items-center gap-1 shadow-sm transition group">
                                        <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-[10px] text-gray-500 border group-hover:bg-emerald-200 group-hover:text-emerald-800 transition">{id}</span>
                                        <span className="text-gray-700 group-hover:text-emerald-900 truncate w-full text-center">{window.APP_DATA.quran[id].name}</span>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {searchResults.data.length > 0 ? searchResults.data.map((res, idx) => (
                                    <button key={idx} onClick={() => open(res.surahId, res.num || res.numberInSurah)} className="w-full text-right p-3 bg-gray-50 rounded-xl border hover:bg-emerald-50 transition">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-xs font-black text-emerald-700">سورة {res.surahName}</span>
                                            <span className="text-[10px] bg-white px-2 rounded border">آية {res.num || res.numberInSurah}</span>
                                        </div>
                                        <p className="font-amiri text-gray-700 text-sm truncate">{res.text}</p>
                                    </button>
                                )) : <div className="text-center text-gray-400 text-xs mt-10">لا توجد نتائج بحث...</div>}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* --- وضع القراءة المطور --- */}
            {view === 'reader' && activeSurah && (
                <div className="flex flex-col h-full bg-white transition-colors duration-300" style={{backgroundColor: bg}}>
                    
                    {/* شريط الأدوات */}
                    <div className={`
                        flex justify-between items-center shadow-sm z-20 sticky top-0 transition-all duration-300
                        ${isFullScreen ? 'p-4 bg-opacity-90 backdrop-blur-md' : 'p-3'}
                        ${bg === '#1f2937' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-800'}
                    `}>
                        <div className="flex gap-2 items-center">
                            <button onClick={() => { if(isFullScreen) setIsFullScreen(false); else setView('list'); }} 
                                className={`rounded-lg font-black flex items-center gap-1 hover:opacity-80 transition
                                ${isFullScreen ? 'px-4 py-2 text-sm' : 'px-3 py-1.5 text-xs'}
                                ${bg === '#1f2937' ? 'bg-gray-700 text-white' : 'bg-white text-gray-600 border'}
                            `}>
                                {isFullScreen ? 'تصغير ✖' : 'خروج'}
                            </button>
                            
                            {!isFullScreen && (
                                <button onClick={()=>setIsFullScreen(true)} className="w-8 h-8 rounded-lg border bg-emerald-50 text-emerald-700 text-lg flex items-center justify-center hover:bg-emerald-100" title="ملء الشاشة">⛶</button>
                            )}
                        </div>
                        
                        <span className={`font-black truncate px-2 ${isFullScreen ? 'text-lg' : 'text-sm'} ${bg === '#1f2937' ? 'text-emerald-400' : 'text-emerald-800'}`}>
                            {activeSurah.name}
                        </span>
                        
                        <div className="flex gap-1">
                            <button onClick={cycleBackground} className={`rounded-full border shadow-sm flex items-center justify-center font-bold ${isFullScreen ? 'w-10 h-10' : 'w-8 h-8'} ${bg==='#1f2937' ? 'bg-gray-600 text-white' : 'bg-amber-100'}`}>
                                {bg === '#1f2937' ? '🌙' : '☀️'}
                            </button>
                            <button onClick={()=>setFs(s=>Math.min(3,s+0.2))} className={`rounded-full border font-bold shadow-sm flex items-center justify-center ${isFullScreen ? 'w-10 h-10 text-lg' : 'w-8 h-8'} ${bg==='#1f2937' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white'}`}>+</button>
                            <button onClick={()=>setFs(s=>Math.max(1,s-0.2))} className={`rounded-full border font-bold shadow-sm flex items-center justify-center ${isFullScreen ? 'w-10 h-10 text-lg' : 'w-8 h-8'} ${bg==='#1f2937' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white'}`}>-</button>
                        </div>
                    </div>

                    {/* منطقة النص */}
                    <div className="flex-1 overflow-y-auto p-5 leading-loose text-justify scrollbar-hide" style={{ fontSize: `${fs}rem` }} dir="rtl">
                        
                        {activeSurah.id !== "1" && activeSurah.id !== "9" && (
                            <div className={`text-center font-amiri mb-8 text-lg decoration-wavy select-none ${bg === '#1f2937' ? 'text-emerald-400' : 'text-emerald-800'}`}>بسم الله الرحمن الرحيم</div>
                        )}

                        <div className={`font-amiri ${bg === '#1f2937' ? 'text-gray-200' : 'text-gray-800'}`}>
                            {activeSurah.ayahs.map((a) => {
                                const aNum = a.num || a.numberInSurah;
                                const endPageNum = pageBreaks[aNum];

                                return (
                                    <React.Fragment key={aNum}>
                                        <span 
                                            id={`ayah-${aNum}`} 
                                            className={`cursor-pointer rounded px-1 transition duration-500 
                                                ${bg === '#1f2937' ? 'hover:bg-gray-700' : 'hover:bg-emerald-100/50'}
                                                ${bookmark?.surahId === activeSurah.id && bookmark?.ayahNum === aNum ? 'bg-yellow-100 text-gray-800 decoration-yellow-400 underline decoration-2' : ''}
                                            `}
                                            onTouchStart={() => handleTouchStart(a)}
                                            onTouchEnd={handleTouchEnd}
                                            onMouseDown={() => handleTouchStart(a)}
                                            onMouseUp={handleTouchEnd}
                                            onMouseLeave={handleTouchEnd}
                                        >
                                            {a.text} 
                                            <span className={`text-[0.6em] border rounded-full px-2 mx-1 select-none font-sans shadow-sm inline-block
                                                ${bg === '#1f2937' ? 'text-emerald-400 border-emerald-400 bg-gray-800' : 'text-emerald-600 border-emerald-500 bg-white'}
                                            `}>{aNum}</span> 
                                        </span>

                                        {/* 🔥 الفاصل الزخرفي + زر الحفظ */}
                                        {endPageNum && (
                                            <div className="w-full my-10 flex flex-col items-center gap-2 select-none animate-in">
                                                <div className="flex items-center gap-4 w-full justify-center opacity-70">
                                                    <div className={`h-px flex-1 ${bg === '#1f2937' ? 'bg-gray-600' : 'bg-emerald-200'}`}></div>
                                                    <div className={`text-[12px] font-bold border px-4 py-1 rounded-full flex items-center gap-2
                                                        ${bg === '#1f2937' ? 'bg-gray-800 border-gray-600 text-gray-300' : 'bg-emerald-50 border-emerald-200 text-emerald-800'}
                                                    `}>
                                                        <span>صفحة {endPageNum}</span>
                                                    </div>
                                                    <div className={`h-px flex-1 ${bg === '#1f2937' ? 'bg-gray-600' : 'bg-emerald-200'}`}></div>
                                                </div>
                                                
                                                {/* زر "تم الحفظ" */}
                                                <button 
                                                    onClick={() => togglePageRead(endPageNum)}
                                                    className={`text-xs font-bold px-4 py-2 rounded-xl transition flex items-center gap-2 shadow-sm
                                                        ${readPages.includes(endPageNum) 
                                                            ? 'bg-green-500 text-white' 
                                                            : (bg === '#1f2937' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-500 hover:bg-gray-200')}
                                                    `}
                                                >
                                                    {readPages.includes(endPageNum) ? '✅ تم الحفظ/القراءة' : '⬜ تحديد كتم قراءة'}
                                                </button>
                                            </div>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </div>
                        
                        <div className="h-40"></div>
                    </div>
                </div>
            )}
        </div>
    );
};
