'use client'

import { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { Grid2X2, List, TrendingUp } from 'lucide-react'
import { allNews, trendingNews } from '@/lib/mockData'
// import { Pagination } from '@/components/ui/pagination'
import dynamic from 'next/dynamic'

const DynamicToggleGroup = dynamic(() => import('@/components/ui/toggle-group').then(mod => mod.ToggleGroup), { ssr: false })
const DynamicToggleGroupItem = dynamic(() => import('@/components/ui/toggle-group').then(mod => mod.ToggleGroupItem), { ssr: false })
const DynamicShareButtons = dynamic(() => import('@/components/share-buttons').then(mod => mod.ShareButtons), { ssr: false })

const ITEMS_PER_PAGE = 20;

export default function Home() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [currentPage, setCurrentPage] = useState(1)
  const heroNews = allNews[0]

  const paginatedNews = allNews.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const totalPages = Math.ceil(allNews.length / ITEMS_PER_PAGE)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="mb-12">
        <Card className="overflow-hidden">
          <div className="md:flex">
            <div className="md:w-2/3 relative h-64 md:h-auto">
              {heroNews.videoUrl ? (
                <video src={heroNews.videoUrl} controls className="w-full h-full object-cover" />
              ) : (
                <Image
                  src={heroNews.image}
                  alt={heroNews.title}
                  layout="fill"
                  objectFit="cover"
                />
              )}
            </div>
            <div className="md:w-1/3 p-6 flex flex-col justify-center">
              <Badge className="mb-2 w-fit">{heroNews.category}</Badge>
              <h1 className="text-3xl font-bold mb-4">{heroNews.title}</h1>
              <p className="text-muted-foreground mb-4">{heroNews.excerpt}</p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-muted-foreground">
                  {new Date(heroNews.date).toLocaleString()}
                </span>
                <DynamicShareButtons url={`/article/${heroNews.id}`} title={heroNews.title} />
              </div>
              <Button asChild>
                <Link href={`/article/${heroNews.id}`}>Read Full Story</Link>
              </Button>
            </div>
          </div>
        </Card>
      </section>

      {/* Trending News */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <TrendingUp className="mr-2" /> Trending Now
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingNews.map((news) => (
            <Card key={news.id} className="overflow-hidden">
              <CardHeader>
                <CardTitle className="text-xl line-clamp-2">{news.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-2 line-clamp-3">{news.excerpt}</p>
                <div className="flex flex-wrap gap-2">
                  {news.topics.map((topic) => (
                    <Badge key={topic} variant="secondary">{topic}</Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  {new Date(news.date).toLocaleString()}
                </span>
                <Button asChild variant="link">
                  <Link href={`/article/${news.id}`}>Read more</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Latest News</h2>
        <DynamicToggleGroup type="single" value={viewMode} onValueChange={(value) => setViewMode(value as 'grid' | 'list')}>
          <DynamicToggleGroupItem value="grid" aria-label="Grid view">
            <Grid2X2 className="h-4 w-4" />
          </DynamicToggleGroupItem>
          <DynamicToggleGroupItem value="list" aria-label="List view">
            <List className="h-4 w-4" />
          </DynamicToggleGroupItem>
        </DynamicToggleGroup>
      </div>
      <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
        {paginatedNews.map((news) => (
          <Card key={news.id} className={`overflow-hidden ${viewMode === 'list' ? 'flex flex-col md:flex-row' : ''}`}>
            <div className={`relative h-48 ${viewMode === 'list' ? 'md:w-1/3' : 'w-full'}`}>
              {news.videoUrl ? (
                <video src={news.videoUrl} controls className="w-full h-full object-cover" />
              ) : (
                <Image
                  src={news.image}
                  alt={news.title}
                  layout="fill"
                  objectFit="cover"
                />
              )}
            </div>
            <div className={`flex flex-col ${viewMode === 'list' ? 'md:w-2/3' : 'w-full'}`}>
              <CardHeader>
                <CardTitle className="text-xl line-clamp-2">{news.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-2 line-clamp-3">{news.excerpt}</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge>{news.category}</Badge>
                  {news.topics.map((topic) => (
                    <Badge key={topic} variant="secondary">{topic}</Badge>
                  ))}
                </div>
                <DynamicShareButtons url={`/article/${news.id}`} title={news.title} />
              </CardContent>
              <CardFooter className="flex justify-between mt-auto">
                <span className="text-sm text-muted-foreground">
                  {new Date(news.date).toLocaleString()}
                </span>
                <Button asChild variant="link">
                  <Link href={`/article/${news.id}`}>Read more</Link>
                </Button>
              </CardFooter>
            </div>
          </Card>
        ))}
      </div>
      <div className="mt-8">
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 mx-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 mx-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

