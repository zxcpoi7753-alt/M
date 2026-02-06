/* =========================================
   الوحدة: الحاسبات (Calculators)
   المسار: js/modules/calculators.js
   ========================================= */
const { useState } = React;

// 1. حاسبة الجهد
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
        // التعديل هنا: استخدام النافذة الأنيقة بدلاً من alert
        if (!days || !val) return window.showGlobalAlert("تنبيه", "الرجاء إكمال جميع البيانات");
        const remaining = 604 - (skippedParts * 20);
        if (remaining <= 0) return window.showGlobalAlert("مبارك", "أنت خاتم للقرآن الكريم! 🎉");
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

// 2. حاسبة الوقت
window.CalcTime = () => {
    const [y, setY] = useState(0); const [m, setM] = useState(0); const [d, setD] = useState(0); const [skippedParts, setSkippedParts] = useState(0); const [res, setRes] = useState(null);
    return (
        <div className="feature-container animate-in">
            <h4 className="font-bold text-amber-800 mb-2 text-center text-sm">🎯 حدد المدة</h4>
            <div className="flex gap-1 mb-2"><select className="flex-1 p-2 border rounded text-xs font-bold text-center" value={y} onChange={e=>setY(e.target.value)}>{[...Array(16).keys()].map(i=><option value={i}>{i} سنة</option>)}</select><select className="flex-1 p-2 border rounded text-xs font-bold text-center" value={m} onChange={e=>setM(e.target.value)}>{[...Array(13).keys()].map(i=><option value={i}>{i} شهر</option>)}</select><select className="flex-1 p-2 border rounded text-xs font-bold text-center" value={d} onChange={e=>setD(e.target.value)}>{[...Array(32).keys()].map(i=><option value={i}>{i} يوم</option>)}</select></div>
            <div className="mb-3"><select className="w-full p-2 border rounded-xl text-center font-bold bg-gray-50 text-sm" value={skippedParts} onChange={(e) => setSkippedParts(e.target.value)}>{[...Array(31).keys()].map(i => <option key={i} value={i}>تخطي {i} جزء محفوظ</option>)}</select></div>
            <button onClick={()=>{
                const totalDays=(y*365)+(parseInt(m)*30)+parseInt(d); 
                // التعديل هنا أيضاً
                if(totalDays<=0) return window.showGlobalAlert("تنبيه", "حدد المدة المستهدفة أولاً"); 
                const rem=604-(skippedParts*20); 
                if(rem<=0) return window.showGlobalAlert("ما شاء الله", "أنت خاتم أصلاً!"); 
                setRes({daily:(rem/totalDays).toFixed(1), totalDays, rem});
            }} className="w-full bg-amber-500 text-white py-2 rounded-xl font-bold shadow">احسب خطتي</button>
            {res && (<div className="mt-3 bg-gradient-to-br from-amber-50 to-white p-3 rounded-xl border border-amber-200 text-center animate-in"><p className="text-xl font-black text-amber-800 mt-1">📖 {res.daily} صفحة يومياً</p></div>)}
        </div>
    );
};
