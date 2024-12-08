import { Button } from "@/components/ui/button"
import { Twitter, Facebook, Share2 } from 'lucide-react'
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
    <div className="flex space-x-2">
      <Button variant="outline" size="icon" onClick={shareToTwitter}>
        <Twitter className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={shareToFacebook}>
        <Facebook className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={shareToWhatsApp}>
        <span className="font-bold">WA</span>
      </Button>
      <Button variant="outline" size="icon" onClick={copyLink}>
        <Share2 className="h-4 w-4" />
      </Button>
    </div>
  )
}

