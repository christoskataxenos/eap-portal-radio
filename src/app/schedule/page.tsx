import { radioSchedule } from '@/lib/schedule';

export default function SchedulePage() {
    // Sort schedule to show Monday first if it's not already
    const sortedSchedule = [...radioSchedule].sort((a, b) => {
        const order = [1, 2, 3, 4, 5, 6, 0];
        return order.indexOf(a.dayIndex) - order.indexOf(b.dayIndex);
    });

    return (
        <div>
            <h1 className="title-grunge" style={{ marginBottom: '2rem' }}>~/radio/cron_jobs</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {sortedSchedule.map((day) => (
                    <div key={day.dayName} className="grunge-container">
                        <h2 style={{
                            color: 'var(--color-orange)',
                            borderBottom: '1px solid #333',
                            paddingBottom: '0.5rem',
                            marginBottom: '1rem',
                            fontFamily: 'var(--font-fira-code)'
                        }}>
                            {day.dayName}
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
