/* =========================================
   المكون: أسماء الله الحسنى (النسخة الكاملة 99 اسماً)
   المسار: js/components/seerah/AsmaHusna.js
   ========================================= */
const { useState, useMemo } = React;

window.AsmaHusna = () => {
    // استخدام useMemo لتحسين الأداء مع القوائم الطويلة
    const names = useMemo(() => [
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
        { id: 20, name: "العليم", meaning: "الذي أحاط علمه بكل شيء، ظاهراً وباطناً" },
        { id: 21, name: "القابض", meaning: "الذي يقبض أرزاق من يشاء، ويضيق عليهم" },
        { id: 22, name: "الباسط", meaning: "الذي يوسع الرزق ويعطي بسخاء" },
        { id: 23, name: "الخافض", meaning: "الذي يرفع بعض الخلق ويخفض بعضهم" },
        { id: 24, name: "الرافع", meaning: "الذي يرفع درجات من يشاء" },
        { id: 25, name: "المعز", meaning: "الذي يكرم من يشاء ويعزّه" },
        { id: 26, name: "المذل", meaning: "الذي يذل من يشاء بقدرته" },
        { id: 27, name: "السميع", meaning: "الذي يسمع كل شيء، لا يغيب عنه شيء" },
        { id: 28, name: "البصير", meaning: "الذي يرى كل شيء بعيون العدل والحكمة" },
        { id: 29, name: "الحكم", meaning: "الحكيم العادل في كل أمر" },
        { id: 30, name: "العدل", meaning: "الذي يميز الحق من الباطل ويعدل في الأحكام" },
        { id: 31, name: "اللطيف", meaning: "الرقيق في تصرفاته، الرحيم بعباده" },
        { id: 32, name: "الخبير", meaning: "الذي يعلم خبايا الأمور وظواهرها" },
        { id: 33, name: "الحليم", meaning: "البطيء بالعقوبة، شديد الرحمة" },
        { id: 34, name: "العظيم", meaning: "الكبير في ذاته وصفاته وأفعاله" },
        { id: 35, name: "الغفور", meaning: "الذي يغفر الذنوب ويعدل بين عباده" },
        { id: 36, name: "الشكور", meaning: "الذي يثيب العباد على صغائر أعمالهم" },
        { id: 37, name: "العلي", meaning: "المرتفع في ذاته وصفاته" },
        { id: 38, name: "الكبير", meaning: "العظيم المتعالي على الخلق" },
        { id: 39, name: "الحفيظ", meaning: "الذي يحفظ كل شيء، ويحمي عباده" },
        { id: 40, name: "المقيت", meaning: "الذي يرزق ويقوي الخلق" },
        { id: 41, name: "الحسيب", meaning: "الذي يحاسب الخلق ويكفيهم ما هم فيه" },
        { id: 42, name: "الجليل", meaning: "العظيم الجلال، المهيب في صفاته" },
        { id: 43, name: "الكريم", meaning: "الذي يعطي بلا حدود، واسع العطاء" },
        { id: 44, name: "الرقيب", meaning: "الذي يراقب كل شيء" },
        { id: 45, name: "المجيب", meaning: "الذي يجيب دعاء عباده" },
        { id: 46, name: "الواسع", meaning: "الذي وسعت رحمته كل شيء" },
        { id: 47, name: "الحكيم", meaning: "العالم بكل شيء، الحكيم في تصرفاته" },
        { id: 48, name: "الودود", meaning: "الذي يحب عباده ويحبهم بالخير" },
        { id: 49, name: "المجيد", meaning: "الذي له الجلالة والعظمة والفضل" },
        { id: 50, name: "الباعث", meaning: "الذي يبعث الخلق بعد الموت" },
        { id: 51, name: "الشهيد", meaning: "الذي لا يغيب عنه شيء، شاهد على كل حال" },
        { id: 52, name: "الحق", meaning: "الذي لا يزول حكمه، الثابت في ذاته وصفاته" },
        { id: 53, name: "الوكيل", meaning: "الذي يتوكل عليه المؤمنون، وهو القائم بأمرهم" },
        { id: 54, name: "القوي", meaning: "الذي لا يغلب، القادر على كل شيء" },
        { id: 55, name: "المتين", meaning: "الذي متين في سلطانه وقدرته" },
        { id: 56, name: "الولي", meaning: "الناصر والحافظ لعباده" },
        { id: 57, name: "الحميد", meaning: "الذي يستحق الثناء والحمد على كل شيء" },
        { id: 58, name: "المحصي", meaning: "الذي يحصي كل شيء بدقة" },
        { id: 59, name: "المبدئ", meaning: "الذي ابتدأ الخلق من العدم" },
        { id: 60, name: "المعيد", meaning: "الذي يعيد الخلق بعد الموت للحساب" },
        { id: 61, name: "المحيي", meaning: "الذي يحيي الأحياء ويميت الموتى" },
        { id: 62, name: "المميت", meaning: "الذي يميت الأحياء بقدرته" },
        { id: 63, name: "الحي", meaning: "الذي لا يموت، الدائم الباقي" },
        { id: 64, name: "القيوم", meaning: "الذي يقوم بالأمر كله، المستقل بذاته" },
        { id: 65, name: "الواجد", meaning: "الذي يوجد كل شيء ويجده" },
        { id: 66, name: "الماجد", meaning: "الذي له المجد في ذاته وصفاته" },
        { id: 67, name: "الواحد", meaning: "الذي لا شريك له، الأحد في ذاته وصفاته" },
        { id: 68, name: "الصمد", meaning: "الذي يُقصد في الحاجات ويستغني عنه الخلق" },
        { id: 69, name: "القادر", meaning: "الذي له القدرة على كل شيء" },
        { id: 70, name: "المقتدر", meaning: "الذي يقدر على كل شيء تقديراً" },
        { id: 71, name: "المقدم", meaning: "الذي يقدم من يشاء" },
        { id: 72, name: "المؤخر", meaning: "الذي يؤخر من يشاء" },
        { id: 73, name: "الأول", meaning: "الذي ليس قبله شيء، الأول في الوجود" },
        { id: 74, name: "الأخر", meaning: "الذي ليس بعده شيء، الآخر في الدوام" },
        { id: 75, name: "الظاهر", meaning: "الذي ظهرت آياته وعظمته للخلق" },
        { id: 76, name: "الباطن", meaning: "الذي غيب عن الخلق وأخفى قدرته" },
        { id: 77, name: "الوالي", meaning: "الذي هو ولي كل شيء، القائم به" },
        { id: 78, name: "المتعالي", meaning: "الذي تعالَى عن الخلق بصفاته" },
        { id: 79, name: "البر", meaning: "الذي يصلح الخلق ويرحمهم" },
        { id: 80, name: "التواب", meaning: "الذي يقبل التوبة ويعود على العباد بالمغفرة" },
        { id: 81, name: "المنتقم", meaning: "الذي ينتقم من الظالمين ويعدل" },
        { id: 82, name: "العفو", meaning: "الذي يعفو عن كثير من الذنوب" },
        { id: 83, name: "الرؤوف", meaning: "الذي يرحم عباده ويخفف عنهم" },
        { id: 84, name: "مالك الملك", meaning: "الذي له ملك كل شيء ويصرفه كما يشاء" },
        { id: 85, name: "ذو الجلال والإكرام", meaning: "العظيم المتصف بالجلال والإكرام" },
        { id: 86, name: "المقسط", meaning: "الذي يعدل بين خلقه" },
        { id: 87, name: "الجامع", meaning: "الذي يجمع الخلق على ما يشاء" },
        { id: 88, name: "الغني", meaning: "الذي لا يحتاج إلى أحد، غني عن كل شيء" },
        { id: 89, name: "المغني", meaning: "الذي يغني عباده عن خلقه" },
        { id: 90, name: "المانع", meaning: "الذي يمنع المكروه ويقي عباده" },
        { id: 91, name: "الضار", meaning: "الذي يضر من يشاء بقدرته" },
        { id: 92, name: "النافع", meaning: "الذي ينفع من يشاء" },
        { id: 93, name: "النور", meaning: "الذي أنار الظلمات بنوره" },
        { id: 94, name: "الهادي", meaning: "الذي يهدي خلقه إلى الحق" },
        { id: 95, name: "البديع", meaning: "الذي أبدع الخلق بغير مثال سابق" },
        { id: 96, name: "الباقي", meaning: "الذي لا يفنى، الباقي بعد فناء كل شيء" },
        { id: 97, name: "الوارث", meaning: "الذي يرث الأرض والسماوات" },
        { id: 98, name: "الرشيد", meaning: "الذي يهدي إلى صراطه المستقيم" },
        { id: 99, name: "الصبور", meaning: "الذي يصبر على عباده ويصبرهم على الابتلاء" }
    ], []);

    const [selected, setSelected] = useState(null);

    return (
        <div className="bg-blue-50/50 min-h-screen rounded-3xl p-4 pb-20 animate-in">
             {/* نافذة التفاصيل */}
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
            </div>
        </div>
    );
};
