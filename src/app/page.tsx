import { getAllNews } from '@/lib/news';
import HomeClient from '@/components/HomeClient';

export default function Home() {
  // Fetch latest 3 news items (Server Side)
  const allNews = getAllNews();
  const latestNews = allNews.slice(0, 3);

  return (
    <HomeClient latestNews={latestNews} />
  );
}
