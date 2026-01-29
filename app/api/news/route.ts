import { NextResponse } from 'next/server';
import Parser from 'rss-parser';

export const dynamic = 'force-dynamic';

const parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'mediaContent'],
      ['media:thumbnail', 'mediaThumbnail'],
      ['dc:creator', 'creator'],
      ['content:encoded', 'contentEncoded'],
    ],
  },
});

const FEEDS = [
  // International
  { url: 'https://feeds.bbci.co.uk/news/world/rss.xml', category: 'World', source: 'BBC' },
  { url: 'https://feeds.bbci.co.uk/news/technology/rss.xml', category: 'Tech', source: 'BBC' },
  { url: 'http://rss.cnn.com/rss/edition.rss', category: 'World', source: 'CNN' },
  
  // Indonesia
  { url: 'https://www.antaranews.com/rss/top-news.xml', category: 'Indonesia', source: 'Antara' },
  { url: 'https://www.cnnindonesia.com/nasional/rss', category: 'Indonesia', source: 'CNN Indonesia' },
  { url: 'https://www.cnbcindonesia.com/news/rss', category: 'Business', source: 'CNBC Indonesia' },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    // Filter feeds if category is provided
    const targetFeeds = category 
      ? FEEDS.filter(f => f.category.toLowerCase() === category.toLowerCase())
      : FEEDS;

    // const allNews: any[] = []; // Removing unused variable

    // Fetch in parallel
    const promises = targetFeeds.map(async (feedInfo) => {
      try {
        const feed = await parser.parseURL(feedInfo.url);
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return feed.items.map((item: any) => {
          let image = 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop';
          
          // Try to find an image in various RSS fields
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if (item.mediaContent && item.mediaContent.$ && item.mediaContent.$.url) {
            image = item.mediaContent.$.url;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } else if (item.mediaThumbnail && item.mediaThumbnail.$ && item.mediaThumbnail.$.url) {
            image = item.mediaThumbnail.$.url;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } else if (item.enclosure && item.enclosure.url && item.enclosure.type?.startsWith('image')) {
             image = item.enclosure.url;
          } else if (item.contentEncoded) {
            // Try to extract first image from content:encoded HTML
            const imgMatch = item.contentEncoded.match(/src="([^"]+)"/);
            if (imgMatch && imgMatch[1]) {
                image = imgMatch[1];
            }
          }

          return {
            id: item.guid || item.link || Math.random().toString(36).substr(2, 9),
            title: item.title,
            excerpt: item.contentSnippet || item.content || '',
            content: item.content || item.contentEncoded || '',
            image,
            date: item.pubDate || new Date().toISOString(),
            category: feedInfo.category,
            author: item.creator || item.author || feedInfo.source,
            source: feedInfo.source,
            url: item.link || '#',
          };
        });
      } catch (error) {
        console.error(`Error fetching feed ${feedInfo.url}:`, error);
        return [];
      }
    });

    const results = await Promise.all(promises);
    
    // Flatten and sort by date
    const flatResults = results.flat().sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    return NextResponse.json(flatResults);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}
