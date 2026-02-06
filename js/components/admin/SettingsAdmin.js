/* =========================================
   المكون: إعدادات النصوص ومن نحن (محدث)
   المسار: js/components/admin/SettingsAdmin.js
   ========================================= */
const SettingsAdmin = ({ config, setConfig }) => {
    return (
        <div className="space-y-6">
            {/* إعدادات المظهر */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-sm mb-3 text-gray-700 flex items-center gap-2">📏 حجم الموقع (Zoom) <span className="text-[10px] text-gray-400 font-normal">(يتحكم في تكبير الخطوط للزوار)</span></h3>
                <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-lg">
                    <span className="text-xs font-bold text-gray-500">صغير</span>
                    <input type="range" min="0.8" max="1.3" step="0.05" className="flex-1 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-emerald-600" value={config.settings.layoutScale} onChange={e => setConfig({...config, settings: { ...config.settings, layoutScale: parseFloat(e.target.value) } })} />
                    <span className="text-xs font-bold text-gray-500">كبير</span>
                </div>
            </div>

            {/* النصوص الأساسية */}
            <div className="grid gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-sm text-gray-700 border-b pb-2">📝 النصوص والرسائل</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                        <label className="text-xs font-bold text-gray-500 mb-1 block">اسم الموقع (الهيدر)</label>
                        <input className="w-full p-3 border rounded-xl bg-gray-50 focus:bg-white transition" value={config.texts.siteTitle} onChange={e=>setConfig({...config, texts:{...config.texts, siteTitle:e.target.value}})} placeholder="مثلاً: حلقات الثريا" />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 mb-1 block">العنوان الترحيبي</label>
                        <input className="w-full p-3 border rounded-xl bg-gray-50 focus:bg-white transition" value={config.texts.heroTitle} onChange={e=>setConfig({...config, texts:{...config.texts, heroTitle:e.target.value}})} placeholder="أهلاً بكم في..." />
                    </div>
                </div>

                <div>
                    <label className="text-xs font-bold text-amber-600 mb-1 block">رسالة ركن الطالب (الصندوق الأصفر)</label>
                    <textarea className="w-full p-3 border rounded-xl h-20 bg-amber-50 focus:bg-white transition border-amber-100" value={config.texts.studentMsg} onChange={e=>setConfig({...config, texts:{...config.texts, studentMsg:e.target.value}})} placeholder="رسالة تحفيزية..." />
                </div>

                <div className="grid grid-cols-1 gap-3">
                    <div>
                        <label className="text-xs font-bold text-emerald-600 mb-1 block">سؤال الأسبوع (الصندوق الأخضر)</label>
                        <textarea className="w-full p-3 border rounded-xl h-20 bg-emerald-50 focus:bg-white transition border-emerald-100" value={config.texts.weeklyQuestion} onChange={e=>setConfig({...config, texts:{...config.texts, weeklyQuestion:e.target.value}})} placeholder="نص السؤال..." />
                    </div>
                    
                    {/* إضافة الفائز السابق الجديدة */}
                    <div className="bg-gradient-to-r from-amber-50 to-white p-3 rounded-xl border border-amber-200">
                        <label className="text-xs font-black text-amber-700 mb-1 block flex items-center gap-1">🏆 الفائز في السؤال السابق <span className="bg-amber-200 text-[9px] px-2 rounded-full">جديد</span></label>
                        <input className="w-full p-2 border rounded-lg text-sm font-bold text-center" value={config.texts.previousWinner || ''} onChange={e=>setConfig({...config, texts:{...config.texts, previousWinner:e.target.value}})} placeholder="اكتب اسم الطالب الفائز هنا..." />
                    </div>
                </div>
            </div>

            {/* إعدادات من نحن (بتصميم الصورة المطلوب) */}
            <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 shadow-sm">
                <h3 className="font-bold text-emerald-800 mb-4 flex items-center gap-2">🔗 من نحن والتواصل</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <div>
                        <label className="text-[10px] font-bold text-green-700 block mb-1">واتساب (الرقم الدولي):</label>
                        <input className="w-full p-2 border border-green-200 rounded-lg bg-white text-left text-sm" dir="ltr" placeholder="9677xxxxxxxx" value={config.texts.contact.phone} onChange={e=>setConfig({...config, texts:{...config.texts, contact:{...config.texts.contact, phone:e.target.value}}})} />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-blue-700 block mb-1">الموقع (رابط خرائط جوجل):</label>
                        <input className="w-full p-2 border border-blue-200 rounded-lg bg-white text-left text-xs" dir="ltr" placeholder="https://maps..." value={config.texts.contact.location} onChange={e=>setConfig({...config, texts:{...config.texts, contact:{...config.texts.contact, location:e.target.value}}})} />
                    </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-gray-200 mb-3 space-y-2">
                    <p className="text-[10px] font-bold text-gray-400 text-left">منصات التواصل (الروابط):</p>
                    <div className="flex items-center gap-2">
                        <span className="w-16 text-[10px] font-bold text-red-600">يوتيوب:</span>
                        <input className="flex-1 p-1.5 border rounded text-xs bg-gray-50" value={config.texts.contact.youtube} onChange={e=>setConfig({...config, texts:{...config.texts, contact:{...config.texts.contact, youtube:e.target.value}}})} />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-16 text-[10px] font-bold text-blue-600">فيسبوك:</span>
                        <input className="flex-1 p-1.5 border rounded text-xs bg-gray-50" value={config.texts.contact.facebook} onChange={e=>setConfig({...config, texts:{...config.texts, contact:{...config.texts.contact, facebook:e.target.value}}})} />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-16 text-[10px] font-bold text-pink-600">انستقرام:</span>
                        <input className="flex-1 p-1.5 border rounded text-xs bg-gray-50" value={config.texts.contact.instagram} onChange={e=>setConfig({...config, texts:{...config.texts, contact:{...config.texts.contact, instagram:e.target.value}}})} />
                    </div>
                </div>

                <div className="mb-3">
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">النص التعريفي (من نحن):</label>
                    <textarea className="w-full p-3 border rounded-xl h-24 text-sm bg-white" placeholder="نحن حلقات الثريا..." value={config.texts.aboutMain} onChange={e=>setConfig({...config, texts:{...config.texts, aboutMain:e.target.value}})} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-[10px] font-bold block mb-1">الآية القرآنية:</label>
                        <input className="w-full p-2 border rounded-lg bg-white text-xs" value={config.texts.aboutAyah} onChange={e=>setConfig({...config, texts:{...config.texts, aboutAyah:e.target.value}})} />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold block mb-1">الخاتمة:</label>
                        <input className="w-full p-2 border rounded-lg bg-white text-xs" value={config.texts.aboutFooter} onChange={e=>setConfig({...config, texts:{...config.texts, aboutFooter:e.target.value}})} />
                    </div>
                </div>
            </div>
        </div>
    );
};
