/* =========================================
   الوحدة: واجهة المستخدم (UI)
   المسار: js/modules/ui.js
   ========================================= */
const { useState, useEffect, useRef, useMemo } = React;

// النافذة المنبثقة الموحدة (Custom Modal)
window.CustomModal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in">
            <div className="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden border-4 border-emerald-50 scale-in">
                <div className="bg-emerald-50 p-4 text-center border-b border-emerald-100">
                    <h3 className="font-black text-emerald-800 text-lg">{title}</h3>
                </div>
                <div className="p-6 text-center">{children}</div>
                <div className="p-4 bg-gray-50 flex justify-center">
                    <button onClick={onClose} className="bg-emerald-600 text-white px-8 py-2 rounded-xl font-bold shadow hover:bg-emerald-700 w-full">حسناً</button>
                </div>
            </div>
        </div>
    );
};
