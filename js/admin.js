/* =========================================
   ملف الإدارة السريع: js/admin.js
   الوظيفة: واجهة فورية (No Loading Screen) مع مزامنة خلفية
   ========================================= */

import { db, doc, onSnapshot, setDoc } from './firebase.js';
const { useState, useEffect } = React;

// مكون القسم القابل للطي
const AdminSection = ({ id, title, activeTab, setActiveTab, children }) => (
    <div className="admin-card bg-white border border-gray-100 mb-3 rounded-xl shadow-sm overflow-hidden animate-in">
        <div 
            onClick={() => setActiveTab(activeTab === id ? null : id)} 
            className={`p-4 flex justify-between items-center cursor-pointer transition-colors ${activeTab === id ? 'bg-emerald-50 text-emerald-800' : 'hover:bg-gray-50'}`}
        >
            <span className="font-bold flex items-center gap-2">
                {title}
            </span>
            <span className="text-gray-400 text-xs">{activeTab === id ? '▲' : '▼'}</span>
        </div>
        {activeTab === id && <div className="p-4 border-t border-gray-100 bg-white">{children}</div>}
    </div>
);

const AdminApp = () => {
    // 1. بيانات افتراضية تظهر فوراً (تمنع الشاشة البيضاء)
    const [config, setConfig] = useState({
        settings: { layoutScale: 1 },
        texts: { 
            siteTitle: 'حلقات الثريا', 
            heroTitle: 'أهلاً بكم', 
            heroSubtitle: '',
            contact: { phone: '', location: '', youtube: '', facebook: '', instagram: '' }, 
            studentMsg: '', 
            weeklyQuestion: '',
            aboutMain: '', aboutAyah: '', aboutFooter: ''
        },
        news: [], teachers: [], halaqat: [], schedules: []
    });
    
    // حالة الاتصال (للعرض فقط)
    const [status, setStatus] = useState('connecting'); // connecting, idle, saving
    const [activeTab, setActiveTab] = useState(null);
    const [toast, setToast] = useState(null);

    // 2. جلب البيانات في الخلفية
    useEffect(() => {
        const unsub = onSnapshot(doc(db, "appData", "mainConfig"), (docSnapshot) => {
            if (docSnapshot.exists()) {
                const data = docSnapshot.data();
                // دمج ذكي للبيانات لضمان عدم فقدان الحقول الجديدة
                setConfig(prev => ({ 
                    ...prev, 
                    ...data,
                    texts: { 
                        ...prev.texts, 
                        ...data.texts, 
                        contact: { ...prev.texts.contact, ...data.texts.contact } 
                    } 
                }));
            }
            setStatus('idle'); // انتهى التحميل وأصبح جاهزاً
        }, (err) => {
            console.error("Connection Error", err);
            setToast('⚠️ العمل في وضع عدم الاتصال');
            setStatus('idle');
        });
        return () => unsub();
    }, []);

    // الحفظ
    const handleSave = async () => {
        setStatus('saving');
        try {
            await setDoc(doc(db, "appData", "mainConfig"), config);
            setToast('✅ تم حفظ التعديلات');
        } catch (e) { 
            console.error(e);
            setToast('❌ فشل الحفظ! تأكد من الإنترنت'); 
        }
        setTimeout(() => { setStatus('idle'); setToast(null); }, 2000);
    };

    // إضافة عنصر جديد للقوائم
    const addItem = (listName, itemTemplate) => {
        setConfig(prev => ({
            ...prev,
            [listName]: [itemTemplate, ...prev[listName]]
        }));
    };

    // حذف عنصر
    const deleteItem = (listName, id) => {
        if(!confirm('هل أنت متأكد من الحذف؟')) return;
        setConfig(prev => ({
            ...prev,
            [listName]: prev[listName].filter(item => item.id !== id)
        }));
    };

    // 3. العرض الفوري
    return (
        <div id="app-container" className="p-4 pb-24 max-w-3xl mx-auto">
            {/* شريط حالة الاتصال العلوي */}
            <div className={`fixed top-0 left-0 w-full h-1 z-50 transition-all ${status === 'connecting' || status === 'saving' ? 'bg-emerald-500 animate-pulse' : 'bg-transparent'}`}></div>

            <div className="flex justify-between items-center mb-6 mt-4">
                <div>
                    <h1 className="text-2xl font-black text-emerald-800">⚙️ لوحة الإدارة</h1>
                    <p className="text-[10px] text-gray-400 font-bold">{status === 'connecting' ? 'جاري المزامنة...' : 'متصل ✅'}</p>
                </div>
                <button 
                    onClick={handleSave} 
                    className={`px-6 py-2 rounded-xl font-bold shadow transition flex items-center gap-2 ${status === 'saving' ? 'bg-gray-400 text-white cursor-wait' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
                    disabled={status === 'saving'}
                >
                    {status === 'saving' ? 'جاري الحفظ...' : '💾 حفظ'}
                </button>
            </div>

            {toast && <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full font-bold shadow-2xl z-50 animate-bounce text-sm">{toast}</div>}

            {/* 1. النصوص */}
            <AdminSection id="txt" title="📝 النصوص والرسائل" activeTab={activeTab} setActiveTab={setActiveTab}>
                <div className="space-y-3">
                    <input className="w-full p-3 border rounded-xl font-bold text-sm" placeholder="اسم الموقع" value={config.texts.siteTitle} onChange={e=>setConfig({...config, texts:{...config.texts, siteTitle:e.target.value}})} />
                    <input className="w-full p-3 border rounded-xl font-bold text-sm" placeholder="عنوان الترحيب الرئيسي" value={config.texts.heroTitle} onChange={e=>setConfig({...config, texts:{...config.texts, heroTitle:e.target.value}})} />
                    
                    <div className="bg-amber-50 p-3 rounded-xl border border-amber-100">
                        <label className="text-xs font-bold text-amber-800 block mb-1">رسالة ركن الطالب:</label>
                        <textarea className="w-full p-2 border rounded-lg h-16 text-sm" value={config.texts.studentMsg} onChange={e=>setConfig({...config, texts:{...config.texts, studentMsg:e.target.value}})} />
                    </div>
                    
                    <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                        <label className="text-xs font-bold text-emerald-800 block mb-1">سؤال الأسبوع:</label>
                        <textarea className="w-full p-2 border rounded-lg h-16 text-sm" value={config.texts.weeklyQuestion} onChange={e=>setConfig({...config, texts:{...config.texts, weeklyQuestion:e.target.value}})} />
                    </div>
                </div>
            </AdminSection>

            {/* 2. الأخبار */}
            <AdminSection id="news" title="📰 الأخبار والإعلانات" activeTab={activeTab} setActiveTab={setActiveTab}>
                <button onClick={() => addItem('news', {id: Date.now(), title: 'خبر جديد', content: '', date: new Date().toISOString().split('T')[0], hidden: false})} className="w-full bg-emerald-50 text-emerald-700 py-3 rounded-xl font-bold mb-3 text-sm dashed-border">+ إضافة خبر</button>
                {config.news.map(n => (
                    <div key={n.id} className={`border p-3 rounded-xl mb-3 relative bg-white ${n.hidden ? 'opacity-50 grayscale' : ''}`}>
                        <input className="w-full font-bold mb-2 border-b pb-1 text-sm" placeholder="العنوان" value={n.title} onChange={e=>{const list=[...config.news]; list.find(x=>x.id===n.id).title=e.target.value; setConfig({...config, news:list})}} />
                        <textarea className="w-full text-xs h-16 border rounded p-2 mb-2 bg-gray-50" placeholder="التفاصيل" value={n.content} onChange={e=>{const list=[...config.news]; list.find(x=>x.id===n.id).content=e.target.value; setConfig({...config, news:list})}} />
                        
                        <div className="flex justify-between items-center mt-2 border-t pt-2">
                             <button onClick={()=>{const list=[...config.news]; list.find(x=>x.id===n.id).hidden=!n.hidden; setConfig({...config, news:list})}} className="text-xs font-bold text-amber-600 px-2 py-1 bg-amber-50 rounded">{n.hidden?'عرض':'إخفاء'}</button>
                             <button onClick={()=>deleteItem('news', n.id)} className="text-xs font-bold text-red-600 px-2 py-1 bg-red-50 rounded">حذف 🗑️</button>
                        </div>
                    </div>
                ))}
            </AdminSection>

            {/* 3. المعلمون */}
            <AdminSection id="teachers" title="👨‍🏫 المعلمون" activeTab={activeTab} setActiveTab={setActiveTab}>
                <button onClick={() => addItem('teachers', {id: Date.now(), name: 'معلم جديد', bio: '', avatar: '🧔', hidden: false})} className="w-full bg-blue-50 text-blue-700 py-3 rounded-xl font-bold mb-3 text-sm dashed-border">+ إضافة معلم</button>
                {config.teachers.map(t => (
                    <div key={t.id} className="border p-3 rounded-xl mb-3 bg-white flex gap-3 items-start">
                        <input className="w-12 h-12 text-center text-2xl border rounded-lg" value={t.avatar} onChange={e=>{const list=[...config.teachers]; list.find(x=>x.id===t.id).avatar=e.target.value; setConfig({...config, teachers:list})}} />
                        <div className="flex-1">
                            <input className="w-full font-bold mb-1 border-b text-sm" placeholder="الاسم" value={t.name} onChange={e=>{const list=[...config.teachers]; list.find(x=>x.id===t.id).name=e.target.value; setConfig({...config, teachers:list})}} />
                            <input className="w-full text-xs text-gray-500" placeholder="الوصف المختصر" value={t.bio} onChange={e=>{const list=[...config.teachers]; list.find(x=>x.id===t.id).bio=e.target.value; setConfig({...config, teachers:list})}} />
                            <div className="flex justify-end gap-2 mt-2">
                                <button onClick={()=>deleteItem('teachers', t.id)} className="text-xs text-red-500 font-bold">حذف</button>
                            </div>
                        </div>
                    </div>
                ))}
            </AdminSection>

            {/* 4. الجداول */}
            <AdminSection id="sch" title="📅 الجداول الدراسية" activeTab={activeTab} setActiveTab={setActiveTab}>
                <div className="flex gap-2 mb-3">
                    <input id="schName" className="flex-1 border rounded p-2 text-xs font-bold" placeholder="اسم الحلقة" />
                    <select id="schPeriod" className="border rounded text-xs font-bold"><option value="عصر">عصر</option><option value="مغرب">مغرب</option></select>
                    <button onClick={()=>{
                        const name=document.getElementById('schName').value;
                        const period=document.getElementById('schPeriod').value;
                        if(name) {
                            addItem('schedules', {id:Date.now(), name, period, hidden:false, days:['السبت','الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس'].map(d=>({day:d, time:'', note:''}))});
                            document.getElementById('schName').value='';
                        }
                    }} className="bg-indigo-600 text-white px-3 rounded text-xs font-bold">+</button>
                </div>
                {config.schedules.map(sch => (
                    <div key={sch.id} className="border p-3 rounded-xl mb-3 bg-white">
                        <div className="flex justify-between items-center mb-2 border-b pb-2">
                            <span className="font-bold text-sm text-emerald-800">{sch.name} ({sch.period})</span>
                            <button onClick={()=>deleteItem('schedules', sch.id)} className="text-red-500 font-bold text-xs">×</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-[10px]">
                                <tbody>
                                    {sch.days.map((d, i) => (
                                        <tr key={i} className="border-b last:border-0">
                                            <td className="font-bold w-10 py-1">{d.day}</td>
                                            <td><input className="w-full border rounded p-1" placeholder="الوقت" value={d.time} onChange={e=>{const list=[...config.schedules]; list.find(x=>x.id===sch.id).days[i].time=e.target.value; setConfig({...config, schedules:list})}} /></td>
                                            <td><input className="w-full border rounded p-1" placeholder="ملاحظة" value={d.note} onChange={e=>{const list=[...config.schedules]; list.find(x=>x.id===sch.id).days[i].note=e.target.value; setConfig({...config, schedules:list})}} /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}
            </AdminSection>

            {/* 5. الأوائل */}
            <AdminSection id="top" title="🏆 أوائل الحلقات" activeTab={activeTab} setActiveTab={setActiveTab}>
                <button onClick={()=>{const n=prompt('اسم الحلقة'); if(n) addItem('halaqat', {id:Date.now(), name:n, students:[], hidden:false})}} className="w-full bg-amber-50 text-amber-700 py-3 rounded-xl font-bold mb-3 text-sm dashed-border">+ إضافة حلقة</button>
                {config.halaqat.map(h => (
                    <div key={h.id} className="bg-amber-50 border border-amber-200 p-3 rounded-xl mb-3">
                        <div className="flex justify-between font-bold text-sm text-amber-900 mb-2">
                            <span>{h.name}</span>
                            <button onClick={()=>deleteItem('halaqat', h.id)} className="text-red-600">×</button>
                        </div>
                        {h.students.map(st => (
                            <div key={st.id} className="flex gap-1 mb-1">
                                <input className="flex-1 p-1 text-xs rounded border" placeholder="الطالب" value={st.name} onChange={e=>{const list=[...config.halaqat]; list.find(x=>x.id===h.id).students.find(s=>s.id===st.id).name=e.target.value; setConfig({...config, halaqat:list})}} />
                                <input className="w-16 p-1 text-xs rounded border text-center" placeholder="المركز" value={st.rank} onChange={e=>{const list=[...config.halaqat]; list.find(x=>x.id===h.id).students.find(s=>s.id===st.id).rank=e.target.value; setConfig({...config, halaqat:list})}} />
                                <button onClick={()=>{const list=[...config.halaqat]; const hObj=list.find(x=>x.id===h.id); hObj.students=hObj.students.filter(s=>s.id!==st.id); setConfig({...config, halaqat:list})}} className="text-red-500 font-bold px-1">×</button>
                            </div>
                        ))}
                        <button onClick={()=>{const list=[...config.halaqat]; list.find(x=>x.id===h.id).students.push({id:Date.now(), name:'', rank:''}); setConfig({...config, halaqat:list})}} className="text-xs bg-white w-full py-1 rounded border border-amber-200 mt-1 font-bold text-amber-600">+ طالب</button>
                    </div>
                ))}
            </AdminSection>

            {/* 6. التواصل */}
            <AdminSection id="contact" title="🔗 روابط التواصل" activeTab={activeTab} setActiveTab={setActiveTab}>
                <div className="space-y-2">
                    <input className="w-full p-2 border rounded text-xs" placeholder="رقم واتساب" value={config.texts.contact.phone} onChange={e=>setConfig({...config, texts:{...config.texts, contact:{...config.texts.contact, phone:e.target.value}}})} />
                    <input className="w-full p-2 border rounded text-xs" placeholder="رابط الموقع (Maps)" value={config.texts.contact.location} onChange={e=>setConfig({...config, texts:{...config.texts, contact:{...config.texts.contact, location:e.target.value}}})} />
                    <input className="w-full p-2 border rounded text-xs" placeholder="رابط يوتيوب" value={config.texts.contact.youtube} onChange={e=>setConfig({...config, texts:{...config.texts, contact:{...config.texts.contact, youtube:e.target.value}}})} />
                    <input className="w-full p-2 border rounded text-xs" placeholder="رابط فيسبوك" value={config.texts.contact.facebook} onChange={e=>setConfig({...config, texts:{...config.texts, contact:{...config.texts.contact, facebook:e.target.value}}})} />
                    <input className="w-full p-2 border rounded text-xs" placeholder="رابط انستقرام" value={config.texts.contact.instagram} onChange={e=>setConfig({...config, texts:{...config.texts, contact:{...config.texts.contact, instagram:e.target.value}}})} />
                </div>
            </AdminSection>
            
            <button onClick={() => { sessionStorage.removeItem('thuraya_admin_auth'); window.location.href = "index.html"; }} className="w-full py-3 mt-6 bg-red-50 text-red-600 rounded-xl font-bold border border-red-100 text-sm">تسجيل خروج 🔒</button>
            <p className="text-center text-gray-300 text-[10px] mt-4 pb-4">نسخة V4 السريعة</p>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('admin-root'));
root.render(<AdminApp />);
