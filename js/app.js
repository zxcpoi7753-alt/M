/* =========================================
   ملف التطبيق الرئيسي: js/app.js
   (النسخة المصفحة - تعمل مهما كانت الظروف)
   ========================================= */

const { useState, useEffect, Component } = React;

// --- 1. حماية ضد الانهيار ---
class ErrorBoundary extends Component {
    constructor(props) { super(props); this.state = { hasError: false }; }
    static getDerivedStateFromError(error) { return { hasError: true }; }
    componentDidCatch(error, info) { console.error("Error detected:", error); }
    render() {
        if (this.state.hasError) return <div className="p-4 bg-red-50 text-red-600 border border-red-200 rounded-xl text-center text-xs m-2">⚠️ حدث خطأ في هذا الجزء. <button onClick={()=>window.location.reload()} className="underline font-bold">تحديث</button></div>;
        return this.props.children;
    }
}

// --- 2. دالة استيراد ذكية ---
// هذه الدالة تمنع الشاشة البيضاء إذا كان الملف غير موجود
const safeGet = (name, fallbackText) => {
    const Comp = window[name];
    if (!Comp) {
        return () => (
            <div className="p-6 text-center text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <p className="text-2xl mb-2">🛠️</p>
                <p className="text-xs font-bold">{fallbackText || `جاري العمل على (${name})...`}</p>
                <p className="text-[9px] mt-1">تأكد من تحميل الملف في index.html</p>
            </div>
        );
    }
    return Comp;
};

// --- 3. استيراد المكونات ---
const HomeSection = safeGet('HomeSection', 'الرئيسية');
const TeachersSection = safeGet('TeachersSection', 'المعلمون');
const SchedulesSection = safeGet('SchedulesSection', 'الجداول');
const AboutSection = safeGet('AboutSection', 'من نحن');

const CalcEffort = safeGet('CalcEffort');
const CalcTime = safeGet('CalcTime');
const TestHifz = safeGet('TestHifz');
const QuranReader = safeGet('QuranReader');
const AzkarApp = safeGet('AzkarApp');
const DailyWird = safeGet('DailyWird');
const VirtuousTimesWidget = safeGet('VirtuousTimesWidget');
const FeelingsPharmacy = safeGet('FeelingsPharmacy');
const CardMaker = safeGet('CardMaker');
const GlobalKhatmaCounter = safeGet('GlobalKhatmaCounter');
const QuranExam = safeGet('QuranExam');
const TafseerExam = safeGet('TafseerExam');
const CustomModal = window.CustomModal;

// 🔥 المكونات الجديدة (محمية)
const RawdatHub = safeGet('RawdatHub', 'روضة المحبين');

