/* =========================================
   ملف التطبيق الرئيسي: js/app.js
   (نسخة الإنقاذ: لا تظهر شاشة بيضاء أبداً)
   ========================================= */

const { useState, useEffect, Component } = React;

// 1. مكون صائد الأخطاء (يمنع الشاشة البيضاء)
class ErrorBoundary extends Component {
    constructor(props) { super(props); this.state = { hasError: false, errorInfo: "" }; }
    static getDerivedStateFromError(error) { return { hasError: true }; }
    componentDidCatch(error, errorInfo) { 
        this.setState({ errorInfo: error.toString() }); 
        console.error("🔥 خطأ:", error); 
    }
    render() {
        if (this.state.hasError) {
            return (
                <div className="p-4 m-4 bg-red-50 border border-red-200 rounded-xl text-center">
                    <h3 className="text-red-800 font-bold mb-2">⚠️ حدث خطأ في هذا القسم</h3>
                    <p className="text-[10px] text-red-600 font-mono" dir="ltr">{this.state.errorInfo.slice(0, 100)}</p>
                    <button onClick={() => window.location.reload()} className="mt-2 px-4 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-bold">تحديث الصفحة</button>
                </div>
            );
        }
        return this.props.children;
    }
}

// 2. دالة استيراد آمنة (تفحص هل المكون موجود أم لا)
const safeImport = (name) => {
    // نحاول جلب المكون من النافذة
    const Comp = window[name];
    // إذا لم نجده، نعرض رسالة انتظار بدلاً من الانهيار
    if (!Comp) return () => <div className="p-4 text-center text-xs text-gray-400">⏳ جاري تحميل {name}... (أو تأكد من الملفات)</div>;
    return Comp;
};

// استيراد المكونات الأساسية
const HomeSection = safeImport('HomeSection');
const TeachersSection = safeImport('TeachersSection');
const SchedulesSection = safeImport('SchedulesSection');
const AboutSection = safeImport('AboutSection');

// استيراد الميزات
const CalcEffort = safeImport('CalcEffort');
const CalcTime = safeImport('CalcTime');
const TestHifz = safeImport('TestHifz');
const QuranReader = safeImport('QuranReader');
const AzkarApp = safeImport('AzkarApp');
const DailyWird = safeImport('DailyWird');
const VirtuousTimesWidget = safeImport('VirtuousTimesWidget');
const FeelingsPharmacy = safeImport('FeelingsPharmacy');
const CardMaker = safeImport('CardMaker');
const GlobalKhatmaCounter = safeImport('GlobalKhatmaCounter');
const QuranExam = safeImport('QuranExam');
const TafseerExam = safeImport('TafseerExam');
const CustomModal = window.CustomModal;

// 🔥 استيراد روضة المحبين (بشكل ديناميكي لمنع الانهيار)
const RawdatHubWrapper = () => {
    if (window.RawdatHub) return <window.RawdatHub />;
    return <div className="p-10 text-center font-bold text-gray-400">⚠️ ملف روضة المحبين لم يتم تحميله بشكل صحيح.<br/><span className="text-[10px]">تأكد من وجود الملف في js/components/seerah/RawdatHub.js</span></div>;
};

