/* =========================================
   المكون: أسماء الله الحسنى (نسخة الإصلاح)
   المسار: js/components/seerah/AsmaHusna.js
   ========================================= */
(function() {
    const { useState } = React;

    const AsmaHusna = () => {
        // قائمة قصيرة للتجربة (لمنع الأخطاء)
        const names = [
            { id: 1, name: "الله", meaning: "الإله المعبود بحق" },
            { id: 2, name: "الرحمن", meaning: "واسع الرحمة بجميع خلقه" },
            { id: 3, name: "الرحيم", meaning: "الواصل رحمته للمؤمنين" },
            { id: 4, name: "الملك", meaning: "المالك لكل شيء" },
            { id: 5, name: "القدوس", meaning: "المنزه عن كل نقص" }
        ];

        const [selected, setSelected] = useState(null);

        return (
            <div className="bg-blue-50/50 min-h-screen rounded-3xl p-4 pb-20 animate-in">
                {window.CustomModal && selected && (
                    <window.CustomModal isOpen={!!selected} onClose={() => setSelected(null)} title={selected.name}>
                        <div className="text-center space-y-4 py-4">
                            <h2 className="font-amiri text-5xl text-blue-800">{selected.name}</h2>
                            <p className="font-bold text-gray-700 text-lg">{selected.meaning}</p>
                        </div>
                    </window.CustomModal>
                )}

                <h1 className="text-center font-amiri text-2xl font-black text-blue-900 mb-6">ولله الأسماء الحسنى</h1>
                <div className="grid grid-cols-3 gap-3">
                    {names.map(n => (
                        <button key={n.id} onClick={() => setSelected(n)} className="aspect-square bg-white rounded-2xl shadow-sm border border-blue-50 flex flex-col items-center justify-center hover:scale-105 transition">
                            <span className="font-amiri font-bold text-xl text-blue-800">{n.name}</span>
                        </button>
                    ))}
                </div>
            </div>
        );
    };

    window.AsmaHusna = AsmaHusna;
})();
