/* =========================================
   وحدة الإعدادات العامة: GeneralSettings.js
   (إصلاح: حفظ الشاشة شغالة + الوضع الليلي)
   ========================================= */
(function() {
    const { useState, useEffect, useRef } = React;

    const GeneralSettings = ({ isZoomed, setIsZoomed }) => {
        // 1. إعدادات الوضع الليلي (مع الحفظ)
        const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');

        // 2. إعدادات الشاشة (مع الحفظ)
        const [wantsWakeLock, setWantsWakeLock] = useState(() => localStorage.getItem('wakeLock') === 'true');
        const wakeLockRef = useRef(null);

        // --- تنفيذ الوضع الليلي ---
        useEffect(() => {
            const root = document.documentElement;
            if (isDark) {
                document.body.classList.add('dark-mode');
                localStorage.setItem('theme', 'dark');
                // تغيير لون شريط المتصفح في الجوال
                document.querySelector('meta[name="theme-color"]').setAttribute('content', '#0f172a');
            } else {
                document.body.classList.remove('dark-mode');
                localStorage.setItem('theme', 'light');
                document.querySelector('meta[name="theme-color"]').setAttribute('content', '#059669');
            }
        }, [isDark]);

        // --- تنفيذ منع انطفاء الشاشة (نظام ذكي) ---
        // وظيفة طلب القفل
        const requestWakeLock = async () => {
            try {
                if ('wakeLock' in navigator) {
                    wakeLockRef.current = await navigator.wakeLock.request('screen');
                    console.log('💡 الشاشة: تم منع الانطفاء');
                }
            } catch (err) {
                console.error('فشل تفعيل الشاشة:', err);
            }
        };

        // وظيفة إلغاء القفل
        const releaseWakeLock = async () => {
            if (wakeLockRef.current) {
                await wakeLockRef.current.release();
                wakeLockRef.current = null;
                console.log('💤 الشاشة: الوضع الطبيعي');
            }
        };

        useEffect(() => {
            // التعامل مع تغيير الحالة
            if (wantsWakeLock) {
                requestWakeLock();
                localStorage.setItem('wakeLock', 'true');
            } else {
                releaseWakeLock();
                localStorage.setItem('wakeLock', 'false');
            }

            // إعادة تفعيل القفل إذا خرج المستخدم ورجع (Re-acquire)
            const handleVisibilityChange = () => {
                if (document.visibilityState === 'visible' && wantsWakeLock) {
                    requestWakeLock();
                }
            };

            document.addEventListener('visibilitychange', handleVisibilityChange);
            return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
        }, [wantsWakeLock]);


        return (
            <div className="space-y-3">
                <h3 className="text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-wider">المظهر والعرض</h3>
                
                {/* زر الوضع الليلي */}
                <button onClick={() => setIsDark(!isDark)} className="w-full flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-emerald-200 transition active:scale-95">
                    <div className="flex items-center gap-3">
                        <span className="text-xl w-8 text-center">{isDark ? '🌙' : '☀️'}</span>
                        <div className="text-right">
                            <span className="font-bold text-sm block text-gray-800">الوضع الليلي</span>
                            <span className="text-[10px] text-gray-400 font-bold block">{isDark ? 'مفعل (مريح للعين)' : 'معطل (نهاري)'}</span>
                        </div>
                    </div>
                    <div className={`w-12 h-6 rounded-full relative transition duration-300 ${isDark ? 'bg-emerald-500' : 'bg-gray-200'}`}>
                        <div className={`w-4 h-4 bg-white rounded-full absolute top-1 shadow-sm transition-all duration-300 ${isDark ? 'left-7' : 'left-1'}`}></div>
                    </div>
                </button>

                {/* زر منع انطفاء الشاشة */}
                <button onClick={() => setWantsWakeLock(!wantsWakeLock)} className="w-full flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-emerald-200 transition active:scale-95">
                    <div className="flex items-center gap-3">
                        <span className="text-xl w-8 text-center">{wantsWakeLock ? '💡' : '💤'}</span>
                        <div className="text-right">
                            <span className="font-bold text-sm block text-gray-800">إبقاء الشاشة</span>
                            <span className="text-[10px] text-gray-400 font-bold block">{wantsWakeLock ? 'لن تنطفئ أبداً' : 'انطفاء تلقائي'}</span>
                        </div>
                    </div>
                    <div className={`w-12 h-6 rounded-full relative transition duration-300 ${wantsWakeLock ? 'bg-orange-400' : 'bg-gray-200'}`}>
                        <div className={`w-4 h-4 bg-white rounded-full absolute top-1 shadow-sm transition-all duration-300 ${wantsWakeLock ? 'left-7' : 'left-1'}`}></div>
                    </div>
                </button>

                {/* زر التكبير */}
                <button onClick={() => setIsZoomed(!isZoomed)} className="w-full flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-emerald-200 transition active:scale-95">
                    <div className="flex items-center gap-3">
                        <span className="text-xl w-8 text-center">{isZoomed ? '📱' : '🔍'}</span>
                        <div className="text-right">
                            <span className="font-bold text-sm block text-gray-800">حجم النصوص</span>
                            <span className="text-[10px] text-gray-400 font-bold block">{isZoomed ? 'كبير (وضع القراءة)' : 'طبيعي'}</span>
                        </div>
                    </div>
                    <span className={`text-[10px] font-black px-2 py-1 rounded border ${isZoomed ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-gray-100 text-gray-400 border-gray-200'}`}>
                        {isZoomed ? 'X-Large' : 'Normal'}
                    </span>
                </button>
            </div>
        );
    };

    window.GeneralSettings = GeneralSettings;
})();
