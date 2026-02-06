/* =========================================
   المكون: الورد اليومي (Daily Wird)
   المسار: js/components/extras/DailyWird.js
   ========================================= */
const { useState, useEffect } = React;

const DailyWird = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [wirdData, setWirdData] = useState(null); // السورة أو الصفحة المعروضة
    const [loading, setLoading] = useState(false);
    const [filterMode, setFilterMode] = useState('random'); // random, juz, surah
    const [selectedFilter, setSelectedFilter] = useState(null);

    // دالة توليد الورد
    const generateWird = () => {
        if (!window.quranData) return alert("جاري تحميل المصحف، انتظر قليلاً...");
        
        setLoading(true);
        let targetSurah;

        // 1. اختيار عشوائي كامل
        if (filterMode === 'random') {
            targetSurah = window.quranData[Math.floor(Math.random() * window.quranData.length)];
        } 
        // 2. اختيار سورة محددة
        else if (filterMode === 'surah' && selectedFilter) {
            targetSurah = window.quranData.find(s => s.number === parseInt(selectedFilter));
        }
        // 3. اختيار جزء (منطق تقريبي للجزء)
        else if (filterMode === 'juz' && selectedFilter) {
            // سنختار سورة عشوائية تقع ضمن هذا الجزء تقريباً
            // (للتبسيط: سنوزع السور على 30 جزء بشكل تقريبي)
            const start = Math.max(1, (selectedFilter - 1) * 3.8); // معادلة تقريبية
            const end = start + 4;
            const surahsInJuz = window.quranData.filter(s => s.number >= start && s.number <= end);
            targetSurah = surahsInJuz[Math.floor(Math.random() * surahsInJuz.length)];
        }

        // إذا لم نجد سورة (احتياط)
        if (!targetSurah) targetSurah = window.quranData[0];

        // عرض السورة
        setWirdData(targetSurah);
        setLoading(false);
    };

    // دالة إتمام الورد (الربط مع العداد العالمي)
    const markAsRead = async () => {
        if (!window.db) return;
        
        // تأثير بصري
        if(window.showGlobalAlert) window.showGlobalAlert('تقبل الله 🤲', `تم إضافة سورة ${wirdData.name} للعداد العالمي!`);
        
        try {
            // زيادة العداد في قاعدة البيانات
            await window.updateDoc(window.doc(window.db, "appData", "globalStats"), {
                pagesRead: window.increment(1) // نحسب السورة كـ "وحدة قراءة" أو صفحة
            });
            
            // إغلاق الورد أو توليد جديد
            setWirdData(null); 
        } catch (e) {
            console.error("Error updating global counter", e);
            alert("تأكد من الاتصال بالإنترنت");
        }
    };

    return (
        <div className="bg-white rounded-[2rem] border border-gray-200 shadow-sm overflow-hidden mb-6 animate-in">
            {/* رأس القائمة */}
            <div onClick={() => setIsOpen(!isOpen)} className="p-5 flex justify-between items-center cursor-pointer bg-gradient-to-r from-amber-50 to-white hover:bg-amber-100 transition">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">📿</span>
                    <div>
                        <h3 className="font-black text-amber-900">الورد اليومي العشوائي</h3>
                        <p className="text-[10px] text-gray-500 font-bold">افتح مصحفك عشوائياً واقرأ</p>
                    </div>
                </div>
                <div className={`transform transition duration-300 ${isOpen ? 'rotate-180' : ''}`}>▼</div>
            </div>

            {isOpen && (
                <div className="p-5 bg-gray-50 border-t">
                    
                    {/* 1. أدوات التحكم والفلاتر */}
                    {!wirdData && (
                        <div className="space-y-4">
                            <div className="flex gap-2 text-xs font-bold justify-center">
                                <button onClick={() => setFilterMode('random')} className={`px-4 py-2 rounded-xl transition ${filterMode==='random' ? 'bg-amber-500 text-white' : 'bg-white text-gray-500 border'}`}>عشوائي</button>
                                <button onClick={() => setFilterMode('surah')} className={`px-4 py-2 rounded-xl transition ${filterMode==='surah' ? 'bg-amber-500 text-white' : 'bg-white text-gray-500 border'}`}>سورة معينة</button>
                                <button onClick={() => setFilterMode('juz')} className={`px-4 py-2 rounded-xl transition ${filterMode==='juz' ? 'bg-amber-500 text-white' : 'bg-white text-gray-500 border'}`}>جزء معين</button>
                            </div>

                            {/* القوائم المنسدلة حسب الفلتر */}
                            {filterMode === 'surah' && window.quranData && (
                                <select onChange={(e) => setSelectedFilter(e.target.value)} className="w-full p-3 rounded-xl border text-center font-bold text-sm">
                                    <option value="">-- اختر السورة --</option>
                                    {window.quranData.map(s => <option key={s.number} value={s.number}>{s.name}</option>)}
                                </select>
                            )}

                            {filterMode === 'juz' && (
                                <select onChange={(e) => setSelectedFilter(e.target.value)} className="w-full p-3 rounded-xl border text-center font-bold text-sm">
                                    <option value="">-- اختر الجزء --</option>
                                    {Array.from({length:30}, (_, i) => i+1).map(j => <option key={j} value={j}>الجزء {j}</option>)}
                                </select>
                            )}

                            <button onClick={generateWird} className="w-full bg-amber-600 text-white py-4 rounded-xl font-black shadow-lg hover:bg-amber-700 transition flex justify-center items-center gap-2">
                                {loading ? 'جاري الفتح...' : '📖 فتح صفحة من المصحف'}
                            </button>
                        </div>
                    )}

                    {/* 2. عرض الورد (الصفحة) */}
                    {wirdData && (
                        <div className="animate-in">
                            <div className="bg-white p-6 rounded-2xl border-2 border-amber-100 text-center relative">
                                <span className="absolute top-4 right-4 text-[10px] bg-amber-100 text-amber-800 px-2 py-1 rounded font-bold">سورة {wirdData.name}</span>
                                
                                {/* عرض أول 5 آيات كعينة للورد أو السورة كاملة إذا كانت قصيرة */}
                                <div className="font-amiri text-xl leading-[2.5] text-gray-800 mt-6 mb-6">
                                    {wirdData.ayahs.slice(0, 7).map(a => a.text).join(' ۝ ')} 
                                    {wirdData.ayahs.length > 7 && ' ... ۝'}
                                </div>

                                <div className="flex gap-2">
                                    <button onClick={generateWird} className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold text-xs hover:bg-gray-200">🔄 تغيير الصفحة</button>
                                    <button onClick={markAsRead} className="flex-[2] bg-emerald-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-emerald-700">✅ تم القراءة (إضافة للعداد)</button>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            )}
        </div>
    );
};

// تصدير المكون
window.DailyWird = DailyWird;
