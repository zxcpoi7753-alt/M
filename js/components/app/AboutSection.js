/* =========================================
   المكون: من نحن (يدعم جميع المنصات)
   المسار: js/components/app/AboutSection.js
   ========================================= */
const AboutSection = ({ texts }) => {
    const contact = texts?.contact || {};

    // قائمة تعريف المنصات (ألوان وأيقونات)
    const platformsDef = [
        { id: 'youtube', label: 'يوتيوب', bg: 'bg-red-50', border: 'border-red-100', text: 'text-red-600', icon: '▶️', hover: 'hover:border-red-500' },
        { id: 'facebook', label: 'فيسبوك', bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-600', icon: 'f', hover: 'hover:border-blue-600' },
        { id: 'instagram', label: 'انستقرام', bg: 'bg-pink-50', border: 'border-pink-100', text: 'text-pink-600', icon: '📸', hover: 'hover:border-pink-500' },
        { id: 'twitter', label: 'تويتر', bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-800', icon: '✖️', hover: 'hover:border-slate-800' },
        { id: 'tiktok', label: 'تيك توك', bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-black', icon: '🎵', hover: 'hover:border-black' },
        { id: 'telegram', label: 'تيليجرام', bg: 'bg-sky-50', border: 'border-sky-100', text: 'text-sky-500', icon: '✈️', hover: 'hover:border-sky-500' },
        { id: 'snapchat', label: 'سناب', bg: 'bg-yellow-50', border: 'border-yellow-100', text: 'text-yellow-600', icon: '👻', hover: 'hover:border-yellow-400' },
    ];

    return (
        <div className="space-y-6 max-w-xl mx-auto text-center animate-in">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-lg border border-emerald-50">
                <h2 className="text-2xl font-black text-emerald-800">{texts?.siteTitle}</h2>
                <p className="text-gray-600 font-bold leading-loose whitespace-pre-line mt-4">{texts?.aboutMain}</p>
                <div className="text-emerald-600 font-black mt-2 text-lg italic">"{texts?.aboutAyah}"</div>
                <p className="text-xs text-gray-400 mt-2">{texts?.aboutFooter}</p>
            </div>
            
            {/* الأساسيات (واتساب وموقع) - تظهر فقط إذا كانت مفعلة */}
            <div className="grid grid-cols-2 gap-3">
                {contact.phone?.active !== false && (
                    <a href={`tel:${contact.phone?.val || contact.phone}`} className="flex flex-col items-center justify-center p-4 bg-green-50 border-2 border-green-200 rounded-2xl shadow-sm hover:bg-green-100 transition">
                        <span className="text-2xl mb-1">📞</span>
                        <span className="font-bold text-green-700">واتساب</span>
                    </a>
                )}
                {contact.location?.active !== false && (
                    <a href={contact.location?.val || contact.location} target="_blank" className="flex flex-col items-center justify-center p-4 bg-blue-50 border-2 border-blue-200 rounded-2xl shadow-sm hover:bg-blue-100 transition">
                        <span className="text-2xl mb-1">📍</span>
                        <span className="font-bold text-blue-700">الموقع</span>
                    </a>
                )}
            </div>

            {/* باقي المنصات (ديناميكية) */}
            <div className="grid grid-cols-3 gap-3 mt-2">
                {platformsDef.map(p => {
                    // التحقق مما إذا كانت المنصة مفعلة في البيانات
                    const platformData = contact[p.id];
                    if (platformData && platformData.active === true && platformData.val) {
                        return (
                            <a key={p.id} href={platformData.val} target="_blank" className={`flex flex-col items-center justify-center p-3 border-2 rounded-2xl bg-white shadow-sm transition ${p.border} ${p.hover}`}>
                                <span className={`${p.text} text-3xl mb-1`}>{p.icon}</span>
                                <span className="text-[10px] font-bold text-gray-500">{p.label}</span>
                            </a>
                        );
                    }
                    return null;
                })}
            </div>
        </div>
    );
};
