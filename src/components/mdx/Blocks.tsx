'use client';

export function Callout({ type = 'info', title, children }: { type?: 'info' | 'warning' | 'danger', title?: string, children: React.ReactNode }) {
    const colors = {
        info: 'var(--color-blue, #00BCD4)',
        warning: 'var(--color-orange, #FF9800)',
        danger: 'var(--color-error, #F44336)',
    };

    const color = colors[type];

    return (
        <div style={{
            borderLeft: `4px solid ${color}`,
            background: 'rgba(255,255,255,0.05)',
            padding: '1rem',
            margin: '1.5rem 0',
            borderRadius: '0 4px 4px 0'
        }}>
            {title && <div style={{ fontWeight: 'bold', color: color, marginBottom: '0.5rem' }}>{title}</div>}
            <div style={{ color: '#ddd' }}>{children}</div>
        </div>
    );
}

export function Terminal({ title = 'Terminal', children }: { title?: string, children: React.ReactNode }) {
    return (
        <div style={{
            background: '#000',
            border: '1px solid #333',
            borderRadius: '6px',
            margin: '1.5rem 0',
            overflow: 'hidden',
            fontFamily: "'Fira Code', monospace"
        }}>
            <div style={{
                background: '#222',
                padding: '5px 10px',
                fontSize: '0.8rem',
                color: '#aaa',
                borderBottom: '1px solid #333',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
            }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f56' }}></span>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffbd2e' }}></span>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#27c93f' }}></span>
                <span style={{ marginLeft: '10px' }}>{title}</span>
            </div>
            <div style={{ padding: '1rem', color: '#0f0', fontSize: '0.9rem', lineHeight: '1.5' }}>
                {children}
            </div>
        </div>
    );
}

export function FileTree({ children }: { children: React.ReactNode }) {
    return (
        <div style={{
            background: '#1a1a1a',
            border: '1px solid #444',
            borderRadius: '6px',
            padding: '1rem',
            margin: '1.5rem 0',
            fontFamily: "'Fira Code', monospace",
            fontSize: '0.9rem',
            color: '#e0e0e0',
            whiteSpace: 'pre',
            overflowX: 'auto'
        }}>
            {children}
        </div>
    );
}
