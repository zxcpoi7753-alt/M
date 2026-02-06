/* =========================================
   ملف الإدارة: js/admin.js (الإصدار المستقر V6)
   الوظيفة: واجهة فورية + إصلاح منصات التواصل
   ========================================= */

import { db, doc, onSnapshot, setDoc } from './firebase.js';
const { useState, useEffect } = React;

const AdminSection = ({ id, title, activeTab, setActiveTab, children }) => (
    <div className="bg-white border border-gray-100 mb-3 rounded-xl shadow-sm overflow-hidden">
        <div onClick={() => setActiveTab(activeTab === id ? null : id)} className={`p-4 flex justify-between items-center cursor-pointer ${activeTab === id ? 'bg-emerald-50 text-emerald-800' : 'hover:bg-gray-50'}`}>
            <span className="font-bold">{title}</span>
            <span className="text-gray-400">{activeTab === id ? '▲' : '▼'}</span>
        </div>
        {activeTab === id && <div className="p-4 border-t border-gray-100">{children}</div>}
    </div>
);

const AdminApp = () => {
    // البيانات الافتراضية تظهر فوراً لتجنب الدوران اللانهائي
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
    
    const [status, setStatus] = useState('idle'); // idle, saving, error
    const [activeTab, setActiveTab] = useState(null);
    const [toast, setToast] = useState(null);

    // محاولة الاتصال بالبيانات
    useEffect(() => {
        try {
            const unsub = onSnapshot(doc(db, "appData", "mainConfig"), (docSnapshot) => {
                if (docSnapshot.exists()) {
                    const data = docSnapshot.data();
                    // دمج البيانات (Deep Merge) لضمان وجود كائن contact
                    setConfig(prev => ({ 
                        ...prev, ...data,
                        texts: { ...prev.texts, ...data.texts, contact: { ...prev.texts.contact, ...data.texts.contact } } 
                    }));
                }
            }, (err) => {
                console.warn("Offline Mode or Permission Error:", err);
                setToast("⚠️ وضع عدم الاتصال (أو خطأ صلاحيات)");
            });
            return () => unsub();
        } catch (e) {
            console.error("Firebase Init Error", e);
        }
    }, []);

    const handleSave = async () => {
        setStatus('saving');
        try {
            await setDoc(doc(db, "appData", "mainConfig"), config);
            setToast('✅ تم الحفظ');
        } catch (e) {
            setToast('❌ فشل الحفظ');
        }
        setTimeout(() => { setStatus('idle'); setToast(null); }, 2000);
    };

    // دوال مساعدة للقوائم
    const addToList = (list, item) => setConfig(prev => ({ ...prev, [list]: [item, ...prev[list]] }));
    const updateList = (list, id, key, val) => setConfig(prev => ({ ...prev, [list]: prev[list].map(i => i.id === id ? { ...i, [key]: val } : i) }));
    const deleteFromList = (list, id) => { if(confirm('حذف؟')) setConfig(prev => ({ ...prev, [list]: prev[list].filter(i => i.id !== id) })) };

    return (
        <div id="app-container" className="p-4 pb-24 max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-6 mt-4">
                <h1 className="text-2xl font-black text-emerald-800">⚙️ الإدارة</h1>
                <button onClick={handleSave} className="bg-emerald-600 text-white px-6 py-2 rounded-xl font-bold shadow disabled:opacity-50" disabled={status==='saving'}>
                    {status === 'saving' ? 'جاري الحفظ...' : '💾 حفظ'}
                </button>
            </div>

            {toast && <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-2 rounded-full font-bold shadow-xl z-50 text-sm animate-bounce">{toast}</div>}

            {/* الأقسام */}
            <AdminSection id="txt" title="📝 النصوص الأساسية" activeTab={activeTab} setActiveTab={setActiveTab}>
                <input className="w-full p-3 border rounded-xl mb-2 text-sm" placeholder="اسم الموقع" value={config.texts.siteTitle} onChange={e=>setConfig({...config, texts:{...config.texts, siteTitle:e.target.value}})} />
                <textarea className="w-full p-3 border rounded-xl h-20 text-sm" placeholder="رسالة الطالب" value={config.texts.studentMsg} onChange={e=>setConfig({...config, texts:{...config.texts, studentMsg:e.target.value}})} />
                <textarea className="w-full p-3 border rounded-xl h-20 text-sm mt-2" placeholder="سؤال الأسبوع" value={config.texts.weeklyQuestion} onChange={e=>setConfig({...config, texts:{...config.texts, weeklyQuestion:e.target.value}})} />
            </AdminSection>

            <AdminSection id="news" title="📰 الأخبار" activeTab={activeTab} setActiveTab={setActiveTab}>
                <button onClick={()=>addToList('news', {id:Date.now(), title:'خبر جديد', content:'', hidden:false})} className="w-full bg-emerald-50 text-emerald-700 py-2 rounded-xl font-bold mb-2 text-sm">+ خبر</button>
                {config.news.map(n => (
                    <div key={n.id} className="border p-3 rounded-xl mb-2 bg-white">
                        <input className="w-full font-bold mb-1 border-b text-sm" value={n.title} onChange={e=>updateList('news', n.id, 'title', e.target.value)} />
                        <textarea className="w-full text-xs h-16 bg-gray-50 p-1" value={n.content} onChange={e=>updateList('news', n.id, 'content', e.target.value)} />
                        <div className="flex justify-between mt-1">
                            <button onClick={()=>updateList('news', n.id, 'hidden', !n.hidden)} className="text-xs text-amber-600 font-bold">{n.hidden?'عرض':'إخفاء'}</button>
                            <button onClick={()=>deleteFromList('news', n.id)} className="text-xs text-red-500 font-bold">حذف</button>
                        </div>
                    </div>
                ))}
            </AdminSection>

            <AdminSection id="contact" title="🔗 منصات التواصل (من نحن)" activeTab={activeTab} setActiveTab={setActiveTab}>
                <div className="space-y-2">
                    <div className="flex items-center gap-2"><span className="w-20 text-xs font-bold">واتساب:</span><input className="flex-1 p-2 border rounded text-xs" value={config.texts.contact.phone} onChange={e=>setConfig({...config, texts:{...config.texts, contact:{...config.texts.contact, phone:e.target.value}}})} /></div>
                    <div className="flex items-center gap-2"><span className="w-20 text-xs font-bold">الموقع:</span><input className="flex-1 p-2 border rounded text-xs" value={config.texts.contact.location} onChange={e=>setConfig({...config, texts:{...config.texts, contact:{...config.texts.contact, location:e.target.value}}})} /></div>
                    <div className="flex items-center gap-2"><span className="w-20 text-xs font-bold">يوتيوب:</span><input className="flex-1 p-2 border rounded text-xs" value={config.texts.contact.youtube} onChange={e=>setConfig({...config, texts:{...config.texts, contact:{...config.texts.contact, youtube:e.target.value}}})} /></div>
                    <div className="flex items-center gap-2"><span className="w-20 text-xs font-bold">فيسبوك:</span><input className="flex-1 p-2 border rounded text-xs" value={config.texts.contact.facebook} onChange={e=>setConfig({...config, texts:{...config.texts, contact:{...config.texts.contact, facebook:e.target.value}}})} /></div>
                    <div className="flex items-center gap-2"><span className="w-20 text-xs font-bold">انستقرام:</span><input className="flex-1 p-2 border rounded text-xs" value={config.texts.contact.instagram} onChange={e=>setConfig({...config, texts:{...config.texts, contact:{...config.texts.contact, instagram:e.target.value}}})} /></div>
                </div>
                <textarea className="w-full p-2 border rounded mt-3 text-xs h-20" placeholder="نص من نحن..." value={config.texts.aboutMain} onChange={e=>setConfig({...config, texts:{...config.texts, aboutMain:e.target.value}})} />
            </AdminSection>

            <AdminSection id="teachers" title="👨‍🏫 المعلمون" activeTab={activeTab} setActiveTab={setActiveTab}>
                <button onClick={()=>addToList('teachers', {id:Date.now(), name:'معلم', bio:'', avatar:'🧔'})} className="w-full bg-blue-50 text-blue-700 py-2 rounded-xl font-bold mb-2 text-sm">+ معلم</button>
                {config.teachers.map(t => (
                    <div key={t.id} className="border p-2 rounded-xl mb-2 flex gap-2 items-start">
                        <input className="w-10 p-1 border rounded text-center" value={t.avatar} onChange={e=>updateList('teachers', t.id, 'avatar', e.target.value)} />
                        <div className="flex-1">
                            <input className="w-full font-bold text-sm border-b" value={t.name} onChange={e=>updateList('teachers', t.id, 'name', e.target.value)} />
                            <input className="w-full text-xs text-gray-500" value={t.bio} onChange={e=>updateList('teachers', t.id, 'bio', e.target.value)} />
                        </div>
                        <button onClick={()=>deleteFromList('teachers', t.id)} className="text-red-500 font-bold text-xs">×</button>
                    </div>
                ))}
            </AdminSection>

            <button onClick={() => { sessionStorage.removeItem('thuraya_admin_auth'); window.location.href = "index.html"; }} className="w-full py-3 mt-6 bg-red-50 text-red-600 rounded-xl font-bold border border-red-100 text-sm">تسجيل خروج 🔒</button>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('admin-root'));
root.render(<AdminApp />);
