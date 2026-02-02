import { getAllNews } from '@/lib/news';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Stats from '@/components/mdx/Stats';
import { Callout, Terminal, FileTree } from '@/components/mdx/Blocks';

const components = {
    Stats,
    Callout,
    Terminal,
    FileTree,
};

export default function NewsPage() {
    const newsItems = getAllNews();

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 className="title-grunge">~/news/git_log</h1>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {newsItems.length === 0 && (
                    <div className="grunge-container">
                        <p>No news found. Checking /dev/null...</p>
                    </div>
                )}

                {newsItems.map((item) => (
                    <article key={item.id} className="grunge-container">
                        <header style={{ borderBottom: '1px dashed #333', paddingBottom: '0.5rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ color: 'var(--color-orange)', fontWeight: 'bold' }}>[{item.author}]</span>
                                <h2 style={{ fontSize: '1.2rem', margin: 0 }}>{item.title}</h2>
                            </div>
                            <span style={{ fontFamily: 'var(--font-fira-code)', fontSize: '0.8rem', color: '#666' }}>
                                {item.date}
                            </span>
                        </header>

                        {/* MDX Content */}
                        <div className="mdx-content" style={{ fontSize: '1rem', lineHeight: '1.6' }}>
                            <MDXRemote source={item.content} components={components} />
                        </div>

                        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                            {item.tags.map(tag => (
                                <span key={tag} style={{
                                    fontSize: '0.7rem',
                                    background: '#111',
                                    padding: '2px 8px',
                                    border: '1px solid #333',
                                    color: 'var(--text-secondary)'
                                }}>
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}
