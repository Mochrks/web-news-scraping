
export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  category: string;
  author: string;
  source: string;
  url: string;
}

export async function getAllNews(category?: string): Promise<NewsItem[]> {
  try {
    const params = category ? `?category=${encodeURIComponent(category)}` : '';
    const res = await fetch(`/api/news${params}`, { 
        cache: 'no-store' 
    });
    
    if (!res.ok) {
        throw new Error('Failed to fetch news');
    }
    
    return await res.json();
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
}

export async function getNews(category: string): Promise<NewsItem[]> {
    return getAllNews(category);
}

