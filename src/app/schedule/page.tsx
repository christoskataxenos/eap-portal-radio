const schedule = [
    { day: 'Δευτέρα', events: [{ time: '10:00', title: 'Start Week Script', dj: 'AutoDJ' }, { time: '21:00', title: 'Introduction to Panic (ΠΛΗ10)', dj: 'Nick' }] },
    { day: 'Τρίτη', events: [{ time: '18:00', title: 'Coffee Break Beats', dj: 'AutoDJ' }, { time: '22:00', title: 'Algorithm Blues', dj: 'Maria' }] },
    { day: 'Τετάρτη', events: [{ time: '20:00', title: 'Mid-Week Crisis', dj: 'Kostas' }] },
    { day: 'Πέμπτη', events: [{ time: '12:00', title: 'Study With Me (Lofi)', dj: 'AutoDJ' }] },
    { day: 'Παρασκευή', events: [{ time: '23:00', title: 'Friday Night Compile', dj: 'The Team' }] },
    { day: 'Σάββατο', events: [{ time: '00:00', title: '404 Sleep Not Found', dj: 'All Star' }] },
    { day: 'Κυριακή', events: [{ time: '10:00', title: 'Deadline Evensong', dj: 'The Compiler' }] },
];

export default function SchedulePage() {
    return (
        <div>
            <h1 className="title-grunge" style={{ marginBottom: '2rem' }}>~/radio/cron_jobs</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {schedule.map((day) => (
                    <div key={day.day} className="grunge-container">
                        <h2 style={{
                            color: 'var(--color-orange)',
                            borderBottom: '1px solid #333',
                            paddingBottom: '0.5rem',
                            marginBottom: '1rem',
                            fontFamily: 'var(--font-fira-code)'
                        }}>
                            {day.day}
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {day.events.map((event, idx) => (
                                <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <span style={{
                                        fontFamily: 'var(--font-fira-code)',
                                        backgroundColor: '#222',
                                        padding: '2px 6px',
                                        borderRadius: '4px',
                                        color: 'var(--color-blue)',
                                        fontSize: '0.9rem'
                                    }}>
                                        {event.time}
                                    </span>
                                    <div>
                                        <div style={{ fontWeight: 'bold' }}>{event.title}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#777' }}> DJ: {event.dj}</div>
                                    </div>
                                </div>
                            ))}
                            {day.events.length === 0 && (
                                <div style={{ fontStyle: 'italic', color: '#555' }}>Offline (Studying...)</div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
