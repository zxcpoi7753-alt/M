/* =========================================
   ملف التطبيق الرئيسي: js/app.js
   (النسخة الذهبية: أمان + ميزات جديدة + تخزين أوفلاين ذكي)
   ========================================= */

const { useState, useEffect, Component } = React;

// --- 1. صائد الأخطاء (يمنع الشاشة البيضاء) ---
class ErrorBoundary extends Component {
    constructor(props) { super(props); this.state = { hasError: false, errorInfo: "" }; }
    static getDerivedStateFromError(error) { return { hasError: true }; }
    componentDidCatch(error, errorInfo) { 
        this.setState({ errorInfo: error.toString() }); 
        console.error("🔥 خطأ:", error, errorInfo); 
    }
    render() {
        if (this.state.hasError) return <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-center my-2"><h3 className="text-red-600 font-bold text-xs">⛔ توقف هذا الجزء</h3></div>;
        return this.props.children;
    }
}

// استيراد آمن للمكونات
const safeImport = (name) => {
    const Comp = window[name];
    if (!Comp) return () => <div className="text-center text-xs text-gray-400 py-4 border border-dashed rounded-lg bg-gray-50">⏳ جاري تحميل {name}... (تأكد من الملفات)</div>;
    return Comp;
};

// تعريف المكونات الأساسية
const CalcEffort = safeImport('CalcEffort');
const CalcTime = safeImport('CalcTime');
const TestHifz = safeImport('TestHifz');
const QuranReader = safeImport('QuranReader');
const AzkarApp = safeImport('AzkarApp');
const DailyWird = safeImport('DailyWird');
const QuranExam = safeImport('QuranExam');
const TafseerExam = safeImport('TafseerExam');
const VirtuousTimesWidget = safeImport('VirtuousTimesWidget');
const FeelingsPharmacy = safeImport('FeelingsPharmacy');
const CardMaker = safeImport('CardMaker');
const GlobalKhatmaCounter = safeImport('GlobalKhatmaCounter');
const CustomModal = window.CustomModal;

const HomeSection = safeImport('HomeSection');
const TeachersSection = safeImport('TeachersSection');
const SchedulesSection = safeImport('SchedulesSection');
const AboutSection = safeImport('AboutSection');

// 🔥 المكون الجديد (روضة المحبين)
const RawdatHub = safeImport('RawdatHub');

