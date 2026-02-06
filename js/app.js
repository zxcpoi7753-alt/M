/* =========================================
   ملف التطبيق: js/app.js
   الوظيفة: تشغيل واجهة الزوار (مع إصلاح المربعات)
   ========================================= */

const { useState, useEffect } = React;

// استيراد المكونات
const CalcEffort = window.CalcEffort;
const CalcTime = window.CalcTime;
const TestHifz = window.TestHifz;
const QuranReader = window.QuranReader;
const AzkarApp = window.AzkarApp;

const App = () => {
    const [config, setConfig] = useState({
        settings: { layoutScale: 1 },
        texts: {
            siteTitle: 'حلقات الثريا',
            heroTitle: 'أهلاً بكم',
            contact: { phone: '', location: '', youtube: '', facebook: '', instagram: '' },
            studentMsg: '', weeklyQuestion: '', aboutMain: '', aboutAyah: '', aboutFooter: ''
        },
        news: [], teachers: [], halaqat: [], schedules: []
    });
    
    const [page, setPage] = useState('home');
    const [studentName, setStudentName] = useState(localStorage.getItem('st_name') || '');
    const [halaqaName, setHalaqaName] = useState(localStorage.getItem('st_halaqa') || '');
    const [activeFeature, setActiveFeature] = useState(null);
    const [expandedSch, setExpandedSch] = useState(null);
    const [dataReady, setDataReady] = useState(false);

    useEffect(() => {
        window.addEventListener('data-ready', () => setDataReady(true));
        if (window.APP_DATA && window.APP_DATA.isReady) setDataReady(true);

        if (window.db && window.onSnapshot && window.doc) {
            const unsub = window.onSnapshot(window.doc(window.db, "appData", "mainConfig"), (doc) => {
                if (doc.exists()) {
                    setConfig(prev => ({...prev, ...doc.data()}));
                    if(doc.data().settings?.layoutScale) document.documentElement.style.setProperty('--layout-scale', doc.data().settings.layoutScale);
                }
            });
            return () => unsub();
        }
    }, []);

    const toggleFeature = (name) => setActiveFeature(activeFeature === name ? null : name);

    return (
        <div id="app-container">
            <header>
                <div className="flex items-center gap-2" onClick={() => setPage('home')}>
                    <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg">ث</div>
                    <h1 className="text-xl font-black text-emerald-800">{config.texts.siteTitle}</h1>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => window.location.reload()} className="p-2 rounded-xl bg-gray-100 text-xs font-bold text-gray-600">🔄</button>
                    <a href="admin.html" className="p-2 rounded-xl text-gray-400 hover:text-emerald-600 text-xl">🔒</a>
                </div>
            </header>

            <nav>
                {['home','student_corner','teachers','students','schedules','about','card'].map(t => (
                    <button key={t} onClick={() => setPage(t)} className={page === t ? 'active' : ''}>
                        {{home:'الرئيسية', student_corner:'ركن الطالب', teachers:'المعلمون', students:'الأوائل', schedules:'الجداول', about:'من نحن', card:'بطاقتي'}[t]}
                    </button>
                ))}
            </nav>

            <main className="p-4 pb-24 animate-in">
                
                {/* 1. الرئيسية */}
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
                            <button onClick={()=>{if(!studentName) {alert('سجل اسمك في بطاقتي'); setPage('card')} else window.open(`https://wa.me/${config.texts.contact.phone}?text=الطالب: ${studentName} - الإجابة: `, '_blank')}} className="w-full bg-[#25D366] text-white py-3 rounded-xl font-bold flex justify-center items-center gap-2 shadow-md">
                                💬 إرسال الإجابة واتساب
                            </button>
                        </div>

                        <section>
                            <h2 className="text-xl font-black text-slate-800 border-b-4 border-amber-400 pb-1 mb-4 inline-block">آخر الأخبار</h2>
                            <div className="flex flex-col gap-4">
                                {config.news.filter(n => !n.hidden).map(n => (
                                    <div key={n.id} className="news-card">
                                        <div className="flex justify-end text-[10px] font-bold text-gray-400 mb-2">{n.date}</div>
                                        <h3 className="text-xl font-black mb-2">{n.title}</h3>
                                        <p className="text-sm leading-loose mb-3 text-gray-600">{n.content}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                )}

                {/* 2. ركن الطالب */}
                {page === 'student_corner' && (
                    <div className="space-y-4 max-w-lg mx-auto">
                        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-center mb-4 shadow-sm">
                            <p className="text-amber-900 font-bold leading-relaxed text-sm">{config.texts.studentMsg}</p>
                        </div>
                        
                        <div onClick={() => toggleFeature('effort')} className={`student-btn ${activeFeature === 'effort' ? 'active' : ''}`}><span>📅 خطة ختمي (بجهدي)</span><span>{activeFeature === 'effort' ? '➖' : '➕'}</span></div>
                        {activeFeature === 'effort' && <CalcEffort />}

                        <div onClick={() => toggleFeature('time')} className={`student-btn ${activeFeature === 'time' ? 'active' : ''}`}><span>🎯 دليل الختم (بوقتي)</span><span>{activeFeature === 'time' ? '➖' : '➕'}</span></div>
                        {activeFeature === 'time' && <CalcTime />}

                        <div onClick={() => toggleFeature('test')} className={`student-btn ${activeFeature === 'test' ? 'active' : ''}`}><span>🧠 اختبر حفظك</span><span>{activeFeature === 'test' ? '➖' : '➕'}</span></div>
                        {activeFeature === 'test' && (dataReady ? <TestHifz /> : <div className="text-center p-4 text-gray-400">جاري التحميل...</div>)}

                        <div onClick={() => toggleFeature('quran')} className={`student-btn ${activeFeature === 'quran' ? 'active' : ''}`}><span>📖 المصحف الشريف</span><span>{activeFeature === 'quran' ? '➖' : '➕'}</span></div>
                        {activeFeature === 'quran' && (dataReady ? <QuranReader /> : <div className="text-center p-4 text-gray-400">جاري التحميل...</div>)}

                        <div onClick={() => toggleFeature('azkar')} className={`student-btn ${activeFeature === 'azkar' ? 'active' : ''}`}><span>📿 الأذكار</span><span>{activeFeature === 'azkar' ? '➖' : '➕'}</span></div>
                        {activeFeature === 'azkar' && (dataReady ? <AzkarApp /> : <div className="text-center p-4 text-gray-400">جاري التحميل...</div>)}
                    </div>
                )}

                {/* 3. الجداول */}
                {page === 'schedules' && (
                    <div className="space-y-6">
                        {config.schedules.filter(s => !s.hidden).map(sch => (
                            <div key={sch.id}>
                                <div onClick={() => setExpandedSch(expandedSch === sch.id ? null : sch.id)} className={`halqa-accordion ${expandedSch === sch.id ? 'active' : ''}`}>
                                    <span>{sch.name} ({sch.period})</span><span>{expandedSch === sch.id ? '−' : '+'}</span>
                                </div>
                                {expandedSch === sch.id && (
                                    <div className="bg-white rounded-xl shadow-md overflow-hidden border mb-4 animate-in">
                                        <table className="schedule-table">
                                            <thead><tr><th>اليوم</th><th>الوقت</th><th>ملاحظة</th></tr></thead>
                                            <tbody>{sch.days.map((d, i) => <tr key={i}><td>{d.day}</td><td className="text-emerald-700 font-bold">{d.time}</td><td className="text-gray-500 text-xs">{d.note}</td></tr>)}</tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* 4. المعلمون */}
                {page === 'teachers' && (
                    <div className="grid gap-4">
                        {config.teachers.filter(t => !t.hidden).map(t => (
                            <div key={t.id} className="bg-white p-6 rounded-3xl border flex items-center gap-4 shadow-sm">
                                <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-black text-2xl">{t.avatar}</div>
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
                                <div className="bg-emerald-50 p-4 text-center font-black text-emerald-800 border-b border-emerald-100">{h.name}</div>
                                <div className="p-4 space-y-2">
                                    {h.students.map((st, idx) => (
                                        <div key={st.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border">
                                            <span className="font-bold text-sm">{idx+1}. {st.name}</span>
                                            <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-black">{st.rank}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* 6. من نحن (تم إصلاح التصميم هنا) */}
                {page === 'about' && (
                    <div className="space-y-6 max-w-xl mx-auto text-center">
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-lg space-y-6 border border-emerald-50">
                            <h2 className="text-2xl font-black text-emerald-800">{config.texts.siteTitle}</h2>
                            <p className="text-gray-600 font-bold leading-loose whitespace-pre-line">{config.texts.aboutMain}</p>
                            <div className="font-black text-xl italic" style={{ color: config.texts.aboutAyahColor }}>{config.texts.aboutAyah}</div>
                            <p className="text-gray-500 font-bold text-sm border-t pt-4">{config.texts.aboutFooter}</p>
                        </div>
                        
                        {/* مربعات التواصل الاجتماعي المحسنة */}
                        <div className="grid grid-cols-2 gap-3">
                            <a href={`tel:${config.texts.contact.phone}`} className="flex flex-col items-center justify-center p-4 bg-green-50 border-2 border-green-200 rounded-2xl shadow-sm text-green-700 font-bold hover:bg-green-100 transition">
                                <span className="text-2xl mb-1">📞</span> واتساب
                            </a>
                            <a href={config.texts.contact.location} target="_blank" className="flex flex-col items-center justify-center p-4 bg-blue-50 border-2 border-blue-200 rounded-2xl shadow-sm text-blue-700 font-bold hover:bg-blue-100 transition">
                                <span className="text-2xl mb-1">📍</span> الموقع
                            </a>
                        </div>

                        <div className="grid grid-cols-3 gap-3 mt-2">
                            {config.texts.contact.youtube && (
                                <a href={config.texts.contact.youtube} className="flex flex-col items-center justify-center p-3 border-2 border-red-100 rounded-2xl bg-white shadow-sm hover:border-red-500 transition">
                                    <span className="text-red-600 text-3xl">▶️</span>
                                    <span className="text-[10px] font-bold mt-1 text-gray-500">يوتيوب</span>
                                </a>
                            )}
                            {config.texts.contact.facebook && (
                                <a href={config.texts.contact.facebook} className="flex flex-col items-center justify-center p-3 border-2 border-blue-100 rounded-2xl bg-white shadow-sm hover:border-blue-600 transition">
                                    <span className="text-blue-600 text-3xl font-black">f</span>
                                    <span className="text-[10px] font-bold mt-1 text-gray-500">فيسبوك</span>
                                </a>
                            )}
                            {config.texts.contact.instagram && (
                                <a href={config.texts.contact.instagram} className="flex flex-col items-center justify-center p-3 border-2 border-pink-100 rounded-2xl bg-white shadow-sm hover:border-pink-500 transition">
                                    <span className="text-pink-600 text-3xl">📸</span>
                                    <span className="text-[10px] font-bold mt-1 text-gray-500">انستقرام</span>
                                </a>
                            )}
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

            <footer className="p-4 text-center bg-white border-t text-[10px] text-gray-400 font-bold fixed bottom-0 w-full z-30">
                &copy; 2026 {config.texts.siteTitle}
            </footer>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
