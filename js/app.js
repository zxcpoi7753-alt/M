/* =========================================
   ملف التطبيق: js/app.js
   الوظيفة: تشغيل واجهة الزوار والطلاب (بدون أدمن)
   ========================================= */

const { useState, useEffect } = React;

// استيراد المكونات التي بنيناها في features.js
const TestHifz = window.TestHifz;
const QuranReader = window.QuranReader;
const AzkarApp = window.AzkarApp;

// البيانات الافتراضية (في حال عدم وجود إنترنت لأول مرة)
const initialConfig = {
    texts: {
        siteTitle: 'حلقات الثريا',
        heroTitle: 'أهلاً بكم في حلقات الثريا',
        heroSubtitle: 'بيئة تربوية جاذبة لتعليم القرآن الكريم',
        weeklyQuestion: 'من هو الصحابي الذي اهتز لموته عرش الرحمن؟',
        aboutMain: 'نحن حلقات الثريا لتحفيظ القرآن الكريم..',
        aboutAyah: '﴿ وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا ﴾',
        aboutAyahColor: '#059669',
        aboutFooter: 'ومن القرآن... نبدأ، وبه... نرتقي.',
        studentMsg: 'أخي الطالب: القرآن حياة للقلوب، فاجعل لك ورداً لا تتركه.',
        contact: { phone: '', location: '', youtube: '', facebook: '', instagram: '' }
    },
    news: [], teachers: [], halaqat: [], schedules: []
};

