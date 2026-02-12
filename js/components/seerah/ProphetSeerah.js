/* =========================================
   المكون: السيرة النبوية (نظام الفصول + نافذة قراءة احترافية)
   المسار: js/components/seerah/ProphetSeerah.js
   ========================================= */
(function() {
    const { useState, useEffect, useMemo } = React;
    const CustomModal = window.CustomModal;

    // تعريف الفصول
    const CHAPTERS = [
        { id: 1, title: "النشأة والنبوة", icon: "👶", desc: "من المولد حتى نزول الوحي", color: "bg-amber-100 text-amber-800 border-amber-200" },
        { id: 2, title: "الجهر بالدعوة", icon: "📣", desc: "سنوات الصبر في مكة", color: "bg-orange-100 text-orange-800 border-orange-200" },
        { id: 3, title: "الهجرة والتأسيس", icon: "🐫", desc: "الطريق إلى المدينة وبناء الدولة", color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
        { id: 4, title: "الغزوات الكبرى", icon: "⚔️", desc: "بدر، أحد، الخندق..", color: "bg-red-100 text-red-800 border-red-200" },
        { id: 5, title: "الفتوحات والوفود", icon: "🏳️", desc: "صلح الحديبية وفتح مكة", color: "bg-blue-100 text-blue-800 border-blue-200" },
        { id: 6, title: "الوداع والرحيل", icon: "👋", desc: "حجة الوداع والرفيق الأعلى", color: "bg-purple-100 text-purple-800 border-purple-200" }
    ];

    const ProphetSeerah = () => {
        const [events, setEvents] = useState([]);
        const [loading, setLoading] = useState(true);
        const [activeChapter, setActiveChapter] = useState(null);
        const [selectedEvent, setSelectedEvent] = useState(null);

        // --- معالج CSV ---
        const parseLine = (text) => {
            const result = [];
            let cell = '';
            let inQuotes = false;
            for (let i = 0; i < text.length; i++) {
                const char = text[i];
                if (char === '"') inQuotes = !inQuotes;
                else if (char === ',' && !inQuotes) { result.push(cell.trim()); cell = ''; }
                else cell += char;
            }
            result.push(cell.trim());
            return result;
        };

        const assignChapter = (year) => {
            if (year <= -13) return 1;
            if (year > -13 && year < 1) return 2;
            if (year === 1) return 3;
            if (year >= 2 && year <= 5) return 4;
            if (year >= 6 && year <= 9) return 5;
            if (year >= 10) return 6;
            return 1;
        };

        const processData = (text) => {
            const lines = text.split('\n');
            const result = [];
            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;
                const cols = parseLine(line);
                if (cols.length < 2) continue;

                const title = cols[1].replace(/["]/g, '');
                if (!/[\u0600-\u06FF]/.test(title)) continue;

                const hijriStr = cols[2].replace(/["]/g, '');
                let year = 0;
                if (hijriStr.includes('ق') || hijriStr.includes('-')) {
                    year = -parseInt(hijriStr.replace(/\D/g, '') || 0);
                } else {
                    year = parseInt(hijriStr.replace(/\D/g, '') || 0);
                }

                result.push({
                    id: i,
                    title: title,
                    hijri: hijriStr,
                    year: year,
                    details: cols[5] ? cols[5].replace(/["]/g, '') : '...',
                    chapterId: assignChapter(year)
                });
            }
            return result.sort((a, b) => a.year - b.year);
        };

        useEffect(() => {
            fetch('data/seerah/prophet.json')
                .then(res => res.text())
                .then(text => {
                    setEvents(processData(text));
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        }, []);

        const chapterEvents = useMemo(() => {
            if (!activeChapter) return [];
            return events.filter(e => e.chapterId === activeChapter.id);
        }, [activeChapter, events]);

        if (loading) return <div className="p-10 text-center animate-pulse text-gray-400 font-bold">📖 جاري تجهيز الفصول...</div>;

        return (
            <div className="animate-in pb-20">
                
                {/* 🔥 نافذة قراءة الحدث (المحسنة للجوال) */}
                {CustomModal && selectedEvent && (
                    <CustomModal isOpen={!!selectedEvent} onClose={() => setSelectedEvent(null)} title="تفاصيل الحدث">
                        {/* حاوية مرنة لتقسيم الشاشة */}
                        <div className="flex flex-col max-h-[70vh]">
                            
                            {/* 1. رأس ثابت (العنوان والتاريخ) */}
                            <div className="shrink-0 border-b border-gray-100 pb-4 mb-2 text-right">
                                <h2 className="font-amiri text-2xl font-black text-emerald-800 leading-tight mb-2">
                                    {selectedEvent.title}
                                </h2>
                                <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg text-xs font-bold border border-emerald-100">
                                    <span>📅</span>
                                    <span>{selectedEvent.hijri}</span>
                                </div>
                            </div>

                            {/* 2. منطقة القراءة (قابلة للتمرير وحدها) */}
                            <div className="grow overflow-y-auto pl-2 custom-scrollbar">
                                <div className="text-lg leading-loose text-gray-700 font-medium text-justify font-amiri py-2">
                                    {selectedEvent.details}
                                </div>
                            </div>

                            {/* 3. ذيل النافذة (زر إغلاق واضح) */}
                            <div className="shrink-0 pt-4 border-t border-gray-100 mt-2">
                                <button 
                                    onClick={() => setSelectedEvent(null)}
                                    className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold shadow-md active:scale-95 transition"
                                >
                                    إغلاق القراءة ✅
                                </button>
                            </div>
                        </div>
                    </CustomModal>
                )}

                {/* --- الواجهة الرئيسية --- */}
                {!activeChapter ? (
                    <>
                        <div className="text-center mb-6 pt-2">
                            <h1 className="font-amiri text-3xl font-black text-emerald-900">رحلة الخلود ﷺ</h1>
                            <p className="text-gray-400 font-bold text-xs mt-1">اختر مرحلة لاستعراض أحداثها</p>
                        </div>
                        <div className="chapters-grid">
                            {CHAPTERS.map(ch => (
                                <div key={ch.id} onClick={() => setActiveChapter(ch)} className="chapter-card group">
                                    <span className="chapter-icon group-hover:scale-110 transition-transform">{ch.icon}</span>
                                    <h3 className="chapter-title">{ch.title}</h3>
                                    <p className="chapter-desc">{ch.desc}</p>
                                    <div className={`mt-3 h-1 w-1/3 mx-auto rounded-full ${ch.color.split(' ')[0]}`}></div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="animate-slide-up">
                        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur shadow-sm p-3 rounded-b-2xl mb-4 border-b border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <button onClick={() => setActiveChapter(null)} className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-500 hover:bg-emerald-50 hover:text-emerald-600 transition">
                                    ➜
                                </button>
                                <div>
                                    <h2 className="font-bold text-sm text-gray-800">{activeChapter.title}</h2>
                                    <p className="text-[10px] text-gray-400">{chapterEvents.length} حدث</p>
                                </div>
                            </div>
                            <span className="text-2xl">{activeChapter.icon}</span>
                        </div>

                        <div className="space-y-4 px-2">
                            {chapterEvents.length > 0 ? (
                                chapterEvents.map((ev, idx) => (
                                    <div key={ev.id} onClick={() => setSelectedEvent(ev)} className="seerah-card relative cursor-pointer active:scale-95 transition hover:shadow-md">
                                        <div className="flex gap-4">
                                            <div className="flex flex-col items-center justify-center min-w-[60px] border-l border-gray-100 pl-4">
                                                <span className="text-2xl font-black text-gray-200">#{idx + 1}</span>
                                                <span className="text-[10px] font-bold bg-gray-50 px-2 py-1 rounded text-gray-500 mt-1">{ev.hijri}</span>
                                            </div>
                                            <div className="flex-1 py-1">
                                                <h3 className="font-amiri text-lg font-bold text-gray-800 mb-1 leading-snug">{ev.title}</h3>
                                                <p className="text-xs text-gray-500 line-clamp-2">{ev.details}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-20 text-gray-300 font-bold">لا توجد أحداث مسجلة في هذه الفترة</div>
                            )}
                        </div>
                        <button onClick={() => setActiveChapter(null)} className="w-full mt-8 py-4 bg-emerald-50 text-emerald-700 font-bold rounded-2xl border border-emerald-100">
                            عودة للفصول الرئيسية 📚
                        </button>
                    </div>
                )}
            </div>
        );
    };

    window.ProphetSeerah = ProphetSeerah;
})();
