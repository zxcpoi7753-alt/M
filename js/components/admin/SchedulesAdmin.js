/* =========================================
   المكون: إدارة الجداول
   المسار: js/components/admin/SchedulesAdmin.js
   ========================================= */
const SchedulesAdmin = ({ schedules, addItem, toggleHidden, deleteItem, setConfig }) => {
    return (
        <div>
            <div className="flex gap-2 mb-4 bg-indigo-50 p-3 rounded-xl">
                <input id="schName" className="flex-1 p-2 border rounded-lg text-sm" placeholder="اسم الحلقة" />
                <select id="schPer" className="p-2 border rounded-lg text-sm font-bold"><option value="عصر">عصر</option><option value="مغرب">مغرب</option></select>
                <button onClick={()=>{
                    const n=document.getElementById('schName').value, p=document.getElementById('schPer').value;
                    if(n) { addItem('schedules', {id:Date.now(), name:n, period:p, hidden:false, days:['السبت','الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس'].map(d=>({day:d,time:'',note:''}))}); document.getElementById('schName').value=''; }
                }} className="bg-indigo-600 text-white px-4 rounded-lg font-bold">+</button>
            </div>
            {schedules.map(s => (
                <div key={s.id} className={`border p-3 rounded-xl mb-3 bg-white ${s.hidden ? 'opacity-60' : ''}`}>
                    <div className="flex justify-between items-center mb-2 border-b pb-2">
                        <span className="font-bold text-emerald-800">{s.name} <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-full">{s.period}</span></span>
                        <div className="flex gap-1">
                            <button onClick={()=>toggleHidden('schedules', s.id)} className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200">{s.hidden?'👁️':'🚫'}</button>
                            <button onClick={()=>deleteItem('schedules', s.id)} className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200">🗑️</button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-1">
                        {s.days.map((d,i)=>(
                            <div key={i} className="flex items-center text-xs border-b last:border-0 py-1">
                                <span className="w-10 font-bold text-gray-500">{d.day}</span>
                                <input className="flex-1 border-l border-r px-2 py-1 mx-1 rounded" value={d.time} placeholder="--:--" onChange={e=>{
                                    // تحديث معقد قليلاً يتطلب setConfig الممررة
                                    setConfig(prev => ({ ...prev, schedules: prev.schedules.map(x => x.id === s.id ? { ...x, days: x.days.map((day, idx) => idx === i ? { ...day, time: e.target.value } : day) } : x) }));
                                }} />
                                <input className="flex-1 px-2 py-1 rounded bg-gray-50" value={d.note} placeholder="ملاحظة" onChange={e=>{
                                    setConfig(prev => ({ ...prev, schedules: prev.schedules.map(x => x.id === s.id ? { ...x, days: x.days.map((day, idx) => idx === i ? { ...day, note: e.target.value } : day) } : x) }));
                                }} />
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};
