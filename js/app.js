/* =========================================
   ملف التطبيق الرئيسي: js/app.js
   (تم تنظيمه وفصل واحة الزوار في دالة مستقلة)
   ========================================= */

const { useState, useEffect } = React;

// استيراد المكونات الآمنة
const safeImport = (name) => window[name] || (() => null);

// المكونات الفرعية
const CalcEffort = safeImport('CalcEffort');
const CalcTime = safeImport('CalcTime');
const TestHifz = safeImport('TestHifz');
const QuranReader = safeImport('QuranReader');
const AzkarApp = safeImport('AzkarApp');
const CustomModal = window.CustomModal; 
const DailyWird = safeImport('DailyWird');
const QuranExam = safeImport('QuranExam');

// مكونات الصفحات
const HomeSection = safeImport('HomeSection');
const TeachersSection = safeImport('TeachersSection');
const SchedulesSection = safeImport('SchedulesSection');
const AboutSection = safeImport('AboutSection');

// --------------------------------------------------------------------------
// (1) دالة قسم واحة الزوار (Extras Section)
// [بداية الدالة رقم 1] - لتسهيل التعديل المستقبلي
// --------------------------------------------------------------------------
const ExtrasSection = ({ dataReady, activeFeature, toggleFeature }) => {
    return (
        <div className="space-y-4 max-w-lg mx-auto animate-in">
            <h2 className="text-center font-black text-2xl text-emerald-800 mb-2">🌱 واحة الزوار</h2>
            
            {/* يظهر دائماً */}
            {window.VirtuousTimesWidget && <window.VirtuousTimesWidget />}
            
            {/* يظهر دائماً (والتعليق يتم داخله) */}
            {window.DailyWird && <window.DailyWird />}

            {/* يظهر دائماً */}
            {window.GlobalKhatmaCounter && <window.GlobalKhatmaCounter />}

            <div onClick={() => toggleFeature('feeling')} className={`student-btn ${activeFeature === 'feeling' ? 'active' : ''} border-emerald-200 bg-emerald-50`}><span>💊 صيدلية القلوب</span><span>{activeFeature === 'feeling'?'➖':'➕'}</span></div>
            {activeFeature === 'feeling' && <window.FeelingsPharmacy />}
            
            {/* المحاكي القرآني: أزلنا شرط dataReady من هنا ليظهر الزر دائماً */}
            {window.QuranExam && <window.QuranExam />}

            <div onClick={() => toggleFeature('card')} className={`student-btn ${activeFeature === 'card' ? 'active' : ''} border-blue-200 bg-blue-50`}><span>🎨 صانع البطاقات</span><span>{activeFeature === 'card'?'➖':'➕'}</span></div>
            {activeFeature === 'card' && <window.CardMaker />}
        </div>
    );
};

// --------------------------------------------------------------------------
// [نهاية الدالة رقم 1]
// --------------------------------------------------------------------------


