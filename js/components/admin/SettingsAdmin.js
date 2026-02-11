/* =========================================
   المكون: إعدادات النصوص + التحكم بالظهور
   المسار: js/components/admin/SettingsAdmin.js
   ========================================= */
const SettingsAdmin = ({ config, setConfig }) => {
    
    // 1. حماية ضد البيانات الفارغة
    if (!config || !config.texts) {
        return <div className="p-8 text-center text-gray-500">⏳ جاري تحميل الإعدادات...</div>;
    }

    const safeContact = config.texts.contact || {};
    const [notify, setNotify] = React.useState({ title: '', body: '' });
    const [activeTab, setActiveTab] = React.useState('texts'); // للتبديل بين النصوص والظهور

    // دالة التحديث الآمنة
    const updatePlatform = (key, field, val) => {
        const newConfig = JSON.parse(JSON.stringify(config));
        if (!newConfig.texts) newConfig.texts = {};
        if (!newConfig.texts.contact) newConfig.texts.contact = {};
        if (!newConfig.texts.contact[key]) newConfig.texts.contact[key] = { active: false, val: '' };
        newConfig.texts.contact[key][field] = val;
        setConfig(newConfig);
    };

    // دالة التحكم بالظهور (الجديدة)
    const toggleVisibility = (section, key) => {
        const newConfig = JSON.parse(JSON.stringify(config));
        if (!newConfig.visibility) newConfig.visibility = {};
        if (!newConfig.visibility[section]) newConfig.visibility[section] = {};
        const currentVal = newConfig.visibility[section][key] !== false;
        newConfig.visibility[section][key] = !currentVal;
        setConfig(newConfig);
    };

    const sendNotification = async () => {
        if(!notify.title || !notify.body) return alert('الرجاء كتابة العنوان والرسالة');
        if (!window.confirm('⚠️ هل أنت متأكد؟\nسيصل هذا الإشعار للجميع!')) return;
        try {
            if (!window.setDoc || !window.db) throw new Error("قاعدة البيانات غير متصلة");
            await window.setDoc(window.doc(window.db, "appData", "notifications"), {
                id: Date.now().toString(),
                title: notify.title,
                body: notify.body,
                active: true,
                timestamp: new Date().toISOString()
            });
            alert('✅ تم الإرسال');
            setNotify({ title: '', body: '' });
        } catch (e) {
            alert('❌ خطأ: ' + e.message);
        }
    };

    const platforms = [
        { id: 'whatsapp', label: 'واتساب', color: 'text-green-600', icon: '💬' },
        { id: 'youtube', label: 'يوتيوب', color: 'text-red-600', icon: '▶️' },
        { id: 'facebook', label: 'فيسبوك', color: 'text-blue-600', icon: 'f' },
        { id: 'instagram', label: 'انستقرام', color: 'text-pink-600', icon: '📸' },
        { id: 'twitter', label: 'تويتر/X', color: 'text-slate-800', icon: '✖️' },
        { id: 'tiktok', label: 'تيك توك', color: 'text-black', icon: '🎵' },
        { id: 'telegram', label: 'تيليجرام', color: 'text-blue-400', icon: '✈️' },
        { id: 'snapchat', label: 'سناب', color: 'text-yellow-500', icon: '👻' },
    ];

    return (
        <div className="space-y-6 animate-in">
            
            {/* شريط التبويبات العلوي */}
            <div className="flex bg-gray-100 p-1 rounded-xl mb-4">
                <button onClick={() => setActiveTab('texts')} className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${activeTab === 'texts' ? 'bg-white shadow text-emerald-800' : 'text-gray-500'}`}>📝 النصوص والإشعارات</button>
                <button onClick={() => setActiveTab('visibility')} className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${activeTab === 'visibility' ? 'bg-white shadow text-emerald-800' : 'text-gray-500'}`}>👁️ إخفاء/إظهار الأقسام</button>
            </div>

            {/* === تبويب 1: النصوص والإشعارات (الكود الأصلي) === */}
            {activeTab === 'texts' && (
                <div className="space-y-6 animate-in">
                    {/* مركز الإشعارات */}
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <h3 className="font-bold text-blue-900 mb-3">🔔 مركز الإشعارات</h3>
                        <div className="space-y-2">
                            <input className="w-full p-2 border rounded-lg" placeholder="العنوان" value={notify.title} onChange={e => setNotify({...notify, title: e.target.value})} />
                            <textarea className="w-full p-2 border rounded-lg h-16 resize-none" placeholder="الرسالة" value={notify.body} onChange={e => setNotify({...notify, body: e.target.value})} />
                            <button onClick={sendNotification} className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700">إرسال</button>
                        </div>
                    </div>

                    {/* إعدادات النصوص */}
                    <div className="bg-white p-4 rounded-xl border shadow-sm">
                        <h3 className="font-bold mb-3 border-b pb-2">📝 النصوص الأساسية</h3>
                        <div className="grid gap-3">
                            <div><label className="text-xs font-bold text-gray-500">اسم الموقع</label><input className="w-full p-2 border rounded" value={config.texts.siteTitle || ''} onChange={e=>setConfig({...config, texts:{...config.texts, siteTitle:e.target.value}})} /></div>
                            <div><label className="text-xs font-bold text-gray-500">الترحيب</label><input className="w-full p-2 border rounded" value={config.texts.heroTitle || ''} onChange={e=>setConfig({...config, texts:{...config.texts, heroTitle:e.target.value}})} /></div>
                            <div><label className="text-xs font-bold text-gray-500">سؤال الأسبوع</label><textarea className="w-full p-2 border rounded" value={config.texts.weeklyQuestion || ''} onChange={e=>setConfig({...config, texts:{...config.texts, weeklyQuestion:e.target.value}})} /></div>
                            <div><label className="text-xs font-bold text-gray-500">🏆 الفائز السابق</label><input className="w-full p-2 border rounded bg-yellow-50" value={config.texts.previousWinner || ''} onChange={e=>setConfig({...config, texts:{...config.texts, previousWinner:e.target.value}})} /></div>
                        </div>
                    </div>

                    {/* التواصل */}
                    <div className="bg-white p-4 rounded-xl border shadow-sm">
                        <h3 className="font-bold mb-3 border-b pb-2">🔗 التواصل</h3>
                        <div className="grid md:grid-cols-2 gap-3 mb-4">
                            <div>
                                <div className="flex justify-between"><label className="text-xs font-bold text-green-700">اتصال (Call)</label><input type="checkbox" checked={safeContact.phone?.active !== false} onChange={e=>updatePlatform('phone', 'active', e.target.checked)}/></div>
                                <input className="w-full p-2 border rounded" value={safeContact.phone?.val || safeContact.phone || ''} onChange={e=>updatePlatform('phone', 'val', e.target.value)} />
                            </div>
                            <div>
                                <div className="flex justify-between"><label className="text-xs font-bold text-blue-700">الخريطة (Map)</label><input type="checkbox" checked={safeContact.location?.active !== false} onChange={e=>updatePlatform('location', 'active', e.target.checked)}/></div>
                                <input className="w-full p-2 border rounded" value={safeContact.location?.val || safeContact.location || ''} onChange={e=>updatePlatform('location', 'val', e.target.value)} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            {platforms.map(p => {
                                const pData = safeContact[p.id] || { active: false, val: '' };
                                return (
                                    <div key={p.id} className="flex items-center gap-2">
                                        <input type="checkbox" checked={pData.active === true} onChange={e => updatePlatform(p.id, 'active', e.target.checked)} />
                                        <span className={`w-20 text-xs font-bold ${p.color}`}>{p.icon} {p.label}</span>
                                        <input className="flex-1 p-1 border rounded text-xs" value={pData.val || ''} onChange={e => updatePlatform(p.id, 'val', e.target.value)} disabled={!pData.active} placeholder="الرابط..." />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* === تبويب 2: التحكم بالظهور (الجديد) === */}
            {activeTab === 'visibility' && (
                <div className="space-y-4 animate-in">
                    <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg text-xs text-yellow-800 mb-2">
                        💡 اضغط على الزر لإخفائه (🚫) أو إظهاره (✅) في التطبيق.
                    </div>

                    {/* القائمة العلوية */}
                    <div className="bg-white p-4 rounded-xl border border-gray-200">
                        <h3 className="font-black text-gray-800 mb-3">🧭 القائمة العلوية (Navigation)</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                {id: 'home', label: 'الرئيسية'},
                                {id: 'student_corner', label: 'ركن الطالب'},
                                {id: 'extras', label: 'واحة الزوار'},
                                {id: 'teachers', label: 'المعلمون'},
                                {id: 'students', label: 'الأوائل'},
                                {id: 'schedules', label: 'الجداول'},
                                {id: 'about', label: 'من نحن'},
                                {id: 'card', label: 'بطاقتي'}
                            ].map(item => (
                                <button key={item.id} onClick={() => toggleVisibility('nav', item.id)} 
                                    className={`p-3 rounded-xl border flex justify-between items-center transition ${config.visibility?.nav?.[item.id] !== false ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-gray-50 text-gray-400 grayscale'}`}>
                                    <span className="text-xs font-bold">{item.label}</span>
                                    <span>{config.visibility?.nav?.[item.id] !== false ? '✅' : '🚫'}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ركن الطالب */}
                    <div className="bg-white p-4 rounded-xl border border-gray-200">
                        <h3 className="font-black text-gray-800 mb-3">🎓 أزرار ركن الطالب</h3>
                        <div className="grid grid-cols-1 gap-2">
                            {[
                                {id: 'effort', label: '📅 خطة ختمي'},
                                {id: 'time', label: '🎯 دليل الختم'},
                                {id: 'test', label: '🧠 اختبار الحفظ'},
                                {id: 'quran', label: '📖 المصحف الشريف'},
                                {id: 'azkar', label: '📿 الأذكار'}
                            ].map(item => (
                                <button key={item.id} onClick={() => toggleVisibility('student', item.id)} 
                                    className={`p-3 rounded-xl border flex justify-between items-center transition ${config.visibility?.student?.[item.id] !== false ? 'bg-blue-50 border-blue-200 text-blue-800' : 'bg-gray-50 text-gray-400 grayscale'}`}>
                                    <span className="text-xs font-bold">{item.label}</span>
                                    <span>{config.visibility?.student?.[item.id] !== false ? '✅' : '🚫'}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* واحة الزوار */}
                    <div className="bg-white p-4 rounded-xl border border-gray-200">
                        <h3 className="font-black text-gray-800 mb-3">🌱 أزرار واحة الزوار</h3>
                        <div className="grid grid-cols-1 gap-2">
                            {[
                                {id: 'virtuous', label: '⏳ منبه الأوقات'},
                                {id: 'wird', label: '📿 الورد اليومي'},
                                {id: 'counter', label: '🌍 العداد العالمي'},
                                {id: 'feeling', label: '💊 صيدلية القلوب'},
                                {id: 'quran_exam', label: '🧠 المحاكي القرآني'},
                                {id: 'tafseer_exam', label: '💡 مسابقة التفسير'},
                                {id: 'card', label: '🎨 صانع البطاقات'}
                            ].map(item => (
                                <button key={item.id} onClick={() => toggleVisibility('extras', item.id)} 
                                    className={`p-3 rounded-xl border flex justify-between items-center transition ${config.visibility?.extras?.[item.id] !== false ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-gray-50 text-gray-400 grayscale'}`}>
                                    <span className="text-xs font-bold">{item.label}</span>
                                    <span>{config.visibility?.extras?.[item.id] !== false ? '✅' : '🚫'}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};