const App = () => {
    // --- الحالات (State) ---
    const [config, setConfig] = useState(initialConfig);
    const [page, setPage] = useState('home');
    const [studentName, setStudentName] = useState(localStorage.getItem('st_name') || '');
    const [halaqaName, setHalaqaName] = useState(localStorage.getItem('st_halaqa') || '');
    
    // تحكم الميزات (الأكورديون)
    const [activeFeature, setActiveFeature] = useState(null); // للتحكم بفتح وإغلاق أدوات الطالب
    const [expandedSch, setExpandedSch] = useState(null);     // للجداول
    
    // حاسبات الطالب (القديمة)
    const [calc1, setCalc1] = useState({ days: '', amount: '', completed: '', result: null });
    const [calc2, setCalc2] = useState({ y: '', m: '', d: '', result: null });
    const [quranToast, setQuranToast] = useState(false); // تنبيه الحد الأقصى

    // التأكد من جاهزية بيانات JSON
    const [dataReady, setDataReady] = useState(window.APP_DATA?.isReady || false);

    // --- الاستماع للأحداث ---
    useEffect(() => {
        // الاستماع لتحميل بيانات JSON
        window.addEventListener('data-ready', () => setDataReady(true));
        if (window.APP_DATA && window.APP_DATA.isReady) setDataReady(true);

        // جلب البيانات من Firebase
        if (window.db && window.onSnapshot && window.doc) {
            const unsub = window.onSnapshot(window.doc(window.db, "appData", "mainConfig"), (doc) => {
                if (doc.exists()) {
                    setConfig(doc.data());
                    // تحديث حجم الموقع
                    const scale = doc.data().settings?.layoutScale || 1;
                    document.documentElement.style.setProperty('--layout-scale', scale);
                }
            });
            return () => unsub();
        }
    }, []);

    // --- دوال الحاسبة (المنطق القديم مع القيود) ---
    const runCalc1 = () => {
        const d = parseFloat(calc1.days)||0, a = parseFloat(calc1.amount)||0, c = parseFloat(calc1.completed)||0;
        if (!d || !a) return;
        
        // القيود
        if (d > 7) return alert('⚠️ أيام الحفظ لا تتجاوز 7 أيام');
        if (c > 30) return alert('⚠️ الأجزاء لا تتجاوز 30 جزءاً');
        if (a > 1812) { 
            setQuranToast(true); 
            setTimeout(() => setQuranToast(false), 3000); 
            return; 
        }

        const rem = 604 - (c * 20);
        if (rem <= 0) return alert('مبارك! لقد أتممت الحفظ 🎉');
        
        const days = (rem / (d * a)) * 7;
        
        if (days < 1) {
            setCalc1(prev => ({ ...prev, result: { type: 'hours', val: Math.ceil(days * 24) } }));
        } else {
            setCalc1(prev => ({ ...prev, result: { type: 'date', y: Math.floor(days/365), m: Math.floor((days%365)/30), d: Math.floor((days%365)%30) } }));
        }
    };

    const runCalc2 = () => {
        const y = parseFloat(calc2.y)||0, m = parseFloat(calc2.m)||0, d = parseFloat(calc2.d)||0;
        const totalDays = (y * 365) + (m * 30) + d;
        if (totalDays > 0) {
            setCalc2(prev => ({ ...prev, result: (604 / totalDays).toFixed(1) }));
        } else {
            alert('الرجاء إدخال مدة صحيحة');
        }
    };

    const sendWhatsappAnswer = () => {
        if (!studentName) {
            alert('يرجى تسجيل اسمك في صفحة "بطاقتي" أولاً');
            setPage('card');
            return;
        }
        window.open(`https://wa.me/${config.texts.contact.phone}?text=الطالب: ${studentName} - إجابة السؤال`, '_blank');
    };

    return (
        <div id="app-container">
            {/* تنبيه الختمة السريعة */}
            {quranToast && (
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/90 text-white p-6 rounded-2xl z-50 text-center animate-in">
                    <h3 className="text-xl font-bold text-amber-400 mb-2">🛑 تنبيه</h3>
                    <p>الحد الأقصى اليومي هو 3 ختمات (1812 صفحة)</p>
                    <p className="text-sm text-gray-400 mt-2">﴿ وَلَا تَعْجَلْ بِالْقُرْآنِ ﴾</p>
                </div>
            )}

            {/* الهيدر */}
            <header>
                <div className="flex items-center gap-2" onClick={() => setPage('home')}>
                    <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg cursor-pointer">ث</div>
                    <h1 className="text-xl font-black text-emerald-800">{config.texts.siteTitle}</h1>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => window.location.reload()} className="p-2 rounded-xl bg-gray-100 text-xs font-bold text-gray-600">🔄 تحديث</button>
                    {/* زر الذهاب للأدمن (يفتح صفحة منفصلة) */}
                    <a href="admin.html" className="p-2 rounded-xl text-gray-300 hover:text-emerald-600 transition text-xl">🔒</a>
                </div>
            </header>

            {/* القائمة العلوية */}
            <nav>
                {['home','student_corner','teachers','students','schedules','about','card'].map(t => (
                    <button key={t} onClick={() => setPage(t)} className={page === t ? 'active' : ''}>
                        {{home:'الرئيسية', student_corner:'ركن الطالب', teachers:'المعلمون', students:'الأوائل', schedules:'الجداول', about:'من نحن', card:'بطاقتي'}[t]}
                    </button>
                ))}
            </nav>

            <main className="p-4 animate-in">
                {/* 1. الصفحة الرئيسية */}
                {page === 'home' && (
                    <div className="space-y-6">
                        <section className="relative rounded-[2.5rem] overflow-hidden bg-emerald-700 text-white p-8 text-center shadow-xl">
                            <div className="islamic-pattern"></div>
                            <h2 className="relative z-10 text-2xl font-black mb-3">{config.texts.heroTitle}</h2>
                            <p className="relative z-10 text-sm opacity-90">{config.texts.heroSubtitle}</p>
                            {studentName && <div className="relative z-10 mt-4 bg-white/20 px-4 py-2 rounded-full text-xs font-bold inline-block">مرحباً بك يا {studentName} 🌹</div>}
                        </section>

                        <div className="bg-white p-6 rounded-3xl border-r-[8px] border-amber-400 shadow-sm">
                            <h3 className="font-black text-lg mb-2 text-emerald-900">⭐ سؤال الأسبوع</h3>
                            <p className="mb-4 text-gray-700 font-bold">{config.texts.weeklyQuestion}</p>
                            <button onClick={sendWhatsappAnswer} className="w-full bg-[#25D366] text-white py-3 rounded-xl font-bold flex justify-center items-center gap-2 shadow-md hover:bg-green-600 transition">
                                💬 إرسال الإجابة واتساب
                            </button>
                        </div>

                        <section>
                            <h2 className="text-xl font-black text-slate-800 border-b-4 border-amber-400 pb-1 mb-4 inline-block">آخر الأخبار</h2>
                            <div className="flex flex-col gap-4">
                                {config.news.filter(n => !n.hidden).map(n => (
                                    <div key={n.id} className="news-card">
                                        <div className="flex justify-end text-[10px] font-bold text-gray-400 mb-2">{n.date}</div>
                                        <h3 className="text-xl font-black mb-2" style={{ color: n.colors?.title || '#1e293b' }}>{n.title}</h3>
                                        <p className="text-sm leading-loose mb-3 text-gray-600" style={{ color: n.colors?.content || '#64748b' }}>{n.content}</p>
                                        {n.link?.url && (
                                            <a href={n.link.url} target="_blank" className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition" style={{ color: n.colors?.link || '#2563eb' }}>
                                                🔗 {n.link.text || 'التفاصيل'}
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                )}

                {/* 2. ركن الطالب (المحدث) */}
                {page === 'student_corner' && (
                    <div className="space-y-4 max-w-lg mx-auto">
                        <h2 className="text-center font-black text-2xl text-emerald-900 mb-6">🎓 ركن الطالب المتميز</h2>
                        
                        {/* رسالة المشرف للطالب */}
                        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-center mb-4 shadow-sm">
                            <p className="text-amber-900 font-bold leading-relaxed text-sm">{config.texts.studentMsg}</p>
                            <div className="text-emerald-600 font-black mt-2 text-xs">{config.texts.aboutAyah}</div>
                        </div>

                        {/* --- الأزرار القديمة (الحاسبات) --- */}
                        <div onClick={() => setActiveFeature(activeFeature === 'calc' ? null : 'calc')} className={`student-btn ${activeFeature === 'calc' ? 'active' : ''}`}>
                            <span>📊 حاسبة الحفظ والختم</span><span>{activeFeature === 'calc' ? '➖' : '➕'}</span>
                        </div>
                        {activeFeature === 'calc' && (
                            <div className="feature-container">
                                {/* حاسبة 1: بجهدي */}
                                <div className="mb-6 pb-6 border-b border-gray-100">
                                    <h4 className="text-center font-bold text-emerald-800 mb-3 text-sm">📅 متى أختم (حسب جهدي)؟</h4>
                                    <div className="space-y-2">
                                        <input type="number" placeholder="كم يوماً تحفظ في الأسبوع؟ (ماكس 7)" className="w-full p-3 bg-gray-50 rounded-xl border text-sm font-bold" value={calc1.days} onChange={e => setCalc1({...calc1, days:e.target.value})} />
                                        <input type="number" placeholder="كم صفحة تحفظ في اليوم؟" className="w-full p-3 bg-gray-50 rounded-xl border text-sm font-bold" value={calc1.amount} onChange={e => setCalc1({...calc1, amount:e.target.value})} />
                                        <input type="number" placeholder="كم جزءاً حفظت سابقاً؟ (ماكس 30)" className="w-full p-3 bg-gray-50 rounded-xl border text-sm font-bold" value={calc1.completed} onChange={e => setCalc1({...calc1, completed:e.target.value})} />
                                        <button onClick={runCalc1} className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold shadow-md mt-2">احسب النتيجة</button>
                                        
                                        {calc1.result && (
                                            <div className="bg-emerald-50 p-3 rounded-xl text-center mt-2 border border-emerald-100 animate-in">
                                                {calc1.result.type === 'hours' ? 
                                                    <p className="font-bold text-emerald-800">تحتاج فقط <span className="text-xl">{calc1.result.val}</span> ساعة! ما شاء الله</p> : 
                                                    <p className="font-bold text-emerald-800">تختم خلال: <span className="text-emerald-600">{calc1.result.y} سنة</span> و <span className="text-emerald-600">{calc1.result.m} شهر</span> و <span className="text-emerald-600">{calc1.result.d} يوم</span></p>
                                                }
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* حاسبة 2: بوقتي */}
                                <div>
                                    <h4 className="text-center font-bold text-amber-800 mb-3 text-sm">🎯 كم أحفظ (حسب وقتي)؟</h4>
                                    <div className="flex gap-2 mb-3">
                                        <input type="number" placeholder="سنة" className="w-1/3 p-2 bg-gray-50 rounded-lg border text-center font-bold" onChange={e => setCalc2({...calc2, y:e.target.value})} />
                                        <input type="number" placeholder="شهر" className="w-1/3 p-2 bg-gray-50 rounded-lg border text-center font-bold" onChange={e => setCalc2({...calc2, m:e.target.value})} />
                                        <input type="number" placeholder="يوم" className="w-1/3 p-2 bg-gray-50 rounded-lg border text-center font-bold" onChange={e => setCalc2({...calc2, d:e.target.value})} />
                                    </div>
                                    <button onClick={runCalc2} className="w-full bg-amber-500 text-white py-3 rounded-xl font-bold shadow-md">احسب الورد اليومي</button>
                                    {calc2.result && (
                                        <div className="bg-amber-50 p-3 rounded-xl text-center mt-3 border border-amber-100 animate-in">
                                            <p className="font-bold text-amber-900">عليك قراءة <span className="text-2xl text-amber-600">{calc2.result}</span> صفحة يومياً</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* --- الأزرار الجديدة (الميزات) --- */}
                        
                        {/* 1. اختبار الحفظ */}
                        <div onClick={() => setActiveFeature(activeFeature === 'test' ? null : 'test')} className={`student-btn ${activeFeature === 'test' ? 'active' : ''}`}>
                            <span>🧠 اختبر حفظك (الممتحن الآلي)</span><span>{activeFeature === 'test' ? '➖' : '➕'}</span>
                        </div>
                        {activeFeature === 'test' && (
                            dataReady ? <TestHifz /> : <div className="text-center p-6 text-gray-400 font-bold bg-white rounded-xl border">⏳ جاري تجهيز بنك الأسئلة...</div>
                        )}

                        {/* 2. المصحف */}
                        <div onClick={() => setActiveFeature(activeFeature === 'quran' ? null : 'quran')} className={`student-btn ${activeFeature === 'quran' ? 'active' : ''}`}>
                            <span>📖 الختمة (المصحف الشريف)</span><span>{activeFeature === 'quran' ? '➖' : '➕'}</span>
                        </div>
                        {activeFeature === 'quran' && (
                            dataReady ? <QuranReader /> : <div className="text-center p-6 text-gray-400 font-bold bg-white rounded-xl border">⏳ جاري تحميل المصحف...</div>
                        )}

                        {/* 3. الأذكار */}
                        <div onClick={() => setActiveFeature(activeFeature === 'azkar' ? null : 'azkar')} className={`student-btn ${activeFeature === 'azkar' ? 'active' : ''}`}>
                            <span>📿 الأذكار والسبحة الذكية</span><span>{activeFeature === 'azkar' ? '➖' : '➕'}</span>
                        </div>
                        {activeFeature === 'azkar' && (
                            dataReady ? <AzkarApp /> : <div className="text-center p-6 text-gray-400 font-bold bg-white rounded-xl border">⏳ جاري تحميل الأذكار...</div>
                        )}

                    </div>
                )}

                {/* 3. الجداول الدراسية */}
                {page === 'schedules' && (
                    <div className="space-y-6">
                        <h2 className="text-center text-2xl font-black text-emerald-900 mb-6">📅 الجداول الدراسية</h2>
                        
                        {/* حلقات العصر */}
                        <div>
                            <h3 className="font-bold text-lg border-b-2 border-amber-400 pb-2 mb-4 w-fit text-amber-600">☀️ حلقات العصر</h3>
                            {config.schedules.filter(s => s.period === 'عصر' && !s.hidden).map(sch => (
                                <div key={sch.id}>
                                    <div onClick={() => setExpandedSch(expandedSch === sch.id ? null : sch.id)} className={`halqa-accordion ${expandedSch === sch.id ? 'active' : ''}`}>
                                        <span>حلقة {sch.name}</span>
                                        <span>{expandedSch === sch.id ? '−' : '+'}</span>
                                    </div>
                                    {expandedSch === sch.id && (
                                        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-emerald-50 mb-4 animate-in">
                                            <table className="schedule-table">
                                                <thead><tr><th>اليوم</th><th>الوقت</th><th>الملاحظة</th></tr></thead>
                                                <tbody>
                                                    {sch.days.map((d, i) => (
                                                        <tr key={i}><td>{d.day}</td><td className="text-emerald-700 font-bold">{d.time}</td><td className="text-gray-500 text-xs">{d.note}</td></tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* حلقات المغرب */}
                        <div>
                            <h3 className="font-bold text-lg border-b-2 border-indigo-400 pb-2 mb-4 w-fit text-indigo-600">🌙 حلقات المغرب</h3>
                            {config.schedules.filter(s => s.period === 'مغرب' && !s.hidden).map(sch => (
                                <div key={sch.id}>
                                    <div onClick={() => setExpandedSch(expandedSch === sch.id ? null : sch.id)} className={`halqa-accordion ${expandedSch === sch.id ? 'active' : ''}`}>
                                        <span>حلقة {sch.name}</span>
                                        <span>{expandedSch === sch.id ? '−' : '+'}</span>
                                    </div>
                                    {expandedSch === sch.id && (
                                        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-emerald-50 mb-4 animate-in">
                                            <table className="schedule-table">
                                                <thead><tr><th>اليوم</th><th>الوقت</th><th>الملاحظة</th></tr></thead>
                                                <tbody>
                                                    {sch.days.map((d, i) => (
                                                        <tr key={i}><td>{d.day}</td><td className="text-emerald-700 font-bold">{d.time}</td><td className="text-gray-500 text-xs">{d.note}</td></tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 4. المعلمون */}
                {page === 'teachers' && (
                    <div className="grid gap-4">
                        {config.teachers.filter(t => !t.hidden).map(t => (
                            <div key={t.id} className="bg-white p-6 rounded-3xl border flex items-center gap-4 shadow-sm">
                                <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-black text-2xl border-2 border-emerald-50">
                                    {t.avatar || t.name.charAt(0)}
                                </div>
                                <div><h3 className="font-black text-lg">{t.name}</h3><p className="text-gray-500 text-sm">{t.bio}</p></div>
                            </div>
                        ))}
                    </div>
                )}

                {/* 5. الأوائل */}
                {page === 'students' && (
                    <div className="space-y-6">
                        {config.halaqat.filter(h => !h.hidden).map(h => (
                            <div key={h.id} className="bg-white rounded-[2rem] shadow-md overflow-hidden border-t-8 border-emerald-500">
                                <div className="bg-emerald-50 p-4 text-center font-black text-emerald-800 border-b border-emerald-100">حلقة {h.name}</div>
                                <div className="p-4 space-y-2">
                                    {h.students.map((st, idx) => (
                                        <div key={st.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border hover:bg-white transition">
                                            <span className="font-bold text-sm">{idx+1}. {st.name}</span>
                                            <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-black shadow-sm">{st.rank}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* 6. من نحن */}
                {page === 'about' && (
                    <div className="space-y-6 max-w-xl mx-auto text-center">
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-lg space-y-6 border border-emerald-50">
                            <h2 className="text-2xl font-black text-emerald-800">{config.texts.siteTitle}</h2>
                            <p className="text-gray-600 font-bold leading-loose whitespace-pre-line">{config.texts.aboutMain}</p>
                            <div className="font-black text-xl italic" style={{ color: config.texts.aboutAyahColor }}>{config.texts.aboutAyah}</div>
                            <p className="text-gray-500 font-bold text-sm border-t pt-4">{config.texts.aboutFooter}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <a href={`tel:${config.texts.contact.phone}`} className="social-box bg-green-50 text-green-600 border border-green-200 p-4 rounded-2xl flex flex-col items-center shadow-sm">
                                <span className="text-3xl mb-2">📞</span><span>اتصل بنا</span>
                            </a>
                            <a href={config.texts.contact.location} target="_blank" className="social-box bg-blue-50 text-blue-600 border border-blue-200 p-4 rounded-2xl flex flex-col items-center shadow-sm">
                                <span className="text-3xl mb-2">📍</span><span>موقعنا</span>
                            </a>
                        </div>
                        <div className="flex justify-center gap-4 mt-4">
                            {config.texts.contact.youtube && <a href={config.texts.contact.youtube} className="text-red-600 text-3xl">▶️</a>}
                            {config.texts.contact.facebook && <a href={config.texts.contact.facebook} className="text-blue-600 text-3xl">facebook</a>}
                            {config.texts.contact.instagram && <a href={config.texts.contact.instagram} className="text-pink-600 text-3xl">📸</a>}
                        </div>
                    </div>
                )}

                {/* 7. بطاقتي */}
                {page === 'card' && (
                    <div className="max-w-md mx-auto space-y-6">
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl text-center border-4 border-emerald-50">
                            <h2 className="text-2xl font-black mb-6 text-gray-800">بيانات الطالب</h2>
                            <input value={studentName} onChange={e => {setStudentName(e.target.value); localStorage.setItem('st_name', e.target.value)}} className="w-full p-4 bg-gray-50 border rounded-2xl mb-3 text-center font-bold" placeholder="الاسم الثلاثي" />
                            <input value={halaqaName} onChange={e => {setHalaqaName(e.target.value); localStorage.setItem('st_halaqa', e.target.value)}} className="w-full p-4 bg-gray-50 border rounded-2xl mb-6 text-center font-bold" placeholder="اسم الحلقة" />
                            <button onClick={() => { setPage('home'); alert('تم حفظ البيانات بنجاح ✅'); }} className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black shadow-lg hover:bg-emerald-700 transition">حفظ وتفعيل</button>
                        </div>
                        {studentName && (
                            <div className="bg-gradient-to-br from-emerald-900 to-emerald-700 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden h-64 flex flex-col justify-center items-center text-center border-4 border-amber-400">
                                <h1 className="text-3xl font-black mb-2">{studentName}</h1>
                                <p className="text-emerald-200 font-bold text-lg">حلقة: {halaqaName}</p>
                                <div className="mt-4 bg-white/20 px-4 py-1 rounded-full text-xs">عضو متميز</div>
                            </div>
                        )}
                    </div>
                )}
            </main>

            <footer className="p-6 text-center bg-white border-t text-[10px] text-gray-400 font-bold uppercase tracking-widest fixed bottom-0 w-full z-30">
                &copy; 2026 {config.texts.siteTitle} | الإصدار الشامل V6
            </footer>
        </div>
    );
};

// تشغيل التطبيق
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

// تفعيل Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js');
    });
}
