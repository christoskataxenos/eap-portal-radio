'use client';

import { useState } from 'react';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [attempts, setAttempts] = useState(0);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);

        if (newAttempts >= 3) {
            // Trigger destruction
            return;
        }

        alert('Access Denied: You need to pass the "Psifiaki Epexergasia Simatos" first.');
    };

    if (attempts >= 3) {
        return (
            <div style={{
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#000',
                color: 'var(--color-error)',
                fontFamily: 'monospace',
                textAlign: 'center',
                padding: '2rem'
            }}>
                <h1 style={{ fontSize: '3rem', marginBottom: '2rem' }}>FATAL ERROR</h1>
                <p style={{ fontSize: '1.5rem' }}>&gt; sudo rm -rf /mental_health --no-preserve-root</p>
                <p style={{ marginTop: '1rem', color: '#fff' }}>Executing...</p>
                <div style={{ marginTop: '2rem', width: '300px', height: '20px', border: '1px solid #333' }}>
                    <div style={{ width: '0%', height: '100%', backgroundColor: 'red', animation: 'load 5s forwards' }}></div>
                </div>
                <style jsx>{`
          @keyframes load { to { width: 100%; } }
        `}</style>
            </div>
        );
    }

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh'
        }}>
            <div className="grunge-container" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
                <h1 className="title-grunge" style={{ width: '100%', textAlign: 'center' }}>sudo login</h1>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', fontFamily: 'var(--font-fira-code)', marginBottom: '0.5rem', color: 'var(--color-blue)' }}>
                            username:
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.8rem',
                                backgroundColor: '#000',
                                border: '1px solid #333',
                                color: '#fff',
                                fontFamily: 'var(--font-fira-code)'
                            }}
                            placeholder="root"
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontFamily: 'var(--font-fira-code)', marginBottom: '0.5rem', color: 'var(--color-blue)' }}>
                            password:
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.8rem',
                                backgroundColor: '#000',
                                border: '1px solid #333',
                                color: '#fff',
                                fontFamily: 'var(--font-fira-code)'
                            }}
                            placeholder="••••••••"
                        />
                    </div>

                    <button type="submit" className="btn-panic" style={{ width: '100%', marginTop: '1rem' }}>
                        Authenticate ({attempts}/3)
                    </button>
                </form>

                <p style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.8rem', color: '#666' }}>
                    Forgot password? Ask the system admin (if he is awake).
                </p>
            </div>
        </div>
    );
}
