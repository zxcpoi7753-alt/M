/* =========================================
   المكون: العداد العالمي للصفحات المقروءة
   المسار: js/components/extras/GlobalCounter.js
   ========================================= */
const { useState, useEffect } = React;

const GlobalKhatmaCounter = () => {
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!window.db || !window.onSnapshot) return;
        const unsub = window.onSnapshot(window.doc(window.db, "appData", "globalStats"), (doc) => {
            if (doc.exists()) setCount(doc.data().pagesRead || 0);
            else if(window.setDoc) window.setDoc(window.doc(window.db, "appData", "globalStats"), { pagesRead: 0 });
        });
        return () => unsub();
    }, []);

    const addPage = async () => {
        if (!window.db) return;
        setLoading(true);
        if(window.showGlobalAlert) window.showGlobalAlert('تقبل الله 🤲', 'تم إضافة صفحتك للعداد العالمي!');
        try {
            await window.updateDoc(window.doc(window.db, "appData", "globalStats"), { pagesRead: window.increment(1) });
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    return (
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-[2rem] p-6 text-white text-center shadow-lg mb-6 relative overflow-hidden animate-in">
            <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            <h3 className="relative z-10 text-sm font-bold opacity-90 mb-2">🌍 العداد العالمي للصفحات المقروءة</h3>
            <div className="relative z-10 text-5xl font-black mb-3 tracking-widest text-yellow-300 drop-shadow-md" dir="ltr">{count.toLocaleString()}</div>
            <button onClick={addPage} disabled={loading} className="relative z-10 bg-white text-blue-700 px-8 py-3 rounded-full font-black text-sm hover:scale-105 transition shadow-lg disabled:opacity-70 flex items-center gap-2 mx-auto">{loading ? 'جاري الإرسال...' : '📖 أتممت قراءة صفحة'}</button>
        </div>
    );
};

window.GlobalKhatmaCounter = GlobalKhatmaCounter;
