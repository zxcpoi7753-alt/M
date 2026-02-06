/* =========================================
   ملف الإدارة الرئيسي: js/admin.js (الهيكلة الجديدة)
   ========================================= */

const { useState, useEffect } = React;
const { db, doc, onSnapshot, setDoc } = window;

// استيراد المكونات الفرعية (يفترض أنك أضفتها في admin.html)
// NewsAdmin, TeachersAdmin, SchedulesAdmin, HalaqatAdmin, SettingsAdmin

// مكون القسم القابل للطي (مشترك)
const AdminSection = ({ id, title, activeTab, setActiveTab, children }) => (
    <div className="bg-white border border-gray-200 mb-4 rounded-xl shadow-sm overflow-hidden animate-in">
        <div onClick={() => setActiveTab(activeTab === id ? null : id)} className={`p-4 flex justify-between items-center cursor-pointer transition-colors ${activeTab === id ? 'bg-emerald-50 text-emerald-900 border-b border-emerald-100' : 'hover:bg-gray-50'}`}>
            <span className="font-bold text-lg flex items-center gap-2">{title}</span>
            <span className="text-gray-400 bg-gray-100 px-2 rounded text-xs">{activeTab === id ? 'إغلاق ▲' : 'فتح ▼'}</span>
        </div>
        {activeTab === id && <div className="p-5 bg-gray-50/50">{children}</div>}
    </div>
);

const AdminApp = () => {
    // 1. هيكل البيانات
    const [config, setConfig] = useState({
        settings: { layoutScale: 1 },
        texts: { siteTitle: '', contact: {} },
        news: [], teachers: [], halaqat: [], schedules: []
    });
    
    const [status, setStatus] = useState('..');
    const [activeTab, setActiveTab] = useState(null);
    const [toast, setToast] = useState(null);

    // 2. الاتصال
    useEffect(() => {
        if (!window.db) { setStatus('خطأ اتصال'); return; }
        const unsub = window.onSnapshot(window.doc(window.db, "appData", "mainConfig"), (d) => {
            if (d.exists()) {
                setConfig(prev => ({ ...prev, ...d.data() }));
                setStatus('متصل ✅');
            }
        });
        return () => unsub();
    }, []);

    // 3. الحفظ
    const handleSave = async () => {
        setStatus('جاري الحفظ...');
        try {
            await window.setDoc(window.doc(window.db, "appData", "mainConfig"), config);
            setToast('✅ تم الحفظ');
            setStatus('متصل ✅');
        } catch (e) { setToast('❌ فشل'); setStatus('خطأ'); }
        setTimeout(() => setToast(null), 2000);
    };

    // --- دوال التحكم العامة ---
    const addItem = (list, item) => setConfig(prev => ({ ...prev, [list]: [item, ...prev[list]] }));
    const updateItem = (list, id, key, val) => setConfig(prev => ({ ...prev, [list]: prev[list].map(i => i.id === id ? { ...i, [key]: val } : i) }));
    const updateDeepItem = (list, id, parentKey, key, val) => setConfig(prev => ({ ...prev, [list]: prev[list].map(i => i.id === id ? { ...i, [parentKey]: { ...i[parentKey], [key]: val } } : i) }));
    const toggleHidden = (list, id) => setConfig(prev => ({ ...prev, [list]: prev[list].map(i => i.id === id ? { ...i, hidden: !i.hidden } : i) }));
    const deleteItem = (list, id) => { if(confirm('حذف؟')) setConfig(prev => ({ ...prev, [list]: prev[list].filter(i => i.id !== id) })); };

    return (
        <div className="p-4 pb-32 max-w-4xl mx-auto font-cairo">
            <div className="flex justify-between items-center mb-6 sticky top-2 z-50 bg-white/90 backdrop-blur p-3 rounded-2xl shadow-md border border-gray-200">
                <h1 className="text-xl font-black text-emerald-800">⚙️ لوحة التحكم <span className="text-xs bg-emerald-100 px-2 rounded-full">{status}</span></h1>
                <button onClick={handleSave} className="bg-emerald-600 text-white px-6 py-2 rounded-xl font-bold shadow hover:bg-emerald-700">💾 حفظ</button>
            </div>
            
            {toast && <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-full font-bold shadow-2xl z-50 animate-bounce">{toast}</div>}

            <AdminSection id="sets" title="🛠️ الإعدادات والنصوص" activeTab={activeTab} setActiveTab={setActiveTab}>
                <SettingsAdmin config={config} setConfig={setConfig} />
            </AdminSection>

            <AdminSection id="news" title="📰 الأخبار" activeTab={activeTab} setActiveTab={setActiveTab}>
                <NewsAdmin news={config.news} addItem={addItem} updateItem={updateItem} updateDeepItem={updateDeepItem} toggleHidden={toggleHidden} deleteItem={deleteItem} />
            </AdminSection>

            <AdminSection id="teachers" title="👨‍🏫 المعلمون" activeTab={activeTab} setActiveTab={setActiveTab}>
                <TeachersAdmin teachers={config.teachers} addItem={addItem} updateItem={updateItem} toggleHidden={toggleHidden} deleteItem={deleteItem} />
            </AdminSection>

            <AdminSection id="sch" title="📅 الجداول" activeTab={activeTab} setActiveTab={setActiveTab}>
                <SchedulesAdmin schedules={config.schedules} addItem={addItem} toggleHidden={toggleHidden} deleteItem={deleteItem} setConfig={setConfig} />
            </AdminSection>

            <AdminSection id="top" title="🏆 الأوائل" activeTab={activeTab} setActiveTab={setActiveTab}>
                <HalaqatAdmin halaqat={config.halaqat} addItem={addItem} toggleHidden={toggleHidden} deleteItem={deleteItem} setConfig={setConfig} />
            </AdminSection>

            <button onClick={() => { sessionStorage.removeItem('thuraya_admin_auth'); window.location.href = "index.html"; }} className="w-full py-4 mt-8 bg-red-50 text-red-600 rounded-2xl font-black border border-red-100 hover:bg-red-100">خروج 🔒</button>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('admin-root'));
root.render(<AdminApp />);
