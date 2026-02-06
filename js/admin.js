/* =========================================
   ملف الإدارة الذهبي: js/admin.js (الميزات الكاملة + الحماية)
   ========================================= */

// استدعاء المكتبات من النافذة (الجسر)
const { useState, useEffect } = React;
const { db, doc, onSnapshot, setDoc } = window;

// مكون القسم (Design Component)
const AdminSection = ({ id, title, activeTab, setActiveTab, children }) => (
    <div className="bg-white border border-gray-200 mb-4 rounded-xl shadow-sm overflow-hidden animate-in">
        <div 
            onClick={() => setActiveTab(activeTab === id ? null : id)} 
            className={`p-4 flex justify-between items-center cursor-pointer transition-colors ${activeTab === id ? 'bg-emerald-50 text-emerald-900 border-b border-emerald-100' : 'hover:bg-gray-50'}`}
        >
            <span className="font-bold text-lg flex items-center gap-2">{title}</span>
            <span className="text-gray-400 bg-gray-100 px-2 rounded text-xs">{activeTab === id ? 'إغلاق ▲' : 'فتح ▼'}</span>
        </div>
        {activeTab === id && <div className="p-5 bg-gray-50/50">{children}</div>}
    </div>
);

const AdminApp = () => {
    // 1. هيكل البيانات الكامل (يشمل الألوان والروابط وكل شيء)
    const [config, setConfig] = useState({
        settings: { layoutScale: 1 },
        texts: { 
            siteTitle: 'حلقات الثريا', heroTitle: 'أهلاً بكم', heroSubtitle: '',
            contact: { phone: '', location: '', youtube: '', facebook: '', instagram: '' },
            studentMsg: '', weeklyQuestion: '', aboutMain: '', aboutAyah: '', aboutFooter: ''
        },
        news: [], teachers: [], halaqat: [], schedules: []
    });
    
    const [status, setStatus] = useState('..');
    const [activeTab, setActiveTab] = useState(null);
    const [toast, setToast] = useState(null);

    // 2. الاتصال الآمن (بدون تعليق)
    useEffect(() => {
        if (!window.db) { setStatus('خطأ اتصال'); return; }
        const unsub = window.onSnapshot(window.doc(window.db, "appData", "mainConfig"), (d) => {
            if (d.exists()) {
                const data = d.data();
                // دمج عميق للحفاظ على الخصائص
                setConfig(prev => ({ 
                    ...prev, ...data,
                    texts: { ...prev.texts, ...data.texts, contact: { ...prev.texts.contact, ...data.texts.contact } } 
                }));
                setStatus('متصل ✅');
            }
        });
        return () => unsub();
    }, []);

    // 3. الحفظ السريع
    const handleSave = async () => {
        setStatus('جاري الحفظ...');
        try {
            await window.setDoc(window.doc(window.db, "appData", "mainConfig"), config);
            setToast('✅ تم حفظ التغييرات بنجاح');
            setStatus('متصل ✅');
        } catch (e) { 
            setToast('❌ فشل الحفظ! تحقق من النت');
            setStatus('خطأ'); 
        }
        setTimeout(() => setToast(null), 2500);
    };

    // --- دوال التحكم في القوائم ---
    
    // إضافة عنصر
    const addItem = (list, item) => setConfig(prev => ({ ...prev, [list]: [item, ...prev[list]] }));
    
    // تعديل عنصر
    const updateItem = (list, id, key, val) => setConfig(prev => ({ ...prev, [list]: prev[list].map(i => i.id === id ? { ...i, [key]: val } : i) }));
    
    // تعديل عنصر داخل كائن فرعي (مثل الألوان في الأخبار)
    const updateDeepItem = (list, id, parentKey, key, val) => {
        setConfig(prev => ({ 
            ...prev, 
            [list]: prev[list].map(i => i.id === id ? { ...i, [parentKey]: { ...i[parentKey], [key]: val } } : i) 
        }));
    };

    // تبديل الإخفاء/الإظهار
    const toggleHidden = (list, id) => {
        setConfig(prev => ({
            ...prev,
            [list]: prev[list].map(i => i.id === id ? { ...i, hidden: !i.hidden } : i)
        }));
    };

    // الحذف
    const deleteItem = (list, id) => {
        if(confirm('هل أنت متأكد من الحذف نهائياً؟')) {
            setConfig(prev => ({ ...prev, [list]: prev[list].filter(i => i.id !== id) }));
        }
    };

    return (
        <div id="app-container" className="p-4 pb-32 max-w-4xl mx-auto font-cairo">
            
            {/* الشريط العلوي */}
            <div className="flex justify-between items-center mb-6 sticky top-2 z-50 bg-white/90 backdrop-blur p-3 rounded-2xl shadow-md border border-gray-200">
                <div>
                    <h1 className="text-xl font-black text-emerald-800 flex items-center gap-2">⚙️ لوحة التحكم <span className="text-[10px] bg-emerald-100 px-2 rounded-full text-emerald-700">{status}</span></h1>
                </div>
                <button onClick={handleSave} className="bg-emerald-600 text-white px-6 py-2 rounded-xl font-bold shadow hover:bg-emerald-700 hover:scale-105 transition">💾 حفظ التعديلات</button>
            </div>

            {toast && <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-full font-bold shadow-2xl z-50 animate-bounce">{toast}</div>}

            {/* 1. إعدادات المظهر */}
            <AdminSection id="sets" title="📏 حجم الموقع (Zoom)" activeTab={activeTab} setActiveTab={setActiveTab}>
                <div className="flex items-center gap-4">
                    <span className="text-xs font-bold">صغير</span>
                    <input type="range" min="0.5" max="1.2" step="0.05" className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" value={config.settings.layoutScale} onChange={e => setConfig({...config, settings: { ...config.settings, layoutScale: parseFloat(e.target.value) } })} />
                    <span className="text-xs font-bold">كبير</span>
                </div>
            </AdminSection>

            {/* 2. النصوص */}
            <AdminSection id="txt" title="📝 النصوص والرسائل" activeTab={activeTab} setActiveTab={setActiveTab}>
                <div className="grid gap-3">
                    <div><label className="text-xs font-bold text-gray-500">اسم الموقع (الهيدر)</label><input className="w-full p-3 border rounded-xl font-bold" value={config.texts.siteTitle} onChange={e=>setConfig({...config, texts:{...config.texts, siteTitle:e.target.value}})} /></div>
                    <div><label className="text-xs font-bold text-gray-500">العنوان الترحيبي</label><input className="w-full p-3 border rounded-xl font-bold" value={config.texts.heroTitle} onChange={e=>setConfig({...config, texts:{...config.texts, heroTitle:e.target.value}})} /></div>
                    <div className="bg-amber-50 p-3 rounded-xl border border-amber-200"><label className="text-xs font-bold text-amber-800">رسالة ركن الطالب:</label><textarea className="w-full p-2 border rounded-xl h-20 mt-1" value={config.texts.studentMsg} onChange={e=>setConfig({...config, texts:{...config.texts, studentMsg:e.target.value}})} /></div>
                    <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200"><label className="text-xs font-bold text-emerald-800">سؤال الأسبوع:</label><textarea className="w-full p-2 border rounded-xl h-20 mt-1" value={config.texts.weeklyQuestion} onChange={e=>setConfig({...config, texts:{...config.texts, weeklyQuestion:e.target.value}})} /></div>
                </div>
            </AdminSection>

            {/* 3. الأخبار (كاملة الخصائص) */}
            <AdminSection id="news" title="📰 الأخبار والإعلانات" activeTab={activeTab} setActiveTab={setActiveTab}>
                <button onClick={() => addItem('news', {id: Date.now(), title: 'عنوان الخبر', content: '', date: new Date().toISOString().split('T')[0], hidden: false, colors: {title:'#000000', content:'#4b5563', link:'#2563eb'}, link: {url:'', text:''}})} className="w-full bg-emerald-100 text-emerald-800 py-3 rounded-xl font-bold mb-4 border border-emerald-200 dashed-border hover:bg-emerald-200">+ إضافة خبر جديد</button>
                
                {config.news.map(n => (
                    <div key={n.id} className={`bg-white border rounded-2xl p-4 mb-4 relative transition ${n.hidden ? 'opacity-60 grayscale bg-gray-50 border-gray-300' : 'border-emerald-100 shadow-sm'}`}>
                        {/* شريط الحالة */}
                        {n.hidden && <div className="absolute top-2 left-2 bg-gray-600 text-white text-[10px] px-2 py-1 rounded font-bold">🚫 هذا الخبر مخفي حالياً</div>}
                        
                        <div className="grid gap-2 mb-3">
                            <input className="w-full font-black text-lg border-b pb-1" placeholder="عنوان الخبر" value={n.title} onChange={e=>updateItem('news', n.id, 'title', e.target.value)} />
                            <textarea className="w-full text-sm h-20 bg-gray-50 p-2 rounded" placeholder="تفاصيل الخبر..." value={n.content} onChange={e=>updateItem('news', n.id, 'content', e.target.value)} />
                        </div>

                        {/* إعدادات متقدمة (ألوان وروابط) */}
                        <div className="bg-gray-50 p-3 rounded-xl mb-3 border border-gray-100">
                            <p className="text-xs font-bold text-gray-400 mb-2">🎨 التخصيص والروابط:</p>
                            <div className="flex flex-wrap gap-2 mb-2">
                                <label className="flex items-center gap-1 text-[10px] bg-white px-2 py-1 rounded border">لون العنوان: <input type="color" value={n.colors?.title || '#000000'} onChange={e=>updateDeepItem('news', n.id, 'colors', 'title', e.target.value)} /></label>
                                <label className="flex items-center gap-1 text-[10px] bg-white px-2 py-1 rounded border">لون النص: <input type="color" value={n.colors?.content || '#4b5563'} onChange={e=>updateDeepItem('news', n.id, 'colors', 'content', e.target.value)} /></label>
                                <label className="flex items-center gap-1 text-[10px] bg-white px-2 py-1 rounded border">لون الرابط: <input type="color" value={n.colors?.link || '#2563eb'} onChange={e=>updateDeepItem('news', n.id, 'colors', 'link', e.target.value)} /></label>
                            </div>
                            <div className="flex gap-2">
                                <input className="flex-1 p-2 border rounded text-xs" placeholder="رابط الزر (URL)" value={n.link?.url || ''} onChange={e=>updateDeepItem('news', n.id, 'link', 'url', e.target.value)} />
                                <input className="w-1/3 p-2 border rounded text-xs" placeholder="نص الزر" value={n.link?.text || ''} onChange={e=>updateDeepItem('news', n.id, 'link', 'text', e.target.value)} />
                            </div>
                        </div>

                        {/* أزرار التحكم */}
                        <div className="flex justify-end gap-2 border-t pt-2">
                            <button onClick={()=>toggleHidden('news', n.id)} className={`px-4 py-1 rounded-lg text-xs font-bold ${n.hidden ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-600'}`}>
                                {n.hidden ? '👁️ إظهار الخبر' : '🚫 إخفاء الخبر'}
                            </button>
                            <button onClick={()=>deleteItem('news', n.id)} className="px-4 py-1 rounded-lg text-xs font-bold bg-red-100 text-red-700 hover:bg-red-200">
                                🗑️ حذف نهائي
                            </button>
                        </div>
                    </div>
                ))}
            </AdminSection>

            {/* 4. المعلمون */}
            <AdminSection id="teachers" title="👨‍🏫 المعلمون" activeTab={activeTab} setActiveTab={setActiveTab}>
                <button onClick={()=>addItem('teachers', {id:Date.now(), name:'اسم المعلم', bio:'', avatar:'🧔', hidden:false})} className="w-full bg-blue-50 text-blue-700 py-3 rounded-xl font-bold mb-4 border border-blue-100">+ إضافة معلم</button>
                {config.teachers.map(t => (
                    <div key={t.id} className={`flex gap-3 items-start border p-3 rounded-xl mb-3 bg-white ${t.hidden ? 'opacity-50' : ''}`}>
                        <div className="flex flex-col items-center gap-1">
                            <input className="w-12 h-12 text-center text-2xl border rounded-full bg-gray-50" value={t.avatar} onChange={e=>updateItem('teachers', t.id, 'avatar', e.target.value)} placeholder="emoji" />
                            <span className="text-[10px] text-gray-400">أيقونة</span>
                        </div>
                        <div className="flex-1">
                            <input className="w-full font-bold border-b mb-1 pb-1" value={t.name} onChange={e=>updateItem('teachers', t.id, 'name', e.target.value)} placeholder="الاسم" />
                            <textarea className="w-full text-xs text-gray-500 h-10 resize-none" value={t.bio} onChange={e=>updateItem('teachers', t.id, 'bio', e.target.value)} placeholder="نبذة مختصرة" />
                            <div className="flex justify-end gap-2 mt-2">
                                <button onClick={()=>toggleHidden('teachers', t.id)} className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded">{t.hidden?'إظهار':'إخفاء'}</button>
                                <button onClick={()=>deleteItem('teachers', t.id)} className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded">حذف</button>
                            </div>
                        </div>
                    </div>
                ))}
            </AdminSection>

            {/* 5. الجداول */}
            <AdminSection id="sch" title="📅 الجداول الدراسية" activeTab={activeTab} setActiveTab={setActiveTab}>
                <div className="flex gap-2 mb-4 bg-indigo-50 p-3 rounded-xl">
                    <input id="schName" className="flex-1 p-2 border rounded-lg text-sm" placeholder="اسم الحلقة (مثلاً: حلقة زيد)" />
                    <select id="schPer" className="p-2 border rounded-lg text-sm font-bold"><option value="عصر">عصر</option><option value="مغرب">مغرب</option></select>
                    <button onClick={()=>{
                        const n=document.getElementById('schName').value, p=document.getElementById('schPer').value;
                        if(n) { addItem('schedules', {id:Date.now(), name:n, period:p, hidden:false, days:['السبت','الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس'].map(d=>({day:d,time:'',note:''}))}); document.getElementById('schName').value=''; }
                    }} className="bg-indigo-600 text-white px-4 rounded-lg font-bold">+</button>
                </div>
                {config.schedules.map(s => (
                    <div key={s.id} className={`border p-3 rounded-xl mb-3 bg-white ${s.hidden ? 'opacity-60' : ''}`}>
                        <div className="flex justify-between items-center mb-2 border-b pb-2">
                            <span className="font-bold text-emerald-800">{s.name} <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-full">{s.period}</span></span>
                            <div className="flex gap-1">
                                <button onClick={()=>toggleHidden('schedules', s.id)} className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200">{s.hidden?'👁️':'🚫'}</button>
                                <button onClick={()=>deleteItem('schedules', s.id)} className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200">🗑️</button>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-1">
                            {s.days.map((d,i)=>(
                                <div key={i} className="flex items-center text-xs border-b last:border-0 py-1">
                                    <span className="w-10 font-bold text-gray-500">{d.day}</span>
                                    <input className="flex-1 border-l border-r px-2 py-1 mx-1 rounded" value={d.time} placeholder="--:--" onChange={e=>{const ls=[...config.schedules]; ls.find(x=>x.id===s.id).days[i].time=e.target.value; setConfig({...config, schedules:ls})}} />
                                    <input className="flex-1 px-2 py-1 rounded bg-gray-50" value={d.note} placeholder="ملاحظة" onChange={e=>{const ls=[...config.schedules]; ls.find(x=>x.id===s.id).days[i].note=e.target.value; setConfig({...config, schedules:ls})}} />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </AdminSection>

            {/* 6. الأوائل */}
            <AdminSection id="top" title="🏆 أوائل الحلقات" activeTab={activeTab} setActiveTab={setActiveTab}>
                <button onClick={()=>{const n=prompt('اسم الحلقة الجديد:'); if(n) addItem('halaqat', {id:Date.now(), name:n, students:[], hidden:false})}} className="w-full bg-amber-100 text-amber-800 py-3 rounded-xl font-bold mb-4 hover:bg-amber-200">+ إضافة حلقة تكريم</button>
                {config.halaqat.map(h => (
                    <div key={h.id} className={`bg-amber-50 border border-amber-200 p-3 rounded-xl mb-3 ${h.hidden ? 'opacity-60' : ''}`}>
                        <div className="flex justify-between font-bold text-amber-900 mb-2 border-b border-amber-200 pb-2">
                            <span>{h.name}</span>
                            <div className="flex gap-1">
                                <button onClick={()=>toggleHidden('halaqat', h.id)} className="text-xs text-amber-700 bg-white px-2 rounded">{h.hidden?'إظهار':'إخفاء'}</button>
                                <button onClick={()=>deleteItem('halaqat', h.id)} className="text-xs text-red-600 bg-white px-2 rounded">حذف</button>
                            </div>
                        </div>
                        {h.students.map(st => (
                            <div key={st.id} className="flex gap-1 mb-1 items-center">
                                <span className="text-xs text-amber-400">⭐</span>
                                <input className="flex-1 p-1.5 border rounded-lg text-xs" value={st.name} placeholder="اسم الطالب" onChange={e=>{const ls=[...config.halaqat]; ls.find(x=>x.id===h.id).students.find(y=>y.id===st.id).name=e.target.value; setConfig({...config, halaqat:ls})}} />
                                <input className="w-16 p-1.5 border rounded-lg text-center text-xs font-bold" value={st.rank} placeholder="المركز" onChange={e=>{const ls=[...config.halaqat]; ls.find(x=>x.id===h.id).students.find(y=>y.id===st.id).rank=e.target.value; setConfig({...config, halaqat:ls})}} />
                                <button onClick={()=>{const ls=[...config.halaqat]; const obj=ls.find(x=>x.id===h.id); obj.students=obj.students.filter(y=>y.id!==st.id); setConfig({...config, halaqat:ls})}} className="text-red-500 font-bold px-2 hover:bg-red-50 rounded">×</button>
                            </div>
                        ))}
                        <button onClick={()=>{const ls=[...config.halaqat]; ls.find(x=>x.id===h.id).students.push({id:Date.now(), name:'', rank:''}); setConfig({...config, halaqat:ls})}} className="w-full bg-white border border-amber-200 py-2 rounded-lg text-xs font-bold text-amber-600 mt-2 hover:bg-amber-100">+ إضافة طالب</button>
                    </div>
                ))}
            </AdminSection>

            {/* 7. من نحن (مربعات واضحة) */}
            <AdminSection id="about" title="🔗 من نحن والتواصل" activeTab={activeTab} setActiveTab={setActiveTab}>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="p-3 border rounded-xl bg-green-50">
                            <label className="text-xs font-bold text-green-800 block mb-1">واتساب (الرقم الدولي):</label>
                            <input className="w-full p-2 border rounded bg-white" placeholder="9677xxxxxxxx" value={config.texts.contact.phone} onChange={e=>setConfig({...config, texts:{...config.texts, contact:{...config.texts.contact, phone:e.target.value}}})} />
                        </div>
                        <div className="p-3 border rounded-xl bg-blue-50">
                            <label className="text-xs font-bold text-blue-800 block mb-1">الموقع (رابط خرائط جوجل):</label>
                            <input className="w-full p-2 border rounded bg-white" placeholder="https://maps..." value={config.texts.contact.location} onChange={e=>setConfig({...config, texts:{...config.texts, contact:{...config.texts.contact, location:e.target.value}}})} />
                        </div>
                    </div>
                    
                    <div className="p-3 border rounded-xl bg-gray-50">
                        <label className="text-xs font-bold text-gray-500 block mb-2">منصات التواصل (الروابط):</label>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2"><span className="w-20 text-xs font-bold text-red-600">يوتيوب:</span><input className="flex-1 p-2 border rounded" value={config.texts.contact.youtube} onChange={e=>setConfig({...config, texts:{...config.texts, contact:{...config.texts.contact, youtube:e.target.value}}})} /></div>
                            <div className="flex items-center gap-2"><span className="w-20 text-xs font-bold text-blue-600">فيسبوك:</span><input className="flex-1 p-2 border rounded" value={config.texts.contact.facebook} onChange={e=>setConfig({...config, texts:{...config.texts, contact:{...config.texts.contact, facebook:e.target.value}}})} /></div>
                            <div className="flex items-center gap-2"><span className="w-20 text-xs font-bold text-pink-600">انستقرام:</span><input className="flex-1 p-2 border rounded" value={config.texts.contact.instagram} onChange={e=>setConfig({...config, texts:{...config.texts, contact:{...config.texts.contact, instagram:e.target.value}}})} /></div>
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <label className="block text-xs font-bold text-gray-500 mb-1">النص التعريفي (من نحن):</label>
                        <textarea className="w-full p-3 border rounded-xl h-24 text-sm bg-gray-50" value={config.texts.aboutMain} onChange={e=>setConfig({...config, texts:{...config.texts, aboutMain:e.target.value}})} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div><label className="text-xs font-bold">الآية القرآنية:</label><input className="w-full p-2 border rounded" value={config.texts.aboutAyah} onChange={e=>setConfig({...config, texts:{...config.texts, aboutAyah:e.target.value}})} /></div>
                        <div><label className="text-xs font-bold">الخاتمة:</label><input className="w-full p-2 border rounded" value={config.texts.aboutFooter} onChange={e=>setConfig({...config, texts:{...config.texts, aboutFooter:e.target.value}})} /></div>
                    </div>
                </div>
            </AdminSection>

            {/* زر الخروج */}
            <button onClick={() => { sessionStorage.removeItem('thuraya_admin_auth'); window.location.href = "index.html"; }} className="w-full py-4 mt-8 bg-red-50 text-red-600 rounded-2xl font-black shadow-inner border border-red-100 hover:bg-red-100 transition">تسجيل خروج 🔒</button>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('admin-root'));
root.render(<AdminApp />);
