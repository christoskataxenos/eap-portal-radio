'use client';

import { useEffect, useState } from 'react';

export default function EasterEggs() {
    const [buffer, setBuffer] = useState('');

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Add char to buffer
            const char = e.key.toLowerCase();
            // Keep only last 10 chars
            setBuffer(prev => (prev + char).slice(-10));
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        if (buffer.endsWith('help')) {
            alert('There is no help here, only assignments.');
            setBuffer(''); // Reset
        }
    }, [buffer]);

    return null;
}
