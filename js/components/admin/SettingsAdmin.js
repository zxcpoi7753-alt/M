/* =========================================
   المكون: إعدادات النصوص (النسخة الآمنة جداً - Anti-Crash)
   المسار: js/components/admin/SettingsAdmin.js
   ========================================= */
const SettingsAdmin = ({ config, setConfig }) => {
    
    // 1. حماية ضد البيانات الفارغة (أهم خطوة لمنع الشاشة البيضاء)
    // إذا لم تكن البيانات قد وصلت بعد، نعرض رسالة تحميل
    if (!config || !config.texts) {
        return <div className="p-8 text-center text-gray-500">⏳ جاري تحميل الإعدادات...</div>;
    }

    // التأكد من وجود كائن contact لتجنب الأخطاء
    const safeContact = config.texts.contact || {};

    const [notify, setNotify] = React.useState({ title: '', body: '' });

    // دالة التحديث الآمنة
    const updatePlatform = (key, field, val) => {
        // إنشاء نسخة عميقة لتجنب الخطأ
        const newConfig = JSON.parse(JSON.stringify(config));
        
        // التأكد من المسار
        if (!newConfig.texts) newConfig.texts = {};
        if (!newConfig.texts.contact) newConfig.texts.contact = {};
        if (!newConfig.texts.contact[key]) newConfig.texts.contact[key] = { active: false, val: '' };

        // التحديث
        newConfig.texts.contact[key][field] = val;
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
            console.error(e);
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
                
                {/* الهاتف والموقع */}
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

                {/* باقي المنصات */}
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
    );
};
