/* =========================================
   ملف الإدارة: js/admin.js
   الوظيفة: النسخة الفورية (بدون انتظار تحميل)
   ========================================= */

import { db, doc, onSnapshot, setDoc } from './firebase.js';
const { useState, useEffect } = React;

// مكون القسم (الأكورديون)
const AdminSection = ({ id, title, activeTab, setActiveTab, children }) => (
    <div className="bg-white border border-gray-200 mb-3 rounded-xl shadow-sm overflow-hidden">
        <div 
            onClick={() => setActiveTab(activeTab === id ? null : id)} 
            className={`p-4 flex justify-between items-center cursor-pointer transition-colors ${activeTab === id ? 'bg-emerald-50 text-emerald-900' : 'hover:bg-gray-50'}`}
        >
            <span className="font-bold">{title}</span>
            <span className="text-gray-400 text-xs">{activeTab === id ? '▲' : '▼'}</span>
        </div>
        {activeTab === id && <div className="p-4 border-t border-gray-100">{children}</div>}
    </div>
);

const AdminApp = () => {
    // 1. البيانات الافتراضية (تظهر فوراً عند الفتح)
    const [config, setConfig] = useState({
        settings: { layoutScale: 1 },
        texts: {
            siteTitle: 'حلقات الثريا',
            heroTitle: 'أهلاً بكم في حلقات الثريا',
            heroSubtitle: 'بيئة تربوية جاذبة',
            weeklyQuestion: '',
            studentMsg: '',
            aboutMain: '', aboutAyah: '', aboutFooter: '',
            contact: { phone: '', location: '', youtube: '', facebook: '', instagram: '' }
        },
        news: [], teachers: [], halaqat: [], schedules: []
    });

    const [activeTab, setActiveTab] = useState(null);
    const [status, setStatus] = useState(''); // لعرض رسالة الحفظ فقط

    // 2. جلب البيانات في الخلفية (بدون تعطيل الشاشة)
    useEffect(() => {
        try {
            const unsub = onSnapshot(doc(db, "appData", "mainConfig"), (doc) => {
                if (doc.exists()) {
                    // دمج البيانات الجديدة مع القديمة لضمان عدم اختفاء الحقول
                    const data = doc.data();
                    setConfig(prev => ({
                        ...prev,
                        ...data,
                        texts: { ...prev.texts, ...data.texts, contact: { ...prev.texts.contact, ...data.texts.contact } }
                    }));
                }
            });
            return () => unsub();
        } catch (e) {
            console.error("Firebase Error (Ignored for UI):", e);
        }
    }, []);

    // 3. الحفظ فقط هو من يتصل
    const handleSave = async () => {
        setStatus('جاري الحفظ...');
        try {
            await setDoc(doc(db, "appData", "mainConfig"), config);
            setStatus('✅ تم الحفظ بنجاح');
        } catch (e) {
            setStatus('❌ خطأ في الحفظ');
        }
        setTimeout(() => setStatus(''), 2000);
    };

    // دوال مساعدة
    const addToList = (key, item) => setConfig(prev => ({ ...prev, [key]: [item, ...prev[key]] }));
    const updateList = (key, id, field, val) => setConfig(prev => ({ ...prev, [key]: prev[key].map(i => i.id === id ? { ...i, [field]: val } : i) }));
    const delFromList = (key, id) => { if(confirm('حذف؟')) setConfig(prev => ({ ...prev, [key]: prev[key].filter(i => i.id !== id) })) };

    return (
        <div className="p-4 pb-24 max-w-3xl mx-auto font-cairo">
            {/* الهيدر */}
            <div className="flex justify-between items-center mb-6 mt-4">
                <h1 className="text-2xl font-black text-emerald-800">⚙️ لوحة التحكم</h1>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-600">{status}</span>
                    <button onClick={handleSave} className="bg-emerald-600 text-white px-6 py-2 rounded-xl font-bold shadow hover:bg-emerald-700">حفظ التعديلات</button>
                </div>
            </div>

            {/* 1. الإعدادات */}
            <AdminSection id="sets" title="📏 إعدادات المظهر" activeTab={activeTab} setActiveTab={setActiveTab}>
                <label className="text-xs font-bold text-gray-500">حجم العرض (Zoom)</label>
                <input type="range" min="0.5" max="1.2" step="0.05" className="w-full" value={config.settings.layoutScale} onChange={e => setConfig({...config, settings: {...config.settings, layoutScale: parseFloat(e.target.value)}})} />
            </AdminSection>

            {/* 2. النصوص */}
            <AdminSection id="txt" title="📝 النصوص والرسائل" activeTab={activeTab} setActiveTab={setActiveTab}>
                <div className="space-y-3">
                    <input className="w-full p-2 border rounded" placeholder="اسم الموقع" value={config.texts.siteTitle} onChange={e=>setConfig({...config, texts:{...config.texts, siteTitle:e.target.value}})} />
                    <input className="w-full p-2 border rounded" placeholder="العنوان الترحيبي" value={config.texts.heroTitle} onChange={e=>setConfig({...config, texts:{...config.texts, heroTitle:e.target.value}})} />
                    <textarea className="w-full p-2 border rounded h-20" placeholder="رسالة الطالب" value={config.texts.studentMsg} onChange={e=>setConfig({...config, texts:{...config.texts, studentMsg:e.target.value}})} />
                    <textarea className="w-full p-2 border rounded h-20" placeholder="سؤال الأسبوع" value={config.texts.weeklyQuestion} onChange={e=>setConfig({...config, texts:{...config.texts, weeklyQuestion:e.target.value}})} />
                </div>
            </AdminSection>

            {/* 3. الأخبار */}
            <AdminSection id="news" title="📰 الأخبار" activeTab={activeTab} setActiveTab={setActiveTab}>
                <button onClick={()=>addToList('news', {id:Date.now(), title:'خبر جديد', content:'', hidden:false})} className="w-full bg-emerald-50 text-emerald-700 py-2 rounded mb-2 font-bold">+ خبر جديد</button>
                {config.news.map(n => (
                    <div key={n.id} className="border p-2 rounded mb-2 bg-white">
                        <input className="w-full font-bold border-b mb-1" value={n.title} onChange={e=>updateList('news', n.id, 'title', e.target.value)} />
                        <textarea className="w-full h-12 text-sm bg-gray-50" value={n.content} onChange={e=>updateList('news', n.id, 'content', e.target.value)} />
                        <div className="flex justify-between mt-1">
                            <button onClick={()=>updateList('news', n.id, 'hidden', !n.hidden)} className="text-xs font-bold text-amber-600">{n.hidden?'عرض':'إخفاء'}</button>
                            <button onClick={()=>delFromList('news', n.id)} className="text-xs font-bold text-red-600">حذف</button>
                        </div>
                    </div>
                ))}
            </AdminSection>

            {/* 4. المعلمون */}
            <AdminSection id="teachers" title="👨‍🏫 المعلمون" activeTab={activeTab} setActiveTab={setActiveTab}>
                <button onClick={()=>addToList('teachers', {id:Date.now(), name:'اسم المعلم', bio:'', avatar:'🧔'})} className="w-full bg-blue-50 text-blue-700 py-2 rounded mb-2 font-bold">+ معلم</button>
                {config.teachers.map(t => (
                    <div key={t.id} className="border p-2 rounded mb-2 flex gap-2">
                        <input className="w-10 border rounded text-center" value={t.avatar} onChange={e=>updateList('teachers', t.id, 'avatar', e.target.value)} />
                        <div className="flex-1">
                            <input className="w-full border-b font-bold" value={t.name} onChange={e=>updateList('teachers', t.id, 'name', e.target.value)} />
                            <input className="w-full text-xs text-gray-500" value={t.bio} onChange={e=>updateList('teachers', t.id, 'bio', e.target.value)} />
                        </div>
                        <button onClick={()=>delFromList('teachers', t.id)} className="text-red-600 font-bold text-xs">×</button>
                    </div>
                ))}
            </AdminSection>

            {/* 5. الجداول */}
            <AdminSection id="sch" title="📅 الجداول" activeTab={activeTab} setActiveTab={setActiveTab}>
                <div className="flex gap-2 mb-2">
                    <input id="schName" className="flex-1 border rounded p-1" placeholder="اسم الحلقة" />
                    <select id="schPer" className="border rounded"><option>عصر</option><option>مغرب</option></select>
                    <button onClick={()=>{
                        const n=document.getElementById('schName').value, p=document.getElementById('schPer').value;
                        if(n) { addToList('schedules', {id:Date.now(), name:n, period:p, days:['السبت','الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس'].map(d=>({day:d,time:'',note:''}))}); document.getElementById('schName').value=''; }
                    }} className="bg-indigo-600 text-white px-3 rounded">+</button>
                </div>
                {config.schedules.map(s => (
                    <div key={s.id} className="border p-2 rounded mb-2 bg-white">
                        <div className="flex justify-between font-bold text-sm mb-1">
                            <span>{s.name} ({s.period})</span>
                            <button onClick={()=>delFromList('schedules', s.id)} className="text-red-600">×</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs">
                                <tbody>
                                    {s.days.map((d, i) => (
                                        <tr key={i} className="border-b last:border-0">
                                            <td className="w-10 font-bold">{d.day}</td>
                                            <td><input className="w-full border p-1" value={d.time} placeholder="وقت" onChange={e=>{const ls=[...config.schedules]; ls.find(x=>x.id===s.id).days[i].time=e.target.value; setConfig({...config, schedules:ls})}} /></td>
                                            <td><input className="w-full border p-1" value={d.note} placeholder="ملاحظة" onChange={e=>{const ls=[...config.schedules]; ls.find(x=>x.id===s.id).days[i].note=e.target.value; setConfig({...config, schedules:ls})}} /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}
            </AdminSection>

            {/* 6. الأوائل */}
            <AdminSection id="top" title="🏆 الأوائل" activeTab={activeTab} setActiveTab={setActiveTab}>
                <button onClick={()=>{const n=prompt('اسم الحلقة'); if(n) addToList('halaqat', {id:Date.now(), name:n, students:[]})}} className="w-full bg-amber-50 text-amber-700 py-2 rounded mb-2 font-bold">+ حلقة جديدة</button>
                {config.halaqat.map(h => (
                    <div key={h.id} className="border border-amber-200 bg-amber-50 p-2 rounded mb-2">
                        <div className="flex justify-between font-bold text-amber-900 mb-1">
                            <span>{h.name}</span>
                            <button onClick={()=>delFromList('halaqat', h.id)} className="text-red-600">×</button>
                        </div>
                        {h.students.map(st => (
                            <div key={st.id} className="flex gap-1 mb-1">
                                <input className="flex-1 p-1 border rounded text-xs" value={st.name} placeholder="الطالب" onChange={e=>{const ls=[...config.halaqat]; ls.find(x=>x.id===h.id).students.find(y=>y.id===st.id).name=e.target.value; setConfig({...config, halaqat:ls})}} />
                                <input className="w-16 p-1 border rounded text-center text-xs" value={st.rank} placeholder="المركز" onChange={e=>{const ls=[...config.halaqat]; ls.find(x=>x.id===h.id).students.find(y=>y.id===st.id).rank=e.target.value; setConfig({...config, halaqat:ls})}} />
                                <button onClick={()=>{const ls=[...config.halaqat]; const obj=ls.find(x=>x.id===h.id); obj.students=obj.students.filter(y=>y.id!==st.id); setConfig({...config, halaqat:ls})}} className="text-red-500 font-bold px-1">×</button>
                            </div>
                        ))}
                        <button onClick={()=>{const ls=[...config.halaqat]; ls.find(x=>x.id===h.id).students.push({id:Date.now(), name:'', rank:''}); setConfig({...config, halaqat:ls})}} className="w-full bg-white border border-amber-200 py-1 rounded text-xs font-bold text-amber-600">+ طالب</button>
                    </div>
                ))}
            </AdminSection>

            {/* 7. من نحن والتواصل (إصلاح المربعات) */}
            <AdminSection id="about" title="🔗 من نحن والتواصل" activeTab={activeTab} setActiveTab={setActiveTab}>
                <div className="space-y-3">
                    <div className="p-3 border border-blue-100 rounded-xl bg-blue-50">
                        <label className="block text-xs font-bold text-blue-800 mb-2">روابط التواصل الاجتماعي:</label>
                        <div className="grid gap-2">
                            <input className="w-full p-2 border rounded text-xs" placeholder="رقم واتساب" value={config.texts.contact.phone} onChange={e=>setConfig({...config, texts:{...config.texts, contact:{...config.texts.contact, phone:e.target.value}}})} />
                            <input className="w-full p-2 border rounded text-xs" placeholder="رابط الموقع (Maps)" value={config.texts.contact.location} onChange={e=>setConfig({...config, texts:{...config.texts, contact:{...config.texts.contact, location:e.target.value}}})} />
                            <input className="w-full p-2 border rounded text-xs" placeholder="رابط يوتيوب" value={config.texts.contact.youtube} onChange={e=>setConfig({...config, texts:{...config.texts, contact:{...config.texts.contact, youtube:e.target.value}}})} />
                            <input className="w-full p-2 border rounded text-xs" placeholder="رابط فيسبوك" value={config.texts.contact.facebook} onChange={e=>setConfig({...config, texts:{...config.texts, contact:{...config.texts.contact, facebook:e.target.value}}})} />
                            <input className="w-full p-2 border rounded text-xs" placeholder="رابط انستقرام" value={config.texts.contact.instagram} onChange={e=>setConfig({...config, texts:{...config.texts, contact:{...config.texts.contact, instagram:e.target.value}}})} />
                        </div>
                    </div>
                    <textarea className="w-full p-2 border rounded h-24 text-xs" placeholder="نص من نحن..." value={config.texts.aboutMain} onChange={e=>setConfig({...config, texts:{...config.texts, aboutMain:e.target.value}})} />
                    <input className="w-full p-2 border rounded text-xs" placeholder="الآية القرآنية" value={config.texts.aboutAyah} onChange={e=>setConfig({...config, texts:{...config.texts, aboutAyah:e.target.value}})} />
                    <input className="w-full p-2 border rounded text-xs" placeholder="الخاتمة" value={config.texts.aboutFooter} onChange={e=>setConfig({...config, texts:{...config.texts, aboutFooter:e.target.value}})} />
                </div>
            </AdminSection>

            <button onClick={() => { sessionStorage.removeItem('thuraya_admin_auth'); window.location.href = "index.html"; }} className="w-full py-4 mt-8 bg-red-600 text-white rounded-2xl font-black shadow-xl">تسجيل خروج 🔒</button>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('admin-root'));
root.render(<AdminApp />);
