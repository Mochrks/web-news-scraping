
import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch the URL' }, { status: response.status });
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Remove unwanted elements
    $('script').remove();
    $('style').remove();
    $('nav').remove();
    $('header').remove();
    $('footer').remove();
    $('iframe').remove();
    $('.ad').remove();
    $('.ads').remove();
    $('.advertisement').remove();
    $('[class*="ad-"]').remove();
    $('[id*="ad-"]').remove();

    // Try to find the main article content
    // Common selectors for article content

    // ... setup and selectors ...
    const selectors = [
      'article',
      '.detail-text', // CNN Indonesia
      '.read__content', // Kompas
      '.article-body',
      '.post-content',
      '.entry-content',
      '.story-body',
      '#main-content',
      '[role="main"]',
    ];

    let $selected = null;

    for (const selector of selectors) {
      const element = $(selector);
      if (element.length > 0) {
          // If multiple matches, pick the one with the most text
          if (element.length > 1) {
              let maxLen = 0;
              element.each((_, el) => {
                  const textLen = $(el).text().length;
                  if (textLen > maxLen) {
                      $selected = $(el);
                      maxLen = textLen;
                  }
              });
          } else {
              $selected = element;
          }
          
          if ($selected && $selected.text().length > 200) break;
      }
    }

    // Fallback logic
    if (!$selected || $selected.text().length < 200) {
       let maxPCount = 0;
       $('div').each((_, el) => {
         const pCount = $(el).find('p').length;
         if (pCount > maxPCount) {
           maxPCount = pCount;
           $selected = $(el);
         }
       });
    }

    if (!$selected) {
        return NextResponse.json({ error: 'Could not extract content' }, { status: 404 });
    }

    // New CLEANING Logic: "Ambil text dan gambar saja kemudian rapihkan"
    // We will create a fresh cheerio instance for the result to keep it very clean
    const $clean = cheerio.load('', null, false);
    
    harvest($, $selected, $clean, url as string);

    return NextResponse.json({ content: $clean.html() });

  } catch (error) {
    console.error('Scraping error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Whitelist of allowed tags
const allowedTags = new Set(['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'blockquote', 'figure', 'img', 'strong', 'b', 'i', 'em']);

// Recursive function to harvest allowed content
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function harvest($: any, $element: any, $clean: any, url: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    $element.children().each((_: any, el: any) => {
        const tagName = el.tagName?.toLowerCase();
        const $el = $(el);

        if (allowedTags.has(tagName)) {
            if (tagName === 'img') {
                // Handle Images
                let src = $el.attr('src') || $el.attr('data-src') || $el.attr('data-original');
                
                // Fix relative URLs
                if (src && !src.startsWith('http')) {
                    try {
                       src = new URL(src, url).href;
                    } catch { /* ignore invalid urls */ }
                }
                
                if (src) {
                    $clean.root().append(`<img src="${src}" alt="${$el.attr('alt') || ''}" class="w-full h-auto rounded-lg my-6 shadow-md" />`);
                }
            } else if (tagName === 'figure') {
                 // Handle Figures
                 const $img = $el.find('img').first();
                 if ($img.length) {
                    let src = $img.attr('src') || $img.attr('data-src');
                    if (src && !src.startsWith('http')) {
                        try { src = new URL(src, url).href; } catch {}
                    }
                    if (src) {
                         const caption = $el.find('figcaption').text().trim();
                         $clean.root().append(`
                            <figure class="my-6">
                                <img src="${src}" alt="${$img.attr('alt') || ''}" class="w-full h-auto rounded-lg shadow-md" />
                                ${caption ? `<figcaption class="text-center text-sm text-gray-500 mt-2 italic">${caption}</figcaption>` : ''}
                            </figure>
                         `);
                    }
                 }
            } else {
                // Handle Text Blocks (p, h1, etc)
                const text = $el.text().trim();
                // Skip empty text blocks unless it's a list or br
                if (!text && !['ul', 'ol', 'br', 'hr'].includes(tagName)) return;

                // Create a clone to manipulate
                // We create a new clean element in the $clean context to avoid carrying over strict parent restrictions? 
                // Actually simply appending the string HTML is safest to strip events/listeners, but we want to strip attributes.
                
                // Let's construct a simple tag
                let innerHtml = $el.html() || '';
                
                // Strip links from inner HTML but keep text
                // Simple regex replacement for <a> tags
                innerHtml = innerHtml.replace(/<a\b[^>]*>(.*?)<\/a>/gi, '$1');

                // Create new element in $clean
                // We use cheerio.load logic on $clean side effectively by appending string
                // But we want to keep the TAG (p, h1, etc)
                
                // To strip attributes:
                // We can just append `<tag>${innerHtml}</tag>` and let prose styling handle it.
                // This removes ALL classes/ids/styles effectively.
                
                $clean.root().append(`<${tagName}>${innerHtml}</${tagName}>`);
            }
        } else if (['div', 'section', 'span', 'article', 'main'].includes(tagName)) {
            // Recurse into containers
            harvest($, $el, $clean, url);
        } 
    });
}
