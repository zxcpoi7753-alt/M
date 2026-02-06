/* =========================================
   الوحدة: واحة الزوار (النسخة الاحترافية: عدادات حية + دقة غيل باوزير)
   المسار: js/modules/visitors.js
   ========================================= */
const { useState, useEffect, useRef } = React;

// ========================================================
// 1. مكون منبه الأوقات الفاضلة (المطور)
// ========================================================
const VirtuousTimesWidget = () => {
    const [isOpen, setIsOpen] = useState(false); // لفتح الودجت بالكامل
    const [loading, setLoading] = useState(false);
    const [locationData, setLocationData] = useState(null); 
    const [activeTab, setActiveTab] = useState(null); // للتحكم في الأقسام (يومي، أسبوعي...)
    
    // التوقيت الحالي (يتحدث كل ثانية للعدادات)
    const [now, setNow] = useState(new Date());

    // تحديث الوقت كل ثانية
    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // قائمة المدن المخصصة (بدقة الإحداثيات)
    const presetLocations = [
        { label: "📍 تحديد موقعي تلقائياً (الأدق)", lat: null, lng: null, type: 'auto' },
        { label: "🇾🇪 اليمن - حضرموت - غيل باوزير", lat: 14.776, lng: 49.365, type: 'manual' }, // إحداثيات دقيقة
        { label: "🇾🇪 اليمن - المكلا", lat: 14.542, lng: 49.124, type: 'manual' },
        { label: "🇾🇪 اليمن - صنعاء", lat: 15.369, lng: 44.191, type: 'manual' },
        { label: "🇸🇦 السعودية - مكة المكرمة", lat: 21.389, lng: 39.857, type: 'manual' },
        { label: "🇸🇦 السعودية - المدينة المنورة", lat: 24.524, lng: 39.569, type: 'manual' },
        { label: "🇪🇬 مصر - القاهرة", lat: 30.044, lng: 31.235, type: 'manual' },
        { label: "🇵🇸 فلسطين - القدس", lat: 31.768, lng: 35.213, type: 'manual' },
    ];

    // جلب البيانات
    const fetchPrayerTimes = async (lat, lng) => {
        setLoading(true);
        try {
            // نستخدم طريقة 4 (أم القرى) لأنها الأدق لليمن والسعودية
            const dateStr = new Date().toISOString().split('T')[0];
            const url = `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${lat}&longitude=${lng}&method=4&adjustment=1`; // adjustment لتصحيح الهجري
            
            const res = await fetch(url);
            const data = await res.json();
            
            if (data.code === 200) {
                setLocationData(data.data);
                if(window.showGlobalAlert) window.showGlobalAlert("تم التحديث", "تم جلب التوقيت بدقة للمنطقة المحددة ✅");
            }
        } catch (error) {
            console.error(error);
            alert("فشل جلب البيانات، تأكد من الإنترنت");
        }
        setLoading(false);
    };

    const handleLocationChange = (e) => {
        const selectedIndex = e.target.selectedIndex;
        if (selectedIndex === 0) return; // العنوان

        const item = presetLocations[selectedIndex - 1]; // -1 لأن الخيار الأول هو العنوان
        
        if (item.type === 'auto') {
            if (!navigator.geolocation) return alert("جهازك لا يدعم تحديد الموقع");
            setLoading(true);
            navigator.geolocation.getCurrentPosition(
                (pos) => fetchPrayerTimes(pos.coords.latitude, pos.coords.longitude),
                () => { setLoading(false); alert("تعذر تحديد الموقع، اختر يدوياً"); }
            );
        } else {
            fetchPrayerTimes(item.lat, item.lng);
        }
    };

    // --- محرك الحسابات الفلكية والشرعية ---
    const calculateEvents = () => {
        if (!locationData) return {};

        const timings = locationData.timings;
        const hijri = locationData.date.hijri;
        
        // تحويل أوقات الصلاة إلى تواريخ (Date Objects) لليوم الحالي
        const getTodayTime = (timeStr) => {
            const [h, m] = timeStr.split(':').map(Number);
            const d = new Date(); d.setHours(h, m, 0, 0);
            return d;
        };

        const fajr = getTodayTime(timings.Fajr);
        const sunrise = getTodayTime(timings.Sunrise);
        const maghrib = getTodayTime(timings.Maghrib);
        const isha = getTodayTime(timings.Isha);

        // 1. حساب منتصف الليل والثلث الأخير
        // (الليل = من المغرب إلى الفجر). نفترض فجر الغد هو نفس فجر اليوم + 24 ساعة للتقريب الدقيق
        const fajrTomorrow = new Date(fajr);
        fajrTomorrow.setDate(fajrTomorrow.getDate() + 1);
        
        const nightDurationMs = fajrTomorrow - maghrib;
        const halfNightTime = new Date(maghrib.getTime() + (nightDurationMs / 2));
        const lastThirdTime = new Date(maghrib.getTime() + (nightDurationMs * 2 / 3));

        // 2. الضحى (شروق + 15 دقيقة)
        const duhaTime = new Date(sunrise.getTime() + 15 * 60000);

        // 3. ساعة الجمعة (آخر ساعة قبل المغرب)
        const fridayHourStart = new Date(maghrib.getTime() - 60 * 60000);

        return {
            daily: [
                { id: 'duha', title: '🌤️ صلاة الضحى', target: duhaTime, desc: 'صلاة الأوابين (بعد الشروق بـ 15د)' },
                { id: 'midnight', title: '🌚 منتصف الليل', target: halfNightTime, desc: 'نهاية وقت العشاء شرعاً' },
                { id: 'lastThird', title: '🌌 الثلث الأخير', target: lastThirdTime, desc: 'وقت النزول الإلهي' }
            ],
            weekly: [
                { id: 'friday', title: '🕌 ساعة الاستجابة', target: fridayHourStart, dayObj: 5, desc: 'آخر ساعة من عصر الجمعة', isWeekly: true },
                { id: 'fasting', title: '📅 صيام الاثنين/الخميس', dayObj: [1, 4], desc: 'تعرض الأعمال على الله', isWeekly: true }
            ],
            monthly: [
                { id: 'whiteDays', title: `🌕 الأيام البيض (${hijri.month.ar})`, days: [13, 14, 15], currentHDay: parseInt(hijri.day), desc: 'وصية النبي ﷺ: صيام ثلاثة أيام' }
            ],
            yearly: [
                { id: 'ramadan', title: '🌙 رمضان المبارك', hMonth: 9, hDay: 1, currentHMonth: parseInt(hijri.month.number), desc: 'شهر القرآن' },
                { id: 'arafa', title: '🕋 يوم عرفة', hMonth: 12, hDay: 9, currentHMonth: parseInt(hijri.month.number), desc: 'يكفر سنتين' },
                { id: 'eidFitr', title: '🎉 عيد الفطر', hMonth: 10, hDay: 1, currentHMonth: parseInt(hijri.month.number), desc: 'فرحة الصائم' },
                { id: 'eidAdha', title: '🐑 عيد الأضحى', hMonth: 12, hDay: 10, currentHMonth: parseInt(hijri.month.number), desc: 'يوم النحر' }
            ]
        };
    };

    const events = calculateEvents();

    // --- مكون العداد التنازلي ---
    const CountdownTimer = ({ targetDate }) => {
        if (!targetDate) return <span>--</span>;
        
        let diff = targetDate - now;
        // لو الوقت فات اليوم، نحسب لبكرة (لليوميات)
        if (diff < 0) diff += 24 * 60 * 60 * 1000; 

        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const m = Math.floor((diff / 1000 / 60) % 60);
        const s = Math.floor((diff / 1000) % 60);

        return (
            <div className="flex gap-2 justify-center items-center text-xs font-bold text-emerald-800" dir="ltr">
                <div className="bg-gray-100 px-2 py-1 rounded"><span>{s}</span><span className="text-[8px] block text-gray-400">ثانية</span></div>:
                <div className="bg-gray-100 px-2 py-1 rounded"><span>{m}</span><span className="text-[8px] block text-gray-400">دقيقة</span></div>:
                <div className="bg-gray-100 px-2 py-1 rounded"><span>{h}</span><span className="text-[8px] block text-gray-400">ساعة</span></div>
                {d > 0 && <div className="bg-emerald-100 px-2 py-1 rounded text-emerald-800"><span>{d}</span><span className="text-[8px] block text-emerald-600">يوم</span></div>}
            </div>
        );
    };

    // مكون خاص لحساب المواسم (رمضان وغيره) بدقة أكبر (بالأيام)
    const SeasonCounter = ({ hMonth, hDay, currentHMonth, currentHDay }) => {
        // حساب تقريبي لعدد الأيام المتبقية بناء على التاريخ الهجري الحالي
        // نفترض الشهر 30 يوم للتبسيط البرمجي في الـ Client Side
        let monthsDiff = hMonth - currentHMonth;
        if (monthsDiff < 0) monthsDiff += 12;
        
        // إذا كنا في نفس الشهر ولكن اليوم لم يأت بعد
        let daysDiff = 0;
        // منطق مبسط:
        const totalDaysLeft = (monthsDiff * 29.5); // متوسط الشهر القمري

        return (
            <div className="text-center">
                {monthsDiff === 0 && currentHDay === hDay ? 
                    <span className="text-green-600 font-black animate-pulse">نحن في اليوم! 🎉</span> :
                    <span className="font-bold text-amber-600">باقي {Math.floor(totalDaysLeft)} يوم تقريباً</span>
                }
            </div>
        );
    };

    return (
        <div className="bg-white rounded-[2rem] border border-gray-200 shadow-sm overflow-hidden mb-6 animate-in">
            {/* رأس القائمة */}
            <div onClick={() => setIsOpen(!isOpen)} className="p-5 flex justify-between items-center cursor-pointer bg-gradient-to-r from-emerald-50 to-white hover:bg-emerald-100 transition">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">⏳</span>
                    <div>
                        <h3 className="font-black text-emerald-900">منبه الأوقات الفاضلة</h3>
                        <p className="text-[10px] text-gray-500 font-bold">حضرموت • مكة • القدس...</p>
                    </div>
                </div>
                <div className={`transform transition duration-300 ${isOpen ? 'rotate-180' : ''}`}>▼</div>
            </div>

            {isOpen && (
                <div className="p-4 bg-gray-50 border-t">
                    
                    {/* اختيار المدينة */}
                    <select onChange={handleLocationChange} className="w-full p-3 mb-4 rounded-xl border border-gray-300 text-xs font-bold bg-white text-center shadow-sm">
                        <option value="">-- اختر منطقتك للحصول على أدق توقيت --</option>
                        {presetLocations.map((loc, idx) => (
                            <option key={idx} value={idx}>{loc.label}</option>
                        ))}
                    </select>

                    {!locationData ? (
                        <div className="text-center text-gray-400 text-xs py-4">يرجى اختيار المدينة لعرض العدادات</div>
                    ) : (
                        <div className="space-y-3">
                            {/* التاريخ الهجري */}
                            <div className="text-center bg-white p-2 rounded-lg border border-emerald-100 mb-4">
                                <span className="text-xs font-black text-emerald-800">
                                    📅 {locationData.date.hijri.day} {locationData.date.hijri.month.ar} {locationData.date.hijri.year} هـ
                                </span>
                            </div>

                            {/* 1. قسم اليوميات */}
                            <div className="bg-white rounded-xl border overflow-hidden">
                                <div onClick={() => setActiveTab(activeTab === 'daily' ? null : 'daily')} className="p-3 bg-blue-50 flex justify-between items-center cursor-pointer">
                                    <span className="font-bold text-xs text-blue-800">🌤️ أوقات يومية (الضحى، السحر...)</span>
                                    <span>{activeTab === 'daily' ? '➖' : '➕'}</span>
                                </div>
                                {activeTab === 'daily' && (
                                    <div className="p-3 space-y-3">
                                        {events.daily.map(ev => (
                                            <div key={ev.id} className="border-b pb-2 last:border-0">
                                                <div className="flex justify-between mb-1">
                                                    <span className="text-xs font-bold text-gray-700">{ev.title}</span>
                                                    <span className="text-[10px] text-gray-400">{ev.target.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                                </div>
                                                <CountdownTimer targetDate={ev.target} />
                                                <p className="text-[9px] text-gray-500 mt-1 text-center">{ev.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* 2. قسم الأسبوعيات */}
                            <div className="bg-white rounded-xl border overflow-hidden">
                                <div onClick={() => setActiveTab(activeTab === 'weekly' ? null : 'weekly')} className="p-3 bg-purple-50 flex justify-between items-center cursor-pointer">
                                    <span className="font-bold text-xs text-purple-800">🗓️ أوقات أسبوعية (الجمعة...)</span>
                                    <span>{activeTab === 'weekly' ? '➖' : '➕'}</span>
                                </div>
                                {activeTab === 'weekly' && (
                                    <div className="p-3 space-y-3">
                                        {events.weekly.map(ev => (
                                            <div key={ev.id} className="border-b pb-2 last:border-0">
                                                <div className="flex justify-between mb-1">
                                                    <span className="text-xs font-bold text-gray-700">{ev.title}</span>
                                                </div>
                                                {/* منطق خاص للجمعة */}
                                                {ev.id === 'friday' && new Date().getDay() === 5 ? 
                                                    <CountdownTimer targetDate={ev.target} /> : 
                                                    <span className="text-[10px] text-gray-400 block text-center">انتظر يوم {ev.id === 'friday' ? 'الجمعة' : 'الاثنين/الخميس'}</span>
                                                }
                                                <p className="text-[9px] text-gray-500 mt-1 text-center">{ev.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* 3. قسم الشهريات (البيض) */}
                            <div className="bg-white rounded-xl border overflow-hidden">
                                <div onClick={() => setActiveTab(activeTab === 'monthly' ? null : 'monthly')} className="p-3 bg-amber-50 flex justify-between items-center cursor-pointer">
                                    <span className="font-bold text-xs text-amber-800">🌕 أوقات شهرية (البيض)</span>
                                    <span>{activeTab === 'monthly' ? '➖' : '➕'}</span>
                                </div>
                                {activeTab === 'monthly' && (
                                    <div className="p-3 text-center">
                                        {events.monthly.map((ev, i) => (
                                            <div key={i}>
                                                <h4 className="font-bold text-xs mb-2">{ev.title}</h4>
                                                <div className="flex justify-center gap-2 mb-2">
                                                    {ev.days.map(d => (
                                                        <span key={d} className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold ${ev.currentHDay === d ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                                            {d}
                                                        </span>
                                                    ))}
                                                </div>
                                                <p className="text-[10px] text-gray-500">{ev.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* 4. قسم السنويات (رمضان) */}
                            <div className="bg-white rounded-xl border overflow-hidden">
                                <div onClick={() => setActiveTab(activeTab === 'yearly' ? null : 'yearly')} className="p-3 bg-emerald-50 flex justify-between items-center cursor-pointer">
                                    <span className="font-bold text-xs text-emerald-800">🌙 مواسم سنوية (رمضان، عرفة)</span>
                                    <span>{activeTab === 'yearly' ? '➖' : '➕'}</span>
                                </div>
                                {activeTab === 'yearly' && (
                                    <div className="p-3 space-y-3">
                                        {events.yearly.map(ev => (
                                            <div key={ev.id} className="flex justify-between items-center border-b pb-2 last:border-0">
                                                <div>
                                                    <span className="text-xs font-bold block">{ev.title}</span>
                                                    <span className="text-[9px] text-gray-400">{ev.desc}</span>
                                                </div>
                                                <div className="text-xs">
                                                    <SeasonCounter hMonth={ev.hMonth} hDay={ev.hDay} currentHMonth={ev.currentHMonth} currentHDay={parseInt(locationData.date.hijri.day)} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// --------------------------------------------------------
// 2. مكون العداد الجماعي
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
        if(window.showGlobalAlert) window.showGlobalAlert('تقبل الله 🤲', 'تم إضافة صفحتك للعداد!');
        try {
            await window.updateDoc(window.doc(window.db, "appData", "globalStats"), { pagesRead: window.increment(1) });
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

// ... (صيدلية القلوب وصانع البطاقات تبقى كما هي في الكود السابق) ...
const FeelingsPharmacy = () => {const [s,SS]=useState(null);const d=[{id:'s',l:'حزين 😔',a:'وَلَا تَهِنُوا',t:'لا تحزن الله معك'},{id:'a',l:'قلق 😟',a:'أَلَا بِذِكْرِ اللَّهِ',t:'استغفر الله'},{id:'f',l:'خائف 😨',a:'أَلَيْسَ اللَّهُ بِكَافٍ',t:'الله يكفيك'},{id:'l',l:'كسول 😴',a:'وَالَّذِينَ جَاهَدُوا',t:'توضأ وصل'},{id:'h',l:'سعيد 😃',a:'لَئِن شَكَرْتُمْ',t:'اشكر تزدد'},{id:'ls',l:'تائه 🚶',a:'وَوَجَدَكَ ضَالًّا',t:'الله يهديك'}];return(<div className="animate-in mb-6">{!s?(<div className="grid grid-cols-2 gap-3">{d.map(i=>(<button key={i.id} onClick={()=>SS(i)} className="p-4 bg-white border-2 border-emerald-50 rounded-2xl shadow-sm hover:border-emerald-400 font-bold text-emerald-800">{i.l}</button>))}</div>):(<div className="bg-white p-6 rounded-[2rem] border-2 border-emerald-100 shadow-lg text-center"><h3 className="text-xl font-black text-emerald-800 mb-4">{s.l}</h3><p className="font-amiri text-2xl text-emerald-600 leading-loose mb-3">﴿ {s.a} ﴾</p><div className="bg-amber-50 p-4 rounded-xl text-amber-900 text-sm font-bold mb-4">💡 {s.t}</div><button onClick={()=>SS(null)} className="bg-gray-100 text-gray-600 px-6 py-2 rounded-xl font-bold text-sm">عودة</button></div>)}</div>)};
const CardMaker = () => {const [t,sT]=useState('اللهم اجعل القرآن ربيع قلوبنا');const [a,sA]=useState('');const [c,sC]=useState('#059669');const [f,sF]=useState('font-amiri');const [p,sP]=useState(true);const r=useRef(null);const hD=async()=>{if(!r.current||!window.html2canvas)return alert('انتظر التحميل');const cv=await window.html2canvas(r.current,{scale:3,useCORS:true,backgroundColor:null});const l=document.createElement("a");l.href=cv.toDataURL("image/png");l.download=`card-${Date.now()}.png`;l.click();};return(<div className="animate-in space-y-6"><div className="flex justify-center"><div ref={r} className="aspect-square w-full max-w-[320px] rounded-3xl flex flex-col items-center justify-center p-8 text-center shadow-xl relative overflow-hidden" style={{background:`linear-gradient(135deg,${c},#000)`}}>{p&&<div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>}<div className="relative z-10 flex-1 flex items-center justify-center w-full"><p className={`${f} text-2xl text-white font-bold leading-relaxed whitespace-pre-wrap drop-shadow-md`}>{t}</p></div><div className="relative z-10 w-full pt-4 border-t border-white/20 flex justify-between items-end"><p className="text-[8px] text-white/60">منصة الثريا</p>{a&&<p className="text-[10px] text-white font-bold">✍️ {a}</p>}</div></div></div><div className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm space-y-4"><div><label className="text-xs font-bold text-gray-500 block">النص:</label><textarea value={t} onChange={e=>sT(e.target.value)} className="w-full p-3 border rounded-xl text-center text-sm font-bold h-20"/></div><div><label className="text-xs font-bold text-gray-500 block">التوقيع:</label><input value={a} onChange={e=>sA(e.target.value)} className="w-full p-3 border rounded-xl text-center text-xs font-bold"/></div><div className="grid grid-cols-2 gap-3"><div><label className="text-xs font-bold text-gray-500 block">اللون:</label><input type="color" value={c} onChange={e=>sC(e.target.value)} className="w-full h-10 rounded-xl cursor-pointer"/></div><div><label className="text-xs font-bold text-gray-500 block">الخط:</label><select value={f} onChange={e=>sF(e.target.value)} className="w-full h-10 border rounded-xl text-xs font-bold"><option value="font-amiri">نسخ</option><option value="font-sans">عصري</option></select></div></div><div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl"><span className="text-xs font-bold">زخرفة؟</span><input type="checkbox" checked={p} onChange={e=>sP(e.target.checked)}/></div><button onClick={hD} className="w-full bg-emerald-600 text-white py-4 rounded-xl font-black shadow-lg">📥 تحميل HD</button></div></div>)};

// تصدير
window.VirtuousTimesWidget = VirtuousTimesWidget;
window.GlobalKhatmaCounter = GlobalKhatmaCounter;
window.FeelingsPharmacy = FeelingsPharmacy;
window.CardMaker = CardMaker;
