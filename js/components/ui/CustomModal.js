/* =========================================
   المكون: النافذة المنبثقة العامة (Custom Modal)
   المسار: js/components/ui/CustomModal.js
   ========================================= */
const CustomModal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in">
            <div className="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden scale-in border-4 border-white ring-4 ring-emerald-50">
                {/* رأس النافذة */}
                <div className="bg-gray-50 p-5 border-b flex justify-between items-center">
                    <h3 className="font-black text-emerald-900 text-lg">{title}</h3>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full text-gray-500 hover:bg-red-50 hover:text-red-500 transition font-bold">✕</button>
                </div>
                
                {/* محتوى النافذة */}
                <div className="p-6 text-center text-gray-700 font-bold leading-loose">
                    {children}
                </div>

                {/* ذيل النافذة (اختياري) */}
                <div className="p-4 bg-gray-50 flex justify-center">
                    <button onClick={onClose} className="bg-emerald-600 text-white px-8 py-2 rounded-xl font-black shadow-lg hover:bg-emerald-700 transition">حسناً</button>
                </div>
            </div>
        </div>
    );
};

// تصدير المكون للنافذة
window.CustomModal = CustomModal;
