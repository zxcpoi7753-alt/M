/* =========================================
   المكون: سيرة النبي ﷺ (مع المعالج الذكي للملفات الخام)
   المسار: js/components/seerah/ProphetSeerah.js
   ========================================= */
const { useState, useEffect } = React;
const CustomModal = window.CustomModal;

window.ProphetSeerah = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [filter, setFilter] = useState('all'); // all, makkah, madinah

    // --- المعالج الذكي (هو الذي سينظف ملفك) ---
    const processRawData = (rawData) => {
        try {
            console.log("raw data sample:", rawData[0]); // للفحص

            const cleanEvents = rawData
                // 1. الفلترة: نحذف أي شيء ليس عربياً أو فارغاً
                .filter(item => {
                    // نتحقق من وجود حقل "locale" إذا كان في ملفك
                    if (item.locale && item.locale !== 'ar') return false;
                    // فحص إضافي: هل العنوان يحتوي حروف عربية؟
                    const hasArabic = /[\u0600-\u06FF]/.test(item.title || item.details);
                    return hasArabic;
                })
                // 2. التحويل: ننسق البيانات لتناسب تصميمنا
                .map((item, index) => {
                    // معالجة السنة الهجرية (تحويل "53 ق هـ" إلى -53)
                    let year = 0;
                    if (item.hijri_year) {
                        let yStr = item.hijri_year.toString();
                        let isBefore = yStr.includes('ق') || yStr.includes('BH') || yStr.includes('-');
                        let num = parseInt(yStr.replace(/[^0-9]/g, '')) || 0;
                        year = isBefore ? -num : num;
                    }

                    // معالجة الإحداثيات (تحويل "21.4,39.8" إلى أرقام)
                    let loc = { name: item.location_name || "مكة المكرمة", lat: null, lng: null };
                    if (item.geo_coordinates) {
                        const parts = item.geo_coordinates.split(',');
                        if (parts.length === 2) {
                            loc.lat = parseFloat(parts[0].trim());
                            loc.lng = parseFloat(parts[1].trim());
                        }
                    }

                    return {
                        id: item.event_id || index,
                        title: item.title,
                        year: year,
                        hijri: item.hijri_year || `${Math.abs(year)} هـ`,
                        // تحديد النوع بناءً على السنة
                        type: year < 1 ? 'makkah' : 'madinah', 
                        details: item.details,
                        location: loc,
                        source: item.source_url || "كتب السيرة"
                    };
                })
                // 3. الترتيب: حسب السنة من القديم للجديد
                .sort((a, b) => a.year - b.year);

            return cleanEvents;

        } catch (e) {
            console.error("خطأ في معالجة البيانات:", e);
            return [];
        }
    };

    // تحميل البيانات
    useEffect(() => {
        fetch('data/seerah/prophet.json')
            .then(res => res.json())
            .then(data => {
                // نرسل البيانات للمعالج الذكي أولاً
                const processed = processRawData(data);
                setEvents(processed);
                setLoading(false);
            })
            .catch(err => {
                console.error("فشل تحميل السيرة", err);
                // بيانات تجريبية في حال الفشل
                setEvents([{ id: 1, year: -53, title: "مولد النبي ﷺ", details: "عام الفيل...", hijri: "53 ق.هـ", location: {name: "مكة"} }]);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="p-10 text-center font-bold text-amber-800 animate-pulse flex flex-col items-center gap-4"><span className="text-4xl">📜</span><span>جاري ترتيب أحداث السيرة...</span></div>;

    // فلترة العرض (مكي / مدني)
    const filteredEvents = events.filter(ev => {
        if (filter === 'makkah') return ev.year < 1;
        if (filter === 'madinah') return ev.year >= 1;
        return true;
    });

    return (
        <div className="bg-amber-50/50 min-h-screen rounded-3xl p-2 animate-in">
            
            {/* نافذة التفاصيل */}
            {CustomModal && selectedEvent && (
                <CustomModal isOpen={!!selectedEvent} onClose={() => setSelectedEvent(null)} title="تفاصيل الحدث">
                    <div className="text-right space-y-4">
                        <h3 className="font-amiri text-xl font-black text-amber-800 border-b pb-2">{selectedEvent.title}</h3>
                        
                        <div className="flex justify-between items-center text-xs font-bold text-amber-600 bg-amber-50 p-3 rounded-xl border border-amber-100">
                            <span>📅 {selectedEvent.hijri}</span>
                            <span>📍 {selectedEvent.location.name}</span>
                        </div>
                        
                        {selectedEvent.location.lat && (
                            <a href={`https://www.google.com/maps/search/?api=1&query=${selectedEvent.location.lat},${selectedEvent.location.lng}`} target="_blank" className="block w-full text-center bg-emerald-50 text-emerald-700 py-2 rounded-lg text-xs font-bold border border-emerald-100 hover:bg-emerald-100">
                                🗺️ مشاهدة الموقع على الخريطة
                            </a>
                        )}

                        <div className="bg-white p-4 rounded-xl border leading-loose text-gray-700 font-bold text-justify max-h-60 overflow-y-auto">
                            {selectedEvent.details}
                        </div>
                    </div>
                </CustomModal>
            )}

            {/* الهيدر */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border-b-4 border-amber-200 mb-6 text-center sticky top-0 z-20">
                <h1 className="font-amiri text-2xl font-black text-amber-900">سيرة الحبيب ﷺ</h1>
                <p className="text-[10px] text-gray-400 font-bold mb-3">{events.length} حدث موثق</p>
                <div className="flex justify-center gap-2">
                    <button onClick={()=>setFilter('all')} className={`px-4 py-2 rounded-xl text-xs font-bold transition ${filter==='all'?'bg-amber-600 text-white shadow-lg':'bg-gray-50 text-gray-500'}`}>الكل</button>
                    <button onClick={()=>setFilter('makkah')} className={`px-4 py-2 rounded-xl text-xs font-bold transition ${filter==='makkah'?'bg-amber-600 text-white shadow-lg':'bg-gray-50 text-gray-500'}`}>مكة المكرمة 🕋</button>
                    <button onClick={()=>setFilter('madinah')} className={`px-4 py-2 rounded-xl text-xs font-bold transition ${filter==='madinah'?'bg-green-600 text-white shadow-lg':'bg-gray-50 text-gray-500'}`}>المدينة المنورة 🕌</button>
                </div>
            </div>

            {/* الخط الزمني (Timeline) */}
            <div className="relative pb-32 px-2 max-w-2xl mx-auto">
                {/* الخط الرأسي */}
                <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-gradient-to-b from-amber-200 via-amber-400 to-amber-200 -ml-[2px] rounded-full"></div>

                {filteredEvents.map((ev, index) => (
                    <div key={ev.id} className={`mb-6 flex justify-between items-center w-full group ${index % 2 === 0 ? 'flex-row-reverse' : ''}`}>
                        
                        {/* مساحة فارغة */}
                        <div className="w-[45%]"></div>

                        {/* النقطة المركزية */}
                        <div className={`z-10 w-12 h-12 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 border-4 shadow-lg transition group-hover:scale-110 ${ev.year < 1 ? 'bg-amber-100 text-amber-800 border-white' : 'bg-green-100 text-green-800 border-white'}`}>
                            {Math.abs(ev.year)}
                            <span className="text-[8px] block -mt-1">{ev.year < 1 ? 'ق.هـ' : 'هـ'}</span>
                        </div>

                        {/* بطاقة الحدث */}
                        <div onClick={() => setSelectedEvent(ev)} className="w-[45%] bg-white p-3 rounded-2xl shadow-sm border border-amber-50 cursor-pointer active:scale-95 transition hover:shadow-md hover:border-amber-300 relative overflow-hidden">
                            <div className={`absolute top-0 right-0 w-1 h-full ${ev.year < 1 ? 'bg-amber-400' : 'bg-green-500'}`}></div>
                            <h3 className="font-black text-xs text-gray-800 mb-1 truncate pl-1">{ev.title}</h3>
                            <p className="text-[9px] text-gray-500 line-clamp-2 leading-relaxed">{ev.details}</p>
                        </div>
                    </div>
                ))}
                
                {filteredEvents.length === 0 && (
                    <div className="text-center py-10 text-gray-400 font-bold text-sm">لا توجد أحداث في هذا القسم</div>
                )}
            </div>
        </div>
    );
};
