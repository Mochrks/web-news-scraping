'use client'

import { useState, useEffect } from 'react'
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { getAllNews, NewsItem } from '@/lib/api'
import { Loader2 } from 'lucide-react'

export default function CategoryPage({ params }: { params: { category: string } }) {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const category = params.category.charAt(0).toUpperCase() + params.category.slice(1)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        // Map common slugs to our API categories if needed, or just pass directly
        const data = await getAllNews(category);
        setNews(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [category])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <div className="mb-8 border-b border-border pb-4">
        <Badge className="mb-2 bg-primary">{category}</Badge>
        <h1 className="text-4xl font-bold font-serif">{category} News</h1>
      </div>

      {news.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground">No news found for this category at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((item) => (
            <Card key={item.id} className="overflow-hidden bg-card border-border flex flex-col h-full group">
              <Link href={`/article/${encodeURIComponent(item.id)}`} className="relative h-56 w-full overflow-hidden">
                <div
                  className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url("${item.image}")` }}
                />
              </Link>
              <div className="flex flex-col flex-1 p-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold text-primary uppercase tracking-wider">{item.source}</span>
                  <span className="text-xs text-muted-foreground">{new Date(item.date).toLocaleDateString()}</span>
                </div>
                <Link href={`/article/${encodeURIComponent(item.id)}`}>
                  <h3 className="text-xl font-bold font-serif mb-3 leading-tight group-hover:text-primary transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                </Link>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
                  {item.excerpt}
                </p>
                <div className="mt-auto pt-4 border-t border-border flex items-center text-sm font-medium text-primary">
                  <Link href={`/article/${encodeURIComponent(item.id)}`} className="hover:underline">
                    Read Full Story
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
