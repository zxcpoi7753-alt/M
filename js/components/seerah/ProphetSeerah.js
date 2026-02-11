/* =========================================
   المكون: سيرة النبي ﷺ (النسخة الآمنة)
   المسار: js/components/seerah/ProphetSeerah.js
   ========================================= */
(function() {
    const { useState, useEffect } = React;
    const CustomModal = window.CustomModal;

    const ProphetSeerah = () => {
        const [events, setEvents] = useState([]);
        const [loading, setLoading] = useState(true);
        const [selectedEvent, setSelectedEvent] = useState(null);
        const [filter, setFilter] = useState('all'); 

        // معالج البيانات الآمن
        const processRawData = (rawData) => {
            try {
                if (!rawData || !Array.isArray(rawData)) return [];
                
                return rawData
                    .filter(item => {
                        const txt = (item.title || '') + (item.details || '');
                        return /[\u0600-\u06FF]/.test(txt);
                    })
                    .map((item, index) => {
                        let year = 0;
                        if (item.hijri_year) {
                            let yStr = item.hijri_year.toString();
                            let num = parseInt(yStr.replace(/[^0-9]/g, '')) || 0;
                            let isBefore = yStr.includes('ق') || yStr.includes('BH') || yStr.includes('-');
                            year = isBefore ? -num : num;
                        } else if (item.year) {
                            year = parseInt(item.year);
                        }

                        let loc = { name: item.location_name || "مكة المكرمة", lat: null, lng: null };
                        if (item.geo_coordinates) {
                            const parts = item.geo_coordinates.split(',');
                            if (parts.length === 2) {
                                loc.lat = parseFloat(parts[0].trim());
                                loc.lng = parseFloat(parts[1].trim());
                            }
                        } else if (item.location) {
                            loc = item.location;
                        }

                        return {
                            id: item.event_id || item.id || index,
                            title: item.title,
                            year: year,
                            hijri: item.hijri_year || item.hijri || `${Math.abs(year)} ${year < 1 ? 'ق.هـ' : 'هـ'}`,
                            type: year < 1 ? 'makkah' : 'madinah',
                            details: item.details,
                            location: loc,
                            source: item.source_url || item.source || "كتب السيرة"
                        };
                    })
                    .sort((a, b) => a.year - b.year);
            } catch (e) {
                console.error("خطأ في المعالجة", e);
                return [];
            }
        };

        useEffect(() => {
            fetch('data/seerah/prophet.json')
                .then(res => res.ok ? res.json() : [])
                .then(data => {
                    setEvents(processRawData(data));
                    setLoading(false);
                })
                .catch(() => {
                    // بيانات احتياطية عند الفشل
                    setEvents([{ id: 1, year: -53, title: "مولد النبي ﷺ", details: "عام الفيل", hijri: "53 ق.هـ", location: {name: "مكة"}, type: 'makkah' }]);
                    setLoading(false);
                });
        }, []);

        if (loading) return <div className="p-10 text-center font-bold text-amber-800 animate-pulse flex flex-col items-center gap-4 py-20"><span className="text-5xl">📜</span><span>جاري فتح كتب السيرة...</span></div>;

        const filteredEvents = events.filter(ev => {
            if (filter === 'makkah') return ev.year < 1;
            if (filter === 'madinah') return ev.year >= 1;
            return true;
        });

        return (
            <div className="bg-amber-50/50 min-h-screen rounded-3xl p-2 animate-in">
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

                <div className="bg-white p-3 rounded-2xl shadow-sm border-b-4 border-amber-200 mb-6 sticky top-0 z-20">
                    <div className="flex justify-between items-center mb-2">
                        <h1 className="font-amiri text-lg font-black text-amber-900">أحداث السيرة</h1>
                        <span className="text-[10px] bg-amber-100 px-2 py-1 rounded text-amber-800 font-bold">{filteredEvents.length} حدث</span>
                    </div>
                    <div className="flex justify-center gap-2">
                        <button onClick={()=>setFilter('all')} className={`flex-1 py-2 rounded-xl text-[10px] font-bold transition ${filter==='all'?'bg-amber-600 text-white shadow-lg':'bg-gray-50 text-gray-500'}`}>الكل</button>
                        <button onClick={()=>setFilter('makkah')} className={`flex-1 py-2 rounded-xl text-[10px] font-bold transition ${filter==='makkah'?'bg-amber-600 text-white shadow-lg':'bg-gray-50 text-gray-500'}`}>مكة 🕋</button>
                        <button onClick={()=>setFilter('madinah')} className={`flex-1 py-2 rounded-xl text-[10px] font-bold transition ${filter==='madinah'?'bg-green-600 text-white shadow-lg':'bg-gray-50 text-gray-500'}`}>المدينة 🕌</button>
                    </div>
                </div>

                <div className="relative pb-32 px-2 max-w-2xl mx-auto">
                    <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-gradient-to-b from-amber-200 via-orange-300 to-amber-200 -ml-[2px] rounded-full"></div>
                    {filteredEvents.map((ev, index) => (
                        <div key={ev.id} className={`mb-6 flex justify-between items-center w-full group ${index % 2 === 0 ? 'flex-row-reverse' : ''}`}>
                            <div className="w-[45%]"></div>
                            <div className={`z-10 w-10 h-10 rounded-full flex items-center justify-center text-[9px] font-black shrink-0 border-4 shadow-lg transition group-hover:scale-110 ${ev.year < 1 ? 'bg-amber-100 text-amber-800 border-white' : 'bg-green-100 text-green-800 border-white'}`}>
                                {Math.abs(ev.year)}
                            </div>
                            <div onClick={() => setSelectedEvent(ev)} className="w-[45%] bg-white p-3 rounded-2xl shadow-sm border border-amber-50 cursor-pointer active:scale-95 transition hover:shadow-md hover:border-amber-300 relative overflow-hidden">
                                <div className={`absolute top-0 right-0 w-1 h-full ${ev.year < 1 ? 'bg-amber-400' : 'bg-green-500'}`}></div>
                                <h3 className="font-black text-xs text-gray-800 mb-1 truncate pl-2">{ev.title}</h3>
                                <p className="text-[9px] text-gray-500 line-clamp-2 leading-relaxed pl-1">{ev.details}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    window.ProphetSeerah = ProphetSeerah;
})();
