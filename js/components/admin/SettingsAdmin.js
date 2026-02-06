/* =========================================
   المكون: إعدادات النصوص ومن نحن
   المسار: js/components/admin/SettingsAdmin.js
   ========================================= */
const SettingsAdmin = ({ config, setConfig }) => {
    return (
        <div className="space-y-6">
            {/* إعدادات المظهر */}
            <div className="bg-gray-50 p-4 rounded-xl border">
                <h3 className="font-bold text-sm mb-2 text-gray-700">📏 حجم الموقع (Zoom)</h3>
                <div className="flex items-center gap-4">
                    <span className="text-xs">صغير</span>
                    <input type="range" min="0.5" max="1.2" step="0.05" className="flex-1" value={config.settings.layoutScale} onChange={e => setConfig({...config, settings: { ...config.settings, layoutScale: parseFloat(e.target.value) } })} />
                    <span className="text-xs">كبير</span>
                </div>
            </div>

            {/* النصوص الأساسية */}
            <div className="grid gap-3">
                <input className="w-full p-3 border rounded-xl" value={config.texts.siteTitle} onChange={e=>setConfig({...config, texts:{...config.texts, siteTitle:e.target.value}})} placeholder="اسم الموقع" />
                <input className="w-full p-3 border rounded-xl" value={config.texts.heroTitle} onChange={e=>setConfig({...config, texts:{...config.texts, heroTitle:e.target.value}})} placeholder="العنوان الترحيبي" />
                <textarea className="w-full p-3 border rounded-xl h-20" value={config.texts.studentMsg} onChange={e=>setConfig({...config, texts:{...config.texts, studentMsg:e.target.value}})} placeholder="رسالة الطالب" />
                <textarea className="w-full p-3 border rounded-xl h-20" value={config.texts.weeklyQuestion} onChange={e=>setConfig({...config, texts:{...config.texts, weeklyQuestion:e.target.value}})} placeholder="سؤال الأسبوع" />
            </div>

            {/* إعدادات من نحن */}
            <div className="border-t pt-4">
                <h3 className="font-bold text-emerald-800 mb-3">🔗 من نحن والتواصل</h3>
                <div className="grid grid-cols-2 gap-2 mb-2">
                    <input className="p-2 border rounded text-xs" placeholder="واتساب" value={config.texts.contact.phone} onChange={e=>setConfig({...config, texts:{...config.texts, contact:{...config.texts.contact, phone:e.target.value}}})} />
                    <input className="p-2 border rounded text-xs" placeholder="الموقع" value={config.texts.contact.location} onChange={e=>setConfig({...config, texts:{...config.texts, contact:{...config.texts.contact, location:e.target.value}}})} />
                </div>
                <div className="space-y-2 mb-4">
                    <input className="w-full p-2 border rounded text-xs" placeholder="يوتيوب" value={config.texts.contact.youtube} onChange={e=>setConfig({...config, texts:{...config.texts, contact:{...config.texts.contact, youtube:e.target.value}}})} />
                    <input className="w-full p-2 border rounded text-xs" placeholder="فيسبوك" value={config.texts.contact.facebook} onChange={e=>setConfig({...config, texts:{...config.texts, contact:{...config.texts.contact, facebook:e.target.value}}})} />
                    <input className="w-full p-2 border rounded text-xs" placeholder="انستقرام" value={config.texts.contact.instagram} onChange={e=>setConfig({...config, texts:{...config.texts, contact:{...config.texts.contact, instagram:e.target.value}}})} />
                </div>
                <textarea className="w-full p-3 border rounded-xl h-24 text-sm" placeholder="نص من نحن" value={config.texts.aboutMain} onChange={e=>setConfig({...config, texts:{...config.texts, aboutMain:e.target.value}})} />
            </div>
        </div>
    );
};
