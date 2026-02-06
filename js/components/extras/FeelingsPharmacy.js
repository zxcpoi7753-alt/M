/* =========================================
   المكون: صيدلية القلوب
   المسار: js/components/extras/FeelingsPharmacy.js
   ========================================= */
const { useState } = React;

const FeelingsPharmacy = () => {
    const [selected, setSelected] = useState(null);
    const data = [
        { id: 'sad', label: 'حزين 😔', ayah: 'وَلَا تَهِنُوا وَلَا تَحْزَنُوا وَأَنتُمُ الْأَعْلَوْنَ', text: 'لا تحزن، فالله يسمع دبيب النملة السوداء، ألا يسمع قلبك؟' },
        { id: 'anxious', label: 'قلق 😟', ayah: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ', text: 'علاج القلق هو كثرة الذكر. استغفر الله الآن 10 مرات.' },
        { id: 'fear', label: 'خائف 😨', ayah: 'أَلَيْسَ اللَّهُ بِكَافٍ عَبْدَهُ', text: 'من كان الله معه، فممن يخاف؟' },
        { id: 'lazy', label: 'كسول 😴', ayah: 'وَالَّذِينَ جَاهَدُوا فِينَا لَنَهْدِيَنَّهُمْ سُبُلَنَا', text: 'قم وتوضأ وصلِّ ركعتين، ستنشط روحك فوراً.' },
        { id: 'happy', label: 'سعيد 😃', ayah: 'لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ', text: 'قيد هذه النعمة بالشكر حتى تدوم وتزيد.' },
        { id: 'lost', label: 'تائه 🚶', ayah: 'وَوَجَدَكَ ضَالًّا فَهَدَىٰ', text: 'الله الذي هداك سابقاً، لن يتركك الآن.' }
    ];
    return (
        <div className="animate-in mb-6">
            {!selected ? (
                <div className="grid grid-cols-2 gap-3">{data.map(item => (<button key={item.id} onClick={() => setSelected(item)} className="p-4 bg-white border-2 border-emerald-50 rounded-2xl shadow-sm hover:border-emerald-400 flex flex-col items-center gap-2 transition"><span className="font-bold text-emerald-800">{item.label}</span></button>))}</div>
            ) : (
                <div className="bg-white p-6 rounded-[2rem] border-2 border-emerald-100 shadow-lg text-center"><h3 className="text-xl font-black text-emerald-800 mb-4">{selected.label}</h3><p className="font-amiri text-2xl text-emerald-600 leading-loose mb-3">﴿ {selected.ayah} ﴾</p><div className="bg-amber-50 p-4 rounded-xl border border-amber-100 text-amber-900 text-sm font-bold mb-4">💡 {selected.text}</div><button onClick={() => setSelected(null)} className="bg-gray-100 text-gray-600 px-6 py-2 rounded-xl font-bold text-sm">عودة</button></div>
            )}
        </div>
    );
};

window.FeelingsPharmacy = FeelingsPharmacy;
