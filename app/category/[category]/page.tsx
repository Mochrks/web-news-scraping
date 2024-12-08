'use client'

import { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import Image from "next/image"
import Link from "next/link"
import { Grid2X2, List } from 'lucide-react'
import { newsByCategory } from '@/lib/mockData'
import { Pagination } from '@/components/ui/pagination'

const ITEMS_PER_PAGE = 40;

export default function CategoryPage({ params }: { params: { category: string } }) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [currentPage, setCurrentPage] = useState(1)
  const category = params.category.charAt(0).toUpperCase() + params.category.slice(1)
  const categoryNews = newsByCategory[category] || []

  const paginatedNews = categoryNews.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const totalPages = Math.ceil(categoryNews.length / ITEMS_PER_PAGE)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">{category} News</h1>
      <div className="flex justify-end mb-6">
        <ToggleGroup type="single" value={viewMode} onValueChange={(value) => setViewMode(value as 'grid' | 'list')}>
          <ToggleGroupItem value="grid" aria-label="Grid view">
            <Grid2X2 className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label="List view">
            <List className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
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
                <Badge>{news.category}</Badge>
              </CardContent>
              <CardFooter className="flex justify-between mt-auto">
                <span className="text-sm text-muted-foreground">{new Date(news.date).toLocaleDateString()}</span>
                <Button asChild variant="link">
                  <Link href={`/article/${news.id}`}>Read more</Link>
                </Button>
              </CardFooter>
            </div>
          </Card>
        ))}
      </div>
      <div className="mt-8">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  )
}

