/* =========================================
   المكون: إعدادات النصوص + مركز الإشعارات (المتكامل)
   المسار: js/components/admin/SettingsAdmin.js
   ========================================= */
const SettingsAdmin = ({ config, setConfig }) => {
    
    // حالة للإشعار الجديد (خاصة بهذا المكون فقط)
    const [notify, setNotify] = React.useState({ title: '', body: '' });

    // دالة تحديث بيانات المنصات
    const updatePlatform = (key, field, val) => {
        setConfig(prev => ({
            ...prev,
            texts: {
                ...prev.texts,
                contact: {
                    ...prev.texts.contact,
                    [key]: { ...prev.texts.contact[key], [field]: val }
                }
            }
        }));
    };

    // دالة إرسال الإشعار
    const sendNotification = async () => {
        if(!notify.title || !notify.body) return alert('الرجاء كتابة العنوان والرسالة');
        
        // استخدام confirm العادي هنا لأنه داخل مكون فرعي (أو يمكن تمرير دالة Modal من الأب)
        const confirmSend = confirm('⚠️ هل أنت متأكد؟\nسيصل هذا الإشعار لجميع مستخدمي الموقع فوراً!');
        if(!confirmSend) return;

        try {
            await window.setDoc(window.doc(window.db, "appData", "notifications"), {
                id: Date.now().toString(),
                title: notify.title,
                body: notify.body,
                active: true,
                timestamp: new Date().toISOString()
            });
            alert('✅ تم إرسال الإشعار بنجاح');
            setNotify({ title: '', body: '' });
        } catch (e) {
            alert('❌ فشل الإرسال: ' + e.message);
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
        <div className="space-y-6">
            
            {/* --- قسم 1: مركز الإشعارات (الجديد) --- */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-4 rounded-xl border border-indigo-100 shadow-sm">
                <h3 className="font-black text-indigo-900 mb-3 flex items-center gap-2">🔔 مركز الإشعارات (للموقع والهاتف)</h3>
                <div className="space-y-3">
                    <input 
                        className="w-full p-3 border rounded-xl font-bold focus:ring-2 ring-indigo-200 outline-none" 
                        placeholder="عنوان الإشعار (مثلاً: 📢 تنبيه هام)" 
                        value={notify.title}
                        onChange={e => setNotify({...notify, title: e.target.value})}
                    />
                    <textarea 
                        className="w-full p-3 border rounded-xl h-20 resize-none text-sm focus:ring-2 ring-indigo-200 outline-none" 
                        placeholder="نص الرسالة..."
                        value={notify.body}
                        onChange={e => setNotify({...notify, body: e.target.value})}
                    />
                    <button 
                        onClick={sendNotification} 
                        className="w-full bg-indigo-600 text-white py-3 rounded-xl font-black shadow-lg hover:bg-indigo-700 transition transform active:scale-95"
                    >
                        🚀 إرسال للجميع الآن
                    </button>
                    <p className="text-[10px] text-indigo-400 text-center">سيظهر الإشعار كنافذة منبثقة وكإشعار هاتف لكل من يفتح الموقع.</p>
                </div>
            </div>

            {/* --- قسم 2: إعدادات المظهر --- */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-sm mb-3 text-gray-700 flex items-center gap-2">📏 حجم الموقع (Zoom)</h3>
                <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-lg">
                    <span className="text-xs font-bold text-gray-500">صغير</span>
                    <input type="range" min="0.8" max="1.3" step="0.05" className="flex-1 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-emerald-600" value={config.settings.layoutScale} onChange={e => setConfig({...config, settings: { ...config.settings, layoutScale: parseFloat(e.target.value) } })} />
                    <span className="text-xs font-bold text-gray-500">كبير</span>
                </div>
            </div>

            {/* --- قسم 3: النصوص والرسائل --- */}
            <div className="grid gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-sm text-gray-700 border-b pb-2">📝 النصوص والرسائل</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div><label className="text-xs font-bold text-gray-500 mb-1 block">اسم الموقع</label><input className="w-full p-3 border rounded-xl bg-gray-50 focus:bg-white transition" value={config.texts.siteTitle} onChange={e=>setConfig({...config, texts:{...config.texts, siteTitle:e.target.value}})} /></div>
                    <div><label className="text-xs font-bold text-gray-500 mb-1 block">العنوان الترحيبي</label><input className="w-full p-3 border rounded-xl bg-gray-50 focus:bg-white transition" value={config.texts.heroTitle} onChange={e=>setConfig({...config, texts:{...config.texts, heroTitle:e.target.value}})} /></div>
                </div>
                <div><label className="text-xs font-bold text-amber-600 mb-1 block">رسالة ركن الطالب</label><textarea className="w-full p-3 border rounded-xl h-20 bg-amber-50 focus:bg-white transition border-amber-100" value={config.texts.studentMsg} onChange={e=>setConfig({...config, texts:{...config.texts, studentMsg:e.target.value}})} /></div>
                <div className="grid grid-cols-1 gap-3">
                    <div><label className="text-xs font-bold text-emerald-600 mb-1 block">سؤال الأسبوع</label><textarea className="w-full p-3 border rounded-xl h-20 bg-emerald-50 focus:bg-white transition border-emerald-100" value={config.texts.weeklyQuestion} onChange={e=>setConfig({...config, texts:{...config.texts, weeklyQuestion:e.target.value}})} /></div>
                    <div className="bg-gradient-to-r from-amber-50 to-white p-3 rounded-xl border border-amber-200"><label className="text-xs font-black text-amber-700 mb-1 block flex items-center gap-1">🏆 الفائز السابق</label><input className="w-full p-2 border rounded-lg text-sm font-bold text-center" value={config.texts.previousWinner || ''} onChange={e=>setConfig({...config, texts:{...config.texts, previousWinner:e.target.value}})} /></div>
                </div>
            </div>

            {/* --- قسم 4: من نحن والتواصل --- */}
            <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 shadow-sm">
                <h3 className="font-bold text-emerald-800 mb-4 flex items-center gap-2">🔗 من نحن والتواصل</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <div className="relative">
                        <div className="flex justify-between mb-1"><label className="text-[10px] font-bold text-green-700">اتصال هاتفي (Call):</label><input type="checkbox" checked={config.texts.contact.phone?.active !== false} onChange={e=>updatePlatform('phone', 'active', e.target.checked)} className="accent-green-600"/></div>
                        <input className={`w-full p-2 border border-green-200 rounded-lg text-left text-sm ${config.texts.contact.phone?.active===false ? 'opacity-50 bg-gray-100' : 'bg-white'}`} placeholder="رقم الجوال" value={config.texts.contact.phone?.val || config.texts.contact.phone || ''} onChange={e=>updatePlatform('phone', 'val', e.target.value)} />
                    </div>
                    <div className="relative">
                        <div className="flex justify-between mb-1"><label className="text-[10px] font-bold text-blue-700">الموقع (Maps):</label><input type="checkbox" checked={config.texts.contact.location?.active !== false} onChange={e=>updatePlatform('location', 'active', e.target.checked)} className="accent-blue-600"/></div>
                        <input className={`w-full p-2 border border-blue-200 rounded-lg text-left text-xs ${config.texts.contact.location?.active===false ? 'opacity-50 bg-gray-100' : 'bg-white'}`} placeholder="https://maps..." value={config.texts.contact.location?.val || config.texts.contact.location || ''} onChange={e=>updatePlatform('location', 'val', e.target.value)} />
                    </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-gray-200 mb-3 space-y-3">
                    <p className="text-[10px] font-bold text-gray-400 text-left border-b pb-1">منصات التواصل (فعل ما تحتاج):</p>
                    {platforms.map(p => (
                        <div key={p.id} className="flex items-center gap-2">
                            <input type="checkbox" checked={config.texts.contact[p.id]?.active === true} onChange={e => updatePlatform(p.id, 'active', e.target.checked)} className="w-4 h-4 accent-emerald-600 cursor-pointer" />
                            <span className={`w-20 text-[10px] font-bold ${p.color}`}>{p.icon} {p.label}:</span>
                            <input className={`flex-1 p-1.5 border rounded text-xs transition ${config.texts.contact[p.id]?.active ? 'bg-white border-gray-300' : 'bg-gray-100 border-gray-100 text-gray-400'}`} value={config.texts.contact[p.id]?.val || ''} onChange={e => updatePlatform(p.id, 'val', e.target.value)} placeholder={`رابط/رقم ${p.label}`} disabled={!config.texts.contact[p.id]?.active} />
                        </div>
                    ))}
                </div>

                <div className="mb-3">
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">النص التعريفي (من نحن):</label>
                    <textarea className="w-full p-3 border rounded-xl h-24 text-sm bg-white" placeholder="نحن حلقات الثريا..." value={config.texts.aboutMain} onChange={e=>setConfig({...config, texts:{...config.texts, aboutMain:e.target.value}})} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div><label className="text-[10px] font-bold block mb-1">الآية القرآنية:</label><input className="w-full p-2 border rounded-lg bg-white text-xs" value={config.texts.aboutAyah} onChange={e=>setConfig({...config, texts:{...config.texts, aboutAyah:e.target.value}})} /></div>
                    <div><label className="text-[10px] font-bold block mb-1">الخاتمة:</label><input className="w-full p-2 border rounded-lg bg-white text-xs" value={config.texts.aboutFooter} onChange={e=>setConfig({...config, texts:{...config.texts, aboutFooter:e.target.value}})} /></div>
                </div>
            </div>
        </div>
    );
};
