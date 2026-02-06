/* =========================================
   المكون: صانع البطاقات الاحترافي
   المسار: js/components/extras/CardMaker.js
   ========================================= */
const { useState, useRef } = React;

const CardMaker = () => {
    const [text, setText] = useState('اللهم اجعل القرآن ربيع قلوبنا\nونور صدورنا');
    const [author, setAuthor] = useState('');
    const [color, setColor] = useState('#059669');
    const [font, setFont] = useState('font-amiri');
    const [pattern, setPattern] = useState(true);
    const cardRef = useRef(null);

    const handleDownload = async () => {
        if (!cardRef.current) return;
        if (!window.html2canvas) return window.showGlobalAlert ? window.showGlobalAlert('خطأ', 'مكتبة الصور غير محملة') : alert('خطأ بالمكتبة');

        try {
            if(window.showGlobalAlert) window.showGlobalAlert('جاري المعالجة 🎨', 'يتم تجهيز الصورة بدقة عالية...');
            const canvas = await window.html2canvas(cardRef.current, { scale: 3, useCORS: true, backgroundColor: null });
            const image = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.href = image;
            link.download = `thuraya-card-${Date.now()}.png`;
            link.click();
        } catch (err) {
            console.error(err);
            alert('فشل حفظ الصورة');
        }
    };

    return (
        <div className="animate-in space-y-6">
            <h2 className="text-center font-black text-lg text-gray-700">🎨 الاستوديو الإبداعي</h2>
            <div className="flex justify-center">
                <div ref={cardRef} className="aspect-square w-full max-w-[320px] rounded-3xl flex flex-col items-center justify-center p-8 text-center shadow-xl relative overflow-hidden transition-all duration-300" style={{ background: `linear-gradient(135deg, ${color}, #000000)` }}>
                    {pattern && <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>}
                    <div className="relative z-10 flex-1 flex items-center justify-center w-full"><p className={`${font} text-2xl text-white font-bold leading-relaxed whitespace-pre-wrap drop-shadow-md`} style={{textShadow: '0 2px 4px rgba(0,0,0,0.3)'}}>{text}</p></div>
                    <div className="relative z-10 w-full pt-4 border-t border-white/20 flex justify-between items-end"><div className="text-right"><p className="text-[8px] text-white/60">منصة حلقات الثريا</p></div>{author && <div className="text-left"><p className="text-[10px] text-white font-bold">✍️ {author}</p></div>}</div>
                </div>
            </div>
            <div className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm space-y-4">
                <div><label className="text-xs font-bold text-gray-500 mb-1 block">محتوى البطاقة:</label><textarea value={text} onChange={e => setText(e.target.value)} className="w-full p-3 border rounded-xl text-center text-sm font-bold h-24 resize-none focus:ring-2 ring-emerald-100 outline-none" placeholder="اكتب عبارتك هنا..." /></div>
                <div><label className="text-xs font-bold text-gray-500 mb-1 block">توقيع المصمم:</label><input value={author} onChange={e => setAuthor(e.target.value)} className="w-full p-3 border rounded-xl text-center text-xs font-bold" placeholder="اكتب اسمك هنا..." /></div>
                <div className="grid grid-cols-2 gap-3">
                    <div><label className="text-xs font-bold text-gray-500 mb-1 block">لون الخلفية:</label><div className="h-10 border rounded-xl overflow-hidden relative"><input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-[120%] h-[120%] -m-1 cursor-pointer" /></div></div>
                    <div><label className="text-xs font-bold text-gray-500 mb-1 block">نوع الخط:</label><select value={font} onChange={e => setFont(e.target.value)} className="w-full h-10 border rounded-xl text-xs font-bold bg-gray-50 text-center"><option value="font-amiri">خط النسخ</option><option value="font-sans">خط عصري</option><option value="font-serif">خط كلاسيكي</option></select></div>
                </div>
                <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl"><span className="text-xs font-bold text-gray-600">زخرفة إسلامية؟</span><input type="checkbox" checked={pattern} onChange={e => setPattern(e.target.checked)} className="w-5 h-5 accent-emerald-600" /></div>
                <button onClick={handleDownload} className="w-full bg-emerald-600 text-white py-4 rounded-xl font-black shadow-lg hover:bg-emerald-700 transition flex justify-center items-center gap-2"><span>📥 تحميل الصورة (HD)</span></button>
            </div>
        </div>
    );
};

window.CardMaker = CardMaker;
