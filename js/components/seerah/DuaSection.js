/* =========================================
   المكون: حصن المسلم (الأدعية والأذكار)
   المسار: js/components/seerah/DuaSection.js
   ========================================= */
(function() {
    const { useState, useEffect, useMemo } = React;
    const CustomModal = window.CustomModal;

    const DuaSection = () => {
        const [categories, setCategories] = useState([]);
        const [loading, setLoading] = useState(true);
        const [search, setSearch] = useState("");
        const [selectedCategory, setSelectedCategory] = useState(null);
        const [copiedId, setCopiedId] = useState(null);

        // تحميل البيانات
        useEffect(() => {
            fetch('data/duas.json')
                .then(res => res.json())
                .then(data => {
                    setCategories(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Error loading duas:", err);
                    setLoading(false);
                });
        }, []);

        // تصفية البحث
        const filteredCats = useMemo(() => {
            if (!search) return categories;
            return categories.filter(cat => 
                cat.title.includes(search) || 
                cat.items.some(item => item.arabic.includes(search))
            );
        }, [categories, search]);

        // وظيفة النسخ
        const handleCopy = (text, id) => {
            navigator.clipboard.writeText(text).then(() => {
                setCopiedId(id);
                setTimeout(() => setCopiedId(null), 2000); // إخفاء رسالة "تم النسخ" بعد ثانيتين
            });
        };

        // وظيفة المشاركة
        const handleShare = (dua) => {
            const text = `${dua.arabic}\n\n${dua.translation ? dua.translation + '\n' : ''}📚 المصدر: ${dua.reference || 'بدون مصدر'}\n\nتطبيق الثريا`;
            
            if (navigator.share) {
                navigator.share({
                    title: 'دعاء من حصن المسلم',
                    text: text,
                }).catch(console.error);
            } else {
                handleCopy(text, dua.id); // إذا المتصفح لا يدعم المشاركة، انسخ النص
            }
        };

        if (loading) return <div className="p-8 text-center text-gray-400 animate-pulse">جاري تحميل الأدعية... 📖</div>;

        return (
            <div className="animate-in mb-8">
                
                {/* رأس القسم */}
                <div className="flex items-center justify-between mb-4 px-2">
                    <div>
                        <h2 className="font-amiri text-2xl font-black text-emerald-800">حصن المسلم</h2>
                        <p className="text-xs text-gray-500 font-bold">أذكار وأدعية من الكتاب والسنة</p>
                    </div>
                    <span className="text-3xl">🤲</span>
                </div>

                {/* شريط البحث */}
                <div className="relative mb-6 mx-1">
                    <input 
                        type="text" 
                        placeholder="ابحث عن دعاء أو ذكر..." 
                        className="w-full bg-white border border-emerald-100 rounded-xl py-3 px-10 shadow-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition outline-none"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <span className="absolute right-3 top-3.5 text-gray-400">🔍</span>
                </div>

                {/* شبكة الأقسام */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {filteredCats.map(cat => (
                        <button 
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat)}
                            className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-emerald-300 transition text-right group flex flex-col justify-between min-h-[100px]"
                        >
                            <span className="font-bold text-gray-800 group-hover:text-emerald-700 leading-snug">
                                {cat.title}
                            </span>
                            <div className="flex justify-between items-end mt-2">
                                <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-1 rounded-md font-bold">
                                    {cat.items.length} دعاء
                                </span>
                                <span className="text-gray-300 group-hover:text-emerald-500 text-lg">➜</span>
                            </div>
                        </button>
                    ))}
                </div>

                {/* نافذة عرض الأدعية */}
                {CustomModal && selectedCategory && (
                    <CustomModal 
                        isOpen={!!selectedCategory} 
                        onClose={() => setSelectedCategory(null)} 
                        title={selectedCategory.title}
                    >
                        <div className="space-y-6 py-2 pb-10">
                            {selectedCategory.items.map((dua, idx) => (
                                <div key={dua.id} className="bg-gray-50 rounded-2xl p-5 border border-gray-100 relative group hover:bg-white hover:shadow-sm transition">
                                    
                                    {/* رقم الدعاء */}
                                    <span className="absolute -top-3 -right-2 w-8 h-8 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold text-sm border-2 border-white">
                                        {idx + 1}
                                    </span>

                                    {/* النص العربي */}
                                    <p className="font-amiri text-xl leading-loose text-gray-800 text-right mb-4 mt-2">
                                        {dua.arabic}
                                    </p>

                                    {/* الترجمة والمصدر */}
                                    <div className="border-t border-gray-200 pt-3 mt-3">
                                        {dua.translation && (
                                            <p className="text-sm text-gray-500 mb-2 font-serif italic" dir="ltr">
                                                {dua.translation}
                                            </p>
                                        )}
                                        <p className="text-[10px] text-emerald-600 font-bold bg-emerald-50 inline-block px-2 py-1 rounded">
                                            📚 {dua.reference || "بدون مصدر"}
                                        </p>
                                    </div>

                                    {/* أزرار التحكم */}
                                    <div className="flex gap-2 mt-4 pt-2 border-t border-dashed border-gray-200 justify-end">
                                        <button 
                                            onClick={() => handleCopy(dua.arabic, dua.id)}
                                            className={`flex items-center gap-1 px-4 py-2 rounded-lg text-xs font-bold transition ${copiedId === dua.id ? 'bg-green-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                                        >
                                            {copiedId === dua.id ? 'تم النسخ ✅' : 'نسخ 📋'}
                                        </button>
                                        <button 
                                            onClick={() => handleShare(dua)}
                                            className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-emerald-700 transition flex items-center gap-1"
                                        >
                                            مشاركة 📤
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CustomModal>
                )}
            </div>
        );
    };

    window.DuaSection = DuaSection;
})();
