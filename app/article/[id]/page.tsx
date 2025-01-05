'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { allNews } from '@/lib/mockData'
import { NewsItem } from '@/lib/mockData'
import { Comments } from '@/components/comments'
import dynamic from 'next/dynamic'

const DynamicShareButtons = dynamic(() => import('@/components/share-buttons').then(mod => mod.ShareButtons), { ssr: false })

export default function ArticlePage({ params }: { params: { id: string } }) {
  const [article, setArticle] = useState<NewsItem | null>(null)

  useEffect(() => {
    const foundArticle = allNews.find(news => news.id === params.id)
    setArticle(foundArticle || null)
  }, [params.id])

  if (!article) {
    return <div className="container mx-auto px-4 py-8">Article not found</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="overflow-hidden">
        <div className="relative h-64 md:h-96">
          {article.videoUrl ? (
            <video src={article.videoUrl} controls className="w-full h-full object-cover" />
          ) : (
            <Image
              src={article.image}
              alt={article.title}
              layout="fill"
              objectFit="cover"
            />
          )}
        </div>
        <CardHeader>
          <div className="flex justify-between items-center mb-4">
            <Badge>{article.category}</Badge>
            <span className="text-sm text-muted-foreground">{new Date(article.date).toLocaleString()}</span>
          </div>
          <CardTitle className="text-3xl md:text-4xl font-bold">{article.title}</CardTitle>
          <div className="flex flex-wrap gap-2 mt-2">
            {article.topics.map((topic) => (
              <Badge key={topic} variant="secondary">{topic}</Badge>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-muted-foreground mb-6">{article.excerpt}</p>
          <div className="prose max-w-none mb-6">
            {article.content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4">{paragraph}</p>
            ))}
          </div>
          <DynamicShareButtons url={`/article/${article.id}`} title={article.title} />
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">Author: {article.author}</p>
        </CardFooter>
      </Card>
      <Comments />
    </div>
  )
}

