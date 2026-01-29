'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Search, Menu, Sun, Moon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useState, useEffect, useRef } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { useRouter } from 'next/navigation'

export default function Header() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const { t, language, setLanguage } = useLanguage()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Ctrl+K to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setIsSearchOpen(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Focus input when dialog opens
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isSearchOpen])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setIsSearchOpen(false)
      // Redirect to a search page (we assume /search exists or we handle it via category page logic later if needed)
      // For now, let's just create a generic search page or route
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
    }
  }

  if (!mounted) {
    return null
  }

  const navItems = [
    { key: 'nav.world', href: '/category/world' },
    { key: 'nav.business', href: '/category/business' },
    { key: 'nav.tech', href: '/category/tech' },
    { key: 'nav.science', href: '/category/science' },
    { key: 'nav.culture', href: '/category/culture' },
  ]

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-white/10 bg-background-light/80 dark:bg-[#121212]/90 backdrop-blur-md">
        <div className="mx-auto max-w-[1200px] flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button - Visible on small screens */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
            </Button>
            <Link href="/" className="group">
              <h2 className="text-2xl font-black tracking-tighter uppercase text-slate-900 dark:text-white group-hover:opacity-80 transition-opacity">
                The Daily<span className="text-primary">.</span>
              </h2>
            </Link>
          </div>

          <div className="flex flex-1 justify-end items-center gap-8">
            <nav className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  className="text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                >
                  {t(item.key)}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2 pl-4 md:border-l border-slate-200 dark:border-white/10">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search className="h-5 w-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400"
                onClick={() => setLanguage(language === 'en' ? 'id' : 'en')}
              >
                <span className="text-xs font-bold">{t('lang.toggle')}</span>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>

              <Button className="hidden sm:flex h-9 px-4 items-center justify-center rounded bg-slate-900 text-white dark:bg-white dark:text-black text-xs font-bold hover:bg-slate-700 dark:hover:bg-gray-200 transition-all uppercase tracking-wider">
                {t('nav.subscribe')}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Search Overlay */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-24 px-4"
          onClick={() => setIsSearchOpen(false)}
        >
          <div
            className="w-full max-w-[600px] bg-background border border-slate-200 dark:border-white/10 rounded-lg shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSearch} className="flex items-center px-4 py-4 bg-slate-50 dark:bg-[#1a1a1a]">
              <Search className="mr-3 h-5 w-5 text-muted-foreground" />
              <input
                ref={searchInputRef}
                className="flex-1 bg-transparent outline-none text-lg text-slate-900 dark:text-white placeholder:text-muted-foreground"
                placeholder={t('search.placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="ml-2 text-xs text-muted-foreground border border-slate-200 dark:border-white/10 px-2 py-1 rounded hover:bg-slate-200 dark:hover:bg-white/10"
              >
                ESC
              </button>
            </form>
            <div className="px-4 py-3 bg-white dark:bg-[#121212] border-t border-slate-200 dark:border-white/10 text-xs text-muted-foreground">
              Type to search news and press Enter...
            </div>
          </div>
        </div>
      )}
    </>
  )
}
