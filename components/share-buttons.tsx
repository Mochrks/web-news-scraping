import { Button } from "@/components/ui/button"
import { Twitter, Facebook, Share2, Instagram } from 'lucide-react'
import { useState, useEffect } from 'react'

interface ShareButtonsProps {
  url: string
  title: string
}

export function ShareButtons({ url, title }: ShareButtonsProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const fullUrl = `https://yournewswebsite.com${url}`
  const encodedUrl = encodeURIComponent(fullUrl)
  const encodedTitle = encodeURIComponent(title)

  const shareToTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`, '_blank')
  }

  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank')
  }

  const shareToWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`, '_blank')
  }

  const copyLink = () => {
    navigator.clipboard.writeText(fullUrl).then(() => {
      alert('Link copied to clipboard!')
    })
  }

  return (
    <div className="flex flex-col md:flex-row gap-2">
      <Button variant="outline" size="icon" onClick={shareToTwitter} className="rounded-full hover:text-blue-400 hover:border-blue-400 transition-colors">
        <Twitter className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={shareToFacebook} className="rounded-full hover:text-blue-600 hover:border-blue-600 transition-colors">
        <Facebook className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={shareToWhatsApp} className="rounded-full hover:text-green-500 hover:border-green-500 transition-colors">
        {/* WhatsApp Icon SVG */}
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
          <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" stroke="none" fill="currentColor" />
          {/* Simplified WA Phone path roughly, usually standard icons are better but this mimics message bubble */}
          <path d="M9 10a.5.5 0 0 0 1 0v.01a.5.5 0 0 0-1 0V10zm5 5a.5.5 0 0 0 1 0v.01a.5.5 0 0 0-1 0V15z" />
        </svg>
      </Button>
      <Button variant="outline" size="icon" onClick={copyLink} className="rounded-full hover:text-gray-500 hover:border-gray-500 transition-colors">
        <Share2 className="h-4 w-4" />
      </Button>
      {/* Instagram doesn't have a direct share URL usually, but we can link to profile or just show icon for consistency if user asked */}
      <Button variant="outline" size="icon" onClick={() => window.open('https://instagram.com', '_blank')} className="rounded-full hover:text-pink-500 hover:border-pink-500 transition-colors">
        <Instagram className="h-4 w-4" />
      </Button>
    </div>
  )
}

