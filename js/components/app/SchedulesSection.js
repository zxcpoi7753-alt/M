/* =========================================
   المكون: الجداول الدراسية
   المسار: js/components/app/SchedulesSection.js
   ========================================= */
const SchedulesSection = ({ schedules }) => {
    const [expandedSch, setExpandedSch] = React.useState(null);

    const renderList = (period, title, colorClass) => (
        <div className="mb-8">
            <h3 className={`font-black text-xl mb-4 border-b-2 pb-2 w-fit ${colorClass}`}>{title}</h3>
            {schedules?.filter(s => s.period === period && !s.hidden).map(sch => (
                <div key={sch.id}>
                    <div 
                        onClick={() => setExpandedSch(expandedSch === sch.id ? null : sch.id)} 
                        className={`halqa-accordion ${expandedSch === sch.id ? 'active' : ''}`}
                    >
                        <span>{sch.name}</span>
                        <span>{expandedSch === sch.id ? '−' : '+'}</span>
                    </div>
                    {expandedSch === sch.id && (
                        <div className="bg-white rounded-xl shadow-md overflow-hidden border mb-4 animate-in">
                            <table className="schedule-table">
                                <thead><tr><th>اليوم</th><th>الوقت</th><th>ملاحظة</th></tr></thead>
                                <tbody>
                                    {sch.days.map((d, i) => (
                                        <tr key={i}><td>{d.day}</td><td className="text-emerald-700 font-bold">{d.time}</td><td className="text-gray-500 text-xs">{d.note}</td></tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );

    return (
        <div className="animate-in">
            {renderList('عصر', '☀️ حلقات العصر', 'text-amber-600 border-amber-200')}
            {renderList('مغرب', '🌙 حلقات المغرب', 'text-indigo-600 border-indigo-200')}
        </div>
    );
};
