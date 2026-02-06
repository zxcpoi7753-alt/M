/* =========================================
   الوحدة: واحة الزوار (النسخة الشاملة: منبه + صلاة + عداد + بطاقات)
   المسار: js/modules/visitors.js
   ========================================= */
const { useState, useEffect, useRef } = React;

// --------------------------------------------------------
// 1. مكون منبه الأوقات الفاضلة وأوقات الصلاة (Virtuous Times & Prayer)
// --------------------------------------------------------
const VirtuousTimesWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [locationData, setLocationData] = useState(null); // { city, timings, hijri }
    const [virtuousEvents, setVirtuousEvents] = useState([]);
    const [manualCity, setManualCity] = useState("Mecca");

    // قائمة مدن يدوية (للحالات الطارئة)
    const cities = [
        { name: "مكة المكرمة", val: "Mecca" }, { name: "المدينة المنورة", val: "Medina" },
        { name: "الرياض", val: "Riyadh" }, { name: "القاهرة", val: "Cairo" },
        { name: "صنعاء", val: "Sanaa" }, { name: "عمان", val: "Amman" },
        { name: "القدس", val: "Jerusalem" }, { name: "بغداد", val: "Baghdad" },
        { name: "دبي", val: "Dubai" }, { name: "إسطنبول", val: "Istanbul" }
    ];

    // 1. دالة جلب البيانات من API
    const fetchPrayerTimes = async (params) => {
        setLoading(true);
        try {
            // استخدام API "رابطة العالم الإسلامي" أو "أم القرى" عبر Aladhan
            const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
            let url = '';
            
            if (params.lat && params.lng) {
                url = `https://api.aladhan.com/v1/timings/${date}?latitude=${params.lat}&longitude=${params.lng}&method=4`; // method 4 = Umm Al Qura
            } else if (params.city) {
                url = `https://api.aladhan.com/v1/timingsByCity/${date}?city=${params.city}&country=&method=4`;
            }

            const res = await fetch(url);
            const data = await res.json();
            
            if (data.code === 200) {
                setLocationData({
                    timings: data.data.timings,
                    hijri: data.data.date.hijri,
                    gregorian: data.data.date.gregorian,
                    meta: data.data.meta
                });
                calculateVirtuousTimes(data.data);
                if(window.showGlobalAlert) window.showGlobalAlert("تم التحديث", "تم جلب أوقات الصلاة والمناسبات بنجاح ✅");
            }
        } catch (error) {
            console.error(error);
            if(window.showGlobalAlert) window.showGlobalAlert("خطأ", "فشل جلب الأوقات، تأكد من الإنترنت.");
        }
        setLoading(false);
    };

    // 2. دالة تحديد الموقع الجغرافي
    const handleLocateMe = () => {
        if (!navigator.geolocation) return alert("المتصفح لا يدعم تحديد الموقع");
        setLoading(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                fetchPrayerTimes({ lat: pos.coords.latitude, lng: pos.coords.longitude });
            },
            (err) => {
                setLoading(false);
                alert("تعذر تحديد الموقع، يرجى اختيار المدينة يدوياً.");
            }
        );
    };

    // 3. المحرك الروحي: حساب الأوقات الفاضلة
    const calculateVirtuousTimes = (data) => {
        const timings = data.timings;
        const hijri = data.date.hijri;
        const events = [];
        const now = new Date();
        const dayOfWeek = now.getDay(); // 0=Sun, 1=Mon... 5=Fri

        // --- أ. الحسابات اليومية ---
        
        // 1. الضحى (الشروق + 15 دقيقة)
        const sunrise = timings.Sunrise; // "06:10"
        events.push({ title: "🌤️ صلاة الضحى", time: addMinutes(sunrise, 15), desc: "صلاة الأوابين، تغنيك عن 360 صدقة", type: 'daily' });

        // 2. منتصف الليل والثلث الأخير
        // نحتاج وقت المغرب ووقت الفجر (لليوم التالي - تقريبياً نستخدم فجر اليوم)
        const maghrib = timeToMinutes(timings.Maghrib);
        let fajr = timeToMinutes(timings.Fajr);
        if (fajr < maghrib) fajr += 24 * 60; // تصحيح لليوم التالي

        const nightDuration = fajr - maghrib;
        const halfNight = maghrib + (nightDuration / 2);
        const lastThird = maghrib + (nightDuration * 2 / 3);

        events.push({ title: "🌚 منتصف الليل", time: minutesToTime(halfNight), desc: "نهاية وقت العشاء الشرعي", type: 'night' });
        events.push({ title: "🌌 الثلث الأخير", time: minutesToTime(lastThird), desc: "وقت النزول الإلهي.. سهام لا تخطئ", type: 'night' });

        // --- ب. الحسابات الأسبوعية ---

        // 3. ساعة الاستجابة (الجمعة)
        if (dayOfWeek === 5) {
            const lastHourFri = timeToMinutes(timings.Maghrib) - 60;
            events.push({ title: "🕌 ساعة الاستجابة", time: minutesToTime(lastHourFri), desc: "أرجى ساعة يوم الجمعة (قبل المغرب)", type: 'vip' });
            events.push({ title: "🚿 غسل الجمعة", time: "صباحاً", desc: "وسنن الجمعة: طيب، سواك، تبكير", type: 'vip' });
        }

        // 4. صيام الاثنين والخميس (تذكير المساء)
        if (dayOfWeek === 0 || dayOfWeek === 3) { // الأحد أو الأربعاء
            events.push({ title: `🍽️ سحور ${dayOfWeek === 0 ? 'الاثنين' : 'الخميس'}`, time: "الليلة", desc: "تبيت النية لصيام الغد", type: 'fasting' });
        }

        // --- ج. الحسابات الشهرية ---

        // 5. الأيام البيض
        const hDay = parseInt(hijri.day);
        if ([12, 13, 14].includes(hDay)) {
             events.push({ title: `🌕 الأيام البيض (${hDay + 1})`, time: "غداً", desc: "صيام الأيام البيض كصيام الدهر", type: 'fasting' });
        }

        // --- د. الحسابات السنوية ---

        // 6. رمضان
        if (hijri.month.number !== 9) {
            // حساب تقريبي: 9 - الشهر الحالي
            let monthsLeft = 9 - hijri.month.number;
            if (monthsLeft < 0) monthsLeft += 12;
            events.push({ title: "🌙 رمضان", time: `باقي ${monthsLeft} شهر`, desc: "اللهم بلغنا رمضان", type: 'year' });
        } else {
            events.push({ title: "🌙 رمضان", time: "نحن فيه!", desc: "شهر القرآن والعتق من النيران", type: 'vip' });
        }

        // 7. عرفة وذي الحجة
        if (hijri.month.number === 12 && hDay < 9) {
             events.push({ title: "🕋 يوم عرفة", time: `باقي ${9 - hDay} يوم`, desc: "خير الدعاء دعاء يوم عرفة", type: 'vip' });
        }

        setVirtuousEvents(events);
    };

    // دوال مساعدة للوقت
    const timeToMinutes = (timeStr) => {
        const [h, m] = timeStr.split(':').map(Number);
        return h * 60 + m;
    };
    const minutesToTime = (totalMin) => {
        let h = Math.floor(totalMin / 60);
        let m = Math.floor(totalMin % 60);
        if (h >= 24) h -= 24;
        const ampm = h >= 12 ? 'م' : 'ص';
        h = h % 12; 
        h = h ? h : 12; 
        return `${h}:${m < 10 ? '0'+m : m} ${ampm}`;
    };
    const addMinutes = (timeStr, minsToAdd) => {
        return minutesToTime(timeToMinutes(timeStr) + minsToAdd);
    };

    return (
        <div className="bg-white rounded-[2rem] border border-gray-200 shadow-sm overflow-hidden mb-6 animate-in">
            {/* 1. رأس الزر القابل للطي */}
            <div onClick={() => setIsOpen(!isOpen)} className="p-5 flex justify-between items-center cursor-pointer bg-gradient-to-r from-emerald-50 to-white hover:bg-emerald-100 transition">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">⏳</span>
                    <div>
                        <h3 className="font-black text-emerald-900">منبه الأوقات الفاضلة</h3>
                        <p className="text-[10px] text-gray-500 font-bold">أوقات الصلاة • الثلث الأخير • الصيام</p>
                    </div>
                </div>
                <div className={`transform transition duration-300 ${isOpen ? 'rotate-180' : ''}`}>▼</div>
            </div>

            {/* 2. المحتوى المخفي */}
            {isOpen && (
                <div className="p-5 bg-white border-t border-gray-100">
                    
                    {/* أ. أدوات تحديد الموقع */}
                    <div className="flex gap-2 mb-6">
                        <button onClick={handleLocateMe} className="flex-1 bg-emerald-600 text-white py-2 rounded-xl text-xs font-bold shadow hover:bg-emerald-700 flex items-center justify-center gap-1">
                            {loading ? 'جاري التحديد...' : '📍 موقعي تلقائياً'}
                        </button>
                        <select 
                            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold p-2 text-center"
                            onChange={(e) => fetchPrayerTimes({ city: e.target.value })}
                            value={manualCity}
                        >
                            <option value="">أو اختر مدينة..</option>
                            {cities.map(c => <option key={c.val} value={c.val}>{c.name}</option>)}
                        </select>
                    </div>

                    {/* ب. عرض أوقات الصلاة (إذا توفرت البيانات) */}
                    {locationData && (
                        <div className="animate-in">
                            <div className="text-center mb-4">
                                <span className="text-xs font-bold bg-amber-100 text-amber-800 px-3 py-1 rounded-full">
                                    📅 {locationData.hijri.day} {locationData.hijri.month.ar} {locationData.hijri.year}
                                </span>
                            </div>

                            {/* جدول الصلوات */}
                            <div className="grid grid-cols-5 gap-1 mb-6 text-center">
                                {['Fajr','Dhuhr','Asr','Maghrib','Isha'].map(p => (
                                    <div key={p} className="bg-gray-50 rounded-lg p-2 border">
                                        <div className="text-[9px] text-gray-400 font-bold mb-1">{{Fajr:'الفجر',Dhuhr:'الظهر',Asr:'العصر',Maghrib:'المغرب',Isha:'العشاء'}[p]}</div>
                                        <div className="text-xs font-black text-emerald-800">
                                            {minutesToTime(timeToMinutes(locationData.timings[p]))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* ج. المناسبات والأوقات الفاضلة */}
                            <h4 className="font-black text-emerald-800 mb-3 border-r-4 border-emerald-500 pr-2">🌟 الفرص الذهبية القادمة:</h4>
                            <div className="space-y-2">
                                {virtuousEvents.map((ev, i) => (
                                    <div key={i} className={`flex justify-between items-center p-3 rounded-xl border-l-4 shadow-sm ${ev.type === 'night' ? 'bg-slate-800 text-white border-slate-500' : ev.type === 'vip' ? 'bg-amber-50 border-amber-400' : 'bg-white border-emerald-400'}`}>
                                        <div>
                                            <div className="font-bold text-sm">{ev.title}</div>
                                            <div className={`text-[10px] ${ev.type==='night'?'text-gray-300':'text-gray-500'}`}>{ev.desc}</div>
                                        </div>
                                        <div className={`text-sm font-black ${ev.type==='night'?'text-emerald-300':'text-emerald-700'}`}>{ev.time}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {!locationData && !loading && (
                        <div className="text-center py-6 text-gray-400 text-xs font-bold">
                            الرجاء تحديد الموقع أو المدينة لعرض الأوقات
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// --------------------------------------------------------
// 2. مكون العداد الجماعي (Global Khatma)
// --------------------------------------------------------
const GlobalKhatmaCounter = () => {
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!window.db || !window.onSnapshot) return;
        const unsub = window.onSnapshot(window.doc(window.db, "appData", "globalStats"), (doc) => {
            if (doc.exists()) setCount(doc.data().pagesRead || 0);
            else if(window.setDoc) window.setDoc(window.doc(window.db, "appData", "globalStats"), { pagesRead: 0 });
        });
        return () => unsub();
    }, []);

    const addPage = async () => {
        if (!window.db) return;
        setLoading(true);
        if(window.showGlobalAlert) window.showGlobalAlert('تقبل الله 🤲', 'ساهمت في العداد العالمي بصفحة!');
        try {
            const docRef = window.doc(window.db, "appData", "globalStats");
            await window.updateDoc(docRef, { pagesRead: window.increment(1) });
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    return (
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-[2rem] p-6 text-white text-center shadow-lg mb-6 relative overflow-hidden animate-in">
            <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            <h3 className="relative z-10 text-sm font-bold opacity-90 mb-2">🌍 العداد العالمي للصفحات المقروءة</h3>
            <div className="relative z-10 text-5xl font-black mb-3 tracking-widest text-yellow-300 drop-shadow-md" dir="ltr">{count.toLocaleString()}</div>
            <button onClick={addPage} disabled={loading} className="relative z-10 bg-white text-blue-700 px-8 py-3 rounded-full font-black text-sm hover:scale-105 transition shadow-lg disabled:opacity-70 flex items-center gap-2 mx-auto">{loading ? 'جاري الإرسال...' : '📖 أتممت قراءة صفحة'}</button>
        </div>
    );
};

// --------------------------------------------------------
// 3. صيدلية القلوب
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
// 4. صانع البطاقات (Card Maker 2.0)
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
            const canvas = await window.html2canvas(cardRef.current, { scale: 3, useCORS: true, backgroundColor: null });
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

// ==========================================
// تصدير المكونات
// ==========================================
window.VirtuousTimesWidget = VirtuousTimesWidget;
window.GlobalKhatmaCounter = GlobalKhatmaCounter;
window.FeelingsPharmacy = FeelingsPharmacy;
window.CardMaker = CardMaker;
