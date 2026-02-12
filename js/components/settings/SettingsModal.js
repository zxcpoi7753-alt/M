/* =========================================
   حاوية الإعدادات: SettingsModal.js
   (تجمع كل أقسام الإعدادات في مكان واحد)
   ========================================= */
(function() {
    const { useState } = React;
    const GeneralSettings = window.GeneralSettings; // استدعاء الملف الفرعي

    const SettingsModal = ({ isOpen, onClose, isZoomed, setIsZoomed, onUpdate }) => {
        if (!isOpen) return null;

        return (
            <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
                {/* خلفية معتمة */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>

                {/* نافذة الإعدادات */}
                <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-slide-up sm:animate-in max-h-[85vh] overflow-y-auto">
                    
                    {/* رأس النافذة */}
                    <div className="flex justify-between items-center mb-6 border-b pb-4">
                        <h2 className="text-xl font-black text-emerald-800">⚙️ الإعدادات</h2>
                        <button onClick={onClose} className="w-8 h-8 bg-gray-100 rounded-full text-gray-500 font-bold">✕</button>
                    </div>

                    {/* --- قسم 1: الإعدادات العامة (ملف مفصول) --- */}
                    <GeneralSettings isZoomed={isZoomed} setIsZoomed={setIsZoomed} />

                    <div className="my-6 border-t border-dashed"></div>

                    {/* --- قسم 2: النظام (يمكن فصله لاحقاً) --- */}
                    <h3 className="text-xs font-bold text-gray-400 mb-2">النظام</h3>
                    
                    <button onClick={onUpdate} className="w-full flex items-center gap-3 p-3 bg-blue-50 text-blue-700 rounded-xl mb-2">
                        <span>🔄</span>
                        <span className="font-bold text-sm">تحديث التطبيق</span>
                    </button>

                    <a href="admin.html" className="w-full flex items-center gap-3 p-3 bg-red-50 text-red-700 rounded-xl">
                        <span>🔒</span>
                        <span className="font-bold text-sm">لوحة الإدارة</span>
                    </a>

                    <div className="mt-8 text-center text-[10px] text-gray-300 font-bold">
                        رقم الإصدار: 2.5.0 (Beta)
                    </div>
                </div>
            </div>
        );
    };

    window.SettingsModal = SettingsModal;
})();
