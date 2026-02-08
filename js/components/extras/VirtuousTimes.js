/* =========================================
   المكون: منبه الأوقات الفاضلة (النسخة الهجينة المصححة)
   المسار: js/components/extras/VirtuousTimes.js
   ========================================= */
const { useState, useEffect } = React;

const VirtuousTimesWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [timings, setTimings] = useState(null); 
    const [hijriDate, setHijriDate] = useState(null);
    const [now, setNow] = useState(new Date());
    const [selectedCity, setSelectedCity] = useState("auto");

    // 1. قائمة المدن
    const CITIES = [
        { id: "auto", name: "📍 تحديد موقعي تلقائياً", lat: null, lng: null },
        { id: "mekkah", name: "🇸🇦 مكة المكرمة", lat: 21.389, lng: 39.857 },
        { id: "madina", name: "🇸🇦 المدينة المنورة", lat: 24.524, lng: 39.569 },
        { id: "hadramout", name: "🇾🇪 حضرموت (الغيل)", lat: 14.776, lng: 49.365 },
        { id: "sanaa", name: "🇾🇪 صنعاء", lat: 15.369, lng: 44.191 },
        { id: "cairo", name: "🇪🇬 القاهرة", lat: 30.044, lng: 31.235 },
        { id: "quds", name: "🇵🇸 القدس الشريف", lat: 31.768, lng: 35.213 },
        { id: "baghdad", name: "🇮🇶 بغداد", lat: 33.315, lng: 44.366 },
    ];

    // 2. تواريخ المواسم السنوية
    const YEARLY_TARGETS = [
        { id: 'ramadan', title: '🌙 رمضان المبارك', date: "2026-02-18T00:00:00", desc: 'شهر القرآن' },
        { id: 'eid_fitr', title: '🎉 عيد الفطر', date: "2026-03-20T00:00:00", desc: 'فرحة الصائم' },
        { id: 'arafa', title: '🕋 يوم عرفة', date: "2026-05-27T00:00:00", desc: 'يكفر سنتين' }, 
        { id: 'eid_adha', title: '🐑 عيد الأضحى', date: "2026-05-28T00:00:00", desc: 'يوم النحر' }   
    ];

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (isOpen && !timings) fetchTimings(selectedCity);
    }, [isOpen]);

    const fetchTimings = async (cityId) => {
        setLoading(true);
        let lat, lng;

        try {
            if (cityId === 'auto') {
                if (!navigator.geolocation) throw new Error("الموقع غير مدعوم");
                const pos = await new Promise((resolve, reject) => 
                    navigator.geolocation.getCurrentPosition(resolve, reject)
                );
                lat = pos.coords.latitude;
                lng = pos.coords.longitude;
            } else {
                const city = CITIES.find(c => c.id === cityId);
                lat = city.lat;
                lng = city.lng;
            }

            const dateStr = new Date().toISOString().split('T')[0];
            const response = await fetch(`https://api.aladhan.com/v1/timings/${dateStr}?latitude=${lat}&longitude=${lng}&method=4`);
            const data = await response.json();

            if (data.code === 200) {
                setTimings(data.data.timings);
                setHijriDate(data.data.date.hijri);
                if(window.showGlobalAlert) window.showGlobalAlert("تم التحديث", `تم جلب مواقيت الصلاة بنجاح`);
            }
        } catch (e) {
            console.error(e);
            if(window.showGlobalAlert) window.showGlobalAlert("تنبيه", "تأكد من تفعيل الموقع أو الاتصال بالإنترنت");
        }
        setLoading(false);
    };

    // حساب أوقات الليل والضحى
    const getDailyTimes = () => {
        if (!timings) return [];
        
        const todayStr = new Date().toISOString().split('T')[0];
        const getTime = (t) => {
            // تنظيف الوقت من أي إضافات (مثل (EEST))
            const cleanTime = t.split(' ')[0]; 
            return new Date(`${todayStr}T${cleanTime}`);
        };

        const fajr = getTime(timings.Fajr);
        const maghrib = getTime(timings.Maghrib);
        const sunrise = getTime(timings.Sunrise);
        
        // حساب مدة الليل
        const nightLen = 24 * 60 * 60 * 1000 - (maghrib - fajr); 
        const lastThird = new Date(fajr.getTime() - (nightLen / 3));
        const duha = new Date(sunrise.getTime() + 15 * 60000);

        return [
            { name: "🕌 الضحى (الأوابين)", time: duha },
            { name: "🌌 الثلث الأخير", time: lastThird }
        ];
    };

    // مكون العداد الداخلي
    const Countdown = ({ target }) => {
        const tgtDate = new Date(target);
        let diff = tgtDate - now;

        if (diff < 0) return <span className="text-red-500 font-bold text-[10px]">انقضى</span>;

        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const m = Math.floor((diff / 1000 / 60) % 60);
        const s = Math.floor((diff / 1000) % 60);

        return (
            <div className="flex gap-1 justify-end text-[10px] font-bold font-mono text-emerald-700" dir="ltr">
                <span className="bg-emerald-50 px-1 rounded">{s}</span>:
                <span className="bg-emerald-50 px-1 rounded">{m}</span>:
                <span className="bg-emerald-50 px-1 rounded">{h}</span>
                {d > 0 && <span className="bg-amber-100 text-amber-800 px-1 rounded border border-amber-200 ml-1">{d} يوم</span>}
            </div>
        );
    };

    return (
        <div className="bg-white rounded-[2rem] border border-gray-200 shadow-sm overflow-hidden mb-4 animate-in">
            <div onClick={() => setIsOpen(!isOpen)} className="p-5 flex justify-between items-center cursor-pointer bg-gradient-to-r from-indigo-50 to-white hover:bg-indigo-100 transition">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">⏳</span>
                    <div>
                        <h3 className="font-black text-indigo-900">منبه الأوقات الفاضلة</h3>
                        <p className="text-[10px] text-gray-500 font-bold">
                            {hijriDate ? `${hijriDate.day} ${hijriDate.month.ar} ${hijriDate.year}` : "الصلوات • المواسم • العدادات"}
                        </p>
                    </div>
                </div>
                <div className={`transform transition duration-300 ${isOpen ? 'rotate-180' : ''}`}>▼</div>
            </div>

            {isOpen && (
                <div className="p-4 bg-gray-50 border-t space-y-6">
                    {/* اختيار المدينة */}
                    <div className="bg-white p-2 rounded-xl border">
                        <select 
                            className="w-full text-xs font-bold bg-transparent outline-none text-gray-700"
                            value={selectedCity}
                            onChange={(e) => { setSelectedCity(e.target.value); fetchTimings(e.target.value); }}
                        >
                            {CITIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>

                    {loading && <div className="text-center text-xs text-indigo-500 animate-pulse">جاري جلب المواقيت بدقة... 📡</div>}

                    {timings && (
                        <>
                            {/* الصلوات */}
                            <div>
                                <h4 className="text-center font-black text-gray-700 mb-2 text-xs">🕌 الصلوات اليومية</h4>
                                <div className="grid grid-cols-5 gap-1 text-center">
                                    {["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"].map((k, i) => {
                                        const names = ["الفجر", "الظهر", "العصر", "المغرب", "العشاء"];
                                        let timeRaw = timings[k].split(' ')[0]; // إزالة المنطقة الزمنية
                                        let [h, m] = timeRaw.split(':');
                                        const ampm = h >= 12 ? 'م' : 'ص';
                                        h = h % 12 || 12;
                                        return (
                                            <div key={k} className="bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
                                                <div className="text-[9px] text-gray-400 font-bold">{names[i]}</div>
                                                <div className="text-[10px] font-black text-indigo-800">{h}:{m} {ampm}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* الغنائم */}
                            <div>
                                <h4 className="text-center font-black text-gray-700 mb-2 text-xs">✨ أوقات الغنائم</h4>
                                {getDailyTimes().map((t, i) => (
                                    <div key={i} className="flex justify-between items-center bg-white p-3 mb-1 rounded-xl border border-indigo-50">
                                        <span className="text-xs font-bold text-gray-700">{t.name}</span>
                                        <span className="text-xs font-mono text-indigo-600 font-bold">
                                            {t.time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {/* العدادات */}
                    <div>
                        <h4 className="text-center font-black text-gray-700 mb-2 text-xs">📅 كم باقي للمواسم؟</h4>
                        <div className="space-y-2">
                            {YEARLY_TARGETS.map((t) => (
                                <div key={t.id} className="bg-white p-3 rounded-xl border border-emerald-100 shadow-sm">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-bold text-xs text-emerald-900">{t.title}</span>
                                        <span className="text-[9px] text-gray-400">{t.desc}</span>
                                    </div>
                                    <Countdown target={t.date} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

window.VirtuousTimesWidget = VirtuousTimesWidget;
