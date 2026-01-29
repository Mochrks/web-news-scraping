'use client';

import { useEffect, useState } from 'react';
import { getAllNews, NewsItem } from '@/lib/api';
import Link from 'next/link';
import { ArrowRight, PlayCircle } from 'lucide-react';

export default function Home() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getAllNews();
        setNews(data);
      } catch (error) {
        console.error("Failed to load news", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const totalPages = Math.ceil((news.length - 5) / itemsPerPage);

  const heroNews = news[0];
  const sideNews = news.slice(1, 5);
  const latestReports = news.slice(5 + (page - 1) * itemsPerPage, 5 + page * itemsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      const section = document.getElementById('latest-reports');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 500, behavior: 'smooth' });
      }
    }
  };

  if (loading) {
    return (
      <div className="w-full flex flex-col items-center">
        {/* Skeleton Hero Section */}
        <section className="w-full max-w-[1200px] px-6 pt-10 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            <div className="lg:col-span-8 flex flex-col gap-4">
              <div className="w-full aspect-[16/9] bg-slate-200 dark:bg-zinc-800 rounded-sm animate-pulse"></div>
            </div>
            <div className="lg:col-span-4 flex flex-col gap-6 lg:border-l border-slate-200 dark:border-white/10 lg:pl-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="h-4 w-20 bg-slate-200 dark:bg-zinc-800 rounded animate-pulse"></div>
                  <div className="h-6 w-full bg-slate-200 dark:bg-zinc-800 rounded animate-pulse"></div>
                  <div className="h-6 w-2/3 bg-slate-200 dark:bg-zinc-800 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Skeleton Reports Section */}
        <section className="w-full max-w-[1200px] px-6 pb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="w-full aspect-[3/2] bg-slate-200 dark:bg-zinc-800 rounded-sm animate-pulse"></div>
                <div className="h-4 w-1/3 bg-slate-200 dark:bg-zinc-800 rounded animate-pulse"></div>
                <div className="h-6 w-full bg-slate-200 dark:bg-zinc-800 rounded animate-pulse"></div>
                <div className="h-4 w-full bg-slate-200 dark:bg-zinc-800 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full max-w-[1200px] px-6 pt-10 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Main Hero Article */}
          {heroNews && (
            <div className="lg:col-span-8 flex flex-col gap-4">
              <Link href={`/article/${encodeURIComponent(heroNews.id)}`} className="relative w-full aspect-[16/9] rounded-sm overflow-hidden group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>
                <div
                  className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url("${heroNews.image}")` }}
                ></div>
                <div className="absolute bottom-0 left-0 p-6 md:p-8 z-20 w-full">
                  <span className="inline-block px-2 py-1 mb-3 text-[10px] font-bold tracking-widest uppercase bg-primary text-white rounded-sm">
                    {heroNews.category}
                  </span>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white leading-tight mb-2 group-hover:text-primary transition-colors">
                    {heroNews.title}
                  </h1>
                  <p className="hidden md:block text-gray-300 max-w-2xl text-sm md:text-base leading-relaxed line-clamp-2">
                    {heroNews.excerpt}
                  </p>
                </div>
              </Link>
            </div>
          )}

          {/* Side Articles */}
          <div className="lg:col-span-4 flex flex-col gap-6 lg:border-l border-slate-200 dark:border-white/10 lg:pl-8">
            {sideNews.map((item, index) => (
              <div key={item.id} className="group cursor-pointer">
                <Link href={`/article/${encodeURIComponent(item.id)}`} className="flex flex-col gap-1">
                  {index === 0 && (
                    <div className="flex items-center gap-2 mb-1">
                      <span className="size-2 bg-red-500 rounded-full animate-pulse"></span>
                      <span className="text-[10px] uppercase tracking-widest font-bold text-red-500">Live Update</span>
                    </div>
                  )}
                  {index !== 0 && (
                    <span className="text-[10px] uppercase tracking-widest font-bold text-primary">
                      {item.category}
                    </span>
                  )}
                  <h3 className="text-lg font-serif font-semibold text-slate-800 dark:text-white group-hover:text-primary transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <span className="text-xs text-slate-500 dark:text-gray-500 mt-1">
                    {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </Link>
                {index < sideNews.length - 1 && <hr className="mt-6 border-slate-200 dark:border-white/10" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Reports Section */}
      <section id="latest-reports" className="w-full max-w-[1200px] px-6 pb-20">
        <div className="flex items-end justify-between mb-8 border-b border-slate-200 dark:border-white/10 pb-4">
          <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Latest Reports</h2>
          <Link href="#" className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-primary dark:text-gray-400 dark:hover:text-white transition-colors">
            View Archive
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
          {latestReports.map((item, index) => {
            // Special styling for specific grid items to match the visual mockups (Podcast/Briefing style)
            const absoluteIndex = 5 + (page - 1) * itemsPerPage + index;
            const isSpecialCard = absoluteIndex % 10 === 5 || absoluteIndex % 10 === 6;

            if (isSpecialCard) {
              return (
                <Link key={item.id} href={`/article/${encodeURIComponent(item.id)}`} className="group flex flex-col h-full border border-slate-200 dark:border-white/10 p-5 rounded-sm bg-slate-50 dark:bg-surface-dark hover:border-primary/50 transition-colors">
                  <div className="flex flex-col gap-3 h-full justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                        {index % 2 === 0 ? 'Briefing' : 'Podcast'}
                      </span>
                      <h3 className="text-xl font-serif font-bold text-slate-900 dark:text-white leading-tight mt-2 group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-gray-400 mt-3 line-clamp-3">
                        {item.excerpt}
                      </p>
                    </div>
                    <div className="flex items-center text-primary text-xs font-bold uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                      {index % 2 === 0 ? 'Read Briefing' : 'Listen Now'}
                      {index % 2 === 0 ? <ArrowRight className="h-4 w-4 ml-1" /> : <PlayCircle className="h-4 w-4 ml-1" />}
                    </div>
                  </div>
                </Link>
              );
            }

            return (
              <article key={item.id} className="group flex flex-col h-full">
                <Link href={`/article/${encodeURIComponent(item.id)}`}>
                  <div className="relative w-full aspect-[3/2] overflow-hidden rounded-sm mb-4">
                    <div
                      className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                      style={{ backgroundImage: `url("${item.image}")` }}
                    ></div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{item.category}</span>
                    <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-white leading-tight group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-gray-400 line-clamp-2">
                      {item.excerpt}
                    </p>
                    <span className="text-xs text-slate-500 dark:text-gray-600 mt-1">
                      By {item.author} • {Math.floor(Math.random() * 10) + 2} min read
                    </span>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>

        {/* Pagination UI */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-16">
            <nav className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="size-10 flex items-center justify-center rounded-sm border border-slate-200 dark:border-white/10 text-slate-400 hover:text-primary dark:hover:text-white transition-all disabled:opacity-50"
              >
                <ArrowRight className="h-4 w-4 rotate-180" />
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum = i + 1;
                // Simple sliding window logic could go here, but strict 1-5 is fine for MVP
                if (totalPages > 5) {
                  if (page > 3) {
                    pageNum = page - 2 + i;
                  }
                  if (pageNum > totalPages) {
                    pageNum = totalPages - 4 + i;
                  }
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`size-10 flex items-center justify-center rounded-sm border transition-all ${page === pageNum
                        ? 'border-primary text-primary font-bold shadow-glow'
                        : 'border-slate-200 dark:border-white/10 text-slate-400 hover:text-primary dark:hover:text-white'
                      }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="size-10 flex items-center justify-center rounded-sm border border-slate-200 dark:border-white/10 text-slate-400 hover:text-primary dark:hover:text-white transition-all disabled:opacity-50"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </nav>
          </div>
        )}
      </section>

      {/* Newsletter Section */}
      <section className="w-full bg-slate-100 dark:bg-surface-dark border-y border-slate-200 dark:border-white/5 py-16">
        <div className="mx-auto max-w-[600px] px-6 text-center">
          <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mb-4">The Daily Briefing</h3>
          <p className="text-slate-600 dark:text-gray-400 mb-8">Essential news, expert analysis, and exclusive content delivered straight to your inbox every morning.</p>
          <form className="flex flex-col sm:flex-row gap-3">
            <input
              className="flex-1 bg-white dark:bg-black/30 border border-slate-300 dark:border-white/10 rounded-sm px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-gray-600 focus:ring-1 focus:ring-primary focus:border-primary outline-none"
              placeholder="Your email address"
              type="email"
            />
            <button className="bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-wider text-xs px-8 py-3 rounded-sm transition-colors shadow-glow" type="button">
              Subscribe
            </button>
          </form>
          <p className="text-xs text-slate-500 dark:text-gray-600 mt-4">No spam, unsubscribe anytime.</p>
        </div>
      </section>
    </div>
  );
}
