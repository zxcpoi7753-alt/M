/* =========================================
   الوحدة: واحة الزوار (نوافذ أنيقة)
   المسار: js/modules/visitors.js
   ========================================= */
const { useState } = React;

window.FeelingsPharmacy = () => {
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
        <div className="animate-in">
            {!selected ? (
                <div className="grid grid-cols-2 gap-3">{data.map(item => (<button key={item.id} onClick={() => setSelected(item)} className="p-4 bg-white border-2 border-emerald-50 rounded-2xl shadow-sm hover:border-emerald-400 flex flex-col items-center gap-2"><span className="font-bold text-emerald-800">{item.label}</span></button>))}</div>
            ) : (
                <div className="bg-white p-6 rounded-[2rem] border-2 border-emerald-100 shadow-lg text-center"><h3 className="text-xl font-black text-emerald-800 mb-4">{selected.label}</h3><p className="font-amiri text-2xl text-emerald-600 leading-loose mb-3">﴿ {selected.ayah} ﴾</p><div className="bg-amber-50 p-4 rounded-xl border border-amber-100 text-amber-900 text-sm font-bold mb-4">💡 {selected.text}</div><button onClick={() => setSelected(null)} className="bg-gray-100 text-gray-600 px-6 py-2 rounded-xl font-bold text-sm">عودة</button></div>
            )}
        </div>
    );
};

window.CardMaker = () => {
    const [text, setText] = useState('اللهم اجعل القرآن ربيع قلوبنا');
    const [color, setColor] = useState('from-emerald-600 to-emerald-900');
    const colors = ['from-emerald-600 to-emerald-900', 'from-blue-600 to-blue-900', 'from-amber-500 to-amber-800', 'from-slate-700 to-slate-900'];
    
    // استخدام النافذة العامة بدلاً من alert
    const handleSave = () => {
        if(window.showGlobalAlert) window.showGlobalAlert('قريباً 🚧', 'سيتم تفعيل ميزة تحميل الصور بجودة عالية قريباً إن شاء الله.');
    };

    return (
        <div className="animate-in space-y-4">
            <div className={`aspect-square rounded-2xl flex items-center justify-center p-6 text-center shadow-lg relative overflow-hidden bg-gradient-to-br ${color}`}><div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div><div><p className="font-amiri text-2xl text-white font-bold leading-relaxed drop-shadow-md">{text}</p><p className="absolute bottom-4 left-0 w-full text-center text-[10px] text-white/80">تصميم: حلقات الثريا</p></div></div>
            <div className="bg-white p-4 rounded-2xl border border-gray-100 space-y-3"><input value={text} onChange={e => setText(e.target.value)} className="w-full p-3 border rounded-xl text-center text-sm font-bold" placeholder="اكتب النص..." maxLength="80" /><div className="flex justify-center gap-2">{colors.map((c, i) => (<button key={i} onClick={() => setColor(c)} className={`w-8 h-8 rounded-full bg-gradient-to-br ${c} border-2 border-white ring-1 ring-gray-200`}></button>))}</div><button onClick={handleSave} className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold shadow">💾 حفظ التصميم</button></div>
        </div>
    );
};