// --- 4. التطبيق الرئيسي ---
const App = () => {
    const [config, setConfig] = useState({ texts: {}, visibility: {} });
    const [page, setPage] = useState('home');
    const [activeFeature, setActiveFeature] = useState(null);
    const [studentName, setStudentName] = useState(localStorage.getItem('st_name') || '');
    const [halaqaName, setHalaqaName] = useState(localStorage.getItem('st_halaqa') || '');
    const [modal, setModal] = useState({ show: false, title: '', msg: '' });
    const [installPrompt, setInstallPrompt] = useState(null);
    const [offlineStatus, setOfflineStatus] = useState('checking');

    useEffect(() => {
        // تعريف النوافذ
        window.alert = (msg) => setModal({ show: true, title: 'تنبيه', msg });
        window.showGlobalAlert = (title, msg) => setModal({ show: true, title, msg });

        // تثبيت التطبيق
        window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); setInstallPrompt(e); });

        // التحقق من الاوفلاين
        if ('serviceWorker' in navigator) {
            caches.match('data/quran.json').then(res => { if (res) setOfflineStatus('ready'); });
            navigator.serviceWorker.addEventListener('message', (event) => {
                if (event.data && event.data.type === 'CACHE_COMPLETE') {
                    setOfflineStatus('ready');
                    window.showGlobalAlert("✅ تم", "تم تحديث الملفات بنجاح.");
                }
            });
        }

        // جلب البيانات
        if (window.db && window.onSnapshot) {
            try {
                window.onSnapshot(window.doc(window.db, "appData", "mainConfig"), (d) => {
                    if (d.exists()) setConfig(prev => ({ ...prev, ...d.data() }));
                });
            } catch (e) { console.log("Offline"); }
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

    // القائمة العلوية
    const navItems = [
        { id: 'home', label: 'الرئيسية' },
        { id: 'rawdah', label: 'روضة المحبين' },
        { id: 'student_corner', label: 'ركن الطالب' },
        { id: 'extras', label: 'واحة الزوار' },
        { id: 'teachers', label: 'المعلمون' },
        { id: 'students', label: 'الأوائل' },
        { id: 'schedules', label: 'الجداول' },
        { id: 'about', label: 'من نحن' },
        { id: 'card', label: 'بطاقتي' }
    ].filter(i => isVisible('nav', i.id));

    return (
        <div id="app-container">
            {window.CustomModal && <CustomModal isOpen={modal.show} onClose={() => setModal({ ...modal, show: false })} title={modal.title}><p className="font-bold text-gray-700 leading-relaxed whitespace-pre-line">{modal.msg}</p></CustomModal>}

            <header>
                <div className="flex items-center gap-2" onClick={() => setPage('home')}>
                    <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg cursor-pointer">ث</div>
                    <h1 className="text-xl font-black text-emerald-800">{config.texts?.siteTitle || 'الثريا'}</h1>
                </div>
                <div className="flex gap-2">
                    {installPrompt && (
                        <button onClick={handleInstallClick} className={`px-3 py-2 text-white text-xs font-black rounded-xl shadow-lg border-2 border-white transition flex items-center gap-1 ${offlineStatus === 'ready' ? 'bg-gradient-to-r from-emerald-500 to-green-600 animate-bounce' : 'bg-gray-400 cursor-wait'}`}>
                            {offlineStatus === 'ready' ? '📲 تثبيت' : '⏳'}
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
                    
                    {/* عرض روضة المحبين (آمن) */}
                    {page === 'rawdah' && <RawdatHub />}

                    {page === 'student_corner' && (
                        <div className="space-y-4 max-w-lg mx-auto">
                            {isVisible('student', 'effort') && <div onClick={() => toggleFeature('effort')} className={`student-btn ${activeFeature === 'effort' ? 'active' : ''}`}><span>📅 خطة ختمي</span><span>{activeFeature === 'effort' ? '➖' : '➕'}</span></div>}
                            {activeFeature === 'effort' && <CalcEffort />}

                            {isVisible('student', 'time') && <div onClick={() => toggleFeature('time')} className={`student-btn ${activeFeature === 'time' ? 'active' : ''}`}><span>🎯 دليل الختم</span><span>{activeFeature === 'time' ? '➖' : '➕'}</span></div>}
                            {activeFeature === 'time' && <CalcTime />}

                            {isVisible('student', 'test') && <div onClick={() => toggleFeature('test')} className={`student-btn ${activeFeature === 'test' ? 'active' : ''}`}><span>🧠 اختبر حفظك</span><span>{activeFeature === 'test' ? '➖' : '➕'}</span></div>}
                            {activeFeature === 'test' && <TestHifz />}

                            {isVisible('student', 'quran') && <div onClick={() => toggleFeature('quran')} className={`student-btn ${activeFeature === 'quran' ? 'active' : ''}`}><span>📖 المصحف الشريف</span><span>{activeFeature === 'quran' ? '➖' : '➕'}</span></div>}
                            {activeFeature === 'quran' && <QuranReader />}

                            {isVisible('student', 'azkar') && <div onClick={() => toggleFeature('azkar')} className={`student-btn ${activeFeature === 'azkar' ? 'active' : ''}`}><span>📿 الأذكار</span><span>{activeFeature === 'azkar' ? '➖' : '➕'}</span></div>}
                            {activeFeature === 'azkar' && <AzkarApp />}
                        </div>
                    )}

                    {page === 'extras' && (
                        <div className="space-y-4 max-w-lg mx-auto animate-in">
                            <h2 className="text-center font-black text-2xl text-emerald-800 mb-2">🌱 واحة الزوار</h2>
                            {isVisible('extras', 'virtuous') && <VirtuousTimesWidget />}
                            {isVisible('extras', 'wird') && <DailyWird />}
                            {isVisible('extras', 'counter') && <GlobalKhatmaCounter />}
                            
                            {isVisible('extras', 'feeling') && <div onClick={() => toggleFeature('feeling')} className={`student-btn bg-emerald-50 ${activeFeature === 'feeling' ? 'active' : ''}`}><span>💊 صيدلية القلوب</span><span>{activeFeature === 'feeling' ? '➖' : '➕'}</span></div>}
                            {activeFeature === 'feeling' && <FeelingsPharmacy />}

                            {isVisible('extras', 'quran_exam') && <QuranExam />}
                            {isVisible('extras', 'tafseer_exam') && <TafseerExam />}
                            
                            {isVisible('extras', 'card') && <div onClick={() => toggleFeature('card')} className={`student-btn bg-blue-50 ${activeFeature === 'card' ? 'active' : ''}`}><span>🎨 صانع البطاقات</span><span>{activeFeature === 'card' ? '➖' : '➕'}</span></div>}
                            {activeFeature === 'card' && <CardMaker />}
                        </div>
                    )}

                    {page === 'teachers' && <TeachersSection teachers={config.teachers} />}
                    {page === 'schedules' && <SchedulesSection schedules={config.schedules} />}
                    {page === 'about' && <AboutSection texts={config.texts} />}
                    
                    {page === 'students' && (
                        <div className="space-y-6">
                            {config.halaqat && config.halaqat.filter(h => !h.hidden).map(h => (
                                <div key={h.id} className="bg-white rounded-[2rem] shadow-md overflow-hidden border-t-8 border-emerald-500">
                                    <div className="bg-emerald-50 p-4 text-center font-black text-emerald-800 border-b border-emerald-100">حلقة {h.name}</div>
                                    <div className="p-4 space-y-2">{h.students.map((st, idx) => (<div key={st.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border hover:bg-white transition"><span className="font-bold text-sm">{idx + 1}. {st.name}</span><span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-black shadow-sm">{st.rank}</span></div>))}</div>
                                </div>
                            ))}
                        </div>
                    )}

                    {page === 'card' && (
                        <div className="max-w-md mx-auto space-y-6 animate-in">
                            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl text-center border-4 border-emerald-50">
                                <h2 className="text-2xl font-black mb-6">بيانات الطالب</h2>
                                <input value={studentName} onChange={e => { setStudentName(e.target.value); localStorage.setItem('st_name', e.target.value) }} className="w-full p-4 bg-gray-50 border rounded-2xl mb-3 text-center font-bold" placeholder="الاسم الثلاثي" />
                                <input value={halaqaName} onChange={e => { setHalaqaName(e.target.value); localStorage.setItem('st_halaqa', e.target.value) }} className="w-full p-4 bg-gray-50 border rounded-2xl mb-6 text-center font-bold" placeholder="اسم الحلقة" />
                                <button onClick={() => { setPage('home'); window.showGlobalAlert('نجاح', 'تم حفظ البيانات بنجاح ✅'); }} className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black shadow-lg hover:bg-emerald-700 transition">حفظ وتفعيل</button>
                            </div>
                        </div>
                    )}
                </ErrorBoundary>
            </main>

            <footer className="p-4 text-center bg-white border-t text-[10px] text-gray-400 font-bold fixed bottom-0 w-full z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                &copy; 2026 {config.texts?.siteTitle} | الإصدار المطور
            </footer>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
