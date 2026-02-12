/* =========================================
   المكون: السيرة النبوية (المعالج الاحترافي CSV V2)
   المسار: js/components/seerah/ProphetSeerah.js
   ========================================= */
(function() {
    const { useState, useEffect } = React;
    const CustomModal = window.CustomModal;

    const ProphetSeerah = () => {
        const [events, setEvents] = useState([]);
        const [loading, setLoading] = useState(true);
        const [selectedEvent, setSelectedEvent] = useState(null);
        const [activeTab, setActiveTab] = useState('makkah'); 

        // --- 1. دالة تفكيك CSV الاحترافية (تتعامل مع الفواصل داخل النصوص) ---
        const parseLine = (text) => {
            const result = [];
            let cell = '';
            let inQuotes = false;
            
            for (let i = 0; i < text.length; i++) {
                const char = text[i];
                if (char === '"') {
                    inQuotes = !inQuotes; // تبديل حالة الاقتباس
                } else if (char === ',' && !inQuotes) {
                    result.push(cell.trim()); // نهاية الخلية
                    cell = '';
                } else {
                    cell += char; // إضافة الحرف
                }
            }
            result.push(cell.trim()); // إضافة آخر خلية
            return result;
        };

        // --- 2. المعالج الذكي للبيانات ---
        const processData = (text) => {
            const lines = text.split('\n');
            const result = [];
            
            // تخطي سطر العناوين (أول سطر)
            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;

                // استخدام الدالة الاحترافية للتقسيم
                const columns = parseLine(line);
                
                // التأكد من وجود بيانات كافية
                if (columns.length < 2) continue;

                const title = columns[1];      // العنوان
                const hijriStr = columns[2];   // التاريخ الهجري
                const details = columns[5];    // التفاصيل
                const locationRaw = columns[7];// الموقع

                // فلتر اللغة: تجاهل السطر إذا لم يكن العنوان عربياً
                if (!/[\u0600-\u06FF]/.test(title)) continue;

                // معالجة السنة والنوع (مكي / مدني)
                let year = 0;
                let type = 'madinah'; // الافتراضي

                // تنظيف التاريخ من الرموز
                const cleanHijri = hijriStr.replace(/["]/g, '');

                if (cleanHijri.includes('ق') || cleanHijri.includes('قبل') || cleanHijri.includes('-')) {
                    // مكي (قبل الهجرة)
                    type = 'makkah';
                    const num = parseInt(cleanHijri.replace(/\D/g, '')) || 0;
                    year = -num; 
                } else {
                    // مدني (بعد الهجرة)
                    const num = parseInt(cleanHijri.replace(/\D/g, '')) || 0;
                    year = num;
                    if (year === 0 && !cleanHijri.includes('ق')) type = 'madinah'; // حالات خاصة
                }

                // تحديد اسم الموقع
                let finalLocation = locationRaw ? locationRaw.replace(/["]/g, '') : '';
                if (!finalLocation || finalLocation.length < 2) {
                    finalLocation = (type === 'makkah' ? 'مكة المكرمة' : 'المدينة المنورة');
                }

                result.push({
                    id: i,
                    title: title.replace(/["]/g, ''),
                    year: year,
                    hijri: cleanHijri || 'غير محدد',
                    type: type,
                    details: details ? details.replace(/["]/g, '') : '...',
                    location: finalLocation
                });
            }
            
            // ترتيب الأحداث زمنياً
            return result.sort((a, b) => a.year - b.year);
        };

        useEffect(() => {
            setLoading(true);
            fetch('data/seerah/prophet.json')
                .then(res => res.text())
                .then(text => {
                    const data = processData(text);
                    console.log("Events Loaded:", data.length); // للتأكد في الكونسول
                    setEvents(data);
                    setLoading(false);
                })
                .catch(e => {
                    console.error("Error loading Seerah:", e);
                    setLoading(false);
                });
        }, []);

        const displayEvents = events.filter(ev => ev.type === activeTab);

        if (loading) return <div className="text-center py-20 font-bold text-gray-400 text-xl animate-pulse flex flex-col items-center gap-4"><span className="text-4xl">📜</span><span>جاري قراءة السيرة...</span></div>;

        return (
            <div className="animate-in pb-20">
                {/* 1. نافذة التفاصيل */}
                {CustomModal && selectedEvent && (
                    <CustomModal isOpen={!!selectedEvent} onClose={() => setSelectedEvent(null)} title="تفاصيل الحدث">
                        <div className="space-y-4 text-right">
                            <h2 className="font-amiri text-2xl font-black text-amber-800 border-b pb-3 leading-normal">
                                {selectedEvent.title}
                            </h2>
                            <div className="flex gap-2 flex-wrap">
                                <span className={`px-3 py-1 rounded-lg font-bold text-xs shadow-sm ${selectedEvent.type==='makkah'?'bg-amber-100 text-amber-800':'bg-emerald-100 text-emerald-800'}`}>📅 {selectedEvent.hijri}</span>
                                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg font-bold text-xs shadow-sm">📍 {selectedEvent.location}</span>
                            </div>
                            <div className="bg-amber-50/30 p-4 rounded-2xl border border-amber-100 text-lg leading-loose text-gray-800 font-medium text-justify font-amiri">
                                {selectedEvent.details}
                            </div>
                        </div>
                    </CustomModal>
                )}

                {/* 2. العنوان */}
                <div className="text-center mb-6 pt-2">
                    <h1 className="font-amiri text-3xl font-black text-amber-900 mb-1">رحلة النور ﷺ</h1>
                    <p className="text-gray-400 font-bold text-xs">من المولد إلى الرفيق الأعلى</p>
                </div>

                {/* 3. التبويبات */}
                <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-200 mb-6 sticky top-0 z-30 mx-2">
                    <button onClick={() => setActiveTab('makkah')} className={`flex-1 py-3 rounded-xl font-black text-base transition flex items-center justify-center gap-2 ${activeTab === 'makkah' ? 'bg-amber-500 text-white shadow-md' : 'text-gray-400 hover:bg-gray-50'}`}>
                        <span>🕋</span> مكة
                    </button>
                    <button onClick={() => setActiveTab('madinah')} className={`flex-1 py-3 rounded-xl font-black text-base transition flex items-center justify-center gap-2 ${activeTab === 'madinah' ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-400 hover:bg-gray-50'}`}>
                        <span>🕌</span> المدينة
                    </button>
                </div>

                {/* 4. القائمة */}
                <div className="space-y-4 px-2">
                    {displayEvents.map((ev, idx) => (
                        <div key={ev.id} onClick={() => setSelectedEvent(ev)} className="seerah-card cursor-pointer group hover:border-amber-400 relative overflow-hidden bg-white rounded-3xl shadow-sm border border-gray-100 p-5 transition active:scale-95">
                            <div className={`absolute top-0 right-0 w-2 h-full ${ev.type === 'makkah' ? 'bg-amber-400' : 'bg-emerald-500'}`}></div>
                            
                            <div className="pr-3">
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`px-2 py-1 rounded-md font-black text-[10px] ${ev.type === 'makkah' ? 'bg-amber-50 text-amber-800 border border-amber-100' : 'bg-emerald-50 text-emerald-800 border border-emerald-100'}`}>
                                        {ev.hijri}
                                    </span>
                                    <span className="text-gray-100 font-black text-4xl absolute left-4 top-1 select-none -z-0 opacity-40">#{idx + 1}</span>
                                </div>
                                
                                <h3 className="font-amiri text-xl font-black text-gray-800 mb-2 group-hover:text-amber-700 transition relative z-10 leading-snug">{ev.title}</h3>
                                
                                <p className="text-gray-500 font-semibold text-xs line-clamp-2 leading-relaxed relative z-10">
                                    {ev.details}
                                </p>
                            </div>
                        </div>
                    ))}
                    
                    {displayEvents.length === 0 && (
                        <div className="text-center py-12 bg-white rounded-[2rem] border-2 border-dashed border-gray-200 m-2 flex flex-col items-center justify-center gap-2">
                            <span className="text-4xl grayscale opacity-50">🕋</span>
                            <p className="text-gray-400 font-bold">لا توجد أحداث هنا</p>
                            <p className="text-[10px] text-gray-300">تأكد من صحة ملف البيانات</p>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    window.ProphetSeerah = ProphetSeerah;
})();