const App = () => {
    // --- الحالة (State) ---
    const [config, setConfig] = useState({ texts: { siteTitle: '...', contact: {} }, news: [], teachers: [], halaqat: [], schedules: [] });
    const [page, setPage] = useState('home');
    const [activeFeature, setActiveFeature] = useState(null);
    const [dataReady, setDataReady] = useState(false);
    
    // بيانات الطالب
    const [studentName, setStudentName] = useState(localStorage.getItem('st_name') || '');
    const [halaqaName, setHalaqaName] = useState(localStorage.getItem('st_halaqa') || '');
    
    // النافذة المنبثقة
    const [modal, setModal] = useState({ show: false, title: '', msg: '' });

    // --- التأثيرات (Effects) ---
    useEffect(() => {
        // تفعيل النافذة الأنيقة بدلاً من alert
        window.alert = (message) => setModal({ show: true, title: 'تنبيه', msg: message });
        window.showGlobalAlert = (title, msg) => setModal({ show: true, title, msg });

        // الاستماع لجاهزية البيانات
        const handleDataReady = () => setDataReady(true);
        window.addEventListener('data-ready', handleDataReady);
        if (window.APP_DATA && window.APP_DATA.isReady) setDataReady(true);

        // جلب الإعدادات من Firebase
        if (window.db && window.onSnapshot && window.doc) {
            window.onSnapshot(window.doc(window.db, "appData", "mainConfig"), (doc) => {
                if (doc.exists()) {
                    setConfig(prev => ({...prev, ...doc.data()}));
                    if(doc.data().settings?.layoutScale) document.documentElement.style.setProperty('--layout-scale', doc.data().settings.layoutScale);
                }
            });
        }
        return () => window.removeEventListener('data-ready', handleDataReady);
    }, []);

    // نظام الإشعارات
    useEffect(() => {
        if (!window.db) return;
        const unsub = window.onSnapshot(window.doc(window.db, "appData", "notifications"), (doc) => {
            if (doc.exists()) {
                const data = doc.data();
                const lastMsgId = localStorage.getItem('last_notification_id');
                if (data.id && data.id !== lastMsgId && data.active) {
                    if(window.showGlobalAlert) window.showGlobalAlert(data.title, data.body);
                    if (Notification.permission === 'granted') new Notification(data.title, { body: data.body, icon: 'icon-192.png' });
                    localStorage.setItem('last_notification_id', data.id);
                }
            }
        });
        return () => unsub();
    }, []);

    const toggleFeature = (name) => setActiveFeature(activeFeature === name ? null : name);

    return (
        <div id="app-container">
            {/* النافذة العامة */}
            {window.CustomModal && (
                <CustomModal isOpen={modal.show} onClose={() => setModal({ ...modal, show: false })} title={modal.title}>
                    <p className="font-bold text-gray-700 leading-relaxed whitespace-pre-line">{modal.msg}</p>
                </CustomModal>
            )}

            {/* الهيدر */}
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

            {/* القائمة العلوية */}
            <nav className="no-scrollbar">
                {['home','student_corner','extras','teachers','students','schedules','about','card'].map(t => (
                    <button key={t} onClick={() => setPage(t)} className={page === t ? 'active' : ''}>
                        {{
                            home:'الرئيسية', student_corner:'ركن الطالب', extras:'واحة الزوار',
                            teachers:'المعلمون', students:'الأوائل', schedules:'الجداول',
                            about:'من نحن', card:'بطاقتي'
                        }[t]}
                    </button>
                ))}
            </nav>

            <main className="p-4 pb-24 animate-in">
                {/* 1. الرئيسية */}
                {page === 'home' && <HomeSection config={config} studentName={studentName} showGlobalAlert={window.showGlobalAlert} setPage={setPage} />}

                {/* 2. ركن الطالب */}
                {page === 'student_corner' && (
                    <div className="space-y-4 max-w-lg mx-auto">
                        <div onClick={() => toggleFeature('effort')} className={`student-btn ${activeFeature === 'effort' ? 'active' : ''}`}><span>📅 خطة ختمي</span><span>{activeFeature === 'effort'?'➖':'➕'}</span></div>{activeFeature === 'effort' && <CalcEffort />}
                        <div onClick={() => toggleFeature('time')} className={`student-btn ${activeFeature === 'time' ? 'active' : ''}`}><span>🎯 دليل الختم</span><span>{activeFeature === 'time'?'➖':'➕'}</span></div>{activeFeature === 'time' && <CalcTime />}
                        
                        <div onClick={() => toggleFeature('test')} className={`student-btn ${activeFeature === 'test' ? 'active' : ''}`}><span>🧠 اختبر حفظك (قديم)</span><span>{activeFeature === 'test'?'➖':'➕'}</span></div>
                        {activeFeature === 'test' && (dataReady ? <TestHifz /> : <div className="text-center p-4 text-gray-400 animate-pulse">⏳ جاري تحميل بيانات الاختبار...</div>)}
                        
                        <div onClick={() => toggleFeature('quran')} className={`student-btn ${activeFeature === 'quran' ? 'active' : ''}`}><span>📖 المصحف الشريف</span><span>{activeFeature === 'quran'?'➖':'➕'}</span></div>
                        {activeFeature === 'quran' && (dataReady ? <QuranReader /> : <div className="text-center p-4 text-gray-400 animate-pulse">⏳ جاري تحميل المصحف...</div>)}
                        
                        <div onClick={() => toggleFeature('azkar')} className={`student-btn ${activeFeature === 'azkar' ? 'active' : ''}`}><span>📿 الأذكار</span><span>{activeFeature === 'azkar'?'➖':'➕'}</span></div>
                        {activeFeature === 'azkar' && (dataReady ? <AzkarApp /> : <div className="text-center p-4 text-gray-400 animate-pulse">⏳ جاري تحميل الأذكار...</div>)}
                    </div>
                )}

                {/* 3. واحة الزوار (استخدام الدالة المنفصلة هنا) ✅ */}
                {page === 'extras' && (
                    <ExtrasSection 
                        dataReady={dataReady} 
                        activeFeature={activeFeature} 
                        toggleFeature={toggleFeature} 
                    />
                )}

                {/* 4. المعلمون */}
                {page === 'teachers' && <TeachersSection teachers={config.teachers} />}

                {/* 5. الجداول */}
                {page === 'schedules' && <SchedulesSection schedules={config.schedules} />}

                {/* 6. الأوائل */}
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

                {/* 7. من نحن */}
                {page === 'about' && <AboutSection texts={config.texts} />}

                {/* 8. بطاقتي */}
                {page === 'card' && (
                    <div className="max-w-md mx-auto space-y-6 animate-in">
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl text-center border-4 border-emerald-50">
                            <h2 className="text-2xl font-black mb-6">بيانات الطالب</h2>
                            <input value={studentName} onChange={e => {setStudentName(e.target.value); localStorage.setItem('st_name', e.target.value)}} className="w-full p-4 bg-gray-50 border rounded-2xl mb-3 text-center font-bold" placeholder="الاسم الثلاثي" />
                            <input value={halaqaName} onChange={e => {setHalaqaName(e.target.value); localStorage.setItem('st_halaqa', e.target.value)}} className="w-full p-4 bg-gray-50 border rounded-2xl mb-6 text-center font-bold" placeholder="اسم الحلقة" />
                            <button onClick={() => { setPage('home'); window.alert('تم حفظ البيانات بنجاح ✅'); }} className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black shadow-lg hover:bg-emerald-700 transition">حفظ وتفعيل</button>
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
