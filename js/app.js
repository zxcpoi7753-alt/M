/* =========================================
   ملف التطبيق الرئيسي: js/app.js
   (نسخة الطوارئ - تم تعطيل الميزات الجديدة مؤقتاً)
   ========================================= */

const { useState, useEffect, Component } = React;

// صائد الأخطاء البسيط
class ErrorBoundary extends Component {
    constructor(props) { super(props); this.state = { hasError: false }; }
    static getDerivedStateFromError(error) { return { hasError: true }; }
    componentDidCatch(error, info) { console.error("Error:", error); }
    render() { if (this.state.hasError) return <div className="text-red-500 text-center p-4">حدث خطأ بسيط</div>; return this.props.children; }
}

// دالة استيراد آمنة
const getComponent = (name) => window[name] || (() => <div className="text-gray-400 text-xs text-center py-2">جاري التحميل...</div>);

// استيراد المكونات الأساسية فقط
const HomeSection = getComponent('HomeSection');
const TeachersSection = getComponent('TeachersSection');
const SchedulesSection = getComponent('SchedulesSection');
const AboutSection = getComponent('AboutSection');

const CalcEffort = getComponent('CalcEffort');
const CalcTime = getComponent('CalcTime');
const TestHifz = getComponent('TestHifz');
const QuranReader = getComponent('QuranReader');
const AzkarApp = getComponent('AzkarApp');
const DailyWird = getComponent('DailyWird');
const VirtuousTimesWidget = getComponent('VirtuousTimesWidget');
const FeelingsPharmacy = getComponent('FeelingsPharmacy');
const CardMaker = getComponent('CardMaker');
const GlobalKhatmaCounter = getComponent('GlobalKhatmaCounter');
const QuranExam = getComponent('QuranExam');
const TafseerExam = getComponent('TafseerExam');
const CustomModal = window.CustomModal;

// ❌ تم تعطيل روضة المحبين مؤقتاً لحل المشكلة
const RawdatHub = () => <div className="p-10 text-center text-amber-600 font-bold bg-amber-50 rounded-xl border border-amber-200">🛠️ قسم روضة المحبين تحت الصيانة...</div>;

const App = () => {
    const [config, setConfig] = useState({ texts: {}, visibility: {} });
    const [page, setPage] = useState('home');
    const [activeFeature, setActiveFeature] = useState(null);
    const [studentName, setStudentName] = useState(localStorage.getItem('st_name') || '');
    const [halaqaName, setHalaqaName] = useState(localStorage.getItem('st_halaqa') || '');
    const [modal, setModal] = useState({ show: false, title: '', msg: '' });

    // إعدادات بسيطة
    useEffect(() => {
        window.alert = (msg) => setModal({ show: true, title: 'تنبيه', msg });
        window.showGlobalAlert = (title, msg) => setModal({ show: true, title, msg });

        if (window.db && window.onSnapshot) {
            try {
                window.onSnapshot(window.doc(window.db, "appData", "mainConfig"), (d) => {
                    if (d.exists()) setConfig(prev => ({ ...prev, ...d.data() }));
                });
            } catch (e) { console.log("Offline Mode"); }
        }
    }, []);

    const toggleFeature = (name) => setActiveFeature(activeFeature === name ? null : name);
    const isVisible = (section, key) => config.visibility?.[section]?.[key] !== false;

    // القائمة (بدون الزر الجديد مؤقتاً إذا كان يسبب المشكلة)
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
                    
                    {/* عرض المكون المؤقت */}
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
