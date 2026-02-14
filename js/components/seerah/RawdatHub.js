/* =========================================
   المكون: روضة المحبين (التصميم الأصلي + إصلاح القص)
   المسار: js/components/seerah/RawdatHub.js
   ========================================= */
(function() {
    const { useState } = React;

    const RawdatHub = () => {
        const [section, setSection] = useState('hub');

        // استدعاء آمن للمكونات
        const ProphetSeerahComp = window.ProphetSeerah || (() => <div className="p-8 text-center">⚠️ جاري تحميل السيرة...</div>);
        const DuaSectionComp = window.DuaSection || (() => <div className="p-8 text-center">⚠️ جاري تحميل الأدعية...</div>);
        const AsmaHusnaComp = window.AsmaHusna || (() => <div className="p-8 text-center">⚠️ جاري تحميل الأسماء...</div>);

        // --- الشاشة الرئيسية (القائمة) ---
        // ✅ هذا الجزء مطابق لتصميمك القديم (أزرار كبيرة)
        if (section === 'hub') {
            return (
                <div className="h-full overflow-y-auto pb-40 pt-4 px-2 animate-in">
                    <div className="text-center mb-6">
                        <h2 className="font-amiri text-3xl font-bold text-emerald-900">روضة المحبين 💗</h2>
                        <p className="text-gray-500 text-xs mt-2 font-bold">بابك إلى المعرفة بالله ورسوله</p>
                    </div>

                    <div className="space-y-6">
                        {/* 1. زر سيرة النبي ﷺ */}
                        <div onClick={() => setSection('seerah')} className="relative overflow-hidden h-40 rounded-[2rem] shadow-xl cursor-pointer group border-4 border-amber-50 bg-white hover:scale-[1.02] transition duration-300">
                            <div className="absolute inset-0 bg-gradient-to-r from-amber-100 to-orange-50 opacity-50"></div>
                            <div className="relative z-10 flex flex-col items-center justify-center h-full p-4 text-center">
                                <span className="text-4xl mb-2 drop-shadow-sm">📜</span>
                                <h3 className="font-black text-2xl text-amber-900 font-amiri">سيرة المصطفى ﷺ</h3>
                                <p className="text-xs text-amber-800 font-bold mt-1">عش حياته.. كأنك تراه</p>
                            </div>
                        </div>

                        {/* 🔥 2. زر حصن المسلم 🔥 */}
                        <div onClick={() => setSection('duas')} className="relative overflow-hidden h-40 rounded-[2rem] shadow-xl cursor-pointer group border-4 border-emerald-50 bg-white hover:scale-[1.02] transition duration-300">
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-100 to-green-50 opacity-50"></div>
                            <div className="relative z-10 flex flex-col items-center justify-center h-full p-4 text-center">
                                <span className="text-4xl mb-2 drop-shadow-sm">🤲</span>
                                <h3 className="font-black text-2xl text-emerald-900 font-amiri">حصن المسلم</h3>
                                <p className="text-xs text-emerald-800 font-bold mt-1">أذكار وأدعية من الكتاب والسنة</p>
                            </div>
                        </div>

                        {/* 3. زر أسماء الله الحسنى */}
                        <div onClick={() => setSection('asma')} className="relative overflow-hidden h-40 rounded-[2rem] shadow-xl cursor-pointer group border-4 border-blue-50 bg-white hover:scale-[1.02] transition duration-300">
                            <div className="absolute inset-0 bg-gradient-to-r from-sky-100 to-blue-50 opacity-50"></div>
                            <div className="relative z-10 flex flex-col items-center justify-center h-full p-4 text-center">
                                <span className="text-4xl mb-2 drop-shadow-sm">🌟</span>
                                <h3 className="font-black text-2xl text-blue-900 font-amiri">أسماء الله الحسنى</h3>
                                <p className="text-xs text-blue-800 font-bold mt-1">اعرف ربك.. ليزداد حبك</p>
                            </div>
                        </div>
                    </div>

                    <div className="text-center opacity-50 mt-8 mb-8">
                        <p className="text-[10px] font-bold text-gray-400">قريباً: سير الصحابة والتابعين</p>
                    </div>
                </div>
            );
        }

        // --- داخل الأقسام ---
        // ✅ هذا الجزء الجديد الذي يحل مشكلة القص (Fixed Layout)
        return (
            <div className="fixed inset-0 z-50 bg-gray-50 flex flex-col h-screen w-full">
                
                {/* الهيدر الثابت */}
                <div className="bg-white/95 backdrop-blur shadow-sm border-b border-gray-200 px-4 py-3 flex justify-between items-center z-50 h-16 shrink-0">
                    <h3 className="font-amiri font-bold text-lg text-emerald-900 truncate">
                        {section === 'seerah' && 'سيرة الحبيب ﷺ'}
                        {section === 'duas' && 'حصن المسلم 🤲'}
                        {section === 'asma' && 'الأسماء الحسنى 🌟'}
                    </h3>
                    <button 
                        onClick={() => setSection('hub')} 
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2"
                    >
                        خروج ↩️
                    </button>
                </div>
                
                {/* المحتوى القابل للتحرك (Scrollable) */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden w-full relative">
                    <div className="pb-32 pt-4 px-2"> {/* حشوة سفلية كبيرة لمنع الاختفاء */}
                        {section === 'seerah' && <ProphetSeerahComp />}
                        {section === 'duas' && <DuaSectionComp />}
                        {section === 'asma' && <AsmaHusnaComp />}
                    </div>
                </div>

            </div>
        );
    };

    window.RawdatHub = RawdatHub;
})();
