/* =========================================
   ملف الإدارة السريع: js/admin.js
   الوظيفة: واجهة فورية (No Loading Screen)
   ========================================= */

import { db, doc, onSnapshot, setDoc } from './firebase.js';
const { useState, useEffect } = React;

const AdminSection = ({ id, title, activeTab, setActiveTab, children }) => (
    <div className="admin-card bg-white border border-gray-100 mb-3 rounded-xl shadow-sm overflow-hidden">
        <div onClick={() => setActiveTab(activeTab === id ? null : id)} className={`p-4 flex justify-between items-center cursor-pointer ${activeTab === id ? 'bg-emerald-50 text-emerald-800' : 'hover:bg-gray-50'}`}>
            <span className="font-bold">{title}</span>
            <span className="text-gray-400">{activeTab === id ? '▲' : '▼'}</span>
        </div>
        {activeTab === id && <div className="p-4 border-t border-gray-100 bg-white">{children}</div>}
    </div>
);

const AdminApp = () => {
    // 1. بيانات افتراضية تظهر فوراً (بدون انتظار)
    const [config, setConfig] = useState({
        settings: { layoutScale: 1 },
        texts: { 
            siteTitle: 'جاري التحميل...', 
            heroTitle: '...', 
            contact: {}, 
            studentMsg: '', weeklyQuestion: '' 
        },
        news: [], teachers: [], halaqat: [], schedules: []
    });
    
    const [isSyncing, setIsSyncing] = useState(true);
    const [activeTab, setActiveTab] = useState(null);
    const [toast, setToast] = useState(null);

    // 2. جلب البيانات في الخلفية
    useEffect(() => {
        const unsub = onSnapshot(doc(db, "appData", "mainConfig"), (docSnapshot) => {
            if (docSnapshot.exists()) {
                const data = docSnapshot.data();
                setConfig(prev => ({ 
                    ...prev, 
                    ...data,
                    texts: { ...prev.texts, ...data.texts, contact: { ...prev.texts.contact, ...data.texts.contact } } 
                }));
            }
            setIsSyncing(false); // انتهى التحميل
        }, (err) => {
            console.error("Connection Error", err);
            setIsSyncing(false);
        });
        return () => unsub();
    }, []);

    const handleSave = async () => {
        setIsSyncing(true);
        try {
            await setDoc(doc(db, "appData", "mainConfig"), config);
            setToast('✅ تم الحفظ');
        } catch (e) { setToast('❌ خطأ'); }
        setTimeout(() => { setIsSyncing(false); setToast(null); }, 1000);
    };

    // 3. العرض الفوري (بدون شاشة تحميل)
    return (
        <div id="app-container" className="p-4 pb-24 max-w-3xl mx-auto">
            {/* شريط حالة الاتصال */}
            <div className={`fixed top-0 left-0 w-full h-1 ${isSyncing ? 'bg-emerald-500 animate-pulse' : 'bg-transparent'} z-50`}></div>

            <div className="flex justify-between items-center mb-6 mt-2">
                <h1 className="text-2xl font-black text-emerald-800">⚙️ الإدارة</h1>
                <button onClick={handleSave} className="bg-emerald-600 text-white px-6 py-2 rounded-xl font-bold shadow hover:bg-emerald-700 transition disabled:opacity-50" disabled={isSyncing}>
                    {isSyncing ? '⏳' : 'حفظ'}
                </button>
            </div>

            {toast && <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-6 py-2 rounded-full font-bold shadow-xl z-50 animate-bounce">{toast}</div>}

            {/* الأقسام */}
            <AdminSection id="txt" title="📝 النصوص الأساسية" activeTab={activeTab} setActiveTab={setActiveTab}>
                <input className="w-full p-3 border rounded-xl mb-2" placeholder="اسم الموقع" value={config.texts.siteTitle} onChange={e=>setConfig({...config, texts:{...config.texts, siteTitle:e.target.value}})} />
                <textarea className="w-full p-3 border rounded-xl h-20 mb-2" placeholder="رسالة الطالب" value={config.texts.studentMsg} onChange={e=>setConfig({...config, texts:{...config.texts, studentMsg:e.target.value}})} />
                <textarea className="w-full p-3 border rounded-xl h-20" placeholder="سؤال الأسبوع" value={config.texts.weeklyQuestion} onChange={e=>setConfig({...config, texts:{...config.texts, weeklyQuestion:e.target.value}})} />
            </AdminSection>

            <AdminSection id="news" title="📰 الأخبار" activeTab={activeTab} setActiveTab={setActiveTab}>
                <button onClick={()=>setConfig({...config, news:[{id:Date.now(), title:'خبر جديد', content:'', hidden:false}, ...config.news]})} className="w-full bg-emerald-50 text-emerald-700 py-3 rounded-xl font-bold mb-3">+ إضافة خبر</button>
                {config.news.map(n => (
                    <div key={n.id} className="border p-3 rounded-xl mb-2">
                        <input className="w-full font-bold mb-1 border-b" value={n.title} onChange={e=>{const ns=[...config.news]; ns.find(x=>x.id==n.id).title=e.target.value; setConfig({...config, news:ns})}} />
                        <textarea className="w-full text-sm h-16" value={n.content} onChange={e=>{const ns=[...config.news]; ns.find(x=>x.id==n.id).content=e.target.value; setConfig({...config, news:ns})}} />
                        <div className="flex justify-between mt-2">
                             <button onClick={()=>{const ns=[...config.news]; ns.find(x=>x.id==n.id).hidden=!n.hidden; setConfig({...config, news:ns})}} className="text-xs font-bold text-amber-600">{n.hidden?'إظهار':'إخفاء'}</button>
                             <button onClick={()=>{setConfig({...config, news:config.news.filter(x=>x.id!==n.id)})}} className="text-red-500 text-xs font-bold">حذف 🗑️</button>
                        </div>
                    </div>
                ))}
            </AdminSection>

            <AdminSection id="contact" title="🔗 روابط التواصل" activeTab={activeTab} setActiveTab={setActiveTab}>
                <div className="grid gap-2">
                    <input className="p-2 border rounded" placeholder="واتساب" value={config.texts.contact.phone} onChange={e=>setConfig({...config, texts:{...config.texts, contact:{...config.texts.contact, phone:e.target.value}}})} />
                    <input className="p-2 border rounded" placeholder="يوتيوب" value={config.texts.contact.youtube} onChange={e=>setConfig({...config, texts:{...config.texts, contact:{...config.texts.contact, youtube:e.target.value}}})} />
                    <input className="p-2 border rounded" placeholder="فيسبوك" value={config.texts.contact.facebook} onChange={e=>setConfig({...config, texts:{...config.texts, contact:{...config.texts.contact, facebook:e.target.value}}})} />
                    <input className="p-2 border rounded" placeholder="انستقرام" value={config.texts.contact.instagram} onChange={e=>setConfig({...config, texts:{...config.texts, contact:{...config.texts.contact, instagram:e.target.value}}})} />
                </div>
            </AdminSection>
            
            <p className="text-center text-gray-400 text-xs mt-8 pb-8">V3 Final Admin Panel</p>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('admin-root'));
root.render(<AdminApp />);
