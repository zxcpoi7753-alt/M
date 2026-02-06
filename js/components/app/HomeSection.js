/* =========================================
   المكون: الصفحة الرئيسية (تعديل مكان الفائز)
   المسار: js/components/app/HomeSection.js
   ========================================= */
const HomeSection = ({ config, studentName, showGlobalAlert, setPage }) => {
    return (
        <div className="space-y-6 animate-in">
            {/* الترحيب */}
            <section className="relative rounded-[2.5rem] overflow-hidden bg-emerald-700 text-white p-8 text-center shadow-xl">
                <div className="islamic-pattern"></div>
                <h2 className="relative z-10 text-2xl font-black mb-3">{config.texts?.heroTitle}</h2>
                {studentName && <div className="relative z-10 mt-4 bg-white/20 px-4 py-2 rounded-full text-xs font-bold inline-block">أهلاً {studentName}</div>}
            </section>

            {/* بطاقة السؤال (تحتوي على الفائز الآن) */}
            <div className="bg-white p-6 rounded-3xl border-r-[8px] border-amber-400 shadow-sm relative overflow-hidden">
                <h3 className="font-black text-lg mb-2 text-emerald-900">⭐ سؤال الأسبوع</h3>
                
                {/* نص السؤال */}
                <p className="mb-4 text-gray-700 font-bold leading-relaxed">{config.texts?.weeklyQuestion}</p>

                {/* 🏆 الفائز السابق (المكان الجديد: داخل البطاقة، فوق الزر) */}
                {config.texts?.previousWinner && (
                    <div className="mb-4 bg-gradient-to-r from-amber-50 to-yellow-50 p-3 rounded-xl border border-amber-100 flex items-center gap-3 animate-pulse-slow">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl shadow-sm border border-amber-100">
                            🏆
                        </div>
                        <div>
                            <p className="text-[9px] font-bold text-amber-500 uppercase tracking-wide">الفائز في السؤال السابق</p>
                            <h3 className="text-sm font-black text-amber-800">{config.texts.previousWinner}</h3>
                        </div>
                    </div>
                )}

                {/* زر الإجابة */}
                <button onClick={()=>{ 
                    if(!studentName) { showGlobalAlert('تنبيه', 'سجل اسمك في بطاقتي أولاً'); setPage('card'); } 
                    else window.open(`https://wa.me/${config.texts?.contact?.phone}?text=الطالب: ${studentName}`, '_blank') 
                }} className="w-full bg-[#25D366] text-white py-3 rounded-xl font-bold flex justify-center items-center gap-2 shadow-md hover:bg-green-600 transition">
                    💬 إرسال الإجابة
                </button>
            </div>

            {/* الأخبار */}
            <div className="flex flex-col gap-4">
                {config.news?.filter(n => !n.hidden).map(n => (
                    <div key={n.id} className="news-card">
                        <div className="flex justify-end text-[10px] font-bold text-gray-400 mb-2">{n.date}</div>
                        <h3 className="text-xl font-black mb-2" style={{color: n.colors?.title}}>{n.title}</h3>
                        <p className="text-sm leading-loose mb-3 text-gray-600" style={{color: n.colors?.content}}>{n.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};
