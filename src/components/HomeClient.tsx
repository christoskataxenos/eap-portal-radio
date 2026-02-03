'use client';

import TerminalBoot from '@/components/TerminalBoot';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getUpcomingShow } from '@/lib/schedule';

interface NewsItem {
    id: string;
    title: string;
    date: string;
    author: string;
}

export default function HomeClient({ latestNews }: { latestNews: NewsItem[] }) {
    const [panicMode, setPanicMode] = useState(false);
    const [showIntro, setShowIntro] = useState(true);
    const [currentGenreName, setCurrentGenreName] = useState('Loading...');
    const [upcomingShow, setUpcomingShow] = useState<{ title: string, time: string } | null>(null);

    // # Παρακολούθηση του είδους μουσικής από το localStorage
    useEffect(() => {
        const updateGenre = () => {
            const savedId = localStorage.getItem('radio-genre') || 'lofi';
            const genreNames: { [key: string]: string } = {
                'lofi': '24/7 Lo-fi Beats',
                'synth': 'Retro Synthwave',
                'metal': 'Hardcore Debugging',
                'focus': 'Ambient Focus',
                'classical': 'Classical Masterpieces'
            };
            setCurrentGenreName(genreNames[savedId] || 'Unknown Genre');
        };

        updateGenre(); // # Αρχική φόρτωση
        window.addEventListener('storage', updateGenre); // # Ενημέρωση αν αλλάξει σε άλλο tab

        // # Custom event για ενημέρωση στο ίδιο tab
        const interval = setInterval(updateGenre, 1000);

        return () => {
            window.removeEventListener('storage', updateGenre);
            clearInterval(interval);
        };
    }, []);

    // # Ενημέρωση επόμενης εκπομπής
    useEffect(() => {
        setUpcomingShow(getUpcomingShow());
        const interval = setInterval(() => {
            setUpcomingShow(getUpcomingShow());
        }, 1000 * 60); // # Κάθε λεπτό
        return () => clearInterval(interval);
    }, []);

    if (showIntro) {
        return (
            <>
                <TerminalBoot onComplete={() => setShowIntro(false)} />
            </>
        );
    }

    if (panicMode) {
        return (
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: '#1E1E1E',
                color: '#D4D4D4',
                zIndex: 9999999,
                fontFamily: 'Consolas, "Courier New", monospace',
                display: 'flex',
                flexDirection: 'column',
                fontSize: '14px'
            }}>

                {/* IDE Title Bar */}
                <div style={{
                    height: '35px',
                    background: '#333',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0 10px',
                    userSelect: 'none'
                }}>
                    {/* Menus */}
                    <div style={{ display: 'flex', gap: '15px', fontSize: '13px' }}>
                        <span>File</span>
                        <span>Edit</span>
                        <span>Selection</span>
                        <span>View</span>
                        <span style={{ color: '#aaa' }}>Go</span>
                        <span style={{ color: '#aaa' }}>Run</span>
                    </div>

                    {/* Title */}
                    <div style={{ fontSize: '12px', color: '#999', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
                        main.c - Visual Studio Panic - EAP Edition
                    </div>

                    {/* Window Controls */}
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#F4BF4F', cursor: 'not-allowed' }}></div>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#61C554', cursor: 'not-allowed' }}></div>
                        <div
                            onClick={() => setPanicMode(false)}
                            title="Close IDE (Return to Life)"
                            style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#FC625D', cursor: 'pointer', border: '1px solid #d00' }}
                        ></div>
                    </div>
                </div>

                {/* IDE Body */}
                <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                    {/* Sidebar */}
                    <div style={{ width: '200px', background: '#252526', borderRight: '1px solid #333', padding: '10px' }} className="mobile-hidden">
                        <div style={{ fontSize: '11px', fontWeight: 'bold', marginBottom: '10px' }}>EXPLORER</div>
                        <div style={{ color: '#E0E0E0' }}>&gt; PROJECT_PTYXIO</div>
                        <div style={{ paddingLeft: '15px', color: '#569CD6' }}># main.c</div>
                        <div style={{ paddingLeft: '15px' }}># hope.h <span style={{ color: '#d00' }}>(missing)</span></div>
                        <div style={{ paddingLeft: '15px' }}># sleep.exe <span style={{ color: '#d00' }}>(corrupted)</span></div>
                    </div>

                    {/* Editor Area */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        {/* Tabs */}
                        <div style={{ background: '#2D2D2D', display: 'flex' }}>
                            <div style={{ padding: '8px 15px', background: '#1E1E1E', borderTop: '2px solid #569CD6' }}>main.c</div>
                        </div>

                        {/* Code */}
                        <div style={{ flex: 1, padding: '10px', overflowY: 'auto' }}>
                            <pre style={{ lineHeight: '1.5' }}>
                                <span style={{ color: '#6A9955' }}>// Author: Unknown Student</span>{"\n"}
                                <span style={{ color: '#6A9955' }}>// Date: D-Day (Exam Day)</span>{"\n"}
                                <span style={{ color: '#C586C0' }}>#include</span> <span style={{ color: '#CE9178' }}>&lt;stdio.h&gt;</span>{"\n"}
                                <span style={{ color: '#C586C0' }}>#include</span> <span style={{ color: '#CE9178' }}>&lt;stdlib.h&gt;</span>{"\n"}
                                <span style={{ color: '#C586C0' }}>#include</span> <span style={{ color: '#CE9178' }}>&lt;despair.h&gt;</span>{"\n"}
                                {"\n"}
                                <span style={{ color: '#569CD6' }}>int</span> main() &#123;{"\n"}
                                <span style={{ color: '#569CD6' }}>float</span> gpa = 4.99;{"\n"}
                                <span style={{ color: '#569CD6' }}>void</span>* hope = <span style={{ color: '#569CD6' }}>NULL</span>;{"\n"}
                                <span style={{ color: '#569CD6' }}>long</span> coffee_intake = 999999L;{"\n"}
                                {"\n"}
                                <span style={{ color: '#6A9955' }}>/* TODO: Fix memory leak in my brain */</span>{"\n"}
                                <span style={{ color: '#C586C0' }}>while</span> (1) &#123;{"\n"}
                                printf(<span style={{ color: '#CE9178' }}>"Pretending to understand Pointers...\n"</span>);{"\n"}

                                <span style={{ color: '#C586C0' }}>if</span> (coffee_intake &gt; <span style={{ color: '#B5CEA8' }}>9000</span>) &#123;{"\n"}
                                <span style={{ color: '#DCDCAA' }}>panic</span>(<span style={{ color: '#CE9178' }}>"System Overload"</span>);{"\n"}
                                <span style={{ color: '#C586C0' }}>break</span>; <span style={{ color: '#6A9955' }}>// Unreachable code, just like graduation</span>{"\n"}
                                &#125;{"\n"}
                                {"\n"}
                                <span style={{ color: '#DCDCAA' }}>simulate_studying</span>();{"\n"}
                                &#125;{"\n"}
                                {"\n"}
                                <span style={{ color: '#C586C0' }}>return</span> <span style={{ color: '#B5CEA8' }}>0</span>; <span style={{ color: '#6A9955' }}>// Ideally</span>{"\n"}
                                &#125;
                            </pre>
                        </div>

                        {/* Terminal */}
                        <div style={{ height: '150px', background: '#1E1E1E', borderTop: '1px solid #333', padding: '10px', overflowY: 'auto' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '5px' }}>
                                <span style={{ fontWeight: 'bold' }}>TERMINAL</span>
                                <span>bash</span>
                            </div>
                            <div style={{ fontFamily: 'Consolas', fontSize: '13px' }}>
                                <div><span style={{ color: '#569CD6' }}>admin@EAP:~/projects/ptyxio</span>$ gcc main.c -o ptyxio</div>
                                <div>main.c: In function 'main':</div>
                                <div><span style={{ fontWeight: 'bold' }}>main.c:8:12: <span style={{ color: '#f44336' }}>error:</span></span> 'social_life' undeclared (first use in this function)</div>
                                <div><span style={{ fontWeight: 'bold' }}>main.c:12:5: <span style={{ color: '#f44336' }}>error:</span></span> 'sanity' caused a Segmentation fault (core dumped)</div>
                                <div><span style={{ fontWeight: 'bold' }}>main.c:42:1: <span style={{ color: 'orange' }}>warning:</span></span> implicit declaration of function 'pass_class' is invalid in C99</div>
                                <div><span style={{ color: '#f44336' }}>make: *** [all] Error 1</span></div>
                                <div><span style={{ color: '#569CD6' }}>admin@EAP:~/projects/ptyxio</span>$ _</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Status Bar */}
                <div style={{ height: '22px', background: '#007ACC', color: '#fff', fontSize: '12px', display: 'flex', alignItems: 'center', padding: '0 10px' }}>
                    <div style={{ marginRight: '15px' }}>main.c</div>
                    <div style={{ marginRight: '15px' }}>Ln 14, Col 32</div>
                    <div style={{ marginRight: '15px' }}>UTF-8</div>
                    <div style={{ flex: 1 }}></div>
                    <div>C EAP</div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            {/* Hero Section */}
            <section className="grunge-container" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <h1 className="title-grunge" style={{ fontSize: '2.5rem' }}>ΕΑΠ-νοια</h1>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-fira-code)' }}>
                    &gt; sudo sleep --force <br />
                    <span style={{ color: 'var(--color-error)' }}>Error: Permission Denied. Deadlines ahead.</span>
                </p>

                <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
                    <button className="btn-panic">LISTEN Stream</button>

                    {/* UNDERCOVER PANIC BUTTON: "Make Study" */}
                    <div
                        onClick={() => setPanicMode(true)}
                        title="Emergency Protocol: Compile Degree"
                        style={{
                            fontFamily: 'var(--font-fira-code)',
                            fontSize: '0.9rem',
                            color: '#666',
                            cursor: 'pointer',
                            border: '1px dashed #444',
                            padding: '0.5rem 1rem',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            backgroundColor: 'rgba(0,0,0,0.5)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'var(--color-success)';
                            e.currentTarget.style.color = 'var(--color-success)';
                            e.currentTarget.style.boxShadow = '0 0 10px rgba(0,255,0,0.2)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = '#444';
                            e.currentTarget.style.color = '#666';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        <span style={{ opacity: 0.5 }}>$</span> make study
                    </div>
                </div>
            </section>

            {/* Grid Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

                {/* Real News Feed */}
                <div className="grunge-container">
                    <h2 className="title-grunge">Latest Commit (News)</h2>

                    {latestNews.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {latestNews.map(item => (
                                <article key={item.id}>
                                    <Link href="/news" style={{ display: 'block', textDecoration: 'none', borderBottom: 'none' }}>
                                        <h3 style={{ color: 'var(--color-blue)', fontSize: '1.1rem', marginBottom: '0.3rem' }}>{item.title}</h3>
                                    </Link>
                                    <div style={{ fontSize: '0.8rem', color: '#666', fontFamily: 'var(--font-fira-code)' }}>
                                        {item.date} by {item.author}
                                    </div>
                                </article>
                            ))}
                            <Link href="/news" style={{ marginTop: '0.5rem', display: 'inline-block', fontSize: '0.9rem' }}>
                                &gt; See all logs...
                            </Link>
                        </div>
                    ) : (
                        <div style={{ color: '#666' }}>
                            No entry found in /var/log/news.
                            <br />
                            <a href="/news" style={{ fontFamily: 'var(--font-fira-code)', fontSize: '0.9rem' }}>
                                &gt; touch new_post.md
                            </a>
                        </div>
                    )}
                </div>

                {/* Deadlines & Events */}
                <div className="grunge-container" style={{ borderColor: 'var(--color-orange)' }}>
                    <h2 className="title-grunge" style={{ borderBottomColor: 'var(--color-success)' }}>System Events</h2>

                    <div className="code-block" style={{ marginBottom: '1rem' }}>
                        <span>$ next_deadline --check</span><br />
                        <span style={{ color: 'var(--color-orange)' }}>&gt; ΠΛΗ10: 25 Feb 2026 (Priority: High)</span><br />
                        <span style={{ color: 'var(--color-orange)' }}>&gt; ΠΛΗΠΡΟ: 11 March 2026 --force --maytheforcebewithus</span>
                    </div>

                    <div className="code-block">
                        <span>$ radio_schedule --now</span><br />
                        <span style={{ color: 'var(--color-blue)' }}>&gt; Now Playing: {currentGenreName}</span><br />
                        <span style={{ color: '#666', fontSize: '0.8rem' }}>
                            &gt; upcoming-scheduled-show: {upcomingShow ? `"${upcomingShow.title}" @ ${upcomingShow.time}` : 'None'}
                        </span>
                    </div>
                </div>

            </div>
        </div>
    );
}
