/* =========================================
   حاوية الإعدادات: SettingsModal.js
   (تصميم جديد: يدعم نوافذ التأكيد الداخلية)
   ========================================= */
(function() {
    const { useState } = React;
    const GeneralSettings = window.GeneralSettings;

    const SettingsModal = ({ isOpen, onClose, isZoomed, setIsZoomed, onUpdate }) => {
        const [view, setView] = useState('main'); // main, update_confirm

        if (!isOpen) return null;

        return (
            <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
                {/* خلفية معتمة */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

                {/* نافذة الإعدادات */}
                <div className="relative w-full max-w-md bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] p-6 shadow-2xl animate-slide-up sm:animate-in max-h-[85vh] overflow-y-auto border-t-4 border-emerald-500">
                    
                    {/* --- عرض 1: القائمة الرئيسية --- */}
                    {view === 'main' && (
                        <>
                            {/* رأس النافذة */}
                            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                                <div className="flex items-center gap-2">
                                    <span className="bg-emerald-100 text-emerald-600 p-2 rounded-xl text-xl">⚙️</span>
                                    <h2 className="text-xl font-black text-gray-800">الإعدادات</h2>
                                </div>
                                <button onClick={onClose} className="w-8 h-8 bg-gray-50 rounded-full text-gray-400 font-bold hover:bg-red-50 hover:text-red-500 transition">✕</button>
                            </div>

                            {/* الإعدادات العامة */}
                            <GeneralSettings isZoomed={isZoomed} setIsZoomed={setIsZoomed} />

                            <div className="my-6 border-t border-dashed border-gray-200 relative">
                                <span className="absolute top-[-10px] left-1/2 -translate-x-1/2 bg-white px-2 text-[10px] text-gray-400 font-bold">منطقة النظام</span>
                            </div>

                            {/* أزرار النظام */}
                            <div className="space-y-2">
                                <button onClick={() => setView('update_confirm')} className="w-full flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl transition group">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl group-hover:scale-110 transition">🚀</span>
                                        <div className="text-right">
                                            <span className="font-bold text-sm block">تحديث التطبيق</span>
                                            <span className="text-[10px] opacity-70 block">للحصول على آخر الميزات</span>
                                        </div>
                                    </div>
                                    <span className="text-xl">➜</span>
                                </button>

                                <a href="admin.html" className="w-full flex items-center justify-between p-3 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl transition group">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl group-hover:scale-110 transition">🔒</span>
                                        <div className="text-right">
                                            <span className="font-bold text-sm block">لوحة الإدارة</span>
                                            <span className="text-[10px] opacity-70 block">للمعلمين والمشرفين فقط</span>
                                        </div>
                                    </div>
                                    <span className="text-xl">➜</span>
                                </a>
                            </div>

                            <div className="mt-8 text-center">
                                <p className="text-[10px] text-gray-300 font-bold">رقم الإصدار: 3.0.0 (Pro)</p>
                                <p className="text-[10px] text-gray-200">برمجة وتطوير: فريق الثريا</p>
                            </div>
                        </>
                    )}

                    {/* --- عرض 2: تأكيد التحديث (النافذة الأنيقة) --- */}
                    {view === 'update_confirm' && (
                        <div className="text-center py-4 animate-in">
                            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                                <span className="text-4xl">🔄</span>
                            </div>
                            <h3 className="text-2xl font-black text-gray-800 mb-2">تحديث جديد متوفر</h3>
                            <p className="text-gray-500 text-sm mb-6 leading-relaxed px-4">
                                سيتم إعادة تحميل التطبيق بالكامل لضمان وصول أحدث التحسينات وإصلاحات الأخطاء.
                                <br/>
                                <span className="text-red-500 font-bold text-xs mt-2 block">(سيتم إغلاق التطبيق لثانية واحدة)</span>
                            </p>

                            <div className="space-y-3">
                                <button onClick={onUpdate} className="w-full py-3 bg-blue-600 text-white rounded-xl font-black shadow-lg shadow-blue-200 hover:bg-blue-700 transition active:scale-95 flex items-center justify-center gap-2">
                                    <span>تحديث الآن</span>
                                    <span>⚡</span>
                                </button>
                                <button onClick={() => setView('main')} className="w-full py-3 bg-gray-50 text-gray-500 rounded-xl font-bold hover:bg-gray-100 transition">
                                    إلغاء
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        );
    };

    window.SettingsModal = SettingsModal;
})();
