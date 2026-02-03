'use client';

import { useState, useRef, useEffect } from 'react';

const GENRES = [
    { id: 'lofi', name: '24/7 Lo-fi Beats', url: 'https://streams.fluxfm.de/Chillhop/mp3-128/' },
    { id: 'synth', name: 'Retro Synthwave', url: 'https://esoterica.servemp3.com:444/listen/synthwave_electronicrock/radio.mp3' },
    { id: 'metal', name: 'Hardcore Debugging', url: 'http://live.2stream.net:80/kizrock_metal' },
    { id: 'focus', name: 'Ambient Focus', url: 'http://stream.klassikradio.de/dreams/mp3-192/' },
    { id: 'classical', name: 'Classical Masterpieces', url: 'https://wrti-live.streamguys1.com/classical-mp3' },
];

export default function RadioPlayer() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(50);
    const [currentGenre, setCurrentGenre] = useState(GENRES[0]); // # Αρχικό είδος μουσικής
    const [isLoading, setIsLoading] = useState(false); // # Κατάσταση φόρτωσης
    const [showGenreMenu, setShowGenreMenu] = useState(false); // # Εμφάνιση μενού ειδών
    const audioRef = useRef<HTMLAudioElement>(null);

    // # Κλείσιμο μενού με το κλικ έξω
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (showGenreMenu) setShowGenreMenu(false);
        };
        if (showGenreMenu) {
            window.addEventListener('click', handleClickOutside);
        }
        return () => window.removeEventListener('click', handleClickOutside);
    }, [showGenreMenu]);

    // # Φόρτωση ρυθμίσεων από το localStorage κατά την εκκίνηση
    useEffect(() => {
        const savedGenreId = localStorage.getItem('radio-genre');
        const savedVolume = localStorage.getItem('radio-volume');

        if (savedGenreId) {
            const genre = GENRES.find(g => g.id === savedGenreId);
            if (genre) setCurrentGenre(genre);
        }
        if (savedVolume) {
            setVolume(Number(savedVolume));
        }
    }, []);

    // # Αποθήκευση ρυθμίσεων όταν αλλάζουν
    useEffect(() => {
        localStorage.setItem('radio-genre', currentGenre.id);
    }, [currentGenre]);

    useEffect(() => {
        localStorage.setItem('radio-volume', volume.toString());
        if (audioRef.current) audioRef.current.volume = volume / 100;
    }, [volume]);

    // # Εφέ για την αλλαγή του είδους μουσικής κατά τη διάρκεια της αναπαραγωγής
    useEffect(() => {
        if (isPlaying && audioRef.current) {
            setIsLoading(true);
            audioRef.current.src = currentGenre.url;
            audioRef.current.play().catch(() => setIsPlaying(false));
        }
    }, [currentGenre, isPlaying]);

    const togglePlay = async () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
            audioRef.current.src = '';
            setIsPlaying(false);
            setIsLoading(false);
        } else {
            try {
                setIsLoading(true);
                audioRef.current.src = currentGenre.url; // # Χρήση του τρέχοντος URL
                await audioRef.current.play();
                setIsPlaying(true);
            } catch (error) {
                setIsPlaying(false);
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="terminal-player" style={{ zIndex: 999999 }}>
            <audio
                ref={audioRef}
                onWaiting={() => setIsLoading(true)}
                onCanPlay={() => setIsLoading(false)}
            />

            {/* Genre Terminal Menu (Popup) */}
            {showGenreMenu && (
                <div
                    className="grunge-container"
                    onClick={(e) => e.stopPropagation()} // Stop closing when clicking inside
                    style={{
                        position: 'absolute',
                        bottom: '85px',
                        right: '150px',
                        minWidth: '250px',
                        zIndex: 1000000,
                        padding: '1rem',
                        border: '2px solid var(--color-orange)',
                        boxShadow: '0 0 20px rgba(0,0,0,0.9)'
                    }}
                >
                    <div style={{ fontSize: '0.7rem', color: '#666', marginBottom: '10px' }}>$ select_genre --list</div>
                    {GENRES.map((g, idx) => (
                        <div
                            key={g.id}
                            onClick={() => {
                                setCurrentGenre(g);
                                setShowGenreMenu(false);
                            }}
                            className="genre-option"
                            style={{
                                padding: '5px 10px',
                                cursor: 'pointer',
                                color: currentGenre.id === g.id ? 'var(--color-success)' : '#fff',
                                backgroundColor: currentGenre.id === g.id ? 'rgba(0,255,0,0.1)' : 'transparent',
                                borderLeft: currentGenre.id === g.id ? '2px solid var(--color-success)' : '2px solid transparent',
                                fontSize: '0.9rem',
                                transition: 'all 0.2s'
                            }}
                        >
                            <span style={{ opacity: 0.5, marginRight: '10px' }}>{idx + 1}.</span>
                            {g.name.toUpperCase()}
                        </div>
                    ))}
                    <div
                        onClick={() => setShowGenreMenu(false)}
                        style={{ marginTop: '10px', textAlign: 'right', fontSize: '0.7rem', color: 'var(--color-error)', cursor: 'pointer' }}
                    >
                        [ESC] CANCEL
                    </div>
                </div>
            )}

            {/* Left: Controls & Info */}
            <div className="player-main">
                <button
                    onClick={togglePlay}
                    className={`play-btn ${isPlaying ? 'playing' : ''}`}
                    title="Click to Play/Pause"
                >
                    {isPlaying ? '■' : '▶'}
                </button>

                <div className="track-info">
                    <div className="live-badge">
                        <span className={`dot ${isPlaying ? 'pulse' : ''}`}></span> LIVE
                    </div>
                    <div className="track-marquee">
                        <span>
                            {isLoading ? '>>> CONNECTING_TO_STREAM...' : `${currentGenre.name} for Debugging @ EAP-voia Radio`}
                        </span>
                    </div>
                </div>
            </div>

            {/* Right: Desktop Extras */}
            <div className="desktop-extras">
                {/* Visualizer Bars */}
                <div className="visualizer">
                    <div className="bar" style={{ height: isPlaying ? '80%' : '10%', animationDelay: '0s' }}></div>
                    <div className="bar" style={{ height: isPlaying ? '40%' : '10%', animationDelay: '0.1s' }}></div>
                    <div className="bar" style={{ height: isPlaying ? '90%' : '10%', animationDelay: '0.2s' }}></div>
                    <div className="bar" style={{ height: isPlaying ? '60%' : '10%', animationDelay: '0.3s' }}></div>
                </div>

                {/* Genre Selector Switcher */}
                <div className="volume-control" style={{ borderLeft: '1px solid #333', paddingLeft: '1rem' }}>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowGenreMenu(!showGenreMenu);
                        }}
                        style={{
                            background: '#000',
                            color: 'var(--color-success)',
                            border: '1px solid #333',
                            fontSize: '0.7rem',
                            padding: '4px 10px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px'
                        }}
                    >
                        <span>GENRE:</span>
                        <span style={{ fontWeight: 'bold' }}>{currentGenre.id.toUpperCase()}</span>
                        <span>▼</span>
                    </button>
                </div>

                <div className="volume-control">
                    <span>VOL</span>
                    <input
                        type="range"
                        min="0" max="100"
                        value={volume}
                        onChange={(e) => setVolume(Number(e.target.value))}
                    />
                </div>
            </div>
        </div>
    );
}
