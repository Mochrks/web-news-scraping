'use client'

import { useEffect, useState } from 'react'
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { getAllNews } from '@/lib/api'
import { NewsItem } from '@/lib/api'
import { Comments } from '@/components/comments'
import dynamic from 'next/dynamic'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const DynamicShareButtons = dynamic(() => import('@/components/share-buttons').then(mod => mod.ShareButtons), { ssr: false })

export default function ArticlePage({ params }: { params: { id: string } }) {
  const [article, setArticle] = useState<NewsItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [fullContent, setFullContent] = useState<string | null>(null);
  const [isScraping, setIsScraping] = useState(false);
  const [relatedNews, setRelatedNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    async function fetchArticle() {
      const targetId = decodeURIComponent(params.id);
      try {
        const news = await getAllNews();
        const found = news.find(n => n.id === targetId || n.title === targetId);
        setArticle(found || null);

        if (found) {
          // Find related news
          const related = news
            .filter(n => n.category === found.category && n.id !== found.id)
            .slice(0, 3);
          setRelatedNews(related);

          if (found.url) {
            setIsScraping(true);
            try {
              // Fetch full content
              const res = await fetch(`/api/scrape?url=${encodeURIComponent(found.url)}`);
              if (res.ok) {
                const data = await res.json();
                if (data.content) {
                  setFullContent(data.content);
                }
              }
            } catch (err) {
              console.error("Failed to scrape full content:", err);
            } finally {
              setIsScraping(false);
            }
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchArticle();
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground w-full">
        {/* Skeleton Hero */}
        <div className="container mx-auto max-w-6xl h-[50vh] bg-slate-200 dark:bg-zinc-800 animate-pulse relative">
          <div className="absolute bottom-0 left-0 w-full p-8 container mx-auto max-w-6xl">
            <div className="h-6 w-32 bg-slate-300 dark:bg-zinc-700 rounded mb-4"></div>
            <div className="h-12 w-3/4 bg-slate-300 dark:bg-zinc-700 rounded mb-4"></div>
            <div className="h-4 w-48 bg-slate-300 dark:bg-zinc-700 rounded"></div>
          </div>
        </div>

        {/* Skeleton Content */}
        <div className="container mx-auto max-w-6xl px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="hidden lg:block lg:col-span-1">
            <div className="h-64 w-8 bg-slate-200 dark:bg-zinc-800 rounded animate-pulse"></div>
          </div>
          <div className="col-span-1 lg:col-span-8 space-y-4">
            <div className="h-4 w-full bg-slate-200 dark:bg-zinc-800 rounded animate-pulse"></div>
            <div className="h-4 w-full bg-slate-200 dark:bg-zinc-800 rounded animate-pulse"></div>
            <div className="h-4 w-2/3 bg-slate-200 dark:bg-zinc-800 rounded animate-pulse"></div>
            <div className="h-64 w-full bg-slate-200 dark:bg-zinc-800 rounded animate-pulse mt-8"></div>
            <div className="h-4 w-full bg-slate-200 dark:bg-zinc-800 rounded animate-pulse mt-4"></div>
          </div>
          <div className="hidden lg:block lg:col-span-3 space-y-4">
            <div className="h-32 w-full bg-slate-200 dark:bg-zinc-800 rounded animate-pulse"></div>
            <div className="h-32 w-full bg-slate-200 dark:bg-zinc-800 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background text-foreground container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
        <Button asChild><Link href="/">Back to Home</Link></Button>
      </div>
    )
  }

  return (
    <article className="min-h-screen bg-background text-foreground pb-20">

      {/* Hero Section */}
      <div className="w-full h-[50vh] md:h-[65vh] relative group">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
        <Image
          src={article.image}
          alt={article.title}
          layout="fill"
          objectFit="cover"
          className="z-0 transition-transform duration-1000"
          priority
        />

        {/* Navigation - Absolute Top Left */}
        <div className="absolute top-0 left-0 w-full z-20 p-6 md:p-8">
          <Link href="/" className="inline-flex items-center text-white/80 hover:text-white bg-black/20 hover:bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full transition-all text-sm font-bold uppercase tracking-wider">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to News
          </Link>
        </div>

        {/* Hero Content - Bottom */}
        <div className="absolute bottom-0 left-0 w-full z-20 pb-12 md:pb-16 px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-wrap gap-3 mb-6 animate-fade-in-up">
              <Badge className="bg-primary hover:bg-primary/90 text-white border-none text-xs px-3 py-1.5 uppercase tracking-widest shadow-lg">{article.category}</Badge>
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-7xl font-serif font-black text-white leading-[1.1] mb-8 text-shadow max-w-4xl animate-fade-in-up delay-100">
              {article.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-white/90 text-sm font-medium animate-fade-in-up delay-200">
              <div className="flex items-center gap-2">
                <AvatarPlaceholder name={article.author} />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>•</span>
                <span>{new Date(article.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="container mx-auto max-w-7xl px-4 md:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">


          {/* Center Column: Article Content + Comments */}
          <div className="col-span-1 lg:col-span-8">
            <div className="mb-10 text-xl md:text-2xl font-serif text-slate-800 dark:text-slate-200 leading-relaxed italic pl-6 border-l-4 border-primary">
              {article.excerpt}
            </div>

            <div className="prose prose-lg md:prose-xl dark:prose-invert max-w-none 
                prose-headings:font-serif prose-headings:font-bold prose-h2:text-3xl prose-h2:mt-12
                prose-p:leading-relaxed prose-p:text-slate-700 dark:prose-p:text-slate-300
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-img:rounded-lg prose-img:shadow-xl prose-img:my-8">

              {isScraping ? (
                <div className="space-y-4 animate-pulse">
                  <div className="h-4 bg-slate-200 dark:bg-zinc-800 rounded w-full"></div>
                  <div className="h-4 bg-slate-200 dark:bg-zinc-800 rounded w-full"></div>
                  <div className="h-4 bg-slate-200 dark:bg-zinc-800 rounded w-5/6"></div>
                  <div className="h-4. bg-slate-200 dark:bg-zinc-800 rounded w-full mt-4"></div>
                  <div className="h-4 bg-slate-200 dark:bg-zinc-800 rounded w-4/6"></div>
                </div>
              ) : (
                <div dangerouslySetInnerHTML={{ __html: fullContent || article.content }} />
              )}
            </div>

            <div className="mt-16 pt-8 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-sm text-slate-500 font-medium">Published in <span className="text-primary font-bold">{article.source}</span></p>
              <DynamicShareButtons url={`/article/${encodeURIComponent(article.id)}`} title={article.title} />
              {/* Button Removed */}
            </div>

            {/* Mobile Share (Visible only on small screens) */}
            <div className="lg:hidden mt-8 p-4 bg-slate-50 dark:bg-white/5 rounded-lg border border-slate-100 dark:border-white/10">
              <h3 className="font-bold mb-4 text-xs uppercase tracking-widest text-slate-500">Share this article</h3>
              <div className="flex gap-4">
                <DynamicShareButtons url={`/article/${encodeURIComponent(article.id)}`} title={article.title} />
              </div>
            </div>

            {/* Comments Section (Aligned with content) */}
            <div className="mt-16 pt-10 border-t-4 border-slate-100 dark:border-white/5 ">
              <Comments />
            </div>
          </div>

          {/* Right Sidebar: Recommendations */}
          <div className="hidden lg:block lg:col-span-3 space-y-8 pl-8 border-l border-slate-100 dark:border-white/5">
            <div className="sticky top-24">
              <h3 className="font-bold uppercase tracking-widest text-xs mb-6 text-slate-400">Related News</h3>
              <div className="flex flex-col gap-8">
                {relatedNews.length > 0 ? (
                  relatedNews.map((item) => (
                    <Link href={`/article/${encodeURIComponent(item.id)}`} key={item.id} className="group cursor-pointer block">
                      <div className="relative h-32 w-full mb-3 overflow-hidden rounded-md">
                        <Image
                          src={item.image}
                          alt={item.title}
                          layout="fill"
                          objectFit="cover"
                          className="group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="text-[10px] uppercase font-bold text-primary mb-1 tracking-wider">{item.category}</div>
                      <h4 className="font-serif font-bold leading-tight group-hover:text-primary transition-colors text-sm line-clamp-3">
                        {item.title}
                      </h4>
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-slate-500 italic">No related news found.</p>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </article>
  )
}

function AvatarPlaceholder({ name }: { name: string }) {
  return (
    <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-white uppercase">
      {name.charAt(0)}
    </div>
  )
}
