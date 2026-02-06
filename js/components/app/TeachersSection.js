/* =========================================
   المكون: المعلمون
   المسار: js/components/app/TeachersSection.js
   ========================================= */
const TeachersSection = ({ teachers }) => (
    <div className="grid gap-4 animate-in">
        {teachers?.filter(t => !t.hidden).map(t => (
            <div key={t.id} className="bg-white p-6 rounded-3xl border flex items-center gap-4 shadow-sm hover:shadow-md transition">
                <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center text-xl">{t.avatar}</div>
                <div><h3 className="font-black text-lg">{t.name}</h3><p className="text-gray-500 text-sm">{t.bio}</p></div>
            </div>
        ))}
    </div>
);
