/* =========================================
   المكون: من نحن
   المسار: js/components/app/AboutSection.js
   ========================================= */
const AboutSection = ({ texts }) => (
    <div className="space-y-6 max-w-xl mx-auto text-center animate-in">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-lg border border-emerald-50">
            <h2 className="text-2xl font-black text-emerald-800">{texts?.siteTitle}</h2>
            <p className="text-gray-600 font-bold leading-loose whitespace-pre-line mt-4">{texts?.aboutMain}</p>
            <div className="text-emerald-600 font-black mt-2 text-lg italic">"{texts?.aboutAyah}"</div>
            <p className="text-xs text-gray-400 mt-2">{texts?.aboutFooter}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
            <a href={`tel:${texts?.contact?.phone}`} className="flex flex-col items-center justify-center p-4 bg-green-50 border-2 border-green-200 rounded-2xl shadow-sm font-bold text-green-700 hover:bg-green-100 transition"><span className="text-2xl mb-1">📞</span> واتساب</a>
            <a href={texts?.contact?.location} target="_blank" className="flex flex-col items-center justify-center p-4 bg-blue-50 border-2 border-blue-200 rounded-2xl shadow-sm font-bold text-blue-700 hover:bg-blue-100 transition"><span className="text-2xl mb-1">📍</span> الموقع</a>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-2">
            {texts?.contact?.youtube && <a href={texts.contact.youtube} className="flex flex-col items-center justify-center p-3 border-2 border-red-100 rounded-2xl bg-white shadow-sm hover:border-red-500 transition"><span className="text-red-600 text-3xl">▶️</span><span className="text-[10px] font-bold mt-1 text-gray-500">يوتيوب</span></a>}
            {texts?.contact?.facebook && <a href={texts.contact.facebook} className="flex flex-col items-center justify-center p-3 border-2 border-blue-100 rounded-2xl bg-white shadow-sm hover:border-blue-600 transition"><span className="text-blue-600 text-3xl font-black">f</span><span className="text-[10px] font-bold mt-1 text-gray-500">فيسبوك</span></a>}
            {texts?.contact?.instagram && <a href={texts.contact.instagram} className="flex flex-col items-center justify-center p-3 border-2 border-pink-100 rounded-2xl bg-white shadow-sm hover:border-pink-500 transition"><span className="text-pink-600 text-3xl">📸</span><span className="text-[10px] font-bold mt-1 text-gray-500">انستقرام</span></a>}
        </div>
    </div>
);
