/* =========================================
   المكون: منبه الأوقات الفاضلة وأوقات الصلاة
   المسار: js/components/extras/VirtuousTimes.js
   ========================================= */
const { useState, useEffect } = React;

const VirtuousTimesWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [locationData, setLocationData] = useState(null); 
    const [activeTab, setActiveTab] = useState(null);
    const [now, setNow] = useState(new Date());
    const [manualCity, setManualCity] = useState("");

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const presetLocations = [
        { label: "📍 تحديد موقعي تلقائياً", lat: null, lng: null, type: 'auto' },
        { label: "🇾🇪 اليمن - حضرموت - غيل باوزير", lat: 14.776, lng: 49.365, type: 'manual' },
        { label: "🇾🇪 اليمن - المكلا", lat: 14.542, lng: 49.124, type: 'manual' },
        { label: "🇾🇪 اليمن - صنعاء", lat: 15.369, lng: 44.191, type: 'manual' },
        { label: "🇸🇦 السعودية - مكة المكرمة", lat: 21.389, lng: 39.857, type: 'manual' },
        { label: "🇸🇦 السعودية - المدينة المنورة", lat: 24.524, lng: 39.569, type: 'manual' },
        { label: "🇪🇬 مصر - القاهرة", lat: 30.044, lng: 31.235, type: 'manual' },
        { label: "🇵🇸 فلسطين - القدس", lat: 31.768, lng: 35.213, type: 'manual' },
    ];

    const fetchPrayerTimes = async (lat, lng) => {
        setLoading(true);
        try {
            const dateStr = new Date().toISOString().split('T')[0];
            const url = `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${lat}&longitude=${lng}&method=4&adjustment=1`;
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
        const idx = e.target.selectedIndex;
        if (idx === 0) return;
        const item = presetLocations[idx - 1];
        setManualCity(idx - 1);

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

    const calculateEvents = () => {
        if (!locationData) return {};
        const timings = locationData.timings;
        const hijri = locationData.date.hijri;
        
        const getTodayTime = (timeStr) => {
            const [h, m] = timeStr.split(':').map(Number);
            const d = new Date(); d.setHours(h, m, 0, 0);
            return d;
        };

        const fajr = getTodayTime(timings.Fajr);
        const sunrise = getTodayTime(timings.Sunrise);
        const maghrib = getTodayTime(timings.Maghrib);
        
        const fajrTomorrow = new Date(fajr);
        fajrTomorrow.setDate(fajrTomorrow.getDate() + 1);
        
        const nightDurationMs = fajrTomorrow - maghrib;
        const halfNightTime = new Date(maghrib.getTime() + (nightDurationMs / 2));
        const lastThirdTime = new Date(maghrib.getTime() + (nightDurationMs * 2 / 3));
        const duhaTime = new Date(sunrise.getTime() + 15 * 60000);
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

    const CountdownTimer = ({ targetDate }) => {
        if (!targetDate) return <span>--</span>;
        let diff = targetDate - now;
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

    const SeasonCounter = ({ hMonth, hDay, currentHMonth, currentHDay }) => {
        let monthsDiff = hMonth - currentHMonth;
        if (monthsDiff < 0) monthsDiff += 12;
        const totalDaysLeft = (monthsDiff * 29.5); 
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
                    <select onChange={handleLocationChange} value={manualCity} className="w-full p-3 mb-4 rounded-xl border border-gray-300 text-xs font-bold bg-white text-center shadow-sm">
                        <option value="">-- اختر منطقتك للحصول على أدق توقيت --</option>
                        {presetLocations.map((loc, idx) => (<option key={idx} value={idx}>{loc.label}</option>))}
                    </select>
                    {!locationData ? (<div className="text-center text-gray-400 text-xs py-4">يرجى اختيار المدينة لعرض العدادات</div>) : (
                        <div className="space-y-3">
                            <div className="text-center bg-white p-2 rounded-lg border border-emerald-100 mb-4">
                                <span className="text-xs font-black text-emerald-800">📅 {locationData.date.hijri.day} {locationData.date.hijri.month.ar} {locationData.date.hijri.year} هـ</span>
                            </div>
                            <div className="bg-white rounded-xl border overflow-hidden">
                                <div onClick={() => setActiveTab(activeTab === 'daily' ? null : 'daily')} className="p-3 bg-blue-50 flex justify-between items-center cursor-pointer"><span className="font-bold text-xs text-blue-800">🌤️ أوقات يومية (الضحى، السحر...)</span><span>{activeTab === 'daily' ? '➖' : '➕'}</span></div>
                                {activeTab === 'daily' && (<div className="p-3 space-y-3">{events.daily.map(ev => (<div key={ev.id} className="border-b pb-2 last:border-0"><div className="flex justify-between mb-1"><span className="text-xs font-bold text-gray-700">{ev.title}</span><span className="text-[10px] text-gray-400">{ev.target.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span></div><CountdownTimer targetDate={ev.target} /><p className="text-[9px] text-gray-500 mt-1 text-center">{ev.desc}</p></div>))}</div>)}
                            </div>
                            <div className="bg-white rounded-xl border overflow-hidden">
                                <div onClick={() => setActiveTab(activeTab === 'weekly' ? null : 'weekly')} className="p-3 bg-purple-50 flex justify-between items-center cursor-pointer"><span className="font-bold text-xs text-purple-800">🗓️ أوقات أسبوعية (الجمعة...)</span><span>{activeTab === 'weekly' ? '➖' : '➕'}</span></div>
                                {activeTab === 'weekly' && (<div className="p-3 space-y-3">{events.weekly.map(ev => (<div key={ev.id} className="border-b pb-2 last:border-0"><div className="flex justify-between mb-1"><span className="text-xs font-bold text-gray-700">{ev.title}</span></div>{ev.id === 'friday' && new Date().getDay() === 5 ? <CountdownTimer targetDate={ev.target} /> : <span className="text-[10px] text-gray-400 block text-center">انتظر يوم {ev.id === 'friday' ? 'الجمعة' : 'الاثنين/الخميس'}</span>}<p className="text-[9px] text-gray-500 mt-1 text-center">{ev.desc}</p></div>))}</div>)}
                            </div>
                            <div className="bg-white rounded-xl border overflow-hidden">
                                <div onClick={() => setActiveTab(activeTab === 'monthly' ? null : 'monthly')} className="p-3 bg-amber-50 flex justify-between items-center cursor-pointer"><span className="font-bold text-xs text-amber-800">🌕 أوقات شهرية (البيض)</span><span>{activeTab === 'monthly' ? '➖' : '➕'}</span></div>
                                {activeTab === 'monthly' && (<div className="p-3 text-center">{events.monthly.map((ev, i) => (<div key={i}><h4 className="font-bold text-xs mb-2">{ev.title}</h4><div className="flex justify-center gap-2 mb-2">{ev.days.map(d => (<span key={d} className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold ${ev.currentHDay === d ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'}`}>{d}</span>))}</div><p className="text-[10px] text-gray-500">{ev.desc}</p></div>))}</div>)}
                            </div>
                            <div className="bg-white rounded-xl border overflow-hidden">
                                <div onClick={() => setActiveTab(activeTab === 'yearly' ? null : 'yearly')} className="p-3 bg-emerald-50 flex justify-between items-center cursor-pointer"><span className="font-bold text-xs text-emerald-800">🌙 مواسم سنوية (رمضان، عرفة)</span><span>{activeTab === 'yearly' ? '➖' : '➕'}</span></div>
                                {activeTab === 'yearly' && (<div className="p-3 space-y-3">{events.yearly.map(ev => (<div key={ev.id} className="flex justify-between items-center border-b pb-2 last:border-0"><div><span className="text-xs font-bold block">{ev.title}</span><span className="text-[9px] text-gray-400">{ev.desc}</span></div><div className="text-xs"><SeasonCounter hMonth={ev.hMonth} hDay={ev.hDay} currentHMonth={ev.currentHMonth} currentHDay={parseInt(locationData.date.hijri.day)} /></div></div>))}</div>)}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

window.VirtuousTimesWidget = VirtuousTimesWidget;
