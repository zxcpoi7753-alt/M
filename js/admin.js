/* =========================================
   ملف الإدارة المضمون: js/admin.js
   ========================================= */

// تأكد من أن مسار firebase.js صحيح!
import { db, doc, onSnapshot, setDoc } from './firebase.js';
const { useState, useEffect } = React;

// 1. مكون واجهة بسيط جداً
const AdminSection = ({ id, title, activeTab, setActiveTab, children }) => (
    <div className="bg-white border mb-2 rounded shadow-sm">
        <button 
            onClick={() => setActiveTab(activeTab === id ? null : id)} 
            className="w-full p-4 flex justify-between items-center bg-gray-50 hover:bg-gray-100 font-bold text-emerald-800"
        >
            {title} <span>{activeTab === id ? '▲' : '▼'}</span>
        </button>
        {activeTab === id && <div className="p-4 border-t">{children}</div>}
    </div>
);

const AdminApp = () => {
    // إخفاء شاشة التحميل يدوياً بمجرد بدء التطبيق
    useEffect(() => {
        const loader = document.getElementById('loader');
        if(loader) loader.style.display = 'none';
    }, []);

    // 2. البيانات الافتراضية
    const [config, setConfig] = useState({
        settings: { layoutScale: 1 },
        texts: { 
            siteTitle: '', heroTitle: '', studentMsg: '', weeklyQuestion: '',
            contact: { phone: '', location: '', youtube: '', facebook: '', instagram: '' },
            aboutMain: '', aboutAyah: '', aboutFooter: ''
        },
        news: [], teachers: [], halaqat: [], schedules: []
    });

    const [status, setStatus] = useState('..');
    const [activeTab, setActiveTab] = useState(null);

    // 3. جلب البيانات (مع حماية ضد الأخطاء)
    useEffect(() => {
        try {
            if(!db) { setStatus('خطأ: Firebase غير متصل'); return; }
            
            const unsub = onSnapshot(doc(db, "appData", "mainConfig"), (d) => {
                if (d.exists()) {
                    const data = d.data();
                    // دمج آمن
                    setConfig(prev => ({ 
                        ...prev, ...data,
                        texts: { ...prev.texts, ...data.texts, contact: { ...prev.texts.contact, ...data.texts.contact } } 
                    }));
                    setStatus('متصل ✅');
                }
            }, (err) => {
                console.error(err);
                setStatus('⚠️ وضع الأوفلاين');
            });
            return () => unsub();
        } catch (err) {
            console.error(err);
            setStatus('❌ خطأ برمجي');
        }
    }, []);

    // 4. الحفظ
    const save = async () => {
        setStatus('جاري الحفظ...');
        try {
            await setDoc(doc(db, "appData", "mainConfig"), config);
            setStatus('✅ تم الحفظ');
        } catch (e) { setStatus('❌ فشل'); }
        setTimeout(() => setStatus('متصل ✅'), 2000);
    };

    // دوال مساعدة
    const addItem = (key, val) => setConfig(prev => ({...prev, [key]: [val, ...prev[key]]}));
    const updateItem = (key, id, field, val) => setConfig(prev => ({...prev, [key]: prev[key].map(i => i.id===id ? {...i, [field]:val} : i)}));
    const delItem = (key, id) => { if(confirm('حذف؟')) setConfig(prev => ({...prev, [key]: prev[key].filter(i => i.id!==id)})) };

    return (
        <div className="p-4 pb-20 max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-4 bg-emerald-100 p-3 rounded-lg border border-emerald-200">
                <h2 className="font-black text-emerald-900">لوحة التحكم</h2>
                <div className="flex gap-2 items-center">
                    <span className="text-xs font-bold text-emerald-700">{status}</span>
                    <button onClick={save} className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold shadow">حفظ</button>
                </div>
            </div>

            {/* الأقسام */}
            <AdminSection id="txt" title="📝 النصوص" activeTab={activeTab} setActiveTab={setActiveTab}>
                <div className="space-y-2">
                    <input className="w-full p-2 border rounded" placeholder="اسم الموقع" value={config.texts.siteTitle} onChange={e=>setConfig({...config, texts:{...config.texts, siteTitle:e.target.value}})} />
                    <textarea className="w-full p-2 border rounded" placeholder="رسالة الطالب" value={config.texts.studentMsg} onChange={e=>setConfig({...config, texts:{...config.texts, studentMsg:e.target.value}})} />
                    <textarea className="w-full p-2 border rounded" placeholder="سؤال الأسبوع" value={config.texts.weeklyQuestion} onChange={e=>setConfig({...config, texts:{...config.texts, weeklyQuestion:e.target.value}})} />
                </div>
            </AdminSection>

            <AdminSection id="contact" title="🔗 التواصل (من نحن)" activeTab={activeTab} setActiveTab={setActiveTab}>
                <div className="space-y-2">
                    <input className="w-full p-2 border rounded text-sm" placeholder="واتساب" value={config.texts.contact.phone} onChange={e=>setConfig({...config, texts:{...config.texts, contact:{...config.texts.contact, phone:e.target.value}}})} />
                    <input className="w-full p-2 border rounded text-sm" placeholder="يوتيوب" value={config.texts.contact.youtube} onChange={e=>setConfig({...config, texts:{...config.texts, contact:{...config.texts.contact, youtube:e.target.value}}})} />
                    <input className="w-full p-2 border rounded text-sm" placeholder="فيسبوك" value={config.texts.contact.facebook} onChange={e=>setConfig({...config, texts:{...config.texts, contact:{...config.texts.contact, facebook:e.target.value}}})} />
                    <input className="w-full p-2 border rounded text-sm" placeholder="انستقرام" value={config.texts.contact.instagram} onChange={e=>setConfig({...config, texts:{...config.texts, contact:{...config.texts.contact, instagram:e.target.value}}})} />
                    <textarea className="w-full p-2 border rounded h-16 text-sm" placeholder="نص من نحن" value={config.texts.aboutMain} onChange={e=>setConfig({...config, texts:{...config.texts, aboutMain:e.target.value}})} />
                </div>
            </AdminSection>

            <AdminSection id="news" title="📰 الأخبار" activeTab={activeTab} setActiveTab={setActiveTab}>
                <button onClick={()=>addItem('news', {id:Date.now(), title:'جديد', content:'', hidden:false})} className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded font-bold mb-2">+ إضافة</button>
                {config.news.map(n => (
                    <div key={n.id} className="border p-2 mb-2 rounded bg-gray-50">
                        <input className="w-full font-bold border-b mb-1" value={n.title} onChange={e=>updateItem('news', n.id, 'title', e.target.value)} />
                        <textarea className="w-full text-xs" value={n.content} onChange={e=>updateItem('news', n.id, 'content', e.target.value)} />
                        <div className="flex justify-end gap-2 mt-1">
                            <button onClick={()=>updateItem('news', n.id, 'hidden', !n.hidden)} className="text-xs text-blue-600 font-bold">{n.hidden?'إظهار':'إخفاء'}</button>
                            <button onClick={()=>delItem('news', n.id)} className="text-xs text-red-600 font-bold">حذف</button>
                        </div>
                    </div>
                ))}
            </AdminSection>

            <AdminSection id="teachers" title="👨‍🏫 المعلمون" activeTab={activeTab} setActiveTab={setActiveTab}>
                <button onClick={()=>addItem('teachers', {id:Date.now(), name:'معلم', bio:'', avatar:'🧔'})} className="bg-blue-100 text-blue-800 px-3 py-1 rounded font-bold mb-2">+ إضافة</button>
                {config.teachers.map(t => (
                    <div key={t.id} className="border p-2 mb-2 rounded bg-gray-50 flex gap-2">
                        <input className="w-8 border rounded text-center" value={t.avatar} onChange={e=>updateItem('teachers', t.id, 'avatar', e.target.value)} />
                        <div className="flex-1">
                            <input className="w-full font-bold border-b text-sm" value={t.name} onChange={e=>updateItem('teachers', t.id, 'name', e.target.value)} />
                            <input className="w-full text-xs" value={t.bio} onChange={e=>updateItem('teachers', t.id, 'bio', e.target.value)} />
                        </div>
                        <button onClick={()=>delItem('teachers', t.id)} className="text-red-600 font-bold text-xs">×</button>
                    </div>
                ))}
            </AdminSection>

            <AdminSection id="sch" title="📅 الجداول" activeTab={activeTab} setActiveTab={setActiveTab}>
                <div className="flex gap-1 mb-2">
                    <input id="sn" className="border rounded p-1 flex-1" placeholder="اسم الحلقة" />
                    <select id="sp" className="border rounded"><option>عصر</option><option>مغرب</option></select>
                    <button onClick={()=>{const n=document.getElementById('sn').value, p=document.getElementById('sp').value; if(n){addItem('schedules', {id:Date.now(), name:n, period:p, days:['السبت','الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس'].map(d=>({day:d,time:'',note:''}))}); document.getElementById('sn').value='';}}} className="bg-indigo-600 text-white px-2 rounded">+</button>
                </div>
                {config.schedules.map(s => (
                    <div key={s.id} className="border p-2 mb-2 rounded bg-gray-50">
                        <div className="flex justify-between font-bold text-xs mb-1"><span>{s.name} ({s.period})</span> <button onClick={()=>delItem('schedules', s.id)} className="text-red-600">×</button></div>
                        <div className="grid grid-cols-2 gap-1">
                            {s.days.map((d,i)=>(
                                <div key={i} className="flex text-[10px] items-center border-b">
                                    <span className="w-8 font-bold">{d.day}</span>
                                    <input className="flex-1 border-l p-1" value={d.time} placeholder="وقت" onChange={e=>{const ls=[...config.schedules]; ls.find(x=>x.id===s.id).days[i].time=e.target.value; setConfig({...config, schedules:ls})}} />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </AdminSection>

            <AdminSection id="top" title="🏆 الأوائل" activeTab={activeTab} setActiveTab={setActiveTab}>
                <button onClick={()=>{const n=prompt('اسم الحلقة'); if(n) addItem('halaqat', {id:Date.now(), name:n, students:[]})}} className="bg-amber-100 text-amber-800 px-3 py-1 rounded font-bold mb-2">+ حلقة</button>
                {config.halaqat.map(h => (
                    <div key={h.id} className="border border-amber-200 p-2 mb-2 rounded bg-amber-50">
                        <div className="flex justify-between font-bold text-xs text-amber-900 mb-1"><span>{h.name}</span><button onClick={()=>delItem('halaqat', h.id)} className="text-red-600">×</button></div>
                        {h.students.map(st => (
                            <div key={st.id} className="flex gap-1 mb-1">
                                <input className="flex-1 p-1 border rounded text-xs" value={st.name} onChange={e=>{const ls=[...config.halaqat]; ls.find(x=>x.id===h.id).students.find(y=>y.id===st.id).name=e.target.value; setConfig({...config, halaqat:ls})}} />
                                <input className="w-10 p-1 border rounded text-center text-xs" value={st.rank} onChange={e=>{const ls=[...config.halaqat]; ls.find(x=>x.id===h.id).students.find(y=>y.id===st.id).rank=e.target.value; setConfig({...config, halaqat:ls})}} />
                                <button onClick={()=>{const ls=[...config.halaqat]; const o=ls.find(x=>x.id===h.id); o.students=o.students.filter(y=>y.id!==st.id); setConfig({...config, halaqat:ls})}} className="text-red-500 font-bold px-1">×</button>
                            </div>
                        ))}
                        <button onClick={()=>{const ls=[...config.halaqat]; ls.find(x=>x.id===h.id).students.push({id:Date.now(), name:'', rank:''}); setConfig({...config, halaqat:ls})}} className="w-full bg-white border border-amber-200 text-amber-600 text-xs py-1 rounded">+ طالب</button>
                    </div>
                ))}
            </AdminSection>

            <button onClick={() => { sessionStorage.removeItem('thuraya_admin_auth'); window.location.href = "index.html"; }} className="mt-6 w-full py-3 bg-red-100 text-red-700 font-bold rounded-xl border border-red-200">تسجيل خروج</button>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('admin-root'));
root.render(<AdminApp />);
