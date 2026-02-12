/* =========================================
   المكون: السيرة النبوية (التصميم الاحترافي + المعالج الذكي)
   المسار: js/components/seerah/ProphetSeerah.js
   ========================================= */
(function() {
    const { useState, useEffect } = React;
    const CustomModal = window.CustomModal;

    const ProphetSeerah = () => {
        const [events, setEvents] = useState([]);
        const [loading, setLoading] = useState(true);
        const [selectedEvent, setSelectedEvent] = useState(null);
        const [activeTab, setActiveTab] = useState('makkah'); // makkah, madinah

        // --- المعالج الذكي (يفهم ملفك ويصلح التواريخ) ---
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
                    
                    // 1. فلتر اللغة: تجاهل أي عنوان لا يحتوي على حروف عربية
                    if (!/[\u0600-\u06FF]/.test(title)) continue;

                    // 2. معالجة السنة وتحديد النوع (مكي/مدني)
                    let year = 0;
                    let type = 'madinah'; // الافتراضي
                    
                    // كشف مكة (قبل الهجرة)
                    if (hijriStr.includes('ق') || hijriStr.includes('قبل') || hijriStr.includes('-')) {
                        type = 'makkah';
                        const num = parseInt(hijriStr.replace(/\D/g, '')) || 0;
                        year = -num; 
                    } else {
                        // المدينة (بعد الهجرة)
                        const num = parseInt(hijriStr.replace(/\D/g, '')) || 0;
                        year = num;
                        // تصحيح: إذا كان الرقم موجباً، نعتبره مدني
                        if (year > 0) type = 'madinah';
                    }

                    // 3. تحديد الموقع تلقائياً إذا كان فارغاً
                    let locationName = clean(matches[7]);
                    if (!locationName || locationName.length < 2) {
                        locationName = (type === 'makkah' ? 'مكة المكرمة' : 'المدينة المنورة');
                    }

                    result.push({
                        id: i,
                        title: title,
                        year: year,
                        hijri: hijriStr || 'غير محدد',
                        type: type,
                        details: details || '...',
                        location: locationName
                    });
                }
            }
            // الترتيب الزمني من الأقدم للأحدث
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
                .catch(e => {
                    console.error("Error loading Seerah:", e);
                    setLoading(false);
                });
        }, []);

        // فلترة العرض حسب التبويب
        const displayEvents = events.filter(ev => ev.type === activeTab);

        if (loading) return <div className="text-center py-20 font-bold text-gray-400 text-xl animate-pulse flex flex-col items-center gap-4"><span className="text-4xl">📜</span><span>جاري تجهيز كتاب السيرة...</span></div>;

        return (
            <div className="animate-in pb-20">
                {/* 1. نافذة التفاصيل (كبيرة وواضحة جداً) */}
                {CustomModal && selectedEvent && (
                    <CustomModal isOpen={!!selectedEvent} onClose={() => setSelectedEvent(null)} title="تـفـاصـيـل الـحـدث">
                        <div className="space-y-4 text-right">
                            <h2 className="font-amiri text-3xl font-black text-amber-800 leading-normal border-b pb-4">
                                {selectedEvent.title}
                            </h2>
                            <div className="flex gap-2 flex-wrap">
                                <span className={`px-4 py-2 rounded-xl font-bold text-sm shadow-sm ${selectedEvent.type==='makkah'?'bg-amber-100 text-amber-800':'bg-emerald-100 text-emerald-800'}`}>📅 {selectedEvent.hijri}</span>
                                <span className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl font-bold text-sm shadow-sm">📍 {selectedEvent.location}</span>
                            </div>
                            <div className="bg-amber-50/50 p-6 rounded-3xl border border-amber-100 text-xl leading-loose text-gray-800 font-semibold text-justify font-amiri">
                                {selectedEvent.details}
                            </div>
                        </div>
                    </CustomModal>
                )}

                {/* 2. العنوان الرئيسي */}
                <div className="text-center mb-6 pt-4">
                    <h1 className="font-amiri text-4xl font-black text-amber-900 mb-2 drop-shadow-sm">رحلة النور ﷺ</h1>
                    <p className="text-amber-700 font-bold text-sm bg-amber-50 inline-block px-4 py-1 rounded-full border border-amber-100">من المولد إلى الرفيق الأعلى</p>
                </div>

                {/* 3. التبويبات الكبيرة (Tabs) */}
                <div className="flex bg-white p-2 rounded-2xl shadow-sm border border-gray-200 mb-8 sticky top-0 z-30 mx-2">
                    <button onClick={() => setActiveTab('makkah')} className={`flex-1 py-4 rounded-xl font-black text-lg transition flex items-center justify-center gap-2 ${activeTab === 'makkah' ? 'bg-amber-500 text-white shadow-lg transform scale-105' : 'text-gray-400 hover:bg-gray-50'}`}>
                        <span>🕋</span> مكة
                    </button>
                    <button onClick={() => setActiveTab('madinah')} className={`flex-1 py-4 rounded-xl font-black text-lg transition flex items-center justify-center gap-2 ${activeTab === 'madinah' ? 'bg-emerald-600 text-white shadow-lg transform scale-105' : 'text-gray-400 hover:bg-gray-50'}`}>
                        <span>🕌</span> المدينة
                    </button>
                </div>

                {/* 4. قائمة الأحداث (تصميم البطاقات الكبير) */}
                <div className="space-y-6 px-2">
                    {displayEvents.map((ev, idx) => (
                        <div key={ev.id} onClick={() => setSelectedEvent(ev)} className="seerah-card cursor-pointer group hover:border-amber-400 relative overflow-hidden bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6 transition active:scale-95">
                            {/* شريط جانبي ملون */}
                            <div className={`absolute top-0 right-0 w-3 h-full ${ev.type === 'makkah' ? 'bg-amber-400' : 'bg-emerald-500'}`}></div>
                            
                            <div className="pr-4"> {/* مسافة للشريط */}
                                <div className="flex justify-between items-start mb-3">
                                    <span className={`px-3 py-1 rounded-full font-black text-xs ${ev.type === 'makkah' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                                        {ev.hijri}
                                    </span>
                                    <span className="text-gray-100 font-black text-5xl absolute left-4 top-2 select-none -z-0 opacity-50">{idx + 1}</span>
                                </div>
                                
                                <h3 className="font-amiri text-2xl font-black text-gray-800 mb-3 group-hover:text-amber-700 transition relative z-10">{ev.title}</h3>
                                
                                <p className="text-gray-500 font-semibold text-sm line-clamp-3 leading-relaxed relative z-10">
                                    {ev.details}
                                </p>
                                
                                <div className="mt-4 flex items-center gap-2 text-amber-600 font-bold text-sm relative z-10">
                                    <span>اضغط للقراءة</span>
                                    <span className="animate-bounce-x">⬅️</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {displayEvents.length === 0 && (
                        <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-gray-200 m-4">
                            <p className="text-gray-400 font-bold text-lg">لا توجد أحداث في هذا القسم</p>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    window.ProphetSeerah = ProphetSeerah;
})();
