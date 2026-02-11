/* =========================================
   المكون: أسماء الله الحسنى
   المسار: js/components/seerah/AsmaHusna.js
   ========================================= */
const { useState } = React;

window.AsmaHusna = () => {
    // بيانات أولية (يمكنك زيادتها لاحقاً)
    const names = [
        { id: 1, name: "الله", meaning: "الإله المعبود بحق، الجامع لصفات الألوهية" },
        { id: 2, name: "الرحمن", meaning: "واسع الرحمة بجميع خلقه في الدنيا" },
        { id: 3, name: "الرحيم", meaning: "الواصل رحمته لعباده المؤمنين خاصة" },
        { id: 4, name: "الملك", meaning: "المالك لكل شيء المتصرف فيه بلا منازع" },
        { id: 5, name: "القدوس", meaning: "المنزه عن كل نقص وعيب وشريك" },
        { id: 6, name: "السلام", meaning: "الذي سلم من كل عيب، وسلم عباده من المهالك" },
        { id: 7, name: "المؤمن", meaning: "الذي أمن أولياءه من عذابه، وصدق عباده وعوده" },
        { id: 8, name: "المهيمن", meaning: "الرقيب على كل شيء، الحافظ له" },
        { id: 9, name: "العزيز", meaning: "القوي الذي لا يغلب، المنيع الذي لا يوصل إليه" },
        { id: 10, name: "الجبار", meaning: "الذي يجبر القلوب المنكسرة، ويقهر الجبابرة" },
        { id: 11, name: "المتكبر", meaning: "المتعالي عن صفات الخلق، المنفرد بالعظمة" },
        { id: 12, name: "الخالق", meaning: "الموجد للأشياء من العدم على غير مثال سابق" },
        { id: 13, name: "البارئ", meaning: "الذي خلق الخلق بريئاً من التفاوت والنقص" },
        { id: 14, name: "المصور", meaning: "الذي صور المخلوقات في أحسن صورة وتمييز" },
        { id: 15, name: "الغفار", meaning: "الذي يستر الذنوب ويتجاوز عنها مرة بعد مرة" },
        { id: 16, name: "القهار", meaning: "الذي خضعت له الرقاب وذلت له الجبابرة" },
        { id: 17, name: "الوهاب", meaning: "كثير العطية والهبات بلا عوض ولا غرض" },
        { id: 18, name: "الرزاق", meaning: "المتكفل بأرزاق العباد، يرزق من يشاء" },
        { id: 19, name: "الفتاح", meaning: "الذي يفتح أبواب الرحمة والرزق ويحكم بين عباده" },
        { id: 20, name: "العليم", meaning: "الذي أحاط علمه بكل شيء، ظاهراً وباطناً" }
    ];

    const [selected, setSelected] = useState(null);

    return (
        <div className="bg-blue-50/50 min-h-screen rounded-3xl p-4 pb-20 animate-in">
             {window.CustomModal && selected && (
                <window.CustomModal isOpen={!!selected} onClose={() => setSelected(null)} title={`اسم الله ( ${selected.name} )`}>
                    <div className="text-center space-y-6 py-4">
                        <div className="relative inline-block">
                             <h2 className="font-amiri text-6xl text-blue-800 drop-shadow-md mt-2 relative z-10">{selected.name}</h2>
                             <div className="absolute inset-0 bg-blue-200 blur-xl opacity-30 rounded-full"></div>
                        </div>
                        
                        <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-2xl border border-blue-100 shadow-inner">
                            <h4 className="text-xs font-bold text-blue-400 mb-2">المعنى:</h4>
                            <p className="font-bold text-gray-700 leading-loose text-lg font-amiri">{selected.meaning}</p>
                        </div>

                        <button className="w-full bg-gradient-to-r from-blue-600 to-sky-600 text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition transform active:scale-95 flex items-center justify-center gap-2">
                             <span>🤲</span> دعاء بهذا الاسم
                        </button>
                    </div>
                </window.CustomModal>
            )}

            <div className="text-center mb-6">
                 <h1 className="font-amiri text-2xl font-black text-blue-900">ولله الأسماء الحسنى</h1>
                 <p className="text-[10px] text-blue-400 font-bold mt-1">فادعوه بها</p>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
                {names.map(n => (
                    <button key={n.id} onClick={() => setSelected(n)} className="aspect-square bg-white rounded-2xl shadow-sm border border-blue-50 flex flex-col items-center justify-center hover:scale-105 transition hover:shadow-md hover:border-blue-300 group">
                        <span className="font-amiri font-bold text-xl text-blue-800 group-hover:text-blue-600">{n.name}</span>
                        <span className="text-[8px] text-gray-300 mt-1 group-hover:text-blue-300">#{n.id}</span>
                    </button>
                ))}
                {/* بطاقة المزيد */}
                <div className="aspect-square bg-blue-50/50 rounded-2xl border border-dashed border-blue-200 flex items-center justify-center">
                    <span className="text-xs text-blue-400 font-bold">قريباً..</span>
                </div>
            </div>
        </div>
    );
};
