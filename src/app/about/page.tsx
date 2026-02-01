'use client';

export default function AboutPage() {
    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 className="title-grunge">~/about/whoami.txt</h1>

            <div className="grunge-container" style={{ position: 'relative', overflow: 'hidden' }}>
                {/* Background Decorative Element: Broken C Code */}
                <div style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '-10px',
                    fontSize: '0.8rem',
                    opacity: 0.1,
                    fontFamily: 'var(--font-fira-code)',
                    color: 'var(--color-error)',
                    pointerEvents: 'none',
                    whiteSpace: 'pre',
                    textAlign: 'left'
                }}>
                    {`int main() {
  char *ptr = NULL;
  *ptr = "I love segfaults";
  while(1) fork();
  return -1;
}`}
                </div>

                <h2 style={{ color: 'var(--color-orange)', marginBottom: '1.5rem', fontFamily: 'var(--font-fira-code)' }}>
                    init_team(PID: 2025); <br />
                    <span style={{ fontSize: '0.8rem', color: '#666' }}>while(true) &#123; study(); coffee++; &#125;</span>
                </h2>

                <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '1.5rem' }}>
                    Είμαστε ένα <strong>Array[4] από Unresolved Promises</strong> που τρέχουν σε περιβάλλον Production χωρίς try-catch block. Η RAM (ύπνος) μας είναι volatile και η ψυχική μας υγεία κάνει overflow σε κάθε deadline.
                </p>

                <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '1.5rem' }}>
                    Δημιουργήσαμε αυτό το project για να αντιμετωπίσουμε το Ιερό Τρίπτυχο της σχολής:
                    <br />
                    <span style={{ color: 'var(--color-blue)', fontFamily: 'var(--font-fira-code)', display: 'block', margin: '1rem 0', paddingLeft: '1rem', borderLeft: '2px solid var(--color-blue)' }}>
                        $ echo "Άυπνία / Άνοια / Απαλεψιά"
                    </span>
                </p>

                <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '2rem' }}>
                    Το <strong>ΕΑΠ-νοια</strong> είναι το Stack Trace της ψυχικής μας υγείας.
                </p>

                <div style={{ borderTop: '1px dashed #444', paddingTop: '1.5rem', marginTop: '1rem' }}>
                    <h3 style={{ fontSize: '1rem', color: '#888', marginBottom: '1rem' }}>Stack Overflow Contributors:</h3>
                    <ul style={{ listStyle: 'none', fontFamily: 'var(--font-fira-code)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                        <li className="contributor" title="Uptime: 45 hours (Last slept: Monday)">
                            &gt; Nick_the_Kernel_Panic
                        </li>
                        <li className="contributor" title="Uptime: 12 hours (Sleep Latency: High)">
                            &gt; Maria_High_Latency
                        </li>
                        <li className="contributor" title="Uptime: NULL (Reference Error)">
                            &gt; Kostas_Null_Pointer
                        </li>
                        <li className="contributor" title="Uptime: 2 hours (Reboot pending)">
                            &gt; George_Git_Conflict
                        </li>
                    </ul>
                    <style jsx>{`
            .contributor {
              cursor: help;
              transition: color 0.2s;
              position: relative;
            }
            .contributor:hover::after {
              content: attr(title);
              position: absolute;
              bottom: 100%;
              left: 0;
              background: #000;
              border: 1px solid var(--color-orange);
              color: var(--color-orange);
              padding: 5px 10px;
              font-size: 0.8rem;
              white-space: nowrap;
              z-index: 10;
              box-shadow: 0 0 10px var(--color-orange);
            }
          `}</style>
                </div>
            </div>
        </div>
    );
}
