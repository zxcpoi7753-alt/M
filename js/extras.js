/* =========================================
   ملف الإضافات: js/extras.js
   الوظيفة: صيدلية القلوب + صانع البطاقات
   ========================================= */

const { useState } = React;

// 1. صيدلية القلوب
window.FeelingsPharmacy = () => {
    const [selectedFeeling, setSelectedFeeling] = useState(null);

    const feelings = [
        { id: 'sad', label: 'حزين 😔', ayah: 'وَلَا تَهِنُوا وَلَا تَحْزَنُوا وَأَنتُمُ الْأَعْلَوْنَ', surah: 'آل عمران', text: 'الحزن يضعف القلب، والله يريدك قوياً به.' },
        { id: 'anxious', label: 'قلق 😟', ayah: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ', surah: 'الرعد', text: 'علاج القلق هو كثرة الذكر، جرب الآن: استغفر الله 10 مرات.' },
        { id: 'fear', label: 'خائف 😨', ayah: 'أَلَيْسَ اللَّهُ بِكَافٍ عَبْدَهُ', surah: 'الزمر', text: 'من كان الله معه، فممن يخاف؟' },
        { id: 'lazy', label: 'كسول 😴', ayah: 'وَالَّذِينَ جَاهَدُوا فِينَا لَنَهْدِيَنَّهُمْ سُبُلَنَا', surah: 'العنكبوت', text: 'ابدأ بخطوة صغيرة فقط، والله سيعينك على الباقي.' },
        { id: 'happy', label: 'سعيد 😃', ayah: 'لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ', surah: 'إبراهيم', text: 'قيد هذه النعمة بالشكر حتى تدوم وتزيد.' },
        { id: 'lost', label: 'تائه 🚶', ayah: 'وَوَجَدَكَ ضَالًّا فَهَدَىٰ', surah: 'الضحى', text: 'الله الذي هداك سابقاً، لن يتركك الآن. اطلب الهداية.' },
    ];

    return (
        <div className="animate-in">
            {!selectedFeeling ? (
                <div className="grid grid-cols-2 gap-3">
                    {feelings.map(f => (
                        <button key={f.id} onClick={() => setSelectedFeeling(f)} className="p-4 bg-white border-2 border-emerald-50 rounded-2xl shadow-sm hover:border-emerald-400 hover:bg-emerald-50 transition flex flex-col items-center gap-2">
                            <span className="font-bold text-emerald-800">{f.label}</span>
                        </button>
                    ))}
                </div>
            ) : (
                <div className="bg-white p-6 rounded-[2rem] border-2 border-emerald-100 shadow-lg text-center">
                    <h3 className="text-xl font-black text-emerald-800 mb-4">{selectedFeeling.label}</h3>
                    <p className="font-amiri text-2xl text-emerald-600 leading-loose mb-2">﴿ {selectedFeeling.ayah} ﴾</p>
                    <p className="text-xs text-emerald-400 font-bold mb-4">سورة {selectedFeeling.surah}</p>
                    <div className="bg-amber-50 p-3 rounded-xl border border-amber-100 text-amber-900 text-sm font-bold mb-4">
                        💡 {selectedFeeling.text}
                    </div>
                    <button onClick={() => setSelectedFeeling(null)} className="bg-gray-100 text-gray-600 px-6 py-2 rounded-xl font-bold text-sm">عودة</button>
                </div>
            )}
        </div>
    );
};

// 2. صانع البطاقات (نسخة مبسطة)
window.CardMaker = () => {
    const [text, setText] = useState('اللهم اجعل القرآن ربيع قلوبنا');
    const [bg, setBg] = useState('linear-gradient(135deg, #10b981, #047857)');

    const backgrounds = [
        'linear-gradient(135deg, #10b981, #047857)', // Green
        'linear-gradient(135deg, #3b82f6, #1d4ed8)', // Blue
        'linear-gradient(135deg, #f59e0b, #b45309)', // Amber
        'linear-gradient(135deg, #111827, #374151)', // Dark
    ];

    return (
        <div className="animate-in space-y-4">
            {/* منطقة المعاينة */}
            <div id="capture-area" className="aspect-square rounded-2xl flex items-center justify-center p-6 text-center shadow-lg relative overflow-hidden" style={{ background: bg }}>
                <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>
                <div>
                    <p className="font-amiri text-2xl text-white font-bold leading-relaxed drop-shadow-md">{text}</p>
                    <p className="absolute bottom-4 left-0 w-full text-center text-[10px] text-white/80 font-sans">تصميم: حلقات الثريا</p>
                </div>
            </div>

            {/* أدوات التحكم */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 space-y-3">
                <input value={text} onChange={e => setText(e.target.value)} className="w-full p-3 border rounded-xl text-center text-sm font-bold" placeholder="اكتب النص هنا..." maxlength="100" />
                <div className="flex justify-center gap-2">
                    {backgrounds.map((b, i) => (
                        <button key={i} onClick={() => setBg(b)} className="w-8 h-8 rounded-full border-2 border-white ring-2 ring-gray-200" style={{ background: b }}></button>
                    ))}
                </div>
                <button onClick={() => alert('تم حفظ الصورة (محاكاة)')} className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold shadow">💾 حفظ البطاقة</button>
            </div>
        </div>
    );
};
