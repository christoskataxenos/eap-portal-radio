'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';

interface Deadline {
    task: string;
    date: string;
}

export default function Terminal() {
    const [input, setInput] = useState('');
    const [history, setHistory] = useState<string[]>([
        'Welcome to EAP-voia Terminal v1.0.0',
        'Type "help" for a list of available commands.',
        ''
    ]);
    const [coffees, setCoffees] = useState(0);
    const [deadlines, setDeadlines] = useState<Deadline[]>([]);
    const [isExpanded, setIsExpanded] = useState(false);
    const [studentCount, setStudentCount] = useState(1);
    const [lastShouts, setLastShouts] = useState<any[]>([]);

    const scrollRef = useRef<HTMLDivElement>(null);
    const chatScrollRef = useRef<HTMLDivElement>(null); // # Ref για το αυτόματο σκρολ του chat
    const inputRef = useRef<HTMLInputElement>(null);

    // # Σύνδεση με Supabase για Real-time Shouts
    useEffect(() => {
        const fetchShouts = async () => {
            const yesterday = new Date();
            yesterday.setHours(yesterday.getHours() - 24);

            const { data, error } = await supabase
                .from('shouts')
                .select('*')
                .gt('created_at', yesterday.toISOString()) // # Μόνο μηνύματα των τελευταίων 24 ωρών
                .order('created_at', { ascending: false })
                .limit(100);

            if (data) setLastShouts(data.reverse());
        };

        fetchShouts();

        const channel = supabase
            .channel('public:shouts')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'shouts' }, payload => {
                setLastShouts(prev => [...prev, payload.new].slice(-50)); // # Κρατάμε τα τελευταία 50
                if (isExpanded) {
                    addToHistory(`[SHOUT] ${payload.new.username}: ${payload.new.message}`);
                }
            })
            .subscribe();

        // # Live Student Counter (Mock logic για τώρα, μπορεί να γίνει με Presence)
        const interval = setInterval(() => {
            setStudentCount(Math.floor(Math.random() * 10) + 25); // # Φαίνεται ότι 25-35 άτομα διαβάζουν
        }, 30000);

        return () => {
            supabase.removeChannel(channel);
            clearInterval(interval);
        };
    }, [isExpanded]);

    // # Εστίαση στο input και ενημέρωση ύψους όταν αλλάζει η κατάσταση
    useEffect(() => {
        if (isExpanded) {
            setTimeout(() => inputRef.current?.focus(), 100);
            document.documentElement.style.setProperty('--terminal-height', '480px'); // # 400px terminal + 80px radio
        } else {
            document.documentElement.style.setProperty('--terminal-height', '125px'); // # 45px terminal + 80px radio
        }
    }, [isExpanded]);

    // # Αρχική ρύθμιση ύψους
    useEffect(() => {
        document.documentElement.style.setProperty('--terminal-height', '125px');
    }, []);

    // # Αυτόματο σκρολ στο τέλος του log
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [history, isExpanded]);

    // # Αυτόματο σκρολ στο τέλος του chat
    useEffect(() => {
        if (chatScrollRef.current) {
            chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
        }
    }, [lastShouts, isExpanded]);

    // # Κατάσταση για τον Pomodoro Timer
    const [timerActive, setTimerActive] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // # Ενημέρωση του χρονομέτρου κάθε δευτερόλεπτο
    useEffect(() => {
        if (timerActive && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && timerActive) {
            setTimerActive(false);
            addToHistory(">>> TIMER FINISHED! Ώρα για διάλειμμα ή άλλον έναν καφέ;");
            if (timerRef.current) clearInterval(timerRef.current);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [timerActive, timeLeft]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? "0" : ""}${s}`;
    };

    const addToHistory = (line: string) => {
        setHistory(prev => [...prev, line]);
    };

    const handleCommand = (cmd: string) => {
        const parts = cmd.trim().split(/\s+/);
        const base = parts[0].toLowerCase();

        addToHistory(`admin@EAP:~$ ${cmd}`);

        switch (base) {
            case "help":
                addToHistory("Available commands:");
                addToHistory("  help             - Show this help message");
                addToHistory("  clear            - Clear terminal history");
                addToHistory("  shout [msg]      - Send an anonymous message to everyone");
                addToHistory("  shouts           - Show recent shouts from community");
                addToHistory("  request [song]   - Suggest a track for the stream");
                addToHistory("  deadline --add \"Task\" --date DD/MM - Add a deadline");
                addToHistory("  deadline --list  - List all deadlines");
                addToHistory("  timer --start N  - Start Pomodoro timer for N minutes");
                addToHistory("  calc-gpa         - GPA Predictor tool");
                addToHistory("  coffee           - Log a coffee intake");
                addToHistory("  exit             - Minimize terminal");
                break;

            case "shout":
                const msg = parts.slice(1).join(" ");
                if (!msg) {
                    addToHistory("Usage: shout [your message]");
                } else if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
                    addToHistory("Error: Community features are offline. (Set NEXT_PUBLIC_SUPABASE_URL in .env.local)");
                } else {
                    const sendShout = async () => {
                        const { error } = await supabase
                            .from('shouts')
                            .insert([{ username: 'Anonymous Student', message: msg, type: 'shout' }]);

                        if (error) addToHistory("Error: Failed to connect to Shoutbox. (Check Supabase Config)");
                        else addToHistory(">>> Shout broadcasted to the community!");
                    };
                    sendShout();
                }
                break;

            case "shouts":
                if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
                    addToHistory("Shoutbox is offline. Configure Supabase to see community messages.");
                } else if (lastShouts.length === 0) {
                    addToHistory("Communication lines are quiet. Be the first to shout!");
                } else {
                    addToHistory("--- RECENT COMMUNITY SHOUTS ---");
                    lastShouts.forEach(s => {
                        const time = new Date(s.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                        addToHistory(`[${time}] ${s.username}: ${s.message}`);
                    });
                }
                break;

            case "request":
                const song = parts.slice(1).join(" ");
                if (!song) {
                    addToHistory("Usage: request [song name or link]");
                } else if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
                    addToHistory("Error: Requests are offline. Configure Supabase.");
                } else {
                    const sendRequest = async () => {
                        await supabase
                            .from('shouts')
                            .insert([{ username: 'Listener', message: `Proposed song: ${song}`, type: 'request' }]);
                        addToHistory(">>> Request sent! The Admin will review it.");
                    };
                    sendRequest();
                }
                break;

            case "clear":
                setHistory([]);
                break;

            case "coffee":
                const newCount = coffees + 1;
                setCoffees(newCount);
                localStorage.setItem("terminal-coffees", newCount.toString());

                let comment = "";
                if (newCount < 3) comment = "Ακόμα αντέχεις. Συνέχισε.";
                else if (newCount < 6) comment = "Η καρδιά σου πάει σαν multi-threaded process.";
                else if (newCount < 10) comment = "Βλέπεις τον κώδικα σε ASCII art στον τοίχο.";
                else comment = "Error: Sanity not found. Caffeine levels critical.";

                addToHistory(`Coffee logged! Total: ${newCount}. ${comment}`);
                break;

            case "deadline":
                if (parts.includes("--list")) {
                    if (deadlines.length === 0) {
                        addToHistory("No deadlines found. Use --add to create one.");
                    } else {
                        addToHistory("Upcoming Deadlines:");
                        deadlines.forEach(d => addToHistory(` - ${d.task}: ${d.date}`));
                    }
                } else if (parts.includes("--add")) {
                    const taskMatch = cmd.match(/--add\s+"([^"]+)"/);
                    const dateMatch = cmd.match(/--date\s+([^\s]+)/);

                    if (taskMatch && dateMatch) {
                        const newDeadline = { task: taskMatch[1], date: dateMatch[1] };
                        const updated = [...deadlines, newDeadline];
                        setDeadlines(updated);
                        localStorage.setItem("terminal-deadlines", JSON.stringify(updated));
                        addToHistory(`Added deadline: ${newDeadline.task} on ${newDeadline.date}`);
                    } else {
                        addToHistory("Usage: deadline --add \"Task Name\" --date DD/MM");
                    }
                } else {
                    addToHistory("Usage: deadline --list OR deadline --add \"Task\" --date DD/MM");
                }
                break;

            case "calc-gpa":
                // # Υπολογισμός με βάση τους κανόνες του ΕΑΠ:
                // # 4 Εργασίες (30%) + Τελικές Εξετάσεις (70%)
                // # ΑΠΑΡΑΙΤΗΤΗ ΠΡΟΫΠΟΘΕΣΗ: Βαθμός εξετάσεων >= 5.0
                if (parts.length < 5) {
                    addToHistory("Usage: calc-gpa [G1] [G2] [G3] [G4] [Target]");
                    addToHistory("Example: calc-gpa 8 7.5 9 6 5 (Targeting 5 to pass)");
                } else {
                    const g1 = parseFloat(parts[1]);
                    const g2 = parseFloat(parts[2]);
                    const g3 = parseFloat(parts[3]);
                    const g4 = parseFloat(parts[4]);
                    const target = parseFloat(parts[5] || "5");

                    const avgAssignments = (g1 + g2 + g3 + g4) / 4;
                    const assignmentWeight = avgAssignments * 0.3;

                    // # Υπολογισμός απαραίτητου βαθμού εξετάσεων για το στόχο
                    let neededForTarget = (target - assignmentWeight) / 0.7;

                    // # Εφαρμογή του κανόνα "βάση 5 στις εξετάσεις"
                    const actualNeeded = Math.max(5.0, neededForTarget);

                    addToHistory(`Average Assignments Grade: ${avgAssignments.toFixed(2)} (Contribution to Final: ${assignmentWeight.toFixed(2)})`);

                    if (actualNeeded > 10) {
                        addToHistory(`>>> To reach GPA ${target}, you need ${neededForTarget.toFixed(2)} in the exam.`);
                        addToHistory("Warning: [MISSION_IMPOSSIBLE] Target unreachable even with a 10 in exams.");
                    } else {
                        addToHistory(`>>> To reach GPA ${target}, you need at least: ${actualNeeded.toFixed(2)} in the final exam.`);
                        if (actualNeeded === 5.0 && neededForTarget < 5.0) {
                            addToHistory("(Note: Mathematically you need less, but the EAP pass-base for exams is 5.0)");
                        }
                    }
                }
                break;

            case "timer":
                if (parts.includes("--start")) {
                    const index = parts.indexOf("--start");
                    const mins = parseInt(parts[index + 1]) || 25;
                    setTimeLeft(mins * 60);
                    setTimerActive(true);
                    addToHistory(`Timer started for ${mins} minutes. Focus mode: ON.`);
                } else if (parts.includes("--stop")) {
                    setTimerActive(false);
                    addToHistory("Timer stopped.");
                } else {
                    addToHistory("Usage: timer --start 25 | timer --stop");
                }
                break;

            case "exit":
                setIsExpanded(false);
                break;

            case "":
                break;

            default:
                addToHistory(`Command not found: ${base}. Type "help" for a list of commands.`);
        }
    };

    return (
        <div className={`terminal-container ${isExpanded ? "expanded" : ""}`} style={{
            position: "fixed",
            bottom: "80px", // # Πάνω από το radio player
            left: "0",
            width: "100%",
            height: isExpanded ? "400px" : "45px", // # Λίγο πιο ψηλό όταν είναι κλειστό
            background: isExpanded ? "#000" : "rgba(10, 10, 10, 0.95)",
            borderTop: isExpanded ? "2px solid var(--color-orange)" : "2px solid var(--color-success)", // # Πράσινο όταν είναι κλειστό για "Power" look
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            zIndex: 999998,
            fontFamily: "var(--font-fira-code)",
            display: "flex",
            flexDirection: "column",
            boxShadow: isExpanded
                ? "0 -10px 40px rgba(0,0,0,0.9)"
                : "0 -2px 15px rgba(0, 255, 0, 0.1)", // # Subtle green glow
            backdropFilter: "blur(10px)"
        }}>
            {/* Header / Toggle Button / Status */}
            <div
                onClick={() => setIsExpanded(!isExpanded)}
                style={{
                    height: isExpanded ? "40px" : "45px",
                    display: "flex",
                    alignItems: "center",
                    padding: "0 1rem",
                    cursor: "pointer",
                    color: isExpanded ? "var(--color-orange)" : "var(--color-success)",
                    fontSize: "0.8rem",
                    background: isExpanded ? "#111" : "transparent",
                    borderBottom: isExpanded ? "1px solid #222" : "none",
                    justifyContent: "space-between",
                    position: "relative",
                    overflow: "hidden"
                }}
            >
                {/* Background pulse effect for collapsed state */}
                {!isExpanded && (
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(90deg, transparent, rgba(0,255,0,0.05), transparent)',
                        animation: 'shimmer 2s infinite linear',
                        pointerEvents: 'none'
                    }}></div>
                )}

                <div style={{ display: "flex", alignItems: "center", gap: "1rem", zIndex: 1 }}>
                    <div style={{
                        background: isExpanded ? "var(--color-orange)" : "var(--color-success)",
                        color: "#000",
                        padding: "2px 6px",
                        fontWeight: "bold",
                        fontSize: "0.6rem",
                        borderRadius: "2px",
                        marginRight: "5px"
                    }}>
                        {isExpanded ? "TERMINAL" : "SYSTEM CONSOLE"}
                    </div>

                    <span className={!isExpanded ? "blink" : ""} style={{ opacity: isExpanded ? 1 : 0.9 }}>
                        $ {isExpanded ? "active_session" : "root@EAP-VOIA:~ (WAKE SYSTEM - Click to interact_)"}
                    </span>

                    {timerActive && (
                        <span style={{
                            color: "var(--color-blue)",
                            borderLeft: "1px solid #333",
                            paddingLeft: "1rem",
                            animation: isExpanded ? 'none' : 'pulse 1s infinite'
                        }}>
                            [FOCUS: {formatTime(timeLeft)}]
                        </span>
                    )}
                </div>

                <div style={{ display: "flex", gap: "1rem", opacity: 0.6, zIndex: 1 }}>
                    <span style={{ color: 'var(--color-blue)', marginRight: '10px' }}>
                        👥 {studentCount} studying
                    </span>
                    <span
                        onClick={(e) => {
                            e.stopPropagation();
                            handleCommand('coffee');
                        }}
                        style={{
                            cursor: 'pointer',
                            color: coffees > 5 ? 'var(--color-orange)' : 'inherit',
                            transition: 'color 0.3s'
                        }}
                        title="Click to log a coffee"
                    >
                        ☕ {coffees}
                    </span>
                    <span style={{ color: deadlines.length > 0 ? 'var(--color-blue)' : 'inherit' }}>
                        📅 {deadlines.length}
                    </span>
                </div>
            </div>

            {isExpanded && (
                <>
                    {/* Scanline Effect - Πλέον πίσω από το κείμενο για καλύτερη ορατότητα */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03))',
                        backgroundSize: '100% 4px, 3px 100%',
                        pointerEvents: 'none',
                        zIndex: 1
                    }}></div>

                    {/* Content Container - Πάνω από το scanline */}
                    <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
                        {/* Status Bar */}
                        <div style={{
                            padding: '2px 1rem',
                            background: '#222',
                            fontSize: '0.65rem',
                            color: '#888',
                            display: 'flex',
                            justifyContent: 'space-between',
                            borderBottom: '1px solid #333'
                        }}>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <span>STATUS: <span style={{ color: 'var(--color-success)' }}>ONLINE</span></span>
                                <span>TERM: /dev/tty0</span>
                            </div>
                            <span>EAP-VOIA COMMUNITY GATEWAY v2.0</span>
                        </div>

                        {/* Split Layout: Terminal vs Shoutbox */}
                        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

                            {/* LEFT: Console / Log Area */}
                            <div
                                ref={scrollRef}
                                style={{
                                    flex: 2,
                                    padding: '1rem',
                                    overflowY: 'auto',
                                    fontSize: '0.9rem',
                                    color: 'var(--text-secondary)',
                                    borderRight: '1px solid #222'
                                }}
                            >
                                {history.map((line, i) => (
                                    <div key={i} style={{ marginBottom: '4px', whiteSpace: 'pre-wrap' }}>
                                        {line.startsWith('admin@EAP:~$') ? (
                                            <span>
                                                <span style={{ color: 'var(--color-blue)' }}>admin@EAP</span>:
                                                <span style={{ color: 'var(--color-orange)' }}>~$</span> {line.split('~$')[1]}
                                            </span>
                                        ) : (
                                            line
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* RIGHT: Live Shoutbox Area */}
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'rgba(5,5,5,0.5)' }}>
                                <div style={{
                                    padding: '5px 10px',
                                    background: '#111',
                                    fontSize: '0.7rem',
                                    color: 'var(--color-blue)',
                                    borderBottom: '1px solid #222',
                                    display: 'flex',
                                    justifyContent: 'space-between'
                                }}>
                                    <span>LIVE_SHOUTBOX</span>
                                    <span className="blink">●</span>
                                </div>

                                <div
                                    ref={chatScrollRef}
                                    style={{
                                        flex: 1,
                                        overflowY: 'auto',
                                        padding: '10px',
                                        fontSize: '0.8rem'
                                    }}
                                >
                                    {!process.env.NEXT_PUBLIC_SUPABASE_URL ? (
                                        <div style={{ color: '#555', textAlign: 'center', marginTop: '20%' }}>
                                            [OFFLINE]<br />
                                            Configure .env.local<br />
                                            to see the community.
                                        </div>
                                    ) : lastShouts.length === 0 ? (
                                        <div style={{ color: '#444', textAlign: 'center', marginTop: '20%' }}>
                                            Silent night...<br />Be the first to shout!
                                        </div>
                                    ) : (
                                        lastShouts.map((s, i) => (
                                            <div key={i} style={{ marginBottom: '10px', borderLeft: '2px solid #333', paddingLeft: '8px' }}>
                                                <div style={{ color: 'var(--color-orange)', fontSize: '0.7rem' }}>
                                                    {s.username} - {new Date(s.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                                <div style={{ color: '#ccc' }}>{s.message}</div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Input Line */}
                        <div style={{
                            display: 'flex',
                            padding: '0.5rem 1rem',
                            background: '#050505',
                            borderTop: '1px solid #222',
                            alignItems: 'center'
                        }}>
                            <span style={{ color: 'var(--color-blue)', marginRight: '5px' }}>admin@EAP</span>
                            <span style={{ color: 'var(--color-orange)', marginRight: '10px' }}>:~$</span>
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleCommand(input);
                                        setInput('');
                                    }
                                    if (e.key === 'Escape') {
                                        setIsExpanded(false);
                                    }
                                }}
                                style={{
                                    flex: 1,
                                    background: 'transparent',
                                    border: 'none',
                                    outline: 'none',
                                    color: 'var(--color-success)', // # Χρησιμοποιούμε πράσινο για μέγιστη αντίθεση
                                    fontFamily: 'inherit',
                                    fontSize: '1rem', // # Ελαφρώς μεγαλύτερη γραμματοσειρά
                                    textShadow: '0 0 5px var(--color-success)'
                                }}
                            />
                            <div
                                onClick={() => setIsExpanded(false)}
                                style={{ color: '#555', cursor: 'pointer', fontSize: '0.7rem' }}
                            >
                                [ESC] CLOSE
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
