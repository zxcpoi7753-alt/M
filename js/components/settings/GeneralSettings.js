/* =========================================
   وحدة الإعدادات العامة: GeneralSettings.js
   (المظهر، الشاشة، التكبير)
   ========================================= */
(function() {
    const { useState, useEffect } = React;

    const GeneralSettings = ({ isZoomed, setIsZoomed }) => {
        // 1. الوضع الليلي
        const [isDark, setIsDark] = useState(localStorage.getItem('theme') === 'dark');

        // 2. منع انطفاء الشاشة
        const [isWakeLock, setIsWakeLock] = useState(false);
        const [wakeLockSentinel, setWakeLockSentinel] = useState(null);

        // --- تنفيذ الوضع الليلي ---
        useEffect(() => {
            if (isDark) {
                document.body.classList.add('dark-mode');
                localStorage.setItem('theme', 'dark');
            } else {
                document.body.classList.remove('dark-mode');
                localStorage.setItem('theme', 'light');
            }
        }, [isDark]);

        // --- تنفيذ منع انطفاء الشاشة (Wake Lock API) ---
        const toggleWakeLock = async () => {
            if (!isWakeLock) {
                try {
                    // طلب القفل
                    if ('wakeLock' in navigator) {
                        const lock = await navigator.wakeLock.request('screen');
                        setWakeLockSentinel(lock);
                        setIsWakeLock(true);
                        window.showGlobalAlert('تم التفعيل 💡', 'لن تنطفئ الشاشة الآن أثناء القراءة.');
                    } else {
                        alert('عذراً، هاتفك لا يدعم هذه الميزة.');
                    }
                } catch (err) {
                    console.error(err);
                }
            } else {
                // إلغاء القفل
                if (wakeLockSentinel) {
                    await wakeLockSentinel.release();
                    setWakeLockSentinel(null);
                }
                setIsWakeLock(false);
                window.showGlobalAlert('تم الإيقاف', 'ستنطفئ الشاشة بشكل طبيعي.');
            }
        };

        return (
            <div className="space-y-3">
                <h3 className="text-xs font-bold text-gray-400 mb-2">المظهر والعرض</h3>
                
                {/* زر الوضع الليلي */}
                <button onClick={() => setIsDark(!isDark)} className="w-full flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <span className="text-xl">{isDark ? '🌙' : '☀️'}</span>
                        <span className="font-bold text-sm">الوضع الليلي</span>
                    </div>
                    <div className={`w-10 h-5 rounded-full relative transition ${isDark ? 'bg-emerald-500' : 'bg-gray-300'}`}>
                        <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all ${isDark ? 'left-6' : 'left-1'}`}></div>
                    </div>
                </button>

                {/* زر منع انطفاء الشاشة */}
                <button onClick={toggleWakeLock} className="w-full flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <span className="text-xl">{isWakeLock ? '👁️' : '💤'}</span>
                        <span className="font-bold text-sm">منع انطفاء الشاشة</span>
                    </div>
                    <div className={`w-10 h-5 rounded-full relative transition ${isWakeLock ? 'bg-emerald-500' : 'bg-gray-300'}`}>
                        <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all ${isWakeLock ? 'left-6' : 'left-1'}`}></div>
                    </div>
                </button>

                {/* زر التكبير (تم نقله هنا) */}
                <button onClick={() => setIsZoomed(!isZoomed)} className="w-full flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <span className="text-xl">{isZoomed ? '📱' : '🔍'}</span>
                        <span className="font-bold text-sm">تكبير النصوص</span>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">{isZoomed ? 'مفعل' : 'عادي'}</span>
                </button>
            </div>
        );
    };

    window.GeneralSettings = GeneralSettings;
})();
