/* =========================================
   المكون: السيرة النبوية (التصميم الاحترافي الكبير)
   ========================================= */
(function() {
    const { useState, useEffect, useMemo } = React;
    const CustomModal = window.CustomModal;

    const ProphetSeerah = () => {
        const [events, setEvents] = useState([]);
        const [loading, setLoading] = useState(true);
        const [selectedEvent, setSelectedEvent] = useState(null);
        const [activeTab, setActiveTab] = useState('makkah'); // makkah, madinah, all

        // --- المعالج الذكي (المصحح) ---
        const parseCSV = (text) => {
            const lines = text.split('\n');
            const result = [];
            
            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;

                // تقسيم ذكي يتجاهل الفواصل داخل النصوص
                const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
                
                if (matches && matches.length >= 2) {
                    const clean = (str) => str ? str.replace(/^"|"$/g, '').replace(/""/g, '"').trim() : '';

                    const title = clean(matches[1]); 
                    const hijriStr = clean(matches[2]); // مثل: 53 ق هـ
                    const details = matches[5] ? clean(matches[5]) : '';
                    
                    // فلتر اللغة: تجاهل الفرنسي
                    if (!/[\u0600-\u06FF]/.test(title)) continue;

                    // معالجة السنة وتحديد النوع (مكي/مدني)
                    let year = 0;
                    let type = 'madinah'; // الافتراضي
                    
                    // كشف مكة (قبل الهجرة)
                    if (hijriStr.includes('ق') || hijriStr.includes('قبل') || hijriStr.includes('-')) {
                        type = 'makkah';
                        // استخراج الرقم فقط
                        const num = parseInt(hijriStr.replace(/\D/g, '')) || 0;
                        year = -num; 
                    } else {
                        // المدينة (بعد الهجرة)
                        const num = parseInt(hijriStr.replace(/\D/g, '')) || 0;
                        year = num;
                        // تصحيح: إذا كان الرقم صغيراً جداً بدون "ق"، نعتبره مدني
                        if (year > 0) type = 'madinah';
                    }

                    result.push({
                        id: i,
                        title: title,
                        year: year,
                        hijri: hijriStr || 'غير محدد',
                        type: type, // makkah OR madinah
                        details: details || '...',
                        location: clean(matches[7]) || (type === 'makkah' ? 'مكة المكرمة' : 'المدينة المنورة')
                    });
                }
            }
            // الترتيب الزمني
            return result.sort((a, b) => a.year - b.year);
        };

        useEffect(() => {
            fetch('data/seerah/prophet.json')
                .then(res => res.text())
                .then(text => {
                    const data = parseCSV(text);
                    setEvents(data);
                    setLoading(false);
                })
                .catch(e => setLoading(false));
        }, []);

        // فلترة العرض حسب التبويب
        const displayEvents = events.filter(ev => {
            if (activeTab === 'all') return true;
            return ev.type === activeTab;
        });

        if (loading) return <div className="text-center py-20 font-bold text-gray-400 text-xl animate-pulse">جاري تجهيز كتاب السيرة...</div>;

        return (
            <div className="animate-in pb-20">
                {/* 1. نافذة التفاصيل (كبيرة وواضحة) */}
                {CustomModal && selectedEvent && (
                    <CustomModal isOpen={!!selectedEvent} onClose={() => setSelectedEvent(null)} title="تـفـاصـيـل الـحـدث">
                        <div className="space-y-4 text-right">
                            <h2 className="font-amiri text-3xl font-black text-amber-800 leading-normal border-b pb-4">
                                {selectedEvent.title}
                            </h2>
                            <div className="flex gap-2 flex-wrap">
                                <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-lg font-bold text-sm">📅 {selectedEvent.hijri}</span>
                                <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-lg font-bold text-sm">📍 {selectedEvent.location}</span>
                            </div>
                            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 text-lg leading-loose text-gray-700 font-semibold text-justify">
                                {selectedEvent.details}
                            </div>
                        </div>
                    </CustomModal>
                )}

                {/* 2. العنوان الرئيسي */}
                <div className="text-center mb-6">
                    <h1 className="font-amiri text-3xl font-black text-amber-900 mb-2">رحلة النور ﷺ</h1>
                    <p className="text-gray-500 font-bold text-sm">تتبع خطى الحبيب من المولد إلى الرفيق الأعلى</p>
                </div>

                {/* 3. التبويبات الكبيرة (Tabs) */}
                <div className="flex bg-white p-2 rounded-2xl shadow-sm border border-gray-200 mb-6 sticky top-0 z-30">
                    <button onClick={() => setActiveTab('makkah')} className={`flex-1 py-3 rounded-xl font-black text-sm transition ${activeTab === 'makkah' ? 'bg-amber-500 text-white shadow-lg' : 'text-gray-500'}`}>
                        مكة المكرمة 🕋
                    </button>
                    <button onClick={() => setActiveTab('madinah')} className={`flex-1 py-3 rounded-xl font-black text-sm transition ${activeTab === 'madinah' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-500'}`}>
                        المدينة 🕌
                    </button>
                </div>

                {/* 4. قائمة الأحداث (تصميم البطاقات الكبير) */}
                <div className="space-y-6">
                    {displayEvents.map((ev, idx) => (
                        <div key={ev.id} onClick={() => setSelectedEvent(ev)} className="seerah-card cursor-pointer group hover:border-amber-400">
                            {/* شريط جانبي ملون */}
                            <div className={`absolute top-0 right-0 w-2 h-full ${ev.type === 'makkah' ? 'bg-amber-400' : 'bg-emerald-500'}`}></div>
                            
                            <div className="pr-4"> {/* مسافة للشريط */}
                                <div className="flex justify-between items-start">
                                    <span className={`seerah-date-badge ${ev.type === 'makkah' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                                        {ev.hijri}
                                    </span>
                                    {/* رقم تسلسلي */}
                                    <span className="text-gray-200 font-black text-4xl -mt-2">#{idx + 1}</span>
                                </div>
                                
                                <h3 className="seerah-title group-hover:text-amber-600 transition">{ev.title}</h3>
                                
                                <p className="seerah-text line-clamp-3">
                                    {ev.details}
                                </p>
                                
                                <div className="mt-4 flex items-center gap-1 text-amber-600 text-sm font-bold">
                                    <span>اقرأ المزيد</span>
                                    <span>⬅️</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {displayEvents.length === 0 && (
                        <div className="text-center py-10 bg-white rounded-2xl border border-dashed">
                            <p className="text-gray-400 font-bold">لا توجد أحداث في هذا القسم</p>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    window.ProphetSeerah = ProphetSeerah;
})();
