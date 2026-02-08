/* =========================================
   الوحدة: المصحف الشريف الشامل (بحث + ختمة + بطاقات + ربط جماعي)
   المسار: js/modules/quran_reader.js
   ========================================= */
const { useState, useEffect, useRef, useMemo } = React;
const CustomModal = window.CustomModal;

// --- دوال مساعدة ---
const normalizeArabic = (text) => {
    if (!text) return "";
    return text.replace(/([^\u0621-\u063A\u0641-\u064A\u0660-\u0669a-zA-Z 0-9])/g, '')
               .replace(/(آ|إ|أ)/g, 'ا').replace(/(ة)/g, 'ه').replace(/(ئ|ؤ)/g, 'ء').replace(/(ى)/g, 'ي');
};

// دالة رسم البطاقة (Canvas)
const drawCardToCanvas = (canvas, text, surah, bgType) => {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = 1080;
    const height = 1080;
    canvas.width = width;
    canvas.height = height;

    // 1. الخلفية
    if (bgType === 'dark') {
        const grd = ctx.createLinearGradient(0, 0, 0, height);
        grd.addColorStop(0, "#1f2937"); grd.addColorStop(1, "#111827");
        ctx.fillStyle = grd;
    } else if (bgType === 'nature') {
        const grd = ctx.createLinearGradient(0, 0, width, height);
        grd.addColorStop(0, "#059669"); grd.addColorStop(1, "#047857");
        ctx.fillStyle = grd;
    } else {
        ctx.fillStyle = "#ffffff";
    }
    ctx.fillRect(0, 0, width, height);

    // 2. الإطار الزخرفي
    ctx.strokeStyle = bgType === 'white' ? "#d1fae5" : "rgba(255,255,255,0.1)";
    ctx.lineWidth = 20;
    ctx.strokeRect(40, 40, width - 80, height - 80);

    // 3. النص (الآية)
    ctx.fillStyle = bgType === 'white' ? "#064e3b" : "#ffffff";
    ctx.font = "bold 60px 'Amiri', serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // التفاف النص (Word Wrap)
    const words = text.split(' ');
    let line = '';
    let lines = [];
    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        if (ctx.measureText(testLine).width > width - 200) {
            lines.push(line);
            line = words[n] + ' ';
        } else {
            line = testLine;
        }
    }
    lines.push(line);

    // رسم السطور
    const lineHeight = 100;
    const startY = (height - (lines.length * lineHeight)) / 2;
    lines.forEach((l, i) => {
        ctx.fillText(l, width / 2, startY + (i * lineHeight));
    });

    // 4. التذييل (اسم السورة + التطبيق)
    ctx.font = "40px sans-serif";
    ctx.fillStyle = bgType === 'white' ? "#10b981" : "#34d399";
    ctx.fillText(`سورة ${surah} | تطبيق حلقات الثريا`, width / 2, height - 100);
};


