/* =========================================
   المكون: روضة المحبين (البوابة الرئيسية - مع حصن المسلم)
   المسار: js/components/seerah/RawdatHub.js
   ========================================= */
(function() {
    const { useState } = React;

    const RawdatHub = () => {
        const [section, setSection] = useState('hub');

        // استدعاء آمن للمكونات (Fail-Safe)
        // نستخدم window مباشرة داخل الشرط لتجنب مشاكل التحميل
        const ProphetSeerahComp = window.ProphetSeerah || (() => <div className="p-8 text-center">⚠️ لم يتم تحميل السيرة بعد. تأكد من index.html</div>);
        const AsmaHusnaComp = window.AsmaHusna || (() => <div className="p-8 text-center">⚠️ لم يتم تحميل الأسماء بعد.</div>);
        const DuaSectionComp = window.DuaSection || (() => <div className="p-8 text-center">⚠️ لم يتم تحميل الأدعية بعد. تأكد من إضافة DuaSection.js</div>);

        // --- الشاشة الرئيسية (القائمة) ---
        if (section === 'hub') {
            return (
                <div className="space-y-6 animate-in pb-20">
                    <div className="text-center mb-6">
                        <h2 className="font-amiri text-3xl font-bold text-emerald-900">روضة المحبين 💗</h2>
                        <p className="text-gray-500 text-xs mt-2 font-bold">بابك إلى المعرفة بالله ورسوله</p>
                    </div>

                    {/* 1. زر سيرة النبي ﷺ */}
                    <div onClick={() => setSection('seerah')} className="relative overflow-hidden h-40 rounded-[2rem] shadow-xl cursor-pointer group border-4 border-amber-50 bg-white hover:scale-[1.02] transition duration-300">
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-100 to-orange-50 opacity-50"></div>
                        <div className="relative z-10 flex flex-col items-center justify-center h-full p-4 text-center">
                            <span className="text-4xl mb-2 drop-shadow-sm">📜</span>
                            <h3 className="font-black text-2xl text-amber-900 font-amiri">سيرة المصطفى ﷺ</h3>
                            <p className="text-xs text-amber-800 font-bold mt-1">عش حياته.. كأنك تراه</p>
                        </div>
                    </div>

                    {/* 🔥 2. زر حصن المسلم (الجديد) 🔥 */}
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

                    <div className="text-center opacity-50 mt-8">
                        <p className="text-[10px] font-bold text-gray-400">قريباً: سير الصحابة والتابعين</p>
                    </div>
                </div>
            );
        }

        // --- تحديد العنوان العلوي ---
        let headerTitle = '';
        if (section === 'seerah') headerTitle = 'سيرة الحبيب ﷺ';
        else if (section === 'duas') headerTitle = 'حصن المسلم 🤲';
        else if (section === 'asma') headerTitle = 'الأسماء الحسنى';

        return (
            <div className="animate-in h-full flex flex-col">
                <div className="flex justify-between items-center mb-4 px-2">
                    <h3 className="font-amiri font-bold text-lg text-gray-700">
                        {headerTitle}
                    </h3>
                    <button onClick={() => setSection('hub')} className="px-4 py-2 bg-gray-200 rounded-xl text-xs font-bold text-gray-700 shadow-sm flex items-center gap-2 hover:bg-gray-300">
                        خروج ↩️
                    </button>
                </div>
                
                {/* منطقة عرض المحتوى */}
                <div className="flex-1">
                    {section === 'seerah' && <ProphetSeerahComp />}
                    {section === 'duas' && <DuaSectionComp />}
                    {section === 'asma' && <AsmaHusnaComp />}
                </div>
            </div>
        );
    };

    window.RawdatHub = RawdatHub;
})();
