/* =========================================
   الوحدة: واحة الزوار (العداد الحي + المنبه الذكي + الإشعارات)
   المسار: js/modules/visitors.js
   ========================================= */
const { useState, useEffect, useRef } = React;
const { db, doc, onSnapshot, updateDoc, increment, getDoc, setDoc } = window; 

// 1. مكون العداد الجماعي (المرتبط بقاعدة البيانات)
const GlobalKhatmaCounter = () => {
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!window.db) return;
        // الاستماع المباشر للتغييرات
        const unsub = window.onSnapshot(window.doc(window.db, "appData", "globalStats"), (doc) => {
            if (doc.exists()) {
                setCount(doc.data().pagesRead || 0);
            } else {
                // إنشاء العداد لأول مرة إذا لم يوجد
                window.setDoc(window.doc(window.db, "appData", "globalStats"), { pagesRead: 0 });
            }
        });
        return () => unsub();
    }, []);

    const addPage = async () => {
        if (!window.db) return;
        setLoading(true);
        if(window.showGlobalAlert) window.showGlobalAlert('تقبل الله 🤲', 'ساهمت في العداد العالمي بصفحة!');
        
        try {
            // استخدام increment لضمان عدم ضياع العد عند الضغط المتزامن
            const docRef = window.doc(window.db, "appData", "globalStats");
            await window.updateDoc(docRef, {
                pagesRead: window.increment(1) 
            });
        } catch (e) {
            console.error("خطأ في التحديث، تأكد من قواعد Firebase", e);
            // محاولة بديلة إذا فشل increment
            try {
                const snap = await window.getDoc(window.doc(window.db, "appData", "globalStats"));
                if(snap.exists()) {
                     await window.updateDoc(window.doc(window.db, "appData", "globalStats"), { pagesRead: snap.data().pagesRead + 1 });
                }
            } catch(err2) { console.log(err2); }
        }
        setLoading(false);
    };

    return (
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-[2rem] p-6 text-white text-center shadow-lg mb-6 relative overflow-hidden animate-in">
            <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            <h3 className="relative z-10 text-sm font-bold opacity-90 mb-2">🌍 العداد العالمي للصفحات المقروءة</h3>
            <div className="relative z-10 text-5xl font-black mb-3 tracking-widest text-yellow-300 drop-shadow-md" dir="ltr">
                {count.toLocaleString()}
            </div>
            <button onClick={addPage} disabled={loading} className="relative z-10 bg-white text-blue-700 px-8 py-3 rounded-full font-black text-sm hover:scale-105 transition shadow-lg disabled:opacity-70 flex items-center gap-2 mx-auto">
                {loading ? 'جاري الإرسال...' : '📖 أتممت قراءة صفحة'}
            </button>
        </div>
    );
};

// 2. منبه الأوقات الفاضلة (الشريط الذكي + الإشعارات)
const VirtuousTimesWidget = () => {
    const [activeEvent, setActiveEvent] = useState(null);
    const [timeLeft, setTimeLeft] = useState('');
    const [permission, setPermission] = useState(Notification.permission);

    // طلب إذن الإشعارات
    const requestNotifyPermission = () => {
        Notification.requestPermission().then(p => {
            setPermission(p);
            if (p === 'granted') {
                if(window.showGlobalAlert) window.showGlobalAlert('تم التفعيل', 'ستصلك إشعارات الأوقات الفاضلة 🔔');
            }
        });
    };

    // إرسال إشعار للنظام
    const sendSystemNotification = (title, body) => {
        if (Notification.permission === 'granted') {
            new Notification(title, {
                body: body,
                icon: 'icon-192.png', // تأكد من وجود الأيقونة
                vibrate: [200, 100, 200]
            });
        }
    };

    useEffect(() => {
        const checkTimes = () => {
            const now = new Date();
            const targets = [
                { id: 'sahoor', name: '✨ الثلث الأخير', hour: 2, min: 0, msg: 'أنت في وقت النزول الإلهي.. استغفر الله!' },
                { id: 'friday', name: '🕌 يوم الجمعة', day: 5, hour: 0, min: 0, msg: 'بدأ يوم الجمعة، أكثر من الصلاة على النبي ﷺ' },
                // يمكن إضافة رمضان هنا
            ];

            // منطق مبسط لتحديد الحدث القادم (للمثال نركز على الثلث الأخير)
            // الثلث الأخير يبدأ الساعة 2 فجراً تقريباً
            let targetDate = new Date();
            targetDate.setHours(2, 0, 0, 0);
            
            // إذا تجاوزنا الساعة 2، نحسب لليوم التالي
            if (now > targetDate) {
                targetDate.setDate(targetDate.getDate() + 1);
            }

            const diff = targetDate - now;
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setActiveEvent({
                name: 'الثلث الأخير من الليل',
                countDown: `${seconds} : ${minutes} : ${hours}`,
                msg: 'أنت في وقت النزول الإلهي.. استغفر الله!'
            });

            // إذا وصل العداد للصفر (أو قريباً جداً) ولم يتم التنبيه
            if (diff < 1000 && diff > 0) {
                 if(window.showGlobalAlert) window.showGlobalAlert('🔔 تذكير', 'دخل وقت الثلث الأخير، لا تنس الوتر والاستغفار.');
                 sendSystemNotification('وقت السحر 🌑', 'استغفر الله إنه كان غفاراً');
            }
        };

        const timer = setInterval(checkTimes, 1000);
        return () => clearInterval(timer);
    }, []);

    if (!activeEvent) return null;

    return (
        <div className="mb-6 animate-in">
            {/* الشريط الذكي */}
            <div className="bg-emerald-900 text-white rounded-2xl p-4 flex items-center justify-between shadow-lg border border-emerald-700 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-10"></div>
                
                <div className="relative z-10">
                    <p className="text-[10px] text-emerald-300 font-bold mb-1">الحدث القادم:</p>
                    <h3 className="font-bold text-sm">{activeEvent.name}</h3>
                </div>

                <div className="relative z-10 text-left">
                    <div className="text-2xl font-black font-mono tracking-widest text-yellow-400" dir="ltr">
                        {activeEvent.countDown}
                    </div>
                </div>
            </div>

            {/* زر تفعيل الإشعارات إذا لم تكن مفعلة */}
            {permission !== 'granted' && (
                <button onClick={requestNotifyPermission} className="w-full mt-2 py-2 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-200 flex items-center justify-center gap-2 hover:bg-emerald-100">
                    🔔 تفعيل تنبيهات الأوقات الفاضلة
                </button>
            )}
        </div>
    );
};

// باقي المكونات (صيدلية القلوب وصانع البطاقات) تبقى كما هي...
window.FeelingsPharmacy = () => { /* ... نفس الكود السابق ... */ 
    return <div className="text-center p-4">صيدلية القلوب (موجودة)</div>; // اختصار للكود لعدم التكرار، استخدم الكود السابق
};

// ... أضف CardMaker هنا (نفس النسخة الاحترافية السابقة) ...
window.CardMaker = () => { /* ... استخدم كود CardMaker 2.0 من الرد السابق ... */ 
     return <div className="text-center p-4">صانع البطاقات (موجود)</div>;
};

// التصدير
window.VirtuousTimesWidget = VirtuousTimesWidget;
window.GlobalKhatmaCounter = GlobalKhatmaCounter;
