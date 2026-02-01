import Link from 'next/link';

export default function Navbar() {
    return (
        <nav style={{
            borderBottom: '2px solid var(--border-color)',
            padding: '0.8rem 1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#000',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            boxShadow: '0 2px 10px rgba(0,255,0,0.1)'
        }}>
            <div style={{ fontFamily: 'var(--font-fira-code)', fontSize: '1.2rem', fontWeight: 'bold', textShadow: '0 0 5px var(--color-orange)' }}>
                <Link href="/" style={{ color: 'var(--color-orange)', textDecoration: 'none', border: 'none', boxShadow: 'none' }}>
                    &gt; ./EAP-νοια_v1.0.sh
                </Link>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', fontFamily: 'var(--font-fira-code)', fontSize: '0.9rem' }}>
                <Link href="/" style={{ border: 'none' }}>~/home</Link>
                <Link href="/news" style={{ border: 'none' }}>~/news</Link>
                <Link href="/schedule" style={{ border: 'none' }}>~/schedule</Link>
                <Link href="/about" style={{ border: 'none' }}>~/about</Link>
                <Link href="/login" style={{ color: 'var(--color-orange)', border: 'none' }}>sudo login</Link>
            </div>
        </nav>
    );
}
