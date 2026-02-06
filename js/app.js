/* =========================================
   ملف التطبيق: js/app.js (القوائم الجديدة + المودال)
   ========================================= */

const { useState, useEffect } = React;

const CalcEffort = window.CalcEffort;
const CalcTime = window.CalcTime;
const TestHifz = window.TestHifz;
const QuranReader = window.QuranReader;
const AzkarApp = window.AzkarApp;
const FeelingsPharmacy = window.FeelingsPharmacy; // جديد
const CardMaker = window.CardMaker; // جديد
const CustomModal = window.CustomModal; // جديد

const App = () => {
    const [config, setConfig] = useState({ texts: { siteTitle: '...', contact: {} }, news: [], teachers: [], halaqat: [], schedules: [] });
    const [page, setPage] = useState('home');
    const [studentName, setStudentName] = useState(localStorage.getItem('st_name') || '');
    const [halaqaName, setHalaqaName] = useState(localStorage.getItem('st_halaqa') || '');
    const [activeFeature, setActiveFeature] = useState(null);
    const [expandedSch, setExpandedSch] = useState(null);
    const [dataReady, setDataReady] = useState(false);
    
    // حالة النافذة العامة (بديل Alert)
    const [modal, setModal] = useState({ show: false, title: '', msg: '' });
    const showModal = (title, msg) => setModal({ show: true, title, msg });

    useEffect(() => {
        window.addEventListener('data-ready', () => setDataReady(true));
        if (window.APP_DATA && window.APP_DATA.isReady) setDataReady(true);
        if (window.db && window.onSnapshot && window.doc) {
            window.onSnapshot(window.doc(window.db, "appData", "mainConfig"), (doc) => { if (doc.exists()) setConfig(prev => ({...prev, ...doc.data()})); });
        }
    }, []);

    const toggleFeature = (name) => setActiveFeature(activeFeature === name ? null : name);

    return (
        <div id="app-container">
            {/* النافذة العامة */}
            <CustomModal isOpen={modal.show} onClose={() => setModal({ ...modal, show: false })} title={modal.title}><p className="font-bold text-gray-700">{modal.msg}</p></CustomModal>

            <header>
                <div className="flex items-center gap-2" onClick={() => setPage('home')}><div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg">ث</div><h1 className="text-xl font-black text-emerald-800">{config.texts?.siteTitle}</h1></div>
                <div className="flex gap-2"><button onClick={() => window.location.reload()} className="p-2 rounded-xl bg-gray-100 text-xs font-bold text-gray-600">🔄</button><a href="admin.html" className="p-2 rounded-xl text-gray-400 hover:text-emerald-600 text-xl">🔒</a></div>
            </header>

            {/* القائمة العلوية (تم إضافة زر واحة الزوار) */}
            <nav className="no-scrollbar">
                {['home','student_corner','extras','teachers','students','schedules','about','card'].map(t => (
                    <button key={t} onClick={() => setPage(t)} className={page === t ? 'active' : ''}>
                        {{home:'الرئيسية', student_corner:'ركن الطالب', extras:'واحة الزوار', teachers:'المعلمون', students:'الأوائل', schedules:'الجداول', about:'من نحن', card:'بطاقتي'}[t]}
                    </button>
                ))}
            </nav>

            <main className="p-4 pb-24 animate-in">
                {page === 'home' && (
                    <div className="space-y-6">
                        <section className="relative rounded-[2.5rem] overflow-hidden bg-emerald-700 text-white p-8 text-center shadow-xl"><div className="islamic-pattern"></div><h2 className="relative z-10 text-2xl font-black mb-3">{config.texts?.heroTitle}</h2>{studentName && <div className="relative z-10 mt-4 bg-white/20 px-4 py-2 rounded-full text-xs font-bold inline-block">أهلاً {studentName}</div>}</section>
                        <div className="bg-white p-6 rounded-3xl border-r-[8px] border-amber-400 shadow-sm"><h3 className="font-black text-lg mb-2 text-emerald-900">⭐ سؤال الأسبوع</h3><p className="mb-4 text-gray-700 font-bold">{config.texts?.weeklyQuestion}</p><button onClick={()=>{ if(!studentName) { showModal('تنبيه', 'سجل اسمك في بطاقتي أولاً'); setPage('card'); } else window.open(`https://wa.me/${config.texts?.contact?.phone}?text=الطالب: ${studentName}`, '_blank') }} className="w-full bg-[#25D366] text-white py-3 rounded-xl font-bold flex justify-center items-center gap-2 shadow-md">💬 إرسال الإجابة</button></div>
                        <div className="flex flex-col gap-4">{config.news?.filter(n => !n.hidden).map(n => (<div key={n.id} className="news-card"><div className="flex justify-end text-[10px] font-bold text-gray-400 mb-2">{n.date}</div><h3 className="text-xl font-black mb-2" style={{color: n.colors?.title}}>{n.title}</h3><p className="text-sm leading-loose mb-3 text-gray-600" style={{color: n.colors?.content}}>{n.content}</p></div>))}</div>
                    </div>
                )}

                {page === 'student_corner' && (
                    <div className="space-y-4 max-w-lg mx-auto">
                        <div onClick={() => toggleFeature('effort')} className={`student-btn ${activeFeature === 'effort' ? 'active' : ''}`}><span>📅 خطة ختمي</span><span>{activeFeature === 'effort'?'➖':'➕'}</span></div>{activeFeature === 'effort' && <CalcEffort />}
                        <div onClick={() => toggleFeature('time')} className={`student-btn ${activeFeature === 'time' ? 'active' : ''}`}><span>🎯 دليل الختم</span><span>{activeFeature === 'time'?'➖':'➕'}</span></div>{activeFeature === 'time' && <CalcTime />}
                        <div onClick={() => toggleFeature('test')} className={`student-btn ${activeFeature === 'test' ? 'active' : ''}`}><span>🧠 اختبر حفظك</span><span>{activeFeature === 'test'?'➖':'➕'}</span></div>{activeFeature === 'test' && (dataReady ? <TestHifz /> : <div className="text-center p-4">جاري التحميل...</div>)}
                        <div onClick={() => toggleFeature('quran')} className={`student-btn ${activeFeature === 'quran' ? 'active' : ''}`}><span>📖 المصحف الشريف</span><span>{activeFeature === 'quran'?'➖':'➕'}</span></div>{activeFeature === 'quran' && (dataReady ? <QuranReader /> : <div className="text-center p-4">جاري التحميل...</div>)}
                        <div onClick={() => toggleFeature('azkar')} className={`student-btn ${activeFeature === 'azkar' ? 'active' : ''}`}><span>📿 الأذكار</span><span>{activeFeature === 'azkar'?'➖':'➕'}</span></div>{activeFeature === 'azkar' && (dataReady ? <AzkarApp /> : <div className="text-center p-4">جاري التحميل...</div>)}
                    </div>
                )}

                {/* صفحة واحة الزوار الجديدة */}
                {page === 'extras' && (
                    <div className="space-y-4 max-w-lg mx-auto">
                        <h2 className="text-center font-black text-2xl text-emerald-800 mb-6">🌱 واحة الزوار</h2>
                        <div onClick={() => toggleFeature('feeling')} className={`student-btn ${activeFeature === 'feeling' ? 'active' : ''} border-emerald-200 bg-emerald-50`}><span>💊 صيدلية القلوب</span><span>{activeFeature === 'feeling'?'➖':'➕'}</span></div>{activeFeature === 'feeling' && <FeelingsPharmacy />}
                        <div onClick={() => toggleFeature('card')} className={`student-btn ${activeFeature === 'card' ? 'active' : ''} border-blue-200 bg-blue-50`}><span>🎨 صانع البطاقات</span><span>{activeFeature === 'card'?'➖':'➕'}</span></div>{activeFeature === 'card' && <CardMaker />}
                    </div>
                )}

                {page === 'teachers' && (<div className="grid gap-4">{config.teachers?.filter(t => !t.hidden).map(t => (<div key={t.id} className="bg-white p-6 rounded-3xl border flex items-center gap-4 shadow-sm"><div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center text-xl">{t.avatar}</div><div><h3 className="font-black text-lg">{t.name}</h3><p className="text-gray-500 text-sm">{t.bio}</p></div></div>))}</div>)}
                {page === 'schedules' && (<div className="space-y-8"><div><h3 className="font-black text-xl text-amber-600 mb-4 border-b-2 border-amber-200 pb-2 w-fit">☀️ حلقات العصر</h3>{config.schedules?.filter(s => s.period === 'عصر' && !s.hidden).map(sch => (<div key={sch.id} onClick={() => setExpandedSch(expandedSch === sch.id ? null : sch.id)} className={`halqa-accordion ${expandedSch === sch.id ? 'active' : ''}`}><span>{sch.name}</span><span>{expandedSch === sch.id ? '−' : '+'}</span></div>))}</div><div><h3 className="font-black text-xl text-indigo-600 mb-4 border-b-2 border-indigo-200 pb-2 w-fit">🌙 حلقات المغرب</h3>{config.schedules?.filter(s => s.period === 'مغرب' && !s.hidden).map(sch => (<div key={sch.id} onClick={() => setExpandedSch(expandedSch === sch.id ? null : sch.id)} className={`halqa-accordion ${expandedSch === sch.id ? 'active' : ''}`}><span>{sch.name}</span><span>{expandedSch === sch.id ? '−' : '+'}</span></div>))}</div></div>)}
                {page === 'students' && (<div className="space-y-6">{config.halaqat.filter(h => !h.hidden).map(h => (<div key={h.id} className="bg-white rounded-[2rem] shadow-md overflow-hidden border-t-8 border-emerald-500"><div className="bg-emerald-50 p-4 text-center font-black text-emerald-800 border-b border-emerald-100">حلقة {h.name}</div><div className="p-4 space-y-2">{h.students.map((st, idx) => (<div key={st.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border hover:bg-white transition"><span className="font-bold text-sm">{idx+1}. {st.name}</span><span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-black shadow-sm">{st.rank}</span></div>))}</div></div>))}</div>)}
                {page === 'about' && (<div className="space-y-6 max-w-xl mx-auto text-center"><div className="bg-white p-8 rounded-[2.5rem] shadow-lg border border-emerald-50"><h2 className="text-2xl font-black text-emerald-800">{config.texts?.siteTitle}</h2><p className="text-gray-600 font-bold leading-loose whitespace-pre-line mt-4">{config.texts?.aboutMain}</p></div><div className="grid grid-cols-2 gap-3"><a href={`tel:${config.texts?.contact?.phone}`} className="flex flex-col items-center justify-center p-4 bg-green-50 border-2 border-green-200 rounded-2xl shadow-sm font-bold text-green-700">📞 واتساب</a><a href={config.texts?.contact?.location} className="flex flex-col items-center justify-center p-4 bg-blue-50 border-2 border-blue-200 rounded-2xl shadow-sm font-bold text-blue-700">📍 الموقع</a></div></div>)}
                {page === 'card' && (<div className="max-w-md mx-auto space-y-6"><div className="bg-white p-8 rounded-[2.5rem] shadow-xl text-center border-4 border-emerald-50"><h2 className="text-2xl font-black mb-6">بيانات الطالب</h2><input value={studentName} onChange={e => {setStudentName(e.target.value); localStorage.setItem('st_name', e.target.value)}} className="w-full p-4 bg-gray-50 border rounded-2xl mb-3 text-center font-bold" placeholder="الاسم" /><button onClick={() => { setPage('home'); showModal('نجاح', 'تم حفظ البيانات بنجاح ✅'); }} className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black shadow-lg">حفظ وتفعيل</button></div></div>)}
            </main>
            <footer className="p-4 text-center bg-white border-t text-[10px] text-gray-400 font-bold fixed bottom-0 w-full z-30">&copy; 2026 {config.texts?.siteTitle}</footer>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
