/* =========================================
   الوحدة: واحة الزوار (النسخة الاحترافية الكاملة)
   المسار: js/modules/visitors.js
   ========================================= */
const { useState, useEffect, useRef } = React;
const { db, doc, onSnapshot, updateDoc, increment, getDoc, setDoc } = window; // أدوات قاعدة البيانات

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
                list.push({ title: '✨ الثلث الأخير', msg: 'أنت في وقت النزول الإلهي، استغفر!', active: true });
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

            // 3. حساب رمضان (تاريخ تقريبي: 17 فبراير 2026 مثلاً)
            // يمكنك تحديث التاريخ سنوياً أو جعله ديناميكياً
            const ramadanDate = new Date('2026-02-17'); 
            const diff = ramadanDate - now;
            const daysToRamadan = Math.ceil(diff / (1000 * 60 * 60 * 24));
            
            if (daysToRamadan > 0 && daysToRamadan < 100) {
                 list.push({ title: '🌙 رمضان المبارك', msg: `باقي ${daysToRamadan} يوم!`, active: false });
            }

            setTimes(list);
        };

        calculateTimes();
    }, []);

    return (
        <div className="grid grid-cols-3 gap-2 mb-6 animate-in">
            {times.map((t, i) => (
                <div key={i} className={`p-2 rounded-xl text-center border ${t.active ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' : 'bg-white border-gray-100 text-gray-500'}`}>
                    <div className="text-[10px] font-bold opacity-80">{t.title}</div>
                    <div className="text-xs font-black mt-1">{t.msg}</div>
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
        if (!window.db) return;
        const unsub = window.onSnapshot(window.doc(window.db, "appData", "globalStats"), (doc) => {
            if (doc.exists()) {
                setCount(doc.data().pagesRead || 0);
            } else {
                // إنشاء المستند إذا لم يكن موجوداً
                window.setDoc(window.doc(window.db, "appData", "globalStats"), { pagesRead: 0 });
            }
        });
        return () => unsub();
    }, []);

    const addPage = async () => {
        setLoading(true);
        if(window.showGlobalAlert) window.showGlobalAlert('تقبل الله 🤲', 'تمت إضافة صفحتك للعداد الجماعي!');
        
        try {
            // تحديث الرقم في قاعدة البيانات (زيادة 1)
            // نستخدم طريقة القراءة ثم التحديث لضمان العمل ببساطة
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
            <div className="relative z-10 text-4xl font-black mb-2 tracking-widest">{count.toLocaleString()}</div>
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
// 3. صيدلية القلوب (Feelings Pharmacy) - كما هي
// --------------------------------------------------------
window.FeelingsPharmacy = () => {
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
window.CardMaker = () => {
    const [text, setText] = useState('اللهم اجعل القرآن ربيع قلوبنا\nونور صدورنا');
    const [author, setAuthor] = useState('');
    const [color, setColor] = useState('#059669'); // اللون الأساسي
    const [font, setFont] = useState('font-amiri');
    const [pattern, setPattern] = useState(true);
    const cardRef = useRef(null);

    // دالة التحميل بجودة عالية (HD)
    const handleDownload = async () => {
        if (!cardRef.current) return;
        if (!window.html2canvas) return window.showGlobalAlert('خطأ', 'مكتبة الصور غير محملة. تأكد من إضافتها في index.html');

        try {
            // إظهار تنبيه
            if(window.showGlobalAlert) window.showGlobalAlert('جاري المعالجة 🎨', 'يتم تجهيز الصورة بدقة عالية...');
            
            // تحويل الـ HTML إلى Canvas
            const canvas = await window.html2canvas(cardRef.current, {
                scale: 3, // دقة مضاعفة 3 مرات (HD)
                useCORS: true,
                backgroundColor: null
            });

            // إنشاء رابط التحميل
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
            
            {/* منطقة المعاينة (البطاقة) */}
            <div className="flex justify-center">
                <div 
                    ref={cardRef}
                    className="aspect-square w-full max-w-[320px] rounded-3xl flex flex-col items-center justify-center p-8 text-center shadow-xl relative overflow-hidden transition-all duration-300"
                    style={{
                        background: `linear-gradient(135deg, ${color}, #000000)`,
                    }}
                >
                    {/* الزخرفة */}
                    {pattern && <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>}
                    
                    {/* النص */}
                    <div className="relative z-10 flex-1 flex items-center justify-center w-full">
                        <p className={`${font} text-2xl text-white font-bold leading-relaxed whitespace-pre-wrap drop-shadow-md`} style={{textShadow: '0 2px 4px rgba(0,0,0,0.3)'}}>
                            {text}
                        </p>
                    </div>

                    {/* التوقيع */}
                    <div className="relative z-10 w-full pt-4 border-t border-white/20 flex justify-between items-end">
                        <div className="text-right">
                             <p className="text-[8px] text-white/60">منصة حلقات الثريا</p>
                        </div>
                        {author && <div className="text-left"><p className="text-[10px] text-white font-bold">✍️ {author}</p></div>}
                    </div>
                </div>
            </div>

            {/* أدوات التحكم */}
            <div className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm space-y-4">
                
                {/* 1. النص (متعدد الأسطر) */}
                <div>
                    <label className="text-xs font-bold text-gray-500 mb-1 block">محتوى البطاقة:</label>
                    <textarea 
                        value={text} 
                        onChange={e => setText(e.target.value)} 
                        className="w-full p-3 border rounded-xl text-center text-sm font-bold h-24 resize-none focus:ring-2 ring-emerald-100 outline-none" 
                        placeholder="اكتب عبارتك هنا..." 
                    />
                </div>

                {/* 2. التوقيع */}
                <div>
                    <label className="text-xs font-bold text-gray-500 mb-1 block">توقيع المصمم (اختياري):</label>
                    <input 
                        value={author} 
                        onChange={e => setAuthor(e.target.value)} 
                        className="w-full p-3 border rounded-xl text-center text-xs font-bold" 
                        placeholder="اكتب اسمك هنا..." 
                    />
                </div>

                {/* 3. الألوان والخطوط */}
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-xs font-bold text-gray-500 mb-1 block">لون الخلفية:</label>
                        <div className="h-10 border rounded-xl overflow-hidden relative">
                            <input 
                                type="color" 
                                value={color} 
                                onChange={e => setColor(e.target.value)} 
                                className="w-[120%] h-[120%] -m-1 cursor-pointer" 
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 mb-1 block">نوع الخط:</label>
                        <select value={font} onChange={e => setFont(e.target.value)} className="w-full h-10 border rounded-xl text-xs font-bold bg-gray-50 text-center">
                            <option value="font-amiri">خط النسخ (الأميري)</option>
                            <option value="font-sans">خط حديث (عصري)</option>
                            <option value="font-serif">خط كلاسيكي</option>
                        </select>
                    </div>
                </div>

                {/* 4. زر الزخرفة */}
                <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
                    <span className="text-xs font-bold text-gray-600">زخرفة إسلامية خلفية؟</span>
                    <input type="checkbox" checked={pattern} onChange={e => setPattern(e.target.checked)} className="w-5 h-5 accent-emerald-600" />
                </div>

                {/* زر التحميل */}
                <button onClick={handleDownload} className="w-full bg-emerald-600 text-white py-4 rounded-xl font-black shadow-lg hover:bg-emerald-700 hover:scale-[1.02] transition flex justify-center items-center gap-2">
                    <span>📥 تحميل الصورة (HD)</span>
                </button>
            </div>
        </div>
    );
};
