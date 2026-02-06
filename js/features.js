/* =========================================
   ملف الميزات: js/features.js (تحديث التفسير + النافذة الأنيقة)
   ========================================= */

const { useState, useEffect, useMemo, useRef } = React;

// --- 1. النافذة المنبثقة الأنيقة (بديل Alert) ---
const CustomModal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in">
            <div className="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden border-4 border-emerald-50 scale-in">
                <div className="bg-emerald-50 p-4 text-center border-b border-emerald-100">
                    <h3 className="font-black text-emerald-800 text-lg">{title}</h3>
                </div>
                <div className="p-6 text-center">{children}</div>
                <div className="p-4 bg-gray-50 flex justify-center">
                    <button onClick={onClose} className="bg-emerald-600 text-white px-8 py-2 rounded-xl font-bold shadow hover:bg-emerald-700 w-full">حسناً</button>
                </div>
            </div>
        </div>
    );
};

// قائمة السور
const SURAH_NAMES = ["الفاتحة", "البقرة", "آل عمران", "النساء", "المائدة", "الأنعام", "الأعراف", "الأنفال", "التوبة", "يونس", "هود", "يوسف", "الرعد", "إبراهيم", "الحجر", "النحل", "الإسراء", "الكهف", "مريم", "طه", "الأنبياء", "الحج", "المؤمنون", "النور", "الفرقان", "الشعراء", "النمل", "القصص", "العنكبوت", "الروم", "لقمان", "السجدة", "الأحزاب", "سبأ", "فاطر", "يس", "الصافات", "ص", "الزمر", "غافر", "فصلت", "الشورى", "الزخرف", "الدخان", "الجاثية", "الأحقاف", "محمد", "الفتح", "الحجرات", "ق", "الذاريات", "الطور", "النجم", "القمر", "الرحمن", "الواقعة", "الحديد", "المجادلة", "الحشر", "الممتحنة", "الصف", "الجمعة", "المنافقون", "التغابن", "الطلاق", "التحريم", "الملك", "القلم", "الحاقة", "المعارج", "نوح", "الجن", "المزمل", "المدثر", "القيامة", "الإنسان", "المرسلات", "النبأ", "النازعات", "عبس", "التكوير", "الانفطار", "المطففين", "الانشقاق", "البروج", "الطارق", "الأعلى", "الغاشية", "الفجر", "البلد", "الشمس", "الليل", "الضحى", "الشرح", "التين", "العلق", "القدر", "البينة", "الزلزلة", "العاديات", "القارعة", "التكاثر", "العصر", "الهمزة", "الفيل", "قريش", "الماعون", "الكوثر", "الكافرون", "النصر", "المسد", "الإخلاص", "الفلق", "الناس"];
const JUZ_START_INDEX = [0, 1, 2, 3, 4, 4, 5, 6, 7, 8, 9, 10, 12, 13, 15, 17, 18, 21, 23, 25, 27, 29, 33, 36, 39, 41, 46, 51, 58, 67, 78];

