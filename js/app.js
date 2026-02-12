/* =========================================
   ملف التطبيق الرئيسي: js/app.js
   (النسخة البلاتينية: قائمة إعدادات مجمعة)
   ========================================= */

const { useState, useEffect, Component } = React;

// --- صائد الأخطاء ---
class ErrorBoundary extends Component {
    constructor(props) { super(props); this.state = { hasError: false }; }
    static getDerivedStateFromError(error) { return { hasError: true }; }
    componentDidCatch(error, info) { console.error("Error:", error); }
    render() { if (this.state.hasError) return <div className="text-red-500 text-xs text-center p-2">⚠️ خطأ في العرض</div>; return this.props.children; }
}

// استيراد آمن
const safeImport = (name) => {
    const Comp = window[name];
    if (!Comp) return () => <div className="text-center text-xs text-gray-400 py-4 border border-dashed rounded-lg bg-gray-50">⏳ جاري التحميل...</div>;
    return Comp;
};

// تعريف المكونات
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
const RawdatHub = safeImport('RawdatHub');

const HomeSection = safeImport('HomeSection');
const TeachersSection = safeImport('TeachersSection');
const SchedulesSection = safeImport('SchedulesSection');
const AboutSection = safeImport('AboutSection');

const App = () => {
    // تحميل البيانات من الذاكرة
    const [config, setConfig] = useState(() => {
        const saved = localStorage.getItem('app_offline_data');
        return saved ? JSON.parse(saved) : { texts: { siteTitle: '...' }, news: [], teachers: [], halaqat: [], schedules: [] };
    });

    const [page, setPage] = useState('home');
    const [activeFeature, setActiveFeature] = useState(null);
    const [studentName, setStudentName] = useState(localStorage.getItem('st_name') || '');
    const [halaqaName, setHalaqaName] = useState(localStorage.getItem('st_halaqa') || '');
    const [modal, setModal] = useState({ show: false, title: '', msg: '' });

    // حالة التكبير
    const [isZoomed, setIsZoomed] = useState(false);
    
    // 🔥 حالة قائمة الإعدادات (مفتوحة/مغلقة)
    const [showSettings, setShowSettings] = useState(false);

    useEffect(() => {
        window.showGlobalAlert = (title, msg) => setModal({ show: true, title, msg });

        if (window.db && window.onSnapshot) {
            try {
                window.onSnapshot(window.doc(window.db, "appData", "mainConfig"), (doc) => {
                    if (doc.exists()) {
                        const newData = doc.data();
                        setConfig(prev => ({...prev, ...newData}));
                        localStorage.setItem('app_offline_data', JSON.stringify(newData));
                    }
                });
            } catch (e) { console.log("Offline Mode"); }
        }
    }, []);

    // تأثير التكبير
    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty('--layout-scale', isZoomed ? '1.25' : '1');
    }, [isZoomed]);

    // دالة التحديث الجذري
    const handleSmartUpdate = async () => {
        setShowSettings(false); // إغلاق القائمة
        if (!navigator.onLine) {
            setModal({ show: true, title: '📴 لا يوجد إنترنت', msg: 'عذراً، لا يوجد اتصال بالإنترنت.' });
            return;
        }

        if (confirm("هل تريد تحديث التطبيق الآن؟\n(سيتم إعادة تحميل كافة البيانات)")) {
            if ('serviceWorker' in navigator) {
                const registrations = await navigator.serviceWorker.getRegistrations();
                for (let registration of registrations) await registration.unregister();
            }
            if ('caches' in window) {
                const keys = await caches.keys();
                for (const key of keys) await caches.delete(key);
            }
            window.location.replace(window.location.pathname + '?v=' + new Date().getTime());
        }
    };

    const toggleFeature = (name) => setActiveFeature(activeFeature === name ? null : name);

    return (
        <div id="app-container">
            {window.CustomModal && <CustomModal isOpen={modal.show} onClose={() => setModal({ ...modal, show: false })} title={modal.title}><p className="font-bold text-gray-700 leading-relaxed whitespace-pre-line">{modal.msg}</p></CustomModal>}

            <header className="relative">
                <div className="flex items-center gap-2" onClick={() => setPage('home')}>
                    <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg cursor-pointer">ث</div>
                    <h1 className="text-xl font-black text-emerald-800">{config.texts?.siteTitle}</h1>
                </div>

                {/* 🔥 قسم الإعدادات الجديد */}
                <div className="relative">
                    {/* زر الترس */}
                    <button 
                        onClick={() => setShowSettings(!showSettings)} 
                        className={`w-10 h-10 flex items-center justify-center rounded-xl transition ${showSettings ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-50 text-gray-500'}`}
                    >
                        <span className="text-xl font-bold">⚙️</span>
                    </button>

                    {/* القائمة المنسدلة */}
                    {showSettings && (
                        <>
                            {/* طبقة شفافة لإغلاق القائمة عند الضغط خارجها */}
                            <div className="fixed inset-0 z-40" onClick={() => setShowSettings(false)}></div>
                            
                            {/* محتوى القائمة */}
                            <div className="absolute top-12 left-0 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-in">
                                <div className="p-2 space-y-1">
                                    <div className="px-3 py-2 text-xs font-bold text-gray-400 border-b mb-1">الإعدادات العامة</div>
                                    
                                    <button onClick={() => { setIsZoomed(!isZoomed); setShowSettings(false); }} className="w-full flex items-center gap-3 px-3 py-3 hover:bg-emerald-50 rounded-xl transition text-right">
                                        <span className="text-lg">{isZoomed ? '📱' : '🔍'}</span>
                                        <span className="text-sm font-bold text-gray-700">{isZoomed ? 'تصغير العرض' : 'تكبير العرض'}</span>
                                    </button>

                                    <button onClick={handleSmartUpdate} className="w-full flex items-center gap-3 px-3 py-3 hover:bg-emerald-50 rounded-xl transition text-right">
                                        <span className="text-lg">🔄</span>
                                        <span className="text-sm font-bold text-gray-700">تحديث التطبيق</span>
                                    </button>

                                    <a href="admin.html" className="w-full flex items-center gap-3 px-3 py-3 hover:bg-red-50 rounded-xl transition text-right border-t mt-1">
                                        <span className="text-lg">🔒</span>
                                        <span className="text-sm font-bold text-gray-700">لوحة الإدارة</span>
                                    </a>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </header>

            <nav className="no-scrollbar">
                {[
                    {id:'home', l:'الرئيسية'},
                    {id:'rawdah', l:'روضة المحبين 💗'},
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

                {page === 'rawdah' && <ErrorBoundary><RawdatHub /></ErrorBoundary>}

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
                        <div onClick={() => toggleFeature('feeling')} className={`student-btn border-emerald-200 bg-emerald-50 ${activeFeature === 'feeling' ? 'active' : ''}`}><span>💊 صيدلية القلوب</span><span>{activeFeature === 'feeling'?'➖':'➕'}</span></div>
                        <ErrorBoundary>{activeFeature === 'feeling' && <FeelingsPharmacy />}</ErrorBoundary>
                        <ErrorBoundary>{window.QuranExam && <QuranExam />}</ErrorBoundary>
                        <ErrorBoundary>{window.TafseerExam && <TafseerExam />}</ErrorBoundary>
                        <div onClick={() => toggleFeature('card')} className={`student-btn border-blue-200 bg-blue-50 ${activeFeature === 'card' ? 'active' : ''}`}><span>🎨 صانع البطاقات</span><span>{activeFeature === 'card'?'➖':'➕'}</span></div>
                        <ErrorBoundary>{activeFeature === 'card' && <CardMaker />}</ErrorBoundary>
                    </div>
                )}

                <ErrorBoundary>{page === 'teachers' && <TeachersSection teachers={config.teachers} />}</ErrorBoundary>
                <ErrorBoundary>{page === 'schedules' && <SchedulesSection schedules={config.schedules} />}</ErrorBoundary>
                
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