const App = () => {
    // 🔥 التعديل الذكي هنا: تهيئة البيانات من الذاكرة المحلية فوراً (Offline First)
    const [config, setConfig] = useState(() => {
        const savedData = localStorage.getItem('app_offline_data');
        return savedData ? JSON.parse(savedData) : { 
            texts: { siteTitle: '...', contact: {} }, 
            news: [], teachers: [], halaqat: [], schedules: [] 
        };
    });

    const [page, setPage] = useState('home');
    const [activeFeature, setActiveFeature] = useState(null);
    const [studentName, setStudentName] = useState(localStorage.getItem('st_name') || '');
    const [halaqaName, setHalaqaName] = useState(localStorage.getItem('st_halaqa') || '');
    const [modal, setModal] = useState({ show: false, title: '', msg: '' });

    useEffect(() => {
        window.alert = (msg) => setModal({ show: true, title: 'تنبيه', msg });
        window.showGlobalAlert = (title, msg) => setModal({ show: true, title, msg });

        // جلب البيانات من فيربيس وتحديث الذاكرة المحلية
        if (window.db && window.onSnapshot) {
            try {
                window.onSnapshot(window.doc(window.db, "appData", "mainConfig"), (doc) => {
                    if (doc.exists()) {
                        const newData = doc.data();
                        setConfig(prev => ({...prev, ...newData}));
                        // 🔥 حفظ النسخة الجديدة في "الخزنة" للاستخدام لاحقاً بدون نت
                        localStorage.setItem('app_offline_data', JSON.stringify(newData));
                    }
                });
            } catch (e) {
                console.log("⚠️ وضع الأوفلاين: استخدام البيانات المخزنة");
            }
        }
    }, []);

    const toggleFeature = (name) => setActiveFeature(activeFeature === name ? null : name);

    return (
        <div id="app-container">
            {window.CustomModal && <CustomModal isOpen={modal.show} onClose={() => setModal({ ...modal, show: false })} title={modal.title}><p className="font-bold text-gray-700 leading-relaxed whitespace-pre-line">{modal.msg}</p></CustomModal>}

            <header>
                <div className="flex items-center gap-2" onClick={() => setPage('home')}>
                    <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg cursor-pointer">ث</div>
                    <h1 className="text-xl font-black text-emerald-800">{config.texts?.siteTitle}</h1>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => window.location.reload()} className="p-2 rounded-xl bg-gray-100 text-xs font-bold text-gray-600 shadow-sm">🔄</button>
                    <a href="admin.html" className="p-2 rounded-xl text-gray-400 hover:text-emerald-600 text-xl">🔒</a>
                </div>
            </header>

            <nav className="no-scrollbar">
                {[
                    {id:'home', l:'الرئيسية'},
                    {id:'rawdah', l:'روضة المحبين 💗'}, // زر الميزة الجديدة
                    {id:'student_corner', l:'ركن الطالب'},
                    {id:'extras', l:'واحة الزوار'},
                    {id:'teachers', l:'المعلمون'},
                    {id:'students', l:'الأوائل'},
                    {id:'schedules', l:'الجداول'},
                    {id:'about', l:'من نحن'},
                    {id:'card', l:'بطاقتي'}
                ].map(t => (
                    <button key={t.id} onClick={() => setPage(t.id)} className={page === t.id ? 'active' : ''}>
                        {t.l}
                    </button>
                ))}
            </nav>

            <main className="p-4 pb-24 animate-in">
                <ErrorBoundary>
                    {page === 'home' && <HomeSection config={config} studentName={studentName} showGlobalAlert={window.showGlobalAlert} setPage={setPage} />}
                </ErrorBoundary>

                {/* 🔥 صفحة روضة المحبين */}
                {page === 'rawdah' && (
                    <ErrorBoundary>
                        <RawdatHub />
                    </ErrorBoundary>
                )}

                {page === 'student_corner' && (
                    <div className="space-y-4 max-w-lg mx-auto">
                        <div onClick={() => toggleFeature('effort')} className={`student-btn ${activeFeature === 'effort' ? 'active' : ''}`}><span>📅 خطة ختمي</span><span>{activeFeature === 'effort'?'➖':'➕'}</span></div>
                        <ErrorBoundary>{activeFeature === 'effort' && <CalcEffort />}</ErrorBoundary>

                        <div onClick={() => toggleFeature('time')} className={`student-btn ${activeFeature === 'time' ? 'active' : ''}`}><span>🎯 دليل الختم</span><span>{activeFeature === 'time'?'➖':'➕'}</span></div>
                        <ErrorBoundary>{activeFeature === 'time' && <CalcTime />}</ErrorBoundary>
                        
                        <div onClick={() => toggleFeature('test')} className={`student-btn ${activeFeature === 'test' ? 'active' : ''}`}><span>🧠 اختبر حفظك</span><span>{activeFeature === 'test'?'➖':'➕'}</span></div>
                        <ErrorBoundary>{activeFeature === 'test' && <TestHifz />}</ErrorBoundary>
                        
                        <div onClick={() => toggleFeature('quran')} className={`student-btn ${activeFeature === 'quran' ? 'active' : ''}`}><span>📖 المصحف الشريف</span><span>{activeFeature === 'quran'?'➖':'➕'}</span></div>
                        <ErrorBoundary>{activeFeature === 'quran' && <QuranReader />}</ErrorBoundary>
                        
                        <div onClick={() => toggleFeature('azkar')} className={`student-btn ${activeFeature === 'azkar' ? 'active' : ''}`}><span>📿 الأذكار</span><span>{activeFeature === 'azkar'?'➖':'➕'}</span></div>
                        <ErrorBoundary>{activeFeature === 'azkar' && <AzkarApp />}</ErrorBoundary>
                    </div>
                )}

                {page === 'extras' && (
                    <div className="space-y-4 max-w-lg mx-auto animate-in">
                        <h2 className="text-center font-black text-2xl text-emerald-800 mb-2">🌱 واحة الزوار</h2>
                        <ErrorBoundary>{window.VirtuousTimesWidget && <VirtuousTimesWidget />}</ErrorBoundary>
                        <ErrorBoundary>{window.DailyWird && <DailyWird />}</ErrorBoundary>
                        <ErrorBoundary>{window.GlobalKhatmaCounter && <GlobalKhatmaCounter />}</ErrorBoundary>
                        <div onClick={() => toggleFeature('feeling')} className={`student-btn ${activeFeature === 'feeling' ? 'active' : ''} border-emerald-200 bg-emerald-50`}><span>💊 صيدلية القلوب</span><span>{activeFeature === 'feeling'?'➖':'➕'}</span></div>
                        <ErrorBoundary>{activeFeature === 'feeling' && <FeelingsPharmacy />}</ErrorBoundary>
                        <ErrorBoundary>{window.QuranExam && <QuranExam />}</ErrorBoundary>
                        <ErrorBoundary>{window.TafseerExam && <TafseerExam />}</ErrorBoundary>
                        <div onClick={() => toggleFeature('card')} className={`student-btn ${activeFeature === 'card' ? 'active' : ''} border-blue-200 bg-blue-50`}><span>🎨 صانع البطاقات</span><span>{activeFeature === 'card'?'➖':'➕'}</span></div>
                        <ErrorBoundary>{activeFeature === 'card' && <CardMaker />}</ErrorBoundary>
                    </div>
                )}

                <ErrorBoundary>{page === 'teachers' && <TeachersSection teachers={config.teachers} />}</ErrorBoundary>
                <ErrorBoundary>{page === 'schedules' && <SchedulesSection schedules={config.schedules} />}</ErrorBoundary>
                
                {page === 'students' && (
                     <div className="space-y-6">
                        {config.halaqat && config.halaqat.filter(h => !h.hidden).map(h => (
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
