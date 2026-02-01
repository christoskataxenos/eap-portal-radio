'use client';

import { useState, useRef, useEffect } from 'react';

export default function RadioPlayer() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(50);
    const audioRef = useRef<HTMLAudioElement>(null);
    const STREAM_URL = 'https://stream.zeno.fm/0r0xa792kwzuv';

    useEffect(() => {
        if (audioRef.current) audioRef.current.volume = volume / 100;
    }, [volume]);

    const togglePlay = async () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
            audioRef.current.src = '';
            setIsPlaying(false);
        } else {
            try {
                audioRef.current.src = STREAM_URL;
                await audioRef.current.play();
                setIsPlaying(true);
            } catch (error) {
                setIsPlaying(false);
            }
        }
    };

    return (
        <div className="terminal-player" style={{ zIndex: 999999 }}>
            <audio ref={audioRef} />

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
                        <span>24/7 Lo-fi Beats for Debugging @ EAP-voia Radio</span>
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
