/* =========================================
   المكون: إدارة المعلمين
   المسار: js/components/admin/TeachersAdmin.js
   ========================================= */
const TeachersAdmin = ({ teachers, addItem, updateItem, toggleHidden, deleteItem }) => {
    return (
        <div>
            <button onClick={()=>addItem('teachers', {id:Date.now(), name:'اسم المعلم', bio:'', avatar:'🧔', hidden:false})} className="w-full bg-blue-50 text-blue-700 py-3 rounded-xl font-bold mb-4 border border-blue-100">+ إضافة معلم</button>
            {teachers.map(t => (
                <div key={t.id} className={`flex gap-3 items-start border p-3 rounded-xl mb-3 bg-white ${t.hidden ? 'opacity-50' : ''}`}>
                    <div className="flex flex-col items-center gap-1">
                        <input className="w-12 h-12 text-center text-2xl border rounded-full bg-gray-50" value={t.avatar} onChange={e=>updateItem('teachers', t.id, 'avatar', e.target.value)} placeholder="emoji" />
                        <span className="text-[10px] text-gray-400">أيقونة</span>
                    </div>
                    <div className="flex-1">
                        <input className="w-full font-bold border-b mb-1 pb-1" value={t.name} onChange={e=>updateItem('teachers', t.id, 'name', e.target.value)} placeholder="الاسم" />
                        <textarea className="w-full text-xs text-gray-500 h-10 resize-none" value={t.bio} onChange={e=>updateItem('teachers', t.id, 'bio', e.target.value)} placeholder="نبذة مختصرة" />
                        <div className="flex justify-end gap-2 mt-2">
                            <button onClick={()=>toggleHidden('teachers', t.id)} className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded">{t.hidden?'إظهار':'إخفاء'}</button>
                            <button onClick={()=>deleteItem('teachers', t.id)} className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded">حذف</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
