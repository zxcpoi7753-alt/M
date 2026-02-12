/* =========================================
   المكون: سيرة النبي ﷺ (مع المعالج الذكي للبيانات المختلطة)
   المسار: js/components/seerah/ProphetSeerah.js
   ========================================= */
(function() {
    const { useState, useEffect, useMemo } = React;
    const CustomModal = window.CustomModal;

    const ProphetSeerah = () => {
        const [events, setEvents] = useState([]);
        const [loading, setLoading] = useState(true);
        const [selectedEvent, setSelectedEvent] = useState(null);
        const [filter, setFilter] = useState('all'); 

        // --- 1. دالة فحص اللغة العربية ---
        const isArabic = (text) => {
            if (!text) return false;
            // هذا النمط يتأكد من وجود حروف عربية في النص
            return /[\u0600-\u06FF]/.test(text);
        };

        // --- 2. محلل CSV الذكي (لأن ملفك أصله Excel/CSV) ---
        const parseCSV = (text) => {
            const lines = text.split('\n');
            const result = [];
            
            // تجاوز السطر الأول (العناوين)
            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;

                // تقسيم السطر مع احترام علامات التنصيص " " للنصوص الطويلة
                // هذا التعبير النمطي المعقد يفصل الفواصل التي خارج علامات التنصيص فقط
                const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
                
                if (matches && matches.length >= 2) {
                    // تنظيف النص من علامات التنصيص الزائدة
                    const clean = (str) => str ? str.replace(/^"|"$/g, '').replace(/""/g, '"').trim() : '';

                    const title = clean(matches[1]); // العنوان عادة في العمود الثاني
                    const details = matches[5] ? clean(matches[5]) : ''; // التفاصيل في العمود السادس
                    const yearStr = clean(matches[2]); // السنة الهجرية
                    
                    // 🔥 الفلتر الخطير: إذا لم يكن العنوان أو التفاصيل بالعربي، تجاهل السطر
                    if (!isArabic(title) && !isArabic(details)) continue;

                    // معالجة السنة
                    let year = 0;
                    let type = 'madinah';
                    if (yearStr.includes('ق') || yearStr.includes('-')) {
                        year = -parseInt(yearStr.replace(/\D/g, '') || 53);
                        type = 'makkah';
                    } else {
                        year = parseInt(yearStr.replace(/\D/g, '') || 1);
                    }

                    result.push({
                        id: i,
                        title: title,
                        year: year,
                        hijri: yearStr || 'غير محدد',
                        type: type,
                        details: details || 'لا توجد تفاصيل متاحة',
                        location: { name: clean(matches[7]) || (year < 1 ? 'مكة المكرمة' : 'المدينة المنورة') },
                        source: "كتب السيرة المعتمدة"
                    });
                }
            }
            return result.sort((a, b) => a.year - b.year);
        };

        // --- 3. معالج JSON العادي (للاحتياط) ---
        const processJSON = (data) => {
            return data.map((item, idx) => ({
                id: item.id || idx,
                title: item.title,
                year: item.year || (item.hijri_year?.includes('ق') ? -parseInt(item.hijri_year) : parseInt(item.hijri_year)) || 0,
                hijri: item.hijri_year || item.hijri,
                details: item.details,
                location: { name: item.location_name || "موقع الحدث" },
                type: (item.year < 1 || (item.hijri_year && item.hijri_year.includes('ق'))) ? 'makkah' : 'madinah'
            })).sort((a, b) => a.year - b.year);
        };

        useEffect(() => {
            // جلب الملف كنص (Text) وليس JSON مباشر لكي لا ينهار التطبيق
            fetch('data/seerah/prophet.json')
                .then(res => res.text()) 
                .then(textData => {
                    try {
                        // محاولة قراءته كـ JSON أولاً
                        const jsonData = JSON.parse(textData);
                        setEvents(processJSON(jsonData));
                    } catch (e) {
                        // إذا فشل (لأنه ملف CSV)، نستخدم المحلل الذكي
                        console.log("تم اكتشاف ملف CSV، جاري التنظيف والترجمة...");
                        const cleanData = parseCSV(textData);
                        setEvents(cleanData);
                    }
                    setLoading(false);
                })
                .catch(err => {
                    console.error("فشل التحميل", err);
                    setLoading(false);
                });
        }, []);

        if (loading) return <div className="p-10 text-center font-bold text-amber-800 animate-pulse flex flex-col items-center gap-4 py-20"><span className="text-5xl">📜</span><span>جاري معالجة كتب السيرة...</span></div>;

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
                    {filteredEvents.length === 0 && <div className="text-center py-10 text-gray-400 font-bold text-sm">لا توجد بيانات مطابقة</div>}
                </div>
            </div>
        );
    };

    window.ProphetSeerah = ProphetSeerah;
})();
