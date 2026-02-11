/* =========================================
   المكون: روضة المحبين (البوابة الرئيسية)
   المسار: js/components/seerah/RawdatHub.js
   ========================================= */
const { useState } = React;

// تعريف المكونات الفرعية (يتم تحميلها من المتصفح)
const ProphetSeerah = window.ProphetSeerah || (() => <div className="p-4 text-center">جاري تحميل السيرة...</div>);
const AsmaHusna = window.AsmaHusna || (() => <div className="p-4 text-center">جاري تحميل الأسماء...</div>);

window.RawdatHub = () => {
    const [section, setSection] = useState('hub'); // hub, seerah, asma

    // واجهة الاستقبال (البوابتين)
    if (section === 'hub') {
        return (
            <div className="space-y-6 animate-in pb-20">
                <div className="text-center mb-6">
                    <h2 className="font-amiri text-3xl font-bold text-emerald-900">روضة المحبين 💗</h2>
                    <p className="text-gray-500 text-xs mt-2 font-bold">بابك إلى المعرفة بالله ورسوله</p>
                </div>

                {/* زر سيرة النبي ﷺ */}
                <div onClick={() => setSection('seerah')} className="relative overflow-hidden h-40 rounded-[2rem] shadow-xl cursor-pointer group border-4 border-amber-50 bg-white hover:scale-[1.02] transition duration-300">
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-100 to-orange-50 opacity-50"></div>
                    <div className="relative z-10 flex flex-col items-center justify-center h-full p-4 text-center">
                        <span className="text-4xl mb-2 drop-shadow-sm">📜</span>
                        <h3 className="font-black text-2xl text-amber-900 font-amiri">سيرة المصطفى ﷺ</h3>
                        <p className="text-xs text-amber-800 font-bold mt-1">عش حياته.. كأنك تراه</p>
                    </div>
                </div>

                {/* زر أسماء الله الحسنى */}
                <div onClick={() => setSection('asma')} className="relative overflow-hidden h-40 rounded-[2rem] shadow-xl cursor-pointer group border-4 border-blue-50 bg-white hover:scale-[1.02] transition duration-300">
                    <div className="absolute inset-0 bg-gradient-to-r from-sky-100 to-blue-50 opacity-50"></div>
                    <div className="relative z-10 flex flex-col items-center justify-center h-full p-4 text-center">
                        <span className="text-4xl mb-2 drop-shadow-sm">🌟</span>
                        <h3 className="font-black text-2xl text-blue-900 font-amiri">أسماء الله الحسنى</h3>
                        <p className="text-xs text-blue-800 font-bold mt-1">اعرف ربك.. ليزداد حبك</p>
                    </div>
                </div>

                {/* قسم قريباً */}
                <div className="text-center opacity-50 mt-8">
                    <p className="text-[10px] font-bold text-gray-400">قريباً: سير الصحابة والتابعين</p>
                </div>
            </div>
        );
    }

    // عرض الأقسام الداخلية
    return (
        <div className="animate-in h-full flex flex-col">
            <div className="flex justify-between items-center mb-4 px-2">
                <h3 className="font-amiri font-bold text-lg text-gray-700">
                    {section === 'seerah' ? 'سيرة الحبيب ﷺ' : 'الأسماء الحسنى'}
                </h3>
                <button onClick={() => setSection('hub')} className="px-4 py-2 bg-gray-200 rounded-xl text-xs font-bold text-gray-700 shadow-sm flex items-center gap-2 hover:bg-gray-300">
                    خروج ↩️
                </button>
            </div>
            
            {section === 'seerah' && <window.ProphetSeerah />}
            {section === 'asma' && <window.AsmaHusna />}
        </div>
    );
};
