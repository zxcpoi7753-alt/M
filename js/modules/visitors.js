/* =========================================
   الوحدة: واحة الزوار (النسخة الكاملة والمصححة)
   المسار: js/modules/visitors.js
   ========================================= */
const { useState, useEffect, useRef } = React;

// --------------------------------------------------------
// 1. مكون منبه الأوقات الفاضلة (Virtuous Times)
// --------------------------------------------------------
const VirtuousTimesWidget = () => {
    const [times, setTimes] = useState([]);

    useEffect(() => {
        const calculateTimes = () => {
            const now = new Date();
            const list = [];

            // 1. حساب وقت الثلث الأخير (تقريبي: 1:00 AM - 4:00 AM)
            const hour = now.getHours();
            if (hour >= 1 && hour < 4) {
                list.push({ title: '✨ الثلث الأخير', msg: 'وقت النزول الإلهي، استغفر!', active: true });
            } else {
                list.push({ title: '🌑 قيام الليل', msg: 'شرف المؤمن قيامه بالليل', active: false });
            }

            // 2. حساب يوم الجمعة
            const day = now.getDay(); // 5 = الجمعة
            if (day === 5) {
                list.push({ title: '🕌 يوم الجمعة', msg: 'أكثر من الصلاة على النبي ﷺ', active: true });
            } else {
                const daysLeft = 5 - day + (day > 5 ? 7 : 0);
                list.push({ title: '⏳ الجمعة القادمة', msg: `باقي ${daysLeft} يوم`, active: false });
            }

            // 3. رسالة عامة أو رمضان
            list.push({ title: '💡 تذكير', msg: 'اجعل لك خبيئة من عمل صالح', active: false });

            setTimes(list);
        };

        calculateTimes();
    }, []);

    return (
        <div className="grid grid-cols-3 gap-2 mb-6 animate-in">
            {times.map((t, i) => (
                <div key={i} className={`p-2 rounded-xl text-center border ${t.active ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' : 'bg-white border-gray-100 text-gray-500'}`}>
                    <div className={`text-[10px] font-bold ${t.active ? 'opacity-90' : 'opacity-80'}`}>{t.title}</div>
                    <div className="text-xs font-black mt-1 leading-tight">{t.msg}</div>
                </div>
            ))}
        </div>
    );
};

// --------------------------------------------------------
// 2. مكون العداد الجماعي (Global Khatma)
// --------------------------------------------------------
const GlobalKhatmaCounter = () => {
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(false);

    // الاستماع للرقم من قاعدة البيانات (Real-time)
    useEffect(() => {
        if (!window.db || !window.onSnapshot) return;
        try {
            const unsub = window.onSnapshot(window.doc(window.db, "appData", "globalStats"), (doc) => {
                if (doc.exists()) {
                    setCount(doc.data().pagesRead || 0);
                } else {
                    // إنشاء المستند إذا لم يكن موجوداً
                    if(window.setDoc) window.setDoc(window.doc(window.db, "appData", "globalStats"), { pagesRead: 0 });
                }
            });
            return () => unsub();
        } catch (e) { console.log('Firebase not ready yet'); }
    }, []);

    const addPage = async () => {
        if (!window.db) return;
        setLoading(true);
        if(window.showGlobalAlert) window.showGlobalAlert('تقبل الله 🤲', 'تمت إضافة صفحتك للعداد الجماعي!');
        
        try {
            const docRef = window.doc(window.db, "appData", "globalStats");
            const docSnap = await window.getDoc(docRef);
            if (docSnap.exists()) {
                await window.updateDoc(docRef, {
                    pagesRead: (docSnap.data().pagesRead || 0) + 1
                });
            }
        } catch (e) {
            console.error("Error updating count", e);
        }
        setLoading(false);
    };

    return (
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-[2rem] p-6 text-white text-center shadow-lg mb-6 relative overflow-hidden animate-in">
            <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            <h3 className="relative z-10 text-sm font-bold opacity-90 mb-2">🌍 ختمة الثريا العالمية</h3>
            <div className="relative z-10 text-4xl font-black mb-2 tracking-widest" dir="ltr">{count.toLocaleString()}</div>
            <div className="relative z-10 text-[10px] opacity-75 mb-4">صفحة قرأها الزوار حتى الآن</div>
            <button 
                onClick={addPage} 
                disabled={loading}
                className="relative z-10 bg-white text-blue-700 px-6 py-2 rounded-full font-black text-sm hover:scale-105 transition shadow-lg disabled:opacity-50"
            >
                {loading ? 'جاري الإضافة...' : '📖 أتممت قراءة صفحة'}
            </button>
        </div>
    );
};

