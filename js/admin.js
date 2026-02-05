/* =========================================
   ملف الإدارة: js/admin.js
   الوظيفة: التحكم الكامل بالموقع (محمية)
   ========================================= */

// استيراد أدوات Firebase والرياكت
import { db, doc, onSnapshot, setDoc } from './firebase.js';
const { useState, useEffect } = React;

// --- مكونات مساعدة (لتحسين الأداء وحل مشاكل الكيبورد) ---
const AdminSection = ({ id, title, activeTab, setActiveTab, children }) => (
    <div className="admin-card animate-in">
        <div 
            onClick={() => setActiveTab(activeTab === id ? null : id)} 
            className={`admin-section-btn ${activeTab === id ? 'active' : ''}`}
        >
            <span>{title}</span>
            <span>{activeTab === id ? '▲' : '▼'}</span>
        </div>
        {activeTab === id && <div className="pt-4 border-t border-gray-100 mt-2">{children}</div>}
    </div>
);

// --- التطبيق الرئيسي للإدارة ---
const AdminApp = () => {
    // البيانات الافتراضية
    const initialConfig = {
        settings: { layoutScale: 1, textScale: 1 },
        texts: {
            siteTitle: 'حلقات الثريا',
            heroTitle: 'أهلاً بكم في حلقات الثريا',
            heroSubtitle: 'بيئة تربوية جاذبة لتعليم القرآن الكريم',
            weeklyQuestion: 'من هو الصحابي الذي اهتز لموته عرش الرحمن؟',
            aboutMain: 'نحن حلقات الثريا لتحفيظ القرآن الكريم..',
            aboutAyah: '﴿ وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا ﴾',
            aboutAyahColor: '#059669',
            aboutFooter: 'ومن القرآن... نبدأ، وبه... نرتقي.',
            studentMsg: 'أخي الطالب: القرآن حياة للقلوب، فاجعل لك ورداً لا تتركه.',
            contact: { phone: '', location: '', youtube: '', facebook: '', instagram: '' }
        },
        news: [], teachers: [], halaqat: [], schedules: []
    };

    // الحالات (State)
    const [config, setConfig] = useState(initialConfig);
    const [activeTab, setActiveTab] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // حالات النوافذ والتنبيهات
    const [toast, setToast] = useState(null);
    const [securityModal, setSecurityModal] = useState({ show: false, action: null, type: null, id: null, data: null });
    const [passwordInput, setPasswordInput] = useState('');

    // 1. جلب البيانات من Firebase عند البدء
    useEffect(() => {
        const unsub = onSnapshot(doc(db, "appData", "mainConfig"), (docSnapshot) => {
            if (docSnapshot.exists()) {
                // دمج البيانات الموجودة مع الهيكل لضمان عدم نقص الحقول الجديدة
                setConfig(prev => ({ ...initialConfig, ...docSnapshot.data() }));
            }
            setLoading(false);
        });
        return () => unsub();
    }, []);

    // 2. دالة الحفظ اليدوي
    const handleSave = async () => {
        try {
            await setDoc(doc(db, "appData", "mainConfig"), config);
            showToast('✅ تم حفظ ونشر التعديلات بنجاح');
        } catch (error) {
            console.error(error);
            showToast('❌ حدث خطأ أثناء الحفظ', 'error');
        }
    };

    // 3. عرض التنبيهات
    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    // 4. تنفيذ العمليات الحساسة (حذف/إخفاء)
    const executeSecureAction = () => {
        if (passwordInput !== '12345') {
            showToast('⛔ كلمة المرور خاطئة', 'error');
            return;
        }

        const { action, type, id } = securityModal;
        let newConfig = { ...config };

        // منطق الحذف
        if (action === 'delete') {
            if (type === 'news') newConfig.news = newConfig.news.filter(x => x.id !== id);
            if (type === 'teacher') newConfig.teachers = newConfig.teachers.filter(x => x.id !== id);
            if (type === 'schedule') newConfig.schedules = newConfig.schedules.filter(x => x.id !== id);
            if (type === 'halqa') newConfig.halaqat = newConfig.halaqat.filter(x => x.id !== id);
        }

        // منطق الإخفاء/الإظهار
        if (action === 'hide') {
            const toggle = (list) => list.map(item => item.id === id ? { ...item, hidden: !item.hidden } : item);
            if (type === 'news') newConfig.news = toggle(newConfig.news);
            if (type === 'teacher') newConfig.teachers = toggle(newConfig.teachers);
            if (type === 'schedule') newConfig.schedules = toggle(newConfig.schedules);
            if (type === 'halqa') newConfig.halaqat = toggle(newConfig.halaqat);
        }

        setConfig(newConfig);
        
        // حفظ تلقائي بعد العملية الحساسة
        setDoc(doc(db, "appData", "mainConfig"), newConfig)
            .then(() => showToast('تم تنفيذ العملية بنجاح'))
            .catch(() => showToast('حدث خطأ', 'error'));

        setSecurityModal({ show: false, action: null, type: null, id: null, data: null });
        setPasswordInput('');
    };

    if (loading) return <div className="text-center p-10 font-bold text-gray-500">جاري تحميل لوحة التحكم...</div>;

    return (
        <div id="app-container" className="p-4 pb-24 max-w-3xl mx-auto">
            <h1 className="text-3xl font-black text-emerald-800 mb-6 text-center">⚙️ مركز القيادة</h1>

            {/* زر الحفظ العائم */}
            <button onClick={handleSave} className="fab-save">💾 حفظ التعديلات</button>

            {/* التوست والنوافذ */}
            {toast && <div className="toast-container"><div className={`toast ${toast.type === 'error' ? 'error' : 'success'}`}>{toast.msg}</div></div>}
            
            {securityModal.show && (
                <div className="modal-overlay" onClick={() => setSecurityModal({ show: false })}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="text-4xl mb-4">🛡️</div>
                        <h3 className="text-xl font-black mb-2">تأكيد الإجراء</h3>
                        <p className="text-gray-500 mb-4 text-sm">أدخل كلمة المرور (12345) للمتابعة</p>
                        <input 
                            type="password" 
                            className="w-full p-3 border-2 border-emerald-100 rounded-xl text-center text-xl font-black mb-4 outline-none focus:border-emerald-500" 
                            autoFocus 
                            value={passwordInput} 
                            onChange={e => setPasswordInput(e.target.value)} 
                        />
                        <div className="flex gap-2">
                            <button onClick={executeSecureAction} className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700">تأكيد</button>
                            <button onClick={() => setSecurityModal({ show: false })} className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold">إلغاء</button>
                        </div>
                    </div>
                </div>
            )}

            {/* 1. إعدادات المظهر */}
            <AdminSection id="settings" title="1. أحجام العرض 📏" activeTab={activeTab} setActiveTab={setActiveTab}>
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-gray-500">حجم واجهة الموقع</label>
                        <input type="range" min="0.5" max="1.2" step="0.05" className="scale-slider" 
                            value={config.settings.layoutScale} 
                            onChange={e => setConfig({ ...config, settings: { ...config.settings, layoutScale: parseFloat(e.target.value) } })} 
                        />
                    </div>
                </div>
            </AdminSection>

            {/* 2. النصوص الأساسية */}
            <AdminSection id="texts" title="2. النصوص ورسائل الطالب 📝" activeTab={activeTab} setActiveTab={setActiveTab}>
                <div className="space-y-3">
                    <input className="w-full p-3 border rounded-xl font-bold" placeholder="اسم الموقع" value={config.texts.siteTitle} onChange={e => setConfig({...config, texts: {...config.texts, siteTitle: e.target.value}})} />
                    <input className="w-full p-3 border rounded-xl font-bold" placeholder="عنوان الترحيب" value={config.texts.heroTitle} onChange={e => setConfig({...config, texts: {...config.texts, heroTitle: e.target.value}})} />
                    
                    <div className="bg-amber-50 p-3 rounded-xl border border-amber-200">
                        <label className="text-xs font-black text-amber-700 block mb-1">رسالة ركن الطالب (فوق الحاسبة):</label>
                        <textarea className="w-full p-3 border rounded-xl h-20" value={config.texts.studentMsg} onChange={e => setConfig({...config, texts: {...config.texts, studentMsg: e.target.value}})} />
                    </div>

                    <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                        <label className="text-xs font-black text-emerald-700 block mb-1">سؤال الأسبوع:</label>
                        <textarea className="w-full p-3 border rounded-xl h-20" value={config.texts.weeklyQuestion} onChange={e => setConfig({...config, texts: {...config.texts, weeklyQuestion: e.target.value}})} />
                    </div>
                </div>
            </AdminSection>

            {/* 3. الأخبار */}
            <AdminSection id="news" title="3. الأخبار والإعلانات 📰" activeTab={activeTab} setActiveTab={setActiveTab}>
                <button 
                    onClick={() => setConfig({ ...config, news: [{ id: Date.now(), title: '', date: new Date().toISOString().split('T')[0], content: '', hidden: false, colors: { title: '#000', content: '#555', link: '#2563eb' }, link: { url: '', text: '' } }, ...config.news] })} 
                    className="w-full bg-emerald-100 text-emerald-700 py-3 rounded-xl font-black mb-4 hover:bg-emerald-200"
                >
                    + إضافة خبر جديد
                </button>
                
                {config.news.map((item) => (
                    <div key={item.id} className={`p-4 border rounded-2xl mb-3 relative bg-white ${item.hidden ? 'item-hidden' : ''}`}>
                        <div className="flex justify-end gap-2 mb-2 border-b pb-2">
                            <button onClick={() => setSecurityModal({ show: true, action: 'hide', type: 'news', id: item.id })} className="text-xs bg-amber-100 text-amber-800 px-3 py-1 rounded-lg font-bold">{item.hidden ? 'إظهار' : 'إخفاء'}</button>
                            <button onClick={() => setSecurityModal({ show: true, action: 'delete', type: 'news', id: item.id })} className="text-xs bg-red-100 text-red-800 px-3 py-1 rounded-lg font-bold">حذف</button>
                        </div>
                        <input className="w-full p-2 font-black border rounded-lg mb-2" placeholder="عنوان الخبر" value={item.title} onChange={e => { const list = config.news.map(x => x.id === item.id ? { ...x, title: e.target.value } : x); setConfig({ ...config, news: list }); }} />
                        <textarea className="w-full p-2 border rounded-lg text-sm h-20 mb-2" placeholder="التفاصيل..." value={item.content} onChange={e => { const list = config.news.map(x => x.id === item.id ? { ...x, content: e.target.value } : x); setConfig({ ...config, news: list }); }} />
                        
                        <div className="flex gap-2 bg-gray-50 p-2 rounded-lg">
                            <input className="flex-1 p-1 text-xs border rounded" placeholder="رابط (https://...)" value={item.link?.url || ''} onChange={e => { const list = config.news.map(x => x.id === item.id ? { ...x, link: { ...x.link, url: e.target.value } } : x); setConfig({ ...config, news: list }); }} />
                            <input className="w-1/3 p-1 text-xs border rounded" placeholder="نص الرابط" value={item.link?.text || ''} onChange={e => { const list = config.news.map(x => x.id === item.id ? { ...x, link: { ...x.link, text: e.target.value } } : x); setConfig({ ...config, news: list }); }} />
                        </div>
                    </div>
                ))}
            </AdminSection>

            {/* 4. المعلمون */}
            <AdminSection id="teachers" title="4. المعلمون 👨‍🏫" activeTab={activeTab} setActiveTab={setActiveTab}>
                <button onClick={() => setConfig({ ...config, teachers: [...config.teachers, { id: Date.now(), name: 'معلم جديد', bio: '', avatar: '🧔', hidden: false }] })} className="w-full bg-blue-50 text-blue-600 py-3 rounded-xl font-black mb-4">+ إضافة معلم</button>
                {config.teachers.map((t) => (
                    <div key={t.id} className={`flex flex-col gap-2 mb-3 bg-white p-3 rounded-xl border ${t.hidden ? 'item-hidden' : ''}`}>
                        <div className="flex justify-end gap-2 mb-1">
                            <button onClick={() => setSecurityModal({ show: true, action: 'hide', type: 'teacher', id: t.id })} className="text-[10px] bg-amber-100 text-amber-800 px-2 py-1 rounded font-bold">{t.hidden ? 'إظهار' : 'إخفاء'}</button>
                            <button onClick={() => setSecurityModal({ show: true, action: 'delete', type: 'teacher', id: t.id })} className="text-[10px] bg-red-100 text-red-800 px-2 py-1 rounded font-bold">حذف</button>
                        </div>
                        <div className="flex gap-2">
                            <input className="w-12 p-2 border rounded text-center" placeholder="emoji" value={t.avatar} onChange={e => { const list = config.teachers.map(x => x.id === t.id ? { ...x, avatar: e.target.value } : x); setConfig({ ...config, teachers: list }); }} />
                            <input className="flex-1 font-bold border-b" placeholder="اسم المعلم" value={t.name} onChange={e => { const list = config.teachers.map(x => x.id === t.id ? { ...x, name: e.target.value } : x); setConfig({ ...config, teachers: list }); }} />
                        </div>
                        <textarea className="w-full text-xs bg-gray-50 p-2 rounded h-16" placeholder="نبذة..." value={t.bio} onChange={e => { const list = config.teachers.map(x => x.id === t.id ? { ...x, bio: e.target.value } : x); setConfig({ ...config, teachers: list }); }} />
                    </div>
                ))}
            </AdminSection>

            {/* 5. الجداول */}
            <AdminSection id="schedules" title="5. الجداول الدراسية 📅" activeTab={activeTab} setActiveTab={setActiveTab}>
                <div className="flex gap-2 mb-4">
                    <input id="newSchName" className="flex-1 border rounded p-2 text-xs font-bold" placeholder="اسم الحلقة" />
                    <select id="newSchPeriod" className="border rounded text-xs font-bold"><option value="عصر">عصر</option><option value="مغرب">مغرب</option></select>
                    <button onClick={() => {
                        const name = document.getElementById('newSchName').value;
                        const period = document.getElementById('newSchPeriod').value;
                        if(name) {
                            const newSch = {
                                id: Date.now(), name, period, hidden: false,
                                days: ['السبت','الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس'].map(d => ({ day: d, time: '', note: '' }))
                            };
                            setConfig({ ...config, schedules: [...config.schedules, newSch] });
                            document.getElementById('newSchName').value = '';
                        }
                    }} className="bg-indigo-600 text-white px-4 rounded text-xs font-bold">+ إضافة</button>
                </div>

                {config.schedules.map((sch) => (
                    <div key={sch.id} className={`p-3 border rounded-xl mb-3 bg-white ${sch.hidden ? 'item-hidden' : ''}`}>
                        <div className="flex justify-between items-center mb-2 border-b pb-2">
                            <span className="font-bold text-emerald-800">{sch.name} ({sch.period})</span>
                            <div className="flex gap-1">
                                <button onClick={() => setSecurityModal({ show: true, action: 'hide', type: 'schedule', id: sch.id })} className="text-[10px] bg-amber-100 px-2 py-1 rounded">👁️</button>
                                <button onClick={() => setSecurityModal({ show: true, action: 'delete', type: 'schedule', id: sch.id })} className="text-[10px] bg-red-100 px-2 py-1 rounded">🗑️</button>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-[10px]">
                                <tbody>
                                    {sch.days.map((d, i) => (
                                        <tr key={i} className="border-b last:border-0">
                                            <td className="font-bold w-12">{d.day}</td>
                                            <td><input className="w-full border rounded p-1" placeholder="الوقت" value={d.time} onChange={e => {
                                                const list = [...config.schedules];
                                                const idx = list.findIndex(x => x.id === sch.id);
                                                list[idx].days[i].time = e.target.value;
                                                setConfig({ ...config, schedules: list });
                                            }} /></td>
                                            <td><input className="w-full border rounded p-1" placeholder="ملاحظة" value={d.note} onChange={e => {
                                                const list = [...config.schedules];
                                                const idx = list.findIndex(x => x.id === sch.id);
                                                list[idx].days[i].note = e.target.value;
                                                setConfig({ ...config, schedules: list });
                                            }} /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}
            </AdminSection>

            {/* 6. أوائل الحلقات */}
            <AdminSection id="top" title="6. أوائل الحلقات 🏆" activeTab={activeTab} setActiveTab={setActiveTab}>
                <button onClick={() => { const name = prompt('اسم الحلقة:'); if (name) setConfig({ ...config, halaqat: [...config.halaqat, { id: Date.now(), name, students: [], hidden: false }] }); }} className="w-full bg-amber-100 text-amber-800 py-3 rounded-xl font-black mb-4">+ إضافة حلقة</button>
                {config.halaqat.map((h) => (
                    <div key={h.id} className={`p-4 bg-amber-50 rounded-2xl mb-4 border border-amber-200 ${h.hidden ? 'item-hidden' : ''}`}>
                        <div className="flex justify-between items-center mb-2 pb-2 border-b border-amber-200">
                            <span className="font-bold text-amber-900">{h.name}</span>
                            <div className="flex gap-2">
                                <button onClick={() => setSecurityModal({ show: true, action: 'hide', type: 'halqa', id: h.id })} className="text-[10px] text-amber-600 font-bold">👁️</button>
                                <button onClick={() => setSecurityModal({ show: true, action: 'delete', type: 'halqa', id: h.id })} className="text-[10px] text-red-600 font-bold">🗑️</button>
                            </div>
                        </div>
                        {h.students.map((st) => (
                            <div key={st.id} className="flex gap-1 mt-1 mb-1">
                                <input className="flex-1 p-2 rounded-lg border text-xs" value={st.name} placeholder="اسم الطالب" onChange={e => {
                                    const list = config.halaqat.map(x => x.id === h.id ? { ...x, students: x.students.map(s => s.id === st.id ? { ...s, name: e.target.value } : s) } : x);
                                    setConfig({ ...config, halaqat: list });
                                }} />
                                <input className="w-20 p-2 rounded-lg border text-xs text-center" value={st.rank} placeholder="المركز" onChange={e => {
                                    const list = config.halaqat.map(x => x.id === h.id ? { ...x, students: x.students.map(s => s.id === st.id ? { ...s, rank: e.target.value } : s) } : x);
                                    setConfig({ ...config, halaqat: list });
                                }} />
                                <button onClick={() => {
                                    const list = config.halaqat.map(x => x.id === h.id ? { ...x, students: x.students.filter(s => s.id !== st.id) } : x);
                                    setConfig({ ...config, halaqat: list });
                                }} className="text-red-500 font-bold px-2">×</button>
                            </div>
                        ))}
                        <button onClick={() => {
                            const list = config.halaqat.map(x => x.id === h.id ? { ...x, students: [...x.students, { id: Date.now(), name: '', rank: '' }] } : x);
                            setConfig({ ...config, halaqat: list });
                        }} className="text-xs bg-white w-full border border-amber-200 py-2 rounded-lg mt-2 font-bold text-amber-600">+ طالب</button>
                    </div>
                ))}
            </AdminSection>

            {/* 7. من نحن وروابط التواصل */}
            <AdminSection id="about" title="7. بيانات 'من نحن' 🔗" activeTab={activeTab} setActiveTab={setActiveTab}>
                <div className="space-y-3">
                    <textarea className="w-full p-3 border rounded-xl h-24" placeholder="المحتوى التعريفي" value={config.texts.aboutMain} onChange={e => setConfig({...config, texts: {...config.texts, aboutMain: e.target.value}})} />
                    <input className="w-full p-3 border rounded-xl" placeholder="الآية القرآنية" value={config.texts.aboutAyah} onChange={e => setConfig({...config, texts: {...config.texts, aboutAyah: e.target.value}})} />
                    <div className="grid grid-cols-2 gap-2">
                        <input className="p-2 border rounded text-xs" placeholder="هاتف" value={config.texts.contact.phone} onChange={e => setConfig({...config, texts: {...config.texts, contact: {...config.texts.contact, phone: e.target.value}}})} />
                        <input className="p-2 border rounded text-xs" placeholder="موقع جغرافي" value={config.texts.contact.location} onChange={e => setConfig({...config, texts: {...config.texts, contact: {...config.texts.contact, location: e.target.value}}})} />
                    </div>
                </div>
            </AdminSection>

            <button onClick={() => window.location.href = "index.html"} className="w-full py-4 mt-8 bg-gray-800 text-white rounded-2xl font-black shadow-xl">العودة لصفحة الزوار 🏠</button>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('admin-root'));
root.render(<AdminApp />);
