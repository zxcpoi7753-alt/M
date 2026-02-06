/* =========================================
   المكون: إدارة الأوائل
   المسار: js/components/admin/HalaqatAdmin.js
   ========================================= */
const HalaqatAdmin = ({ halaqat, addItem, toggleHidden, deleteItem, setConfig }) => {
    return (
        <div>
            <button onClick={()=>{const n=prompt('اسم الحلقة الجديد:'); if(n) addItem('halaqat', {id:Date.now(), name:n, students:[], hidden:false})}} className="w-full bg-amber-100 text-amber-800 py-3 rounded-xl font-bold mb-4 hover:bg-amber-200">+ إضافة حلقة تكريم</button>
            {halaqat.map(h => (
                <div key={h.id} className={`bg-amber-50 border border-amber-200 p-3 rounded-xl mb-3 ${h.hidden ? 'opacity-60' : ''}`}>
                    <div className="flex justify-between font-bold text-amber-900 mb-2 border-b border-amber-200 pb-2">
                        <span>{h.name}</span>
                        <div className="flex gap-1">
                            <button onClick={()=>toggleHidden('halaqat', h.id)} className="text-xs text-amber-700 bg-white px-2 rounded">{h.hidden?'إظهار':'إخفاء'}</button>
                            <button onClick={()=>deleteItem('halaqat', h.id)} className="text-xs text-red-600 bg-white px-2 rounded">حذف</button>
                        </div>
                    </div>
                    {h.students.map(st => (
                        <div key={st.id} className="flex gap-1 mb-1 items-center">
                            <span className="text-xs text-amber-400">⭐</span>
                            <input className="flex-1 p-1.5 border rounded-lg text-xs" value={st.name} placeholder="اسم الطالب" onChange={e=>{
                                setConfig(prev => ({ ...prev, halaqat: prev.halaqat.map(x => x.id === h.id ? { ...x, students: x.students.map(y => y.id === st.id ? { ...y, name: e.target.value } : y) } : x) }));
                            }} />
                            <input className="w-16 p-1.5 border rounded-lg text-center text-xs font-bold" value={st.rank} placeholder="المركز" onChange={e=>{
                                setConfig(prev => ({ ...prev, halaqat: prev.halaqat.map(x => x.id === h.id ? { ...x, students: x.students.map(y => y.id === st.id ? { ...y, rank: e.target.value } : y) } : x) }));
                            }} />
                            <button onClick={()=>{
                                setConfig(prev => ({ ...prev, halaqat: prev.halaqat.map(x => x.id === h.id ? { ...x, students: x.students.filter(y => y.id !== st.id) } : x) }));
                            }} className="text-red-500 font-bold px-2 hover:bg-red-50 rounded">×</button>
                        </div>
                    ))}
                    <button onClick={()=>{
                        setConfig(prev => ({ ...prev, halaqat: prev.halaqat.map(x => x.id === h.id ? { ...x, students: [...x.students, {id:Date.now(), name:'', rank:''}] } : x) }));
                    }} className="w-full bg-white border border-amber-200 py-2 rounded-lg text-xs font-bold text-amber-600 mt-2 hover:bg-amber-100">+ إضافة طالب</button>
                </div>
            ))}
        </div>
    );
};
