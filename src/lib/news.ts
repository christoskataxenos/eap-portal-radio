import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface NewsPost {
    id: string;
    title: string;
    date: string;
    author: string;
    content: string; // HTML content (or raw markdown)
    tags: string[];
}

export function getAllNews(): NewsPost[] {
    // Try to resolve the content directory in multiple locations to handle different build contexts (e.g. Vercel root vs project root)
    const possiblePaths = [
        path.join(process.cwd(), 'src/content/news'),
        path.join(process.cwd(), 'portal/src/content/news')
    ];

    let contentDirectory = '';

    for (const p of possiblePaths) {
        if (fs.existsSync(p)) {
            contentDirectory = p;
            break;
        }
    }

    // Check if directory exists
    if (!contentDirectory) {
        console.warn(`[getAllNews] Warning: Content directory not found. Searched in: ${possiblePaths.join(', ')}`);
        return [];
    }

    console.log(`[getAllNews] Using content directory: ${contentDirectory}`);

    const fileNames = fs.readdirSync(contentDirectory);
    console.log(`[News] Found ${fileNames.length} files in ${contentDirectory}:`, fileNames);

    const allNewsData = fileNames.map((fileName) => {
        // Remove ".md" from file name to get id
        const id = fileName.replace(/\.md$/, '');

        // Read markdown file as string
        const fullPath = path.join(contentDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');

        // Use gray-matter to parse the post metadata section
        const matterResult = matter(fileContents);

        // Combine the data with the id
        return {
            id,
            content: matterResult.content,
            title: matterResult.data.title,
            date: matterResult.data.date,
            author: matterResult.data.author,
            tags: matterResult.data.tags || [],
        };
    });

    // Filter out hidden posts (docs, guides)
    const publishedNews = allNewsData.filter(post => {
        const tags = post.tags || [];
        const isHidden = tags.includes('docs') || tags.includes('guide') || tags.includes('hidden');
        if (isHidden) console.log(`[News] Hiding post: ${post.title} (Tags: ${tags})`);
        return !isHidden;
    });

    console.log(`[News] Returning ${publishedNews.length} published posts.`);

    // Sort posts by date
    return publishedNews.sort((a, b) => {
        if (a.date < b.date) {
            return 1;
        } else {
            return -1;
        }
    });
}
