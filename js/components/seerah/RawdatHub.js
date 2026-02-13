/* =========================================
   المكون: روضة المحبين (البوابة الرئيسية - مع حصن المسلم)
   المسار: js/components/seerah/RawdatHub.js
   ========================================= */
(function() {
    const { useState } = React;

    const RawdatHub = () => {
        const [section, setSection] = useState('hub');

        // استدعاء آمن للمكونات (Fail-Safe)
        const ProphetSeerahComp = window.ProphetSeerah || (() => <div className="p-4 text-center animate-pulse">جاري تحميل السيرة... 📜</div>);
        const DuaSectionComp = window.DuaSection || (() => <div className="p-4 text-center animate-pulse">جاري تحميل الأدعية... 🤲</div>);
        const AsmaHusnaComp = window.AsmaHusna || (() => <div className="p-4 text-center animate-pulse">جاري تحميل الأسماء... 🌟</div>);

        // --- الشاشة الرئيسية (القائمة) ---
        if (section === 'hub') {
            return (
                <div className="space-y-4 animate-in pb-24 px-1">
                    
                    {/* الترويسة */}
                    <div className="text-center mb-6 pt-2">
                        <h2 className="font-amiri text-3xl font-black text-emerald-900 drop-shadow-sm">روضة المحبين 💗</h2>
                        <p className="text-emerald-600 text-xs mt-2 font-bold bg-emerald-50 inline-block px-3 py-1 rounded-full border border-emerald-100">
                            بابك إلى المعرفة بالله ورسوله
                        </p>
                    </div>

                    {/* 1. زر سيرة النبي ﷺ */}
                    <div 
                        onClick={() => setSection('seerah')} 
                        className="relative overflow-hidden h-36 rounded-[2rem] shadow-lg cursor-pointer group border-2 border-amber-100 bg-white active:scale-95 transition-all duration-200"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-orange-50 opacity-80 group-hover:opacity-100 transition"></div>
                        <div className="relative z-10 flex items-center justify-between h-full px-8">
                            <div className="text-right">
                                <h3 className="font-black text-2xl text-amber-900 font-amiri mb-1">سيرة المصطفى ﷺ</h3>
                                <p className="text-xs text-amber-700 font-bold opacity-80">عش حياته.. كأنك تراه</p>
                            </div>
                            <span className="text-5xl drop-shadow-md transform group-hover:-rotate-12 transition duration-300">📜</span>
                        </div>
                    </div>

                    {/* 2. زر حصن المسلم (الجديد 🔥) */}
                    <div 
                        onClick={() => setSection('duas')} 
                        className="relative overflow-hidden h-36 rounded-[2rem] shadow-lg cursor-pointer group border-2 border-emerald-100 bg-white active:scale-95 transition-all duration-200"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-green-50 opacity-80 group-hover:opacity-100 transition"></div>
                        <div className="relative z-10 flex items-center justify-between h-full px-8">
                            <div className="text-right">
                                <h3 className="font-black text-2xl text-emerald-900 font-amiri mb-1">حصن المسلم</h3>
                                <p className="text-xs text-emerald-700 font-bold opacity-80">أدعية وأذكار لكل وقت</p>
                            </div>
                            <span className="text-5xl drop-shadow-md transform group-hover:scale-110 transition duration-300">🤲</span>
                        </div>
                    </div>

                    {/* 3. زر أسماء الله الحسنى */}
                    <div 
                        onClick={() => setSection('asma')} 
                        className="relative overflow-hidden h-36 rounded-[2rem] shadow-lg cursor-pointer group border-2 border-blue-100 bg-white active:scale-95 transition-all duration-200"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-sky-50 to-blue-50 opacity-80 group-hover:opacity-100 transition"></div>
                        <div className="relative z-10 flex items-center justify-between h-full px-8">
                            <div className="text-right">
                                <h3 className="font-black text-2xl text-blue-900 font-amiri mb-1">أسماء الله الحسنى</h3>
                                <p className="text-xs text-blue-700 font-bold opacity-80">اعرف ربك.. ليزداد حبك</p>
                            </div>
                            <span className="text-5xl drop-shadow-md transform group-hover:rotate-12 transition duration-300">🌟</span>
                        </div>
                    </div>

                    <div className="text-center opacity-40 mt-8 pb-4">
                        <p className="text-[10px] font-bold text-gray-400">قريباً: سير الصحابة والتابعين</p>
                    </div>
                </div>
            );
        }

        // --- عرض القسم المختار ---
        return (
            <div className="animate-in h-full flex flex-col min-h-screen bg-gray-50/50">
                {/* شريط العنوان العلوي مع زر الرجوع */}
                <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border
