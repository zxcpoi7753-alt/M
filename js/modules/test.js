/* =========================================
   الوحدة: اختبار الحفظ (Test)
   المسار: js/modules/test.js
   ========================================= */
const { useState, useMemo } = React;

const SURAH_NAMES = ["الفاتحة", "البقرة", "آل عمران", "النساء", "المائدة", "الأنعام", "الأعراف", "الأنفال", "التوبة", "يونس", "هود", "يوسف", "الرعد", "إبراهيم", "الحجر", "النحل", "الإسراء", "الكهف", "مريم", "طه", "الأنبياء", "الحج", "المؤمنون", "النور", "الفرقان", "الشعراء", "النمل", "القصص", "العنكبوت", "الروم", "لقمان", "السجدة", "الأحزاب", "سبأ", "فاطر", "يس", "الصافات", "ص", "الزمر", "غافر", "فصلت", "الشورى", "الزخرف", "الدخان", "الجاثية", "الأحقاف", "محمد", "الفتح", "الحجرات", "ق", "الذاريات", "الطور", "النجم", "القمر", "الرحمن", "الواقعة", "الحديد", "المجادلة", "الحشر", "الممتحنة", "الصف", "الجمعة", "المنافقون", "التغابن", "الطلاق", "التحريم", "الملك", "القلم", "الحاقة", "المعارج", "نوح", "الجن", "المزمل", "المدثر", "القيامة", "الإنسان", "المرسلات", "النبأ", "النازعات", "عبس", "التكوير", "الانفطار", "المطففين", "الانشقاق", "البروج", "الطارق", "الأعلى", "الغاشية", "الفجر", "البلد", "الشمس", "الليل", "الضحى", "الشرح", "التين", "العلق", "القدر", "البينة", "الزلزلة", "العاديات", "القارعة", "التكاثر", "العصر", "الهمزة", "الفيل", "قريش", "الماعون", "الكوثر", "الكافرون", "النصر", "المسد", "الإخلاص", "الفلق", "الناس"];
const JUZ_START_INDEX = [0, 1, 2, 3, 4, 4, 5, 6, 7, 8, 9, 10, 12, 13, 15, 17, 18, 21, 23, 25, 27, 29, 33, 36, 39, 41, 46, 51, 58, 67, 78];

window.TestHifz = () => {
    const [scope, setScope] = useState('all'); const [selectedJuz, setSelectedJuz] = useState(1); const [selectedSurahInJuz, setSelectedSurahInJuz] = useState('all'); const [customSurahs, setCustomSurahs] = useState([]); const [qType, setQType] = useState('complete'); const [currentQ, setCurrentQ] = useState(null); const [showAns, setShowAns] = useState(false);
    const surahsInSelectedJuz = useMemo(() => { const s=JUZ_START_INDEX[selectedJuz-1]||0; const e=JUZ_START_INDEX[selectedJuz]||114; return SURAH_NAMES.map((n,i)=>({id:i+1, name:n})).filter(x=>x.id>s && x.id<=e+5); }, [selectedJuz]);
    const toggleCustomSurah = (id) => { const s=id.toString(); setCustomSurahs(p=>p.includes(s)?p.filter(x=>x!==s):[...p,s]); };
    const getMaskedText = (t) => { const w=t.trim().split(/\s+/); let c=0; if(w.length<=3) c=Math.max(1,w.length-1); else c=Math.min(6, Math.floor(w.length/2)); return w.slice(0,c).join(' ')+" ..."; };
    
    const generate = (isNext=false) => {
        // استخدام النافذة العامة
        if(!window.APP_DATA.quran) return window.showGlobalAlert("انتظر", "جاري تحميل بيانات المصحف...");
        
        let sId, sObj, aIdx;
        if(isNext && currentQ) { 
            sId=currentQ.sId; sObj=window.APP_DATA.quran[sId]; aIdx=currentQ.aIdx+1; 
            if(aIdx>=sObj.ayahs.length) return window.showGlobalAlert("انتهت", "انتهت السورة، اختر سؤالاً جديداً."); 
        }
        else {
            let pool=[];
            if(scope==='custom') pool=customSurahs; else if(scope==='juz') pool=(selectedSurahInJuz!=='all'?[selectedSurahInJuz]:surahsInSelectedJuz.map(s=>s.id.toString())); else pool=Object.keys(window.APP_DATA.quran);
            if(pool.length===0) return window.showGlobalAlert("تنبيه", "الرجاء تحديد سور للاختبار");
            const valid=pool.filter(id=>window.APP_DATA.quran[id]); 
            if(valid.length===0) return window.showGlobalAlert("خطأ", "لا توجد بيانات للسور المختارة");
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