// --------------------------------------------------------
// 3. صيدلية القلوب (Feelings Pharmacy)
// --------------------------------------------------------
const FeelingsPharmacy = () => {
    const [selected, setSelected] = useState(null);
    const data = [
        { id: 'sad', label: 'حزين 😔', ayah: 'وَلَا تَهِنُوا وَلَا تَحْزَنُوا وَأَنتُمُ الْأَعْلَوْنَ', text: 'لا تحزن، فالله يسمع دبيب النملة السوداء، ألا يسمع قلبك؟' },
        { id: 'anxious', label: 'قلق 😟', ayah: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ', text: 'علاج القلق هو كثرة الذكر. استغفر الله الآن 10 مرات.' },
        { id: 'fear', label: 'خائف 😨', ayah: 'أَلَيْسَ اللَّهُ بِكَافٍ عَبْدَهُ', text: 'من كان الله معه، فممن يخاف؟' },
        { id: 'lazy', label: 'كسول 😴', ayah: 'وَالَّذِينَ جَاهَدُوا فِينَا لَنَهْدِيَنَّهُمْ سُبُلَنَا', text: 'قم وتوضأ وصلِّ ركعتين، ستنشط روحك فوراً.' },
        { id: 'happy', label: 'سعيد 😃', ayah: 'لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ', text: 'قيد هذه النعمة بالشكر حتى تدوم وتزيد.' },
        { id: 'lost', label: 'تائه 🚶', ayah: 'وَوَجَدَكَ ضَالًّا فَهَدَىٰ', text: 'الله الذي هداك سابقاً، لن يتركك الآن.' }
    ];
    return (
        <div className="animate-in mb-6">
            {!selected ? (
                <div className="grid grid-cols-2 gap-3">{data.map(item => (<button key={item.id} onClick={() => setSelected(item)} className="p-4 bg-white border-2 border-emerald-50 rounded-2xl shadow-sm hover:border-emerald-400 flex flex-col items-center gap-2 transition"><span className="font-bold text-emerald-800">{item.label}</span></button>))}</div>
            ) : (
                <div className="bg-white p-6 rounded-[2rem] border-2 border-emerald-100 shadow-lg text-center"><h3 className="text-xl font-black text-emerald-800 mb-4">{selected.label}</h3><p className="font-amiri text-2xl text-emerald-600 leading-loose mb-3">﴿ {selected.ayah} ﴾</p><div className="bg-amber-50 p-4 rounded-xl border border-amber-100 text-amber-900 text-sm font-bold mb-4">💡 {selected.text}</div><button onClick={() => setSelected(null)} className="bg-gray-100 text-gray-600 px-6 py-2 rounded-xl font-bold text-sm">عودة</button></div>
            )}
        </div>
    );
};

// --------------------------------------------------------
// 4. صانع البطاقات الاحترافي (Card Maker 2.0)
// --------------------------------------------------------
const CardMaker = () => {
    const [text, setText] = useState('اللهم اجعل القرآن ربيع قلوبنا\nونور صدورنا');
    const [author, setAuthor] = useState('');
    const [color, setColor] = useState('#059669');
    const [font, setFont] = useState('font-amiri');
    const [pattern, setPattern] = useState(true);
    const cardRef = useRef(null);

    const handleDownload = async () => {
        if (!cardRef.current) return;
        if (!window.html2canvas) return window.showGlobalAlert('خطأ', 'مكتبة الصور غير محملة.');

        try {
            if(window.showGlobalAlert) window.showGlobalAlert('جاري المعالجة 🎨', 'يتم تجهيز الصورة بدقة عالية...');
            
            const canvas = await window.html2canvas(cardRef.current, {
                scale: 3,
                useCORS: true,
                backgroundColor: null
            });

            const image = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.href = image;
            link.download = `thuraya-card-${Date.now()}.png`;
            link.click();
        } catch (err) {
            console.error(err);
            if(window.showGlobalAlert) window.showGlobalAlert('خطأ', 'فشل في حفظ الصورة');
        }
    };

    return (
        <div className="animate-in space-y-6">
            <h2 className="text-center font-black text-lg text-gray-700">🎨 الاستوديو الإبداعي</h2>
            
            {/* منطقة المعاينة */}
            <div className="flex justify-center">
                <div 
                    ref={cardRef}
                    className="aspect-square w-full max-w-[320px] rounded-3xl flex flex-col items-center justify-center p-8 text-center shadow-xl relative overflow-hidden transition-all duration-300"
                    style={{ background: `linear-gradient(135deg, ${color}, #000000)` }}
                >
                    {pattern && <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>}
                    
                    <div className="relative z-10 flex-1 flex items-center justify-center w-full">
                        <p className={`${font} text-2xl text-white font-bold leading-relaxed whitespace-pre-wrap drop-shadow-md`} style={{textShadow: '0 2px 4px rgba(0,0,0,0.3)'}}>
                            {text}
                        </p>
                    </div>

                    <div className="relative z-10 w-full pt-4 border-t border-white/20 flex justify-between items-end">
                        <div className="text-right"><p className="text-[8px] text-white/60">منصة حلقات الثريا</p></div>
                        {author && <div className="text-left"><p className="text-[10px] text-white font-bold">✍️ {author}</p></div>}
                    </div>
                </div>
            </div>

            {/* أدوات التحكم */}
            <div className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm space-y-4">
                <div><label className="text-xs font-bold text-gray-500 mb-1 block">محتوى البطاقة:</label><textarea value={text} onChange={e => setText(e.target.value)} className="w-full p-3 border rounded-xl text-center text-sm font-bold h-24 resize-none focus:ring-2 ring-emerald-100 outline-none" placeholder="اكتب عبارتك هنا..." /></div>
                <div><label className="text-xs font-bold text-gray-500 mb-1 block">توقيع المصمم:</label><input value={author} onChange={e => setAuthor(e.target.value)} className="w-full p-3 border rounded-xl text-center text-xs font-bold" placeholder="اكتب اسمك هنا..." /></div>
                
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-xs font-bold text-gray-500 mb-1 block">لون الخلفية:</label>
                        <div className="h-10 border rounded-xl overflow-hidden relative"><input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-[120%] h-[120%] -m-1 cursor-pointer" /></div>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 mb-1 block">نوع الخط:</label>
                        <select value={font} onChange={e => setFont(e.target.value)} className="w-full h-10 border rounded-xl text-xs font-bold bg-gray-50 text-center"><option value="font-amiri">خط النسخ</option><option value="font-sans">خط عصري</option><option value="font-serif">خط كلاسيكي</option></select>
                    </div>
                </div>

                <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl"><span className="text-xs font-bold text-gray-600">زخرفة إسلامية؟</span><input type="checkbox" checked={pattern} onChange={e => setPattern(e.target.checked)} className="w-5 h-5 accent-emerald-600" /></div>
                <button onClick={handleDownload} className="w-full bg-emerald-600 text-white py-4 rounded-xl font-black shadow-lg hover:bg-emerald-700 transition flex justify-center items-center gap-2"><span>📥 تحميل الصورة (HD)</span></button>
            </div>
        </div>
    );
};

// ==========================================
// 5. تصدير المكونات للنافذة (هام جداً للربط)
// ==========================================
window.VirtuousTimesWidget = VirtuousTimesWidget;
window.GlobalKhatmaCounter = GlobalKhatmaCounter;
window.FeelingsPharmacy = FeelingsPharmacy;
window.CardMaker = CardMaker;
