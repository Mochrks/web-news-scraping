'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { getAllNews, NewsItem } from '@/lib/api'
import { Loader2 } from 'lucide-react'

// const ITEMS_PER_PAGE = 12;

export default function SearchPage({ searchParams }: { searchParams: { q: string } }) {
    const [news, setNews] = useState<NewsItem[]>([])
    const [loading, setLoading] = useState(true)
    const searchQuery = searchParams.q || ''

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            try {
                // In a real app, we would have a search endpoint. 
                // Here we fetch all (cached) and filter client side for MVP.
                // Since getAllNews fetches from RSS, we might want to just fetch 'World' or multiple.
                // Actually getAllNews fetches All categories if no argument provided (in my implementation). 

                const allData = await getAllNews();
                const filtered = allData.filter(item =>
                    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
                );
                setNews(filtered);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [searchQuery])


    if (loading) {
        return (
            <div className="container mx-auto px-4 py-20 flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8 min-h-screen">
            <h1 className="text-3xl font-bold mb-8">Search Results for &quot;{searchQuery}&quot;</h1>

            {news.length === 0 ? (
                <p className="text-muted-foreground">No results found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {news.map((item) => (
                        <Card key={item.id} className="overflow-hidden flex flex-col h-full bg-slate-50 dark:bg-card">
                            <div className="relative h-48 w-full">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    layout="fill"
                                    objectFit="cover"
                                />
                            </div>
                            <CardHeader>
                                <CardTitle className="text-xl line-clamp-2">{item.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <p className="text-muted-foreground mb-4 line-clamp-3 text-sm">{item.excerpt}</p>
                                <Badge variant="secondary">{item.category}</Badge>
                            </CardContent>
                            <CardFooter>
                                <Button asChild variant="link" className="p-0">
                                    <Link href={`/article/${encodeURIComponent(item.id)}`}>Read more</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
