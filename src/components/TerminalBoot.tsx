'use client';

import { useState, useEffect, useRef } from 'react';

export default function TerminalBoot({ onComplete }: { onComplete: () => void }) {
    const [lines, setLines] = useState<string[]>([]);
    const [showPrompt, setShowPrompt] = useState(false);
    const [userInput, setUserInput] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const [bootFinished, setBootFinished] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Boot Sequence Logs
    const bootLogs = [
        { text: "Initializing kernel... [ OK ]", delay: 200 },
        { text: "Mounting /dev/brain... [ WARNING: Low Capacity ]", delay: 400 },
        { text: "Loading module: coffee_daemon... [ OK ]", delay: 600 },
        { text: "Checking academic dependencies...", delay: 800 },
        { text: "Error: 'Sleep' module not found or corrupted.", delay: 1000 },
        { text: "Bypassing procrastination firewall... [ SUCCESS ]", delay: 1500 },
        { text: "Connecting to EAP servers... [ TIMEOUT ]", delay: 2000 },
        { text: "Switching to backup local radio... [ OK ]", delay: 2200 },
        { text: "", delay: 2500 }, // Spacer
        { text: "System requires update.", delay: 2600 },
    ];

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [lines, userInput, isUpdating]);

    // Focus input automatically
    useEffect(() => {
        if (showPrompt && inputRef.current) {
            inputRef.current.focus();
        }
    }, [showPrompt]);

    // Run initial boot sequence
    useEffect(() => {
        // Check if already visited
        const visited = localStorage.getItem('eap_boot_visited');
        if (visited) {
            onComplete();
            return;
        }

        let currentIndex = 0;

        const runBoot = async () => {
            for (const log of bootLogs) {
                await new Promise(r => setTimeout(r, Math.random() * 300 + 100)); // Randomize delay a bit
                setLines(prev => [...prev, log.text]);
            }
            setShowPrompt(true);
        };

        runBoot();
    }, []);

    const handleCommand = async (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            const cmd = userInput.trim().toLowerCase();
            setShowPrompt(false);
            setLines(prev => [...prev, `user@eap:~$ ${userInput}`]);

            if (cmd === 'yes' || cmd === 'y' || cmd === '') {
                // Run Fake Update
                setIsUpdating(true);
                setLines(prev => [...prev, "sudo apt-get update && sudo apt-get upgrade -y"]);

                const updateLogs = [
                    "Hit:1 http://security.eap.gr/repo stable InRelease",
                    "Hit:2 http://despair.archive.ubuntu.com/ubuntu focal InRelease",
                    "Get:3 http://grades.eap.gr/predictions future [404 Not Found]",
                    "Reading package lists... Done",
                    "Building dependency tree... Done",
                    "Calculated upgrade: 42 packages.",
                    "Unpacking mental-stability (0.1-beta)...",
                    "Setting up radio-portal (2.0.0)...",
                    "Processing triggers for anxiety-d (1.2)...",
                    "Done."
                ];

                for (const log of updateLogs) {
                    await new Promise(r => setTimeout(r, Math.random() * 400 + 200));
                    setLines(prev => [...prev, log]);
                }

                setTimeout(() => {
                    finishBoot();
                }, 1000);

            } else {
                // User typed NO
                setLines(prev => [...prev, "Aborting update.", "Warning: System may be unstable.", "Booting anyway..."]);
                setTimeout(() => {
                    finishBoot();
                }, 1500);
            }
        }
    };

    const finishBoot = () => {
        setBootFinished(true);
        localStorage.setItem('eap_boot_visited', 'true');
        setTimeout(() => {
            onComplete();
        }, 500); // Animation Fade out
    };

    if (bootFinished) return null; // Or keep rendering with opacity 0 for fade effect

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, width: '100vw', height: '100vh',
            backgroundColor: '#000',
            color: '#0f0',
            fontFamily: "'Fira Code', 'Courier New', monospace",
            fontSize: '14px',
            padding: '2rem',
            zIndex: 99999999, // TOP LEVEL
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
        }} onClick={() => inputRef.current?.focus()}>

            <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto' }}>
                {lines.map((line, i) => (
                    <div key={i} style={{ minHeight: '1.2em', whiteSpace: 'pre-wrap' }}>
                        {line}
                    </div>
                ))}

                {showPrompt && (
                    <div style={{ display: 'flex', marginTop: '10px' }}>
                        <span style={{ color: '#00f', marginRight: '10px' }}>user@eap:~$</span>
                        <span>sudo apt update && sudo apt upgrade</span>
                    </div>
                )}

                {showPrompt && (
                    <div style={{ display: 'flex' }}>
                        <span style={{ color: '#aaa', marginRight: '10px' }}>Do you want to continue? [Y/n]</span>
                        <input
                            ref={inputRef}
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            onKeyDown={handleCommand}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#fff',
                                outline: 'none',
                                fontFamily: 'inherit',
                                fontSize: 'inherit',
                                width: '50px',
                                caretColor: '#0f0'
                            }}
                            autoFocus
                        />
                    </div>
                )}

                {isUpdating && !bootFinished && (
                    <div style={{ marginTop: '10px', color: '#aaa ' }}>Processing... <span className="blink">_</span></div>
                )}
            </div>

            <style jsx>{`
        .blink { animation: blink 1s step-end infinite; }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
      `}</style>
        </div>
    );
}