const App = () => {
    const [config, setConfig] = useState({ texts: { siteTitle: '...', contact: {} }, news: [], teachers: [], halaqat: [], schedules: [], visibility: {} });
    const [page, setPage] = useState('home');
    const [activeFeature, setActiveFeature] = useState(null);
    const [studentName, setStudentName] = useState(localStorage.getItem('st_name') || '');
    const [halaqaName, setHalaqaName] = useState(localStorage.getItem('st_halaqa') || '');
    const [modal, setModal] = useState({ show: false, title: '', msg: '' });
    const [installPrompt, setInstallPrompt] = useState(null);
    const [offlineStatus, setOfflineStatus] = useState('checking'); 

    useEffect(() => {
        window.alert = (msg) => setModal({ show: true, title: 'تنبيه', msg });
        window.showGlobalAlert = (title, msg) => setModal({ show: true, title, msg });

        window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); setInstallPrompt(e); });
        
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.addEventListener('message', (event) => {
                if (event.data && event.data.type === 'CACHE_COMPLETE') {
                    setOfflineStatus('ready');
                    window.showGlobalAlert("✅ تم التحديث", "تم تحميل الملفات الجديدة بنجاح.");
                }
            });
            // التحقق من حالة الكاش
            caches.open('althuraya-offline-v8').then(cache => { // تأكد أن الرقم هنا يطابق sw.js
                 cache.match('data/quran.json').then(res => { if (res) setOfflineStatus('ready'); });
            });
        }

        if (window.db && window.onSnapshot) {
            try {
                window.onSnapshot(window.doc(window.db, "appData", "mainConfig"), (doc) => {
                    if (doc.exists()) setConfig(prev => ({...prev, ...doc.data()}));
                });
            } catch (e) { console.log("Offline mode"); }
        }
    }, []);

    const handleInstallClick = async () => {
        if (!installPrompt) return;
        installPrompt.prompt();
        const { outcome } = await installPrompt.userChoice;
        if (outcome === 'accepted') setInstallPrompt(null);
    };

    const toggleFeature = (name) => setActiveFeature(activeFeature === name ? null : name);
    const isVisible = (section, key) => config.visibility?.[section]?.[key] !== false;

    // القائمة
    const navItems = [
        {id: 'home', label: 'الرئيسية'},
        {id: 'rawdah', label: 'روضة المحبين'},
        {id: 'student_corner', label: 'ركن الطالب'},
        {id: 'extras', label: 'واحة الزوار'},
        {id: 'teachers', label: 'المعلمون'},
        {id: 'students', label: 'الأوائل'},
        {id: 'schedules', label: 'الجداول'},
        {id: 'about', label: 'من نحن'},
        {id: 'card', label: 'بطاقتي'}
    ].filter(item => isVisible('nav', item.id));

    return (
        <div id="app-container">
            {window.CustomModal && <CustomModal isOpen={modal.show} onClose={() => setModal({ ...modal, show: false })} title={modal.title}><p className="font-bold text-gray-700 leading-relaxed whitespace-pre-line">{modal.msg}</p></CustomModal>}

            <header>
                <div className="flex items-center gap-2" onClick={() => setPage('home')}>
                    <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg cursor-pointer">ث</div>
                    <h1 className="text-xl font-black text-emerald-800">{config.texts?.siteTitle}</h1>
                </div>
                <div className="flex gap-2">
                    {installPrompt && (
                        <button onClick={handleInstallClick} className={`px-3 py-2 text-white text-xs font-black rounded-xl shadow-lg border-2 border-white transition flex items-center gap-1 ${offlineStatus === 'ready' ? 'bg-gradient-to-r from-emerald-500 to-green-600 animate-bounce' : 'bg-gray-400 cursor-wait'}`}>
                            {offlineStatus === 'ready' ? '📲 تثبيت التطبيق' : '⏳ جاري التجهيز...'}
                        </button>
                    )}
                    <button onClick={() => window.location.reload()} className="p-2 rounded-xl bg-gray-100 text-xs font-bold text-gray-600 shadow-sm">🔄</button>
                    <a href="admin.html" className="p-2 rounded-xl text-gray-400 hover:text-emerald-600 text-xl">🔒</a>
                </div>
            </header>

            <nav className="no-scrollbar">
                {navItems.map(item => (
                    <button key={item.id} onClick={() => setPage(item.id)} className={page === item.id ? 'active' : ''}>
                        {item.label}
                    </button>
                ))}
            </nav>

            <main className="p-4 pb-24 animate-in">
                <ErrorBoundary>
                    {page === 'home' && <HomeSection config={config} studentName={studentName} showGlobalAlert={window.showGlobalAlert} setPage={setPage} />}
                </ErrorBoundary>

                {/* 🔥 عرض روضة المحبين بأمان */}
                {page === 'rawdah' && (
                    <ErrorBoundary>
                        <RawdatHubWrapper />
                    </ErrorBoundary>
                )}

                {page === 'student_corner' && (
                    <div className="space-y-4 max-w-lg mx-auto">
                        <ErrorBoundary>{isVisible('student', 'effort') && <><div onClick={() => toggleFeature('effort')} className={`student-btn ${activeFeature === 'effort'?'active':''}`}><span>📅 خطة ختمي</span><span>{activeFeature==='effort'?'➖':'➕'}</span></div>{activeFeature === 'effort' && <CalcEffort />}</>}</ErrorBoundary>
                        <ErrorBoundary>{isVisible('student', 'time') && <><div onClick={() => toggleFeature('time')} className={`student-btn ${activeFeature === 'time'?'active':''}`}><span>🎯 دليل الختم</span><span>{activeFeature==='time'?'➖':'➕'}</span></div>{activeFeature === 'time' && <CalcTime />}</>}</ErrorBoundary>
                        <ErrorBoundary>{isVisible('student', 'test') && <><div onClick={() => toggleFeature('test')} className={`student-btn ${activeFeature === 'test'?'active':''}`}><span>🧠 اختبر حفظك</span><span>{activeFeature==='test'?'➖':'➕'}</span></div>{activeFeature === 'test' && <TestHifz />}</>}</ErrorBoundary>
                        <ErrorBoundary>{isVisible('student', 'quran') && <><div onClick={() => toggleFeature('quran')} className={`student-btn ${activeFeature === 'quran'?'active':''}`}><span>📖 المصحف الشريف</span><span>{activeFeature==='quran'?'➖':'➕'}</span></div>{activeFeature === 'quran' && <QuranReader />}</>}</ErrorBoundary>
                        <ErrorBoundary>{isVisible('student', 'azkar') && <><div onClick={() => toggleFeature('azkar')} className={`student-btn ${activeFeature === 'azkar'?'active':''}`}><span>📿 الأذكار</span><span>{activeFeature==='azkar'?'➖':'➕'}</span></div>{activeFeature === 'azkar' && <AzkarApp />}</>}</ErrorBoundary>
                    </div>
                )}

                {page === 'extras' && (
                    <div className="space-y-4 max-w-lg mx-auto animate-in">
                        <h2 className="text-center font-black text-2xl text-emerald-800 mb-2">🌱 واحة الزوار</h2>
                        <ErrorBoundary>{isVisible('extras', 'virtuous') && window.VirtuousTimesWidget && <VirtuousTimesWidget />}</ErrorBoundary>
                        <ErrorBoundary>{isVisible('extras', 'wird') && window.DailyWird && <DailyWird />}</ErrorBoundary>
                        <ErrorBoundary>{isVisible('extras', 'counter') && window.GlobalKhatmaCounter && <GlobalKhatmaCounter />}</ErrorBoundary>
                        <ErrorBoundary>{isVisible('extras', 'feeling') && <><div onClick={() => toggleFeature('feeling')} className={`student-btn bg-emerald-50 ${activeFeature === 'feeling'?'active':''}`}><span>💊 صيدلية القلوب</span><span>{activeFeature==='feeling'?'➖':'➕'}</span></div>{activeFeature === 'feeling' && <FeelingsPharmacy />}</>}</ErrorBoundary>
                        <ErrorBoundary>{isVisible('extras', 'quran_exam') && window.QuranExam && <QuranExam />}</ErrorBoundary>
                        <ErrorBoundary>{isVisible('extras', 'tafseer_exam') && window.TafseerExam && <TafseerExam />}</ErrorBoundary>
                        <ErrorBoundary>{isVisible('extras', 'card') && <><div onClick={() => toggleFeature('card')} className={`student-btn bg-blue-50 ${activeFeature === 'card'?'active':''}`}><span>🎨 صانع البطاقات</span><span>{activeFeature==='card'?'➖':'➕'}</span></div>{activeFeature === 'card' && <CardMaker />}</>}</ErrorBoundary>
                    </div>
                )}

                <ErrorBoundary>{isVisible('nav', 'teachers') && page === 'teachers' && <TeachersSection teachers={config.teachers} />}</ErrorBoundary>
                <ErrorBoundary>{isVisible('nav', 'schedules') && page === 'schedules' && <SchedulesSection schedules={config.schedules} />}</ErrorBoundary>
                
                {page === 'students' && (
                     <div className="space-y-6">
                        {config.halaqat.filter(h => !h.hidden).map(h => (
                            <div key={h.id} className="bg-white rounded-[2rem] shadow-md overflow-hidden border-t-8 border-emerald-500">
                                <div className="bg-emerald-50 p-4 text-center font-black text-emerald-800 border-b border-emerald-100">حلقة {h.name}</div>
                                <div className="p-4 space-y-2">{h.students.map((st, idx) => (<div key={st.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border hover:bg-white transition"><span className="font-bold text-sm">{idx+1}. {st.name}</span><span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-black shadow-sm">{st.rank}</span></div>))}</div>
                            </div>
                        ))}
                    </div>
                )}
                <ErrorBoundary>{page === 'about' && <AboutSection texts={config.texts} />}</ErrorBoundary>
                
                {page === 'card' && (
                    <div className="max-w-md mx-auto space-y-6 animate-in">
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl text-center border-4 border-emerald-50">
                            <h2 className="text-2xl font-black mb-6">بيانات الطالب</h2>
                            <input value={studentName} onChange={e => {setStudentName(e.target.value); localStorage.setItem('st_name', e.target.value)}} className="w-full p-4 bg-gray-50 border rounded-2xl mb-3 text-center font-bold" placeholder="الاسم الثلاثي" />
                            <input value={halaqaName} onChange={e => {setHalaqaName(e.target.value); localStorage.setItem('st_halaqa', e.target.value)}} className="w-full p-4 bg-gray-50 border rounded-2xl mb-6 text-center font-bold" placeholder="اسم الحلقة" />
                            <button onClick={() => { setPage('home'); window.showGlobalAlert('نجاح', 'تم حفظ البيانات بنجاح ✅'); }} className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black shadow-lg hover:bg-emerald-700 transition">حفظ وتفعيل</button>
                        </div>
                    </div>
                )}
            </main>

            <footer className="p-4 text-center bg-white border-t text-[10px] text-gray-400 font-bold fixed bottom-0 w-full z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                &copy; 2026 {config.texts?.siteTitle} | الإصدار المطور
            </footer>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
