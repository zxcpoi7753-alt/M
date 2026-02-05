/* =========================================
   ملف التطبيق: js/app.js
   الوظيفة: تشغيل واجهة الزوار وربط الميزات
   ========================================= */

const { useState, useEffect } = React;

// استيراد المكونات من features.js
// تأكد أن هذه الأسماء مطابقة لما في ملف features.js
const CalcEffort = window.CalcEffort;
const CalcTime = window.CalcTime;
const TestHifz = window.TestHifz;
const QuranReader = window.QuranReader;
const AzkarApp = window.AzkarApp;

// البيانات الافتراضية
const initialConfig = {
    settings: { layoutScale: 1 },
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
    
    // التحكم بفتح القوائم (الأكورديون)
    const [activeFeature, setActiveFeature] = useState(null); 
    const [expandedSch, setExpandedSch] = useState(null);

    // حالة تحميل البيانات (JSON)
    const [dataReady, setDataReady] = useState(window.APP_DATA?.isReady || false);

    // --- التأثيرات (Effects) ---
    useEffect(() => {
        // 1. الاستماع لحدث جاهزية البيانات
        const handleDataReady = () => setDataReady(true);
        window.addEventListener('data-ready', handleDataReady);
        if (window.APP_DATA && window.APP_DATA.isReady) setDataReady(true);

        // 2. الاتصال بقاعدة بيانات Firebase (لجلب الأخبار والنصوص)
        if (window.db && window.onSnapshot && window.doc) {
            const unsub = window.onSnapshot(window.doc(window.db, "appData", "mainConfig"), (doc) => {
                if (doc.exists()) {
                    setConfig(prev => ({ ...prev, ...doc.data() }));
                    // تطبيق حجم الخط/الموقع
                    if(doc.data().settings?.layoutScale) {
                        document.documentElement.style.setProperty('--layout-scale', doc.data().settings.layoutScale);
                    }
                }
            });
            return () => unsub();
        }

        return () => window.removeEventListener('data-ready', handleDataReady);
    }, []);

    // دالة تبديل الأكورديون (فتح/إغلاق)
    const toggleFeature = (featureName) => {
        if (activeFeature === featureName) {
            setActiveFeature(null); // إغلاق إذا كان مفتوحاً
        } else {
            setActiveFeature(featureName); // فتح الجديد
        }
    };

    // إرسال الإجابة واتساب
    const sendWhatsapp = () => {
        if(!studentName) {
            alert("يرجى تسجيل اسمك في صفحة 'بطاقتي' أولاً");
            setPage('card');
            return;
        }
        window.open(`https://wa.me/${config.texts.contact.phone}?text=الطالب: ${studentName} - إجابة السؤال الأسبوعي`, '_blank');
    };

    return (
        <div id="app-container">
            {/* --- الهيدر --- */}
            <header>
                <div className="flex items-center gap-2" onClick={() => setPage('home')}>
                    <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg cursor-pointer">ث</div>
                    <h1 className="text-xl font-black text-emerald-800">{config.texts.siteTitle}</h1>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => window.location.reload()} className="p-2 rounded-xl bg-gray-100 text-xs font-bold text-gray-600">🔄 تحديث</button>
                    {/* رابط صفحة الأدمن (يفتح في نافذة جديدة أو ينتقل إليها) */}
                    <a href="admin.html" className="p-2 rounded-xl text-gray-400 hover:text-emerald-600 transition text-xl">🔒</a>
                </div>
            </header>

            {/* --- شريط التنقل --- */}
            <nav>
                {['home','student_corner','teachers','students','schedules','about','card'].map(t => (
                    <button key={t} onClick={() => setPage(t)} className={page === t ? 'active' : ''}>
                        {{home:'الرئيسية', student_corner:'ركن الطالب', teachers:'المعلمون', students:'الأوائل', schedules:'الجداول', about:'من نحن', card:'بطاقتي'}[t]}
                    </button>
                ))}
            </nav>

            {/* --- المحتوى الرئيسي --- */}
            <main className="p-4 animate-in pb-20">
                
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
                            <p className="mb-4 text-gray-700 font-bold leading-relaxed">{config.texts.weeklyQuestion}</p>
                            <button onClick={sendWhatsapp} className="w-full bg-[#25D366] text-white py-3 rounded-xl font-bold flex justify-center items-center gap-2 shadow-md hover:bg-green-600 transition">
                                💬 إرسال الإجابة واتساب
                            </button>
                        </div>

                        <section>
                            <h2 className="text-xl font-black text-slate-800 border-b-4 border-amber-400 pb-1 mb-4 inline-block">آخر الأخبار</h2>
                            <div className="flex flex-col gap-4">
                                {config.news.filter(n => !n.hidden).map(n => (
                                    <div key={n.id} className="news-card">
                                        <div className="flex justify-end text-[10px] font-bold text-gray-400 mb-2">{n.date}</div>
                                        <h3 className="text-xl font-black mb-2" style={{ color: n.colors?.title }}>{n.title}</h3>
                                        <p className="text-sm leading-loose mb-3 text-gray-600" style={{ color: n.colors?.content }}>{n.content}</p>
                                        {n.link?.url && (
                                            <a href={n.link.url} target="_blank" className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition" style={{ color: n.colors?.link }}>
                                                🔗 {n.link.text || 'التفاصيل'}
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                )}

                {/* 2. ركن الطالب (التحديث الكبير) */}
                {page === 'student_corner' && (
                    <div className="space-y-4 max-w-lg mx-auto">
                        <h2 className="text-center font-black text-2xl text-emerald-900 mb-6">🎓 ركن الطالب المتميز</h2>
                        
                        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-center mb-4 shadow-sm">
                            <p className="text-amber-900 font-bold leading-relaxed text-sm">{config.texts.studentMsg}</p>
                            <div className="text-emerald-600 font-black mt-2 text-xs">{config.texts.aboutAyah}</div>
                        </div>

                        {/* زر 1: خطة ختمي (بجهدي) */}
                        <div onClick={() => toggleFeature('effort')} className={`student-btn ${activeFeature === 'effort' ? 'active' : ''}`}>
                            <span>📅 خطة ختمي (بجهدي)</span><span>{activeFeature === 'effort' ? '➖' : '➕'}</span>
                        </div>
                        {activeFeature === 'effort' && <CalcEffort />}

                        {/* زر 2: دليل الختم (بوقتي) */}
                        <div onClick={() => toggleFeature('time')} className={`student-btn ${activeFeature === 'time' ? 'active' : ''}`}>
                            <span>🎯 دليل الختم (بوقتي)</span><span>{activeFeature === 'time' ? '➖' : '➕'}</span>
                        </div>
                        {activeFeature === 'time' && <CalcTime />}

                        {/* زر 3: اختبر حفظك */}
                        <div onClick={() => toggleFeature('test')} className={`student-btn ${activeFeature === 'test' ? 'active' : ''}`}>
                            <span>🧠 اختبر حفظك (الممتحن)</span><span>{activeFeature === 'test' ? '➖' : '➕'}</span>
                        </div>
                        {activeFeature === 'test' && (
                            dataReady ? <TestHifz /> : <div className="text-center p-4 bg-white rounded-xl border text-gray-400 text-sm">⏳ جاري تحميل بنك الأسئلة...</div>
                        )}

                        {/* زر 4: المصحف الشريف */}
                        <div onClick={() => toggleFeature('quran')} className={`student-btn ${activeFeature === 'quran' ? 'active' : ''}`}>
                            <span>📖 المصحف الشريف (القارئ)</span><span>{activeFeature === 'quran' ? '➖' : '➕'}</span>
                        </div>
                        {activeFeature === 'quran' && (
                            dataReady ? <QuranReader /> : <div className="text-center p-4 bg-white rounded-xl border text-gray-400 text-sm">⏳ جاري تحميل المصحف...</div>
                        )}

                        {/* زر 5: الأذكار والسبحة */}
                        <div onClick={() => toggleFeature('azkar')} className={`student-btn ${activeFeature === 'azkar' ? 'active' : ''}`}>
                            <span>📿 الأذكار والسبحة</span><span>{activeFeature === 'azkar' ? '➖' : '➕'}</span>
                        </div>
                        {activeFeature === 'azkar' && (
                            dataReady ? <AzkarApp /> : <div className="text-center p-4 bg-white rounded-xl border text-gray-400 text-sm">⏳ جاري تحميل الأذكار...</div>
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
                            <a href={`tel:${config.texts.contact.phone}`} className="bg-green-50 text-green-600 border border-green-200 p-4 rounded-2xl flex flex-col items-center shadow-sm font-bold">
                                <span className="text-3xl mb-2">📞</span><span>اتصل بنا</span>
                            </a>
                            <a href={config.texts.contact.location} target="_blank" className="bg-blue-50 text-blue-600 border border-blue-200 p-4 rounded-2xl flex flex-col items-center shadow-sm font-bold">
                                <span className="text-3xl mb-2">📍</span><span>موقعنا</span>
                            </a>
                        </div>
                        <div className="flex justify-center gap-6 mt-4">
                            {config.texts.contact.youtube && <a href={config.texts.contact.youtube} className="text-red-600 text-4xl hover:scale-110 transition">▶️</a>}
                            {config.texts.contact.facebook && <a href={config.texts.contact.facebook} className="text-blue-600 text-4xl hover:scale-110 transition">f</a>}
                            {config.texts.contact.instagram && <a href={config.texts.contact.instagram} className="text-pink-600 text-4xl hover:scale-110 transition">📸</a>}
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

            <footer className="p-4 text-center bg-white border-t text-[10px] text-gray-400 font-bold uppercase tracking-widest fixed bottom-0 w-full z-30 shadow-inner">
                &copy; 2026 {config.texts.siteTitle} | الإصدار الشامل
            </footer>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

// تفعيل Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').catch(e => console.log(e));
    });
}