// --- 2. حاسبة الجهد (كما هي) ---
window.CalcEffort = () => {
    const [step, setStep] = useState(1);
    const [days, setDays] = useState(null);
    const [amount, setAmount] = useState('');
    const [skippedParts, setSkippedParts] = useState(0);
    const [result, setResult] = useState(null);
    const [showMaxWarning, setShowMaxWarning] = useState(false);

    const validateAmount = () => {
        let val = parseFloat(amount);
        if (isNaN(val)) return;
        if (val < 0.1) setAmount(0.1); else if (val > 1812) { setAmount(1812); setShowMaxWarning(true); } else setShowMaxWarning(false);
    };
    const calculate = () => {
        const val = parseFloat(amount);
        if (!days || !val) return alert("أكمل البيانات");
        const remaining = 604 - (skippedParts * 20);
        if (remaining <= 0) return alert("مبارك! أنت خاتم.");
        const weekly = val * days;
        const weeks = remaining / weekly;
        const years = Math.floor(weeks / 52);
        const months = Math.floor((weeks % 52) / 4.3);
        setResult({ rate: `${val} صفحة يومياً`, duration: `${years > 0 ? years + ' سنة ' : ''}${months} شهر` });
    };
    return (
        <div className="feature-container animate-in">
            {showMaxWarning && <div className="bg-red-50 text-red-800 p-2 text-xs font-bold rounded mb-2 text-center">⚠ الحد الأقصى</div>}
            {step === 1 && (<div className="text-center"><h4 className="font-bold text-emerald-800 mb-3 text-sm">1️⃣ أيام الحفظ في الأسبوع؟</h4><div className="grid grid-cols-7 gap-1">{[1, 2, 3, 4, 5, 6, 7].map(d => (<button key={d} onClick={() => { setDays(d); setStep(2); }} className="aspect-square rounded-xl bg-gray-50 hover:bg-emerald-600 hover:text-white border font-black text-sm">{d}</button>))}</div></div>)}
            {step === 2 && (<div className="text-center animate-in"><h4 className="font-bold text-emerald-800 mb-2 text-sm">2️⃣ المقدار والتخطي</h4><input type="number" step="0.1" className="w-full p-3 border rounded-xl mb-3 text-center font-bold" placeholder="صفحة يومياً" value={amount} onChange={e=>setAmount(e.target.value)} onBlur={validateAmount} /><select className="w-full p-2 border rounded-xl text-center font-bold bg-gray-50 text-sm mb-3" value={skippedParts} onChange={(e) => setSkippedParts(e.target.value)}>{[...Array(31).keys()].map(i => <option key={i} value={i}>تخطي {i} جزء</option>)}</select><button onClick={calculate} className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold shadow-lg">احسب</button>{result && (<div className="mt-4 bg-emerald-50 border border-emerald-200 p-4 rounded-xl"><h3 className="text-emerald-800 font-black text-lg mb-1">🎉 النتيجة</h3><p className="text-xs text-gray-500 mb-2">المدة المتوقعة: {result.duration}</p></div>)}<button onClick={() => {setStep(1); setResult(null);}} className="text-[10px] text-gray-400 mt-2 underline">إعادة</button></div>)}
        </div>
    );
};

// --- 3. حاسبة الوقت (كما هي) ---
window.CalcTime = () => {
    const [y, setY] = useState(0); const [m, setM] = useState(0); const [d, setD] = useState(0); const [skippedParts, setSkippedParts] = useState(0); const [res, setRes] = useState(null);
    return (
        <div className="feature-container animate-in">
            <h4 className="font-bold text-amber-800 mb-2 text-center text-sm">🎯 حدد المدة</h4>
            <div className="flex gap-1 mb-2"><select className="flex-1 p-2 border rounded text-xs font-bold text-center" value={y} onChange={e=>setY(e.target.value)}>{[...Array(16).keys()].map(i=><option value={i}>{i} سنة</option>)}</select><select className="flex-1 p-2 border rounded text-xs font-bold text-center" value={m} onChange={e=>setM(e.target.value)}>{[...Array(13).keys()].map(i=><option value={i}>{i} شهر</option>)}</select><select className="flex-1 p-2 border rounded text-xs font-bold text-center" value={d} onChange={e=>setD(e.target.value)}>{[...Array(32).keys()].map(i=><option value={i}>{i} يوم</option>)}</select></div>
            <div className="mb-3"><select className="w-full p-2 border rounded-xl text-center font-bold bg-gray-50 text-sm" value={skippedParts} onChange={(e) => setSkippedParts(e.target.value)}>{[...Array(31).keys()].map(i => <option key={i} value={i}>تخطي {i} جزء محفوظ</option>)}</select></div>
            <button onClick={()=>{const totalDays=(y*365)+(parseInt(m)*30)+parseInt(d); if(totalDays<=0) return alert("حدد المدة"); const rem=604-(skippedParts*20); if(rem<=0) return alert("أنت خاتم!"); setRes({daily:(rem/totalDays).toFixed(1), totalDays, rem});}} className="w-full bg-amber-500 text-white py-2 rounded-xl font-bold shadow">احسب خطتي</button>
            {res && (<div className="mt-3 bg-gradient-to-br from-amber-50 to-white p-3 rounded-xl border border-amber-200 text-center animate-in"><p className="text-xl font-black text-amber-800 mt-1">📖 {res.daily} صفحة يومياً</p></div>)}
        </div>
    );
};

// --- 4. اختبر حفظك (كما هو) ---
window.TestHifz = () => {
    const [scope, setScope] = useState('all'); const [selectedJuz, setSelectedJuz] = useState(1); const [selectedSurahInJuz, setSelectedSurahInJuz] = useState('all'); const [customSurahs, setCustomSurahs] = useState([]); const [qType, setQType] = useState('complete'); const [currentQ, setCurrentQ] = useState(null); const [showAns, setShowAns] = useState(false);
    const surahsInSelectedJuz = useMemo(() => { const s=JUZ_START_INDEX[selectedJuz-1]||0; const e=JUZ_START_INDEX[selectedJuz]||114; return SURAH_NAMES.map((n,i)=>({id:i+1, name:n})).filter(x=>x.id>s && x.id<=e+5); }, [selectedJuz]);
    const toggleCustomSurah = (id) => { const s=id.toString(); setCustomSurahs(p=>p.includes(s)?p.filter(x=>x!==s):[...p,s]); };
    const getMaskedText = (t) => { const w=t.trim().split(/\s+/); let c=0; if(w.length<=3) c=Math.max(1,w.length-1); else c=Math.min(6, Math.floor(w.length/2)); return w.slice(0,c).join(' ')+" ..."; };
    const generate = (isNext=false) => {
        if(!window.APP_DATA.quran) return alert("انتظر التحميل...");
        let sId, sObj, aIdx;
        if(isNext && currentQ) { sId=currentQ.sId; sObj=window.APP_DATA.quran[sId]; aIdx=currentQ.aIdx+1; if(aIdx>=sObj.ayahs.length) return alert("انتهت السورة"); }
        else {
            let pool=[];
            if(scope==='custom') pool=customSurahs; else if(scope==='juz') pool=(selectedSurahInJuz!=='all'?[selectedSurahInJuz]:surahsInSelectedJuz.map(s=>s.id.toString())); else pool=Object.keys(window.APP_DATA.quran);
            if(pool.length===0) return alert("اختر سوراً");
            const valid=pool.filter(id=>window.APP_DATA.quran[id]); if(valid.length===0) return alert("لا توجد بيانات");
            sId=valid[Math.floor(Math.random()*valid.length)]; sObj=window.APP_DATA.quran[sId]; aIdx=Math.floor(Math.random()*sObj.ayahs.length);
        }
        const ayah=sObj.ayahs[aIdx]; let qText=ayah.text, prompt="";
        if(qType==='complete'){ prompt="أكمل الآية:"; if(!isNext) qText=getMaskedText(ayah.text); }
        else if(qType==='next') prompt="ما التالي؟"; else if(qType==='prev') prompt="ما السابق؟"; else if(qType==='ayahNum'){prompt="رقم الآية؟"; qText=ayah.text;} else if(qType==='surahName'){prompt="اسم السورة؟"; qText=ayah.text;} else if(qType==='page'){prompt="رقم الصفحة؟"; qText=ayah.text;}
        setCurrentQ({sId, aIdx, qText, fullText:ayah.text, ansText:ayah.text, info:`${sObj.name} - ${ayah.num}`, prompt});
        if(qType==='next') setCurrentQ(p=>({...p, ansText:(aIdx+1<sObj.ayahs.length?sObj.ayahs[aIdx+1].text:"نهاية")}));
        if(qType==='prev') setCurrentQ(p=>({...p, ansText:(aIdx>0?sObj.ayahs[aIdx-1].text:"بداية")}));
        if(qType==='ayahNum') setCurrentQ(p=>({...p, ansText:ayah.num})); if(qType==='surahName') setCurrentQ(p=>({...p, ansText:sObj.name}));
        if(qType==='page'){ const pg=window.APP_DATA.pages?window.APP_DATA.pages.find(pg=>(pg.start.surah_number<parseInt(sId)||(pg.start.surah_number==parseInt(sId)&&pg.start.verse<=ayah.num))&&(pg.end.surah_number>parseInt(sId)||(pg.end.surah_number==parseInt(sId)&&pg.end.verse>=ayah.num))):null; setCurrentQ(p=>({...p, ansText:pg?pg.page:"-"})); }
        setShowAns(false);
    };
    return (
        <div className="feature-container animate-in">
            <div className="flex gap-2 mb-2"><select className="flex-1 p-2 border rounded text-xs font-bold" value={scope} onChange={e=>setScope(e.target.value)}><option value="all">الكل</option><option value="juz">جزء</option><option value="custom">سور محددة</option></select><select className="flex-1 p-2 border rounded text-xs font-bold" value={qType} onChange={e=>setQType(e.target.value)}><option value="complete">أكمل</option><option value="next">التالي</option><option value="prev">السابق</option><option value="ayahNum">رقم الآية</option><option value="surahName">السورة</option><option value="page">الصفحة</option></select></div>
            {scope==='juz' && <div className="mb-2 space-y-2"><select className="w-full p-2 border rounded text-xs font-bold" value={selectedJuz} onChange={e=>setSelectedJuz(parseInt(e.target.value))}>{[...Array(30).keys()].map(i=><option key={i+1} value={i+1}>جزء {i+1}</option>)}</select><select className="w-full p-2 border rounded text-xs font-bold" value={selectedSurahInJuz} onChange={e=>setSelectedSurahInJuz(e.target.value)}><option value="all">كامل الجزء</option>{surahsInSelectedJuz.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></div>}
            {scope==='custom' && <div className="max-h-40 overflow-y-auto border rounded p-2 bg-gray-50 mb-2 grid grid-cols-3 gap-1">{SURAH_NAMES.map((n,i)=>(<div key={i} onClick={()=>toggleCustomSurah(i+1)} className={`text-[10px] p-1 rounded cursor-pointer border text-center ${customSurahs.includes((i+1).toString())?'bg-emerald-600 text-white':'bg-white'}`}>{n}</div>))}</div>}
            <button onClick={()=>generate(false)} className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold shadow mb-4">بدء السؤال 🎲</button>
            {currentQ && (<div className="text-center animate-in"><div className="bg-white border-2 rounded-2xl p-4 mb-3"><p className="text-xs text-gray-400 font-bold mb-2">{currentQ.prompt}</p><p className="font-amiri text-lg leading-loose" dir="rtl">{currentQ.qText}</p></div>{!showAns ? <button onClick={()=>setShowAns(true)} className="w-full bg-amber-100 text-amber-900 py-2 rounded-xl font-bold">كشف الإجابة</button> : <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4"><p className="font-amiri text-lg text-emerald-900 font-bold mb-2">{currentQ.ansText}</p>{qType==='complete'&&<p className="text-[10px] text-gray-500 border-t pt-1 mb-2">{currentQ.fullText}</p>}<p className="text-[10px] text-emerald-600 font-bold">{currentQ.info}</p><div className="flex gap-2 mt-3"><button onClick={()=>generate(false)} className="flex-1 bg-white border py-2 rounded-lg text-xs font-bold">جديد</button>{(qType==='complete'||qType==='next')&&<button onClick={()=>generate(true)} className="flex-1 bg-emerald-600 text-white py-2 rounded-lg text-xs font-bold">تابع ⬅️</button>}</div></div>}</div>)}
        </div>
    );
};

// --- 5. المصحف الشريف (الضغط المطول + نافذة التفسير) ---
window.QuranReader = () => {
    if (!window.APP_DATA || !window.APP_DATA.quran) return <div className="p-4 text-center text-gray-500">جاري تحميل المصحف...</div>;
    const [view, setView] = useState('list'); const [activeSurah, setActiveSurah] = useState(null); const [search, setSearch] = useState(''); const [bg, setBg] = useState('white'); const [fs, setFs] = useState(1.8);
    const [tafsirModal, setTafsirModal] = useState({ show: false, ayah: null });
    const longPressTimer = useRef(null);

    const surahKeys = Object.keys(window.APP_DATA.quran); const filtered = surahKeys.filter(k => window.APP_DATA.quran[k].name.includes(search));
    const open = (id) => { setActiveSurah({ id, ...window.APP_DATA.quran[id] }); setView('reader'); };

    // أحداث الضغط المطول
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

// --- 6. الأذكار (كما هي) ---
window.AzkarApp = window.AzkarApp;
// تصدير النافذة
window.CustomModal = CustomModal;