window.QuranReader = () => {
    // حماية التحميل
    if (!window.APP_DATA || !window.APP_DATA.quran) {
        return <div className="p-10 text-center text-gray-500 font-bold animate-pulse">📖 جاري تجهيز المصحف...</div>;
    }

    // --- الحالات (State) ---
    const [view, setView] = useState('list'); // list, reader, tracker, designer
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
    
    // النوافذ والمودال
    const [tafsirModal, setTafsirModal] = useState({ show: false, ayah: null, text: '' });
    const longPressTimer = useRef(null);

    // حالة المصمم
    const [designData, setDesignData] = useState({ text: '', surah: '', bg: 'white' });
    const canvasRef = useRef(null);

    // --- المنطق (Logic) ---

    // 1. منطق البحث
    const searchResults = useMemo(() => {
        if (!ayahSearch) {
            return {
                type: 'surah',
                data: Object.keys(window.APP_DATA.quran).filter(k => 
                    normalizeArabic(window.APP_DATA.quran[k].name).includes(normalizeArabic(surahSearch))
                )
            };
        } else {
            const term = normalizeArabic(ayahSearch);
            if (term.length < 3) return { type: 'ayah', data: [] };
            let results = [];
            Object.values(window.APP_DATA.quran).forEach(surah => {
                surah.ayahs.forEach(ayah => {
                    if (normalizeArabic(ayah.text).includes(term)) {
                        results.push({ ...ayah, surahName: surah.name, surahId: surah.number });
                    }
                });
            });
            return { type: 'ayah', data: results.slice(0, 50) };
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

    // 3. ملء الشاشة
    useEffect(() => {
        document.body.style.overflow = isFullScreen ? 'hidden' : 'auto';
        return () => { document.body.style.overflow = 'auto'; };
    }, [isFullScreen]);

    // 4. رسم البطاقة عند تغير البيانات
    useEffect(() => {
        if (view === 'designer' && canvasRef.current) {
            drawCardToCanvas(canvasRef.current, designData.text, designData.surah, designData.bg);
        }
    }, [view, designData]);

    // --- الدوال ---

    const open = (id, scrollToAyah = null) => { 
        setActiveSurah({ id, ...window.APP_DATA.quran[id], scrollTarget: scrollToAyah }); 
        setView('reader'); 
    };

    // 🔥 تحديث حالة القراءة + إرسال إشارة للعداد الجماعي
    const togglePageRead = (pageNum) => {
        let newPages;
        if (readPages.includes(pageNum)) {
            newPages = readPages.filter(p => p !== pageNum);
        } else {
            newPages = [...readPages, pageNum];
            if(window.showGlobalAlert) window.showGlobalAlert('مبروك! 🎉', `تم إنجاز الصفحة ${pageNum}`);
            
            // 🔥 تحديث العداد الجماعي (إرسال حدث)
            window.dispatchEvent(new Event('khatma-updated'));
        }
        setReadPages(newPages);
        localStorage.setItem('quran_pages_read', JSON.stringify(newPages));
    };

    const cycleBackground = () => {
        if (bg === 'white') setBg('#fffbf0');
        else if (bg === '#fffbf0') setBg('#1f2937');
        else setBg('white');
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

    // تحميل الصورة
    const downloadCard = () => {
        const link = document.createElement('a');
        link.download = `ayah_${Date.now()}.png`;
        link.href = canvasRef.current.toDataURL();
        link.click();
        if(window.showGlobalAlert) window.showGlobalAlert('تم التحميل', 'تم حفظ البطاقة في جهازك 🖼️');
    };

    return (
        <div className={`transition-all duration-300 shadow-sm overflow-hidden flex flex-col animate-in
            ${isFullScreen 
                ? 'fixed top-0 left-0 w-screen h-screen z-[9999] rounded-none m-0' 
                : 'relative rounded-[2rem] border border-gray-100 h-[650px] z-10'
            }
            bg-white
        `}>
            
            {/* نافذة التفسير + زر المصمم */}
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
                                
                                {/* 🔥 زر المصمم الجديد */}
                                <button className="bg-blue-100 text-blue-700 py-3 rounded-xl font-bold text-xs" onClick={() => {
                                    setDesignData({ text: tafsirModal.ayah.text, surah: activeSurah.name, bg: 'white' });
                                    setTafsirModal({ ...tafsirModal, show: false });
                                    setView('designer');
                                }}>🎨 تصميم بطاقة</button>
                            </div>
                            <button className="w-full bg-gray-100 text-gray-600 py-3 rounded-xl font-bold text-xs" onClick={() => navigator.clipboard.writeText(`${tafsirModal.ayah.text}\n\n${tafsirModal.text}`)}>📋 نسخ النص</button>
                        </div>
                    )}
                </window.CustomModal>
            )}

            {/* --- 1. القائمة الرئيسية (List View) --- */}
            {view === 'list' && (
                <div className="p-4 flex-1 flex flex-col h-full bg-white">
                    <h3 className="text-center font-black text-emerald-900 mb-4 text-xl">📖 المصحف الشريف</h3>
                    
                    {bookmark && (
                        <div onClick={() => open(bookmark.surahId, bookmark.ayahNum)} className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-4 rounded-2xl mb-4 shadow-lg cursor-pointer flex justify-between items-center hover:scale-[1.02] transition">
                            <div><p className="text-[10px] font-bold text-emerald-100 mb-1">أكمل القراءة 🔖</p><h3 className="font-black text-lg">{bookmark.surahName} <span className="text-sm font-normal opacity-80">| آية {bookmark.ayahNum}</span></h3></div>
                            <div className="bg-white/20 w-10 h-10 rounded-full flex items-center justify-center text-xl">👈</div>
                        </div>
                    )}
                    
                    {/* زر الشبكة الجديد */}
                    <div onClick={() => setView('tracker')} className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl mb-3 flex justify-between items-center cursor-pointer hover:bg-emerald-100 transition">
                        <span className="text-xs font-black text-emerald-800">📊 تتبع الختمة (الشبكة)</span>
                        <span className="text-[10px] bg-white px-2 py-1 rounded text-emerald-600 border">{readPages.length} / 604</span>
                    </div>

                    <div className="flex gap-2 mb-3">
                        <input className="flex-1 p-3 border rounded-xl text-xs font-bold bg-gray-50 focus:bg-white transition" placeholder="🔍 السورة..." value={surahSearch} onChange={e=>{setSurahSearch(e.target.value); setAyahSearch('');}} />
                        <input className="flex-[1.5] p-3 border rounded-xl text-xs font-bold bg-gray-50 focus:bg-white transition" placeholder="🔍 الآية..." value={ayahSearch} onChange={e=>{setAyahSearch(e.target.value); setSurahSearch('');}} />
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
                                {searchResults.data.map((res, idx) => (
                                    <button key={idx} onClick={() => open(res.surahId, res.num || res.numberInSurah)} className="w-full text-right p-3 bg-gray-50 rounded-xl border hover:bg-emerald-50 transition">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-xs font-black text-emerald-700">سورة {res.surahName}</span>
                                            <span className="text-[10px] bg-white px-2 rounded border">آية {res.num || res.numberInSurah}</span>
                                        </div>
                                        <p className="font-amiri text-gray-700 text-sm truncate">{res.text}</p>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* --- 2. وضع القراءة (Reader View) --- */}
            {view === 'reader' && activeSurah && (
                <div className="flex flex-col h-full bg-white transition-colors duration-300" style={{backgroundColor: bg}}>
                    <div className={`flex justify-between items-center shadow-sm z-20 sticky top-0 transition-all duration-300 ${isFullScreen ? 'p-4 bg-opacity-90 backdrop-blur-md' : 'p-3'} ${bg === '#1f2937' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-800'}`}>
                        <div className="flex gap-2 items-center">
                            <button onClick={() => { if(isFullScreen) setIsFullScreen(false); else setView('list'); }} className={`rounded-lg font-black flex items-center gap-1 hover:opacity-80 transition ${isFullScreen ? 'px-4 py-2 text-sm' : 'px-3 py-1.5 text-xs'} ${bg === '#1f2937' ? 'bg-gray-700 text-white' : 'bg-white text-gray-600 border'}`}>{isFullScreen ? 'تصغير ✖' : 'خروج'}</button>
                            {!isFullScreen && <button onClick={()=>setIsFullScreen(true)} className="w-8 h-8 rounded-lg border bg-emerald-50 text-emerald-700 text-lg flex items-center justify-center hover:bg-emerald-100">⛶</button>}
                        </div>
                        <span className={`font-black truncate px-2 ${isFullScreen ? 'text-lg' : 'text-sm'} ${bg === '#1f2937' ? 'text-emerald-400' : 'text-emerald-800'}`}>{activeSurah.name}</span>
                        <div className="flex gap-1">
                            <button onClick={cycleBackground} className={`rounded-full border shadow-sm flex items-center justify-center font-bold ${isFullScreen ? 'w-10 h-10' : 'w-8 h-8'} ${bg==='#1f2937' ? 'bg-gray-600 text-white' : 'bg-amber-100'}`}>{bg === '#1f2937' ? '🌙' : '☀️'}</button>
                            <button onClick={()=>setFs(s=>Math.min(3,s+0.2))} className={`rounded-full border font-bold shadow-sm flex items-center justify-center ${isFullScreen ? 'w-10 h-10 text-lg' : 'w-8 h-8'} ${bg==='#1f2937' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white'}`}>+</button>
                            <button onClick={()=>setFs(s=>Math.max(1,s-0.2))} className={`rounded-full border font-bold shadow-sm flex items-center justify-center ${isFullScreen ? 'w-10 h-10 text-lg' : 'w-8 h-8'} ${bg==='#1f2937' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white'}`}>-</button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-5 leading-loose text-justify scrollbar-hide" style={{ fontSize: `${fs}rem` }} dir="rtl">
                        {activeSurah.id !== "1" && activeSurah.id !== "9" && <div className={`text-center font-amiri mb-8 text-lg decoration-wavy select-none ${bg === '#1f2937' ? 'text-emerald-400' : 'text-emerald-800'}`}>بسم الله الرحمن الرحيم</div>}
                        <div className={`font-amiri ${bg === '#1f2937' ? 'text-gray-200' : 'text-gray-800'}`}>
                            {activeSurah.ayahs.map((a) => {
                                const aNum = a.num || a.numberInSurah;
                                const endPageNum = pageBreaks[aNum];
                                return (
                                    <React.Fragment key={aNum}>
                                        <span id={`ayah-${aNum}`} className={`cursor-pointer rounded px-1 transition duration-500 ${bg === '#1f2937' ? 'hover:bg-gray-700' : 'hover:bg-emerald-100/50'} ${bookmark?.surahId === activeSurah.id && bookmark?.ayahNum === aNum ? 'bg-yellow-100 text-gray-800 decoration-yellow-400 underline decoration-2' : ''}`}
                                            onTouchStart={() => handleTouchStart(a)} onTouchEnd={handleTouchEnd} onMouseDown={() => handleTouchStart(a)} onMouseUp={handleTouchEnd} onMouseLeave={handleTouchEnd}>
                                            {a.text} <span className={`text-[0.6em] border rounded-full px-2 mx-1 select-none font-sans shadow-sm inline-block ${bg === '#1f2937' ? 'text-emerald-400 border-emerald-400 bg-gray-800' : 'text-emerald-600 border-emerald-500 bg-white'}`}>{aNum}</span> 
                                        </span>
                                        {endPageNum && (
                                            <div className="w-full my-10 flex flex-col items-center gap-2 select-none animate-in">
                                                <div className="flex items-center gap-4 w-full justify-center opacity-70">
                                                    <div className={`h-px flex-1 ${bg === '#1f2937' ? 'bg-gray-600' : 'bg-emerald-200'}`}></div>
                                                    <div className={`text-[12px] font-bold border px-4 py-1 rounded-full flex items-center gap-2 ${bg === '#1f2937' ? 'bg-gray-800 border-gray-600 text-gray-300' : 'bg-emerald-50 border-emerald-200 text-emerald-800'}`}><span>صفحة {endPageNum}</span></div>
                                                    <div className={`h-px flex-1 ${bg === '#1f2937' ? 'bg-gray-600' : 'bg-emerald-200'}`}></div>
                                                </div>
                                                <button onClick={() => togglePageRead(endPageNum)} className={`text-xs font-bold px-4 py-2 rounded-xl transition flex items-center gap-2 shadow-sm ${readPages.includes(endPageNum) ? 'bg-green-500 text-white' : (bg === '#1f2937' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-500 hover:bg-gray-200')}`}>
                                                    {readPages.includes(endPageNum) ? '✅ تم الحفظ' : '⬜ تحديد كتم قراءة'}
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

            {/* --- 3. وضع الشبكة (Tracker View) --- */}
            {view === 'tracker' && (
                <div className="p-4 flex-1 flex flex-col h-full bg-white animate-in">
                    <div className="flex justify-between items-center mb-4">
                        <button onClick={() => setView('list')} className="text-xs font-bold bg-gray-100 px-3 py-1 rounded-lg text-gray-600">رجوع</button>
                        <h3 className="font-black text-emerald-800">تتبع الختمة ({readPages.length}/604)</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto grid grid-cols-6 gap-1 content-start scrollbar-hide pb-10">
                        {Array.from({length: 604}, (_, i) => i + 1).map(pageNum => (
                            <div key={pageNum} onClick={() => togglePageRead(pageNum)} 
                                className={`h-8 flex items-center justify-center text-[9px] font-bold rounded cursor-pointer transition 
                                ${readPages.includes(pageNum) ? 'bg-emerald-500 text-white' : 'bg-gray-50 text-gray-400 border hover:bg-gray-100'}`}>
                                {pageNum}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* --- 4. وضع المصمم (Designer View) --- */}
            {view === 'designer' && (
                <div className="p-4 flex-1 flex flex-col h-full bg-gray-50 animate-in">
                    <div className="flex justify-between items-center mb-4">
                        <button onClick={() => setView('list')} className="text-xs font-bold bg-white border px-3 py-1 rounded-lg text-gray-600">إلغاء</button>
                        <h3 className="font-black text-blue-800">مصمم البطاقات</h3>
                        <button onClick={downloadCard} className="text-xs font-bold bg-blue-600 text-white px-3 py-1 rounded-lg shadow-lg">حفظ 📥</button>
                    </div>
                    
                    {/* لوحة الرسم */}
                    <div className="flex-1 flex items-center justify-center p-2">
                        <canvas ref={canvasRef} className="w-full max-w-[300px] shadow-2xl rounded-xl" style={{aspectRatio: '1/1'}} />
                    </div>

                    {/* أدوات التحكم */}
                    <div className="bg-white p-4 rounded-2xl shadow-sm border mt-4">
                        <p className="text-xs font-bold text-gray-500 mb-2">اختر الخلفية:</p>
                        <div className="flex gap-2">
                            <button onClick={() => setDesignData({...designData, bg: 'white'})} className="flex-1 py-2 rounded-lg border bg-white text-xs font-bold">أبيض</button>
                            <button onClick={() => setDesignData({...designData, bg: 'dark'})} className="flex-1 py-2 rounded-lg bg-gray-800 text-white text-xs font-bold">داكن</button>
                            <button onClick={() => setDesignData({...designData, bg: 'nature'})} className="flex-1 py-2 rounded-lg bg-green-600 text-white text-xs font-bold">طبيعة</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
