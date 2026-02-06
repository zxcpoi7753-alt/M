/* =========================================
   المكون: إدارة الأخبار
   المسار: js/components/admin/NewsAdmin.js
   ========================================= */
const NewsAdmin = ({ news, addItem, updateItem, updateDeepItem, toggleHidden, deleteItem }) => {
    return (
        <div>
            <button onClick={() => addItem('news', {id: Date.now(), title: 'عنوان الخبر', content: '', date: new Date().toISOString().split('T')[0], hidden: false, colors: {title:'#000000', content:'#4b5563', link:'#2563eb'}, link: {url:'', text:''}})} className="w-full bg-emerald-100 text-emerald-800 py-3 rounded-xl font-bold mb-4 border border-emerald-200 dashed-border hover:bg-emerald-200">+ إضافة خبر جديد</button>
            
            {news.map(n => (
                <div key={n.id} className={`bg-white border rounded-2xl p-4 mb-4 relative transition ${n.hidden ? 'opacity-60 grayscale bg-gray-50 border-gray-300' : 'border-emerald-100 shadow-sm'}`}>
                    {n.hidden && <div className="absolute top-2 left-2 bg-gray-600 text-white text-[10px] px-2 py-1 rounded font-bold">🚫 مخفي</div>}
                    
                    <div className="grid gap-2 mb-3">
                        <input className="w-full font-black text-lg border-b pb-1" placeholder="عنوان الخبر" value={n.title} onChange={e=>updateItem('news', n.id, 'title', e.target.value)} />
                        <textarea className="w-full text-sm h-20 bg-gray-50 p-2 rounded" placeholder="تفاصيل الخبر..." value={n.content} onChange={e=>updateItem('news', n.id, 'content', e.target.value)} />
                    </div>

                    <div className="bg-gray-50 p-3 rounded-xl mb-3 border border-gray-100">
                        <p className="text-xs font-bold text-gray-400 mb-2">🎨 التخصيص:</p>
                        <div className="flex flex-wrap gap-2 mb-2">
                            <label className="flex items-center gap-1 text-[10px] bg-white px-2 py-1 rounded border">لون العنوان: <input type="color" value={n.colors?.title || '#000000'} onChange={e=>updateDeepItem('news', n.id, 'colors', 'title', e.target.value)} /></label>
                            <label className="flex items-center gap-1 text-[10px] bg-white px-2 py-1 rounded border">لون النص: <input type="color" value={n.colors?.content || '#4b5563'} onChange={e=>updateDeepItem('news', n.id, 'colors', 'content', e.target.value)} /></label>
                            <label className="flex items-center gap-1 text-[10px] bg-white px-2 py-1 rounded border">لون الرابط: <input type="color" value={n.colors?.link || '#2563eb'} onChange={e=>updateDeepItem('news', n.id, 'colors', 'link', e.target.value)} /></label>
                        </div>
                        <div className="flex gap-2">
                            <input className="flex-1 p-2 border rounded text-xs" placeholder="رابط (URL)" value={n.link?.url || ''} onChange={e=>updateDeepItem('news', n.id, 'link', 'url', e.target.value)} />
                            <input className="w-1/3 p-2 border rounded text-xs" placeholder="نص الزر" value={n.link?.text || ''} onChange={e=>updateDeepItem('news', n.id, 'link', 'text', e.target.value)} />
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 border-t pt-2">
                        <button onClick={()=>toggleHidden('news', n.id)} className={`px-4 py-1 rounded-lg text-xs font-bold ${n.hidden ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-600'}`}>{n.hidden ? '👁️ إظهار' : '🚫 إخفاء'}</button>
                        <button onClick={()=>deleteItem('news', n.id)} className="px-4 py-1 rounded-lg text-xs font-bold bg-red-100 text-red-700 hover:bg-red-200">🗑️ حذف</button>
                    </div>
                </div>
            ))}
        </div>
    );
};
