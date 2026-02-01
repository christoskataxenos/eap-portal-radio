'use client';

export default function Stats({ panicLevel, coffeeCups, hoursSpent }: { panicLevel: number, coffeeCups: number, hoursSpent: number }) {
    return (
        <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px',
            background: '#111', padding: '15px', borderRadius: '8px',
            margin: '20px 0', border: '1px solid #333'
        }}>
            <StatItem label="Panic Level" value={`${panicLevel}%`} color="var(--color-error)" />
            <StatItem label="Coffee Cups" value={coffeeCups} color="var(--color-coffee)" />
            <StatItem label="Hours Spent" value={hoursSpent} color="var(--color-blue)" />
        </div>
    );
}

function StatItem({ label, value, color }: { label: string, value: string | number, color: string }) {
    return (
        <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: color }}>{value}</div>
            <div style={{ fontSize: '0.8rem', color: '#888', textTransform: 'uppercase' }}>{label}</div>
        </div>
    );
}
