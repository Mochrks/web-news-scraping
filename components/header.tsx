'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Search, Menu, Sun, Moon, X, Mail, CheckCircle2 } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useState, useEffect, useRef } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { useRouter } from 'next/navigation'

export default function Header() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const { t, language, setLanguage } = useLanguage()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false)
  const [subscribeStep, setSubscribeStep] = useState<'input' | 'success'>('input')
  const [email, setEmail] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Lock scroll when menu or modals are open
  useEffect(() => {
    if (isMenuOpen || isSearchOpen || isSubscribeOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMenuOpen, isSearchOpen, isSubscribeOpen])

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
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
    }
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim() && email.includes('@')) {
      setSubscribeStep('success')
      // Simulate API call
      setTimeout(() => {
        setIsSubscribeOpen(false)
        setSubscribeStep('input')
        setEmail('')
      }, 3000)
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
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden hover:bg-slate-200 dark:hover:bg-white/10"
              onClick={() => setIsMenuOpen(true)}
            >
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

              <Button
                onClick={() => setIsSubscribeOpen(true)}
                className="hidden sm:flex h-9 px-4 items-center justify-center rounded bg-slate-900 text-white dark:bg-white dark:text-black text-xs font-bold hover:bg-slate-700 dark:hover:bg-gray-200 transition-all uppercase tracking-wider"
              >
                {t('nav.subscribe')}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-[100] bg-black/60 backdrop-blur-md transition-all duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMenuOpen(false)}
      >
        <div
          className={`absolute left-0 top-0 h-full w-[300px] bg-background border-r border-slate-200 dark:border-white/10 p-6 flex flex-col transition-transform duration-300 ease-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-xl font-black tracking-tighter uppercase">
              Menu<span className="text-primary">.</span>
            </h2>
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)} className="rounded-full">
              <X className="h-6 w-6" />
            </Button>
          </div>

          <nav className="flex flex-col gap-6">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="text-lg font-bold text-slate-800 dark:text-slate-200 hover:text-primary dark:hover:text-primary transition-colors flex items-center justify-between group"
              >
                {t(item.key)}
                <span className="h-[2px] w-0 bg-primary transition-all group-hover:w-8"></span>
              </Link>
            ))}
          </nav>

          <div className="mt-auto pt-10 border-t border-slate-100 dark:border-white/5 space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">Theme</span>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full px-4"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                {theme === 'dark' ? <><Sun className="h-4 w-4 mr-2" /> Light</> : <><Moon className="h-4 w-4 mr-2" /> Dark</>}
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">Language</span>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full px-4"
                onClick={() => setLanguage(language === 'en' ? 'id' : 'en')}
              >
                {t('lang.toggle').toUpperCase()}
              </Button>
            </div>

            <Button
              onClick={() => {
                setIsMenuOpen(false);
                setIsSubscribeOpen(true);
              }}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg uppercase tracking-widest shadow-lg shadow-primary/20"
            >
              {t('nav.subscribe')}
            </Button>
          </div>
        </div>
      </div>

      {/* Subscribe Modal */}
      {isSubscribeOpen && (
        <div
          className="fixed inset-0 z-[120] bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setIsSubscribeOpen(false)}
        >
          <div
            className="w-full max-w-[450px] bg-background border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8 text-center">
              {subscribeStep === 'input' ? (
                <>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Mail className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-tight mb-2">Subscribe to News</h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-8">Get the latest stories delivered straight to your inbox.</p>

                  <form onSubmit={handleSubscribe} className="space-y-4">
                    <input
                      type="email"
                      required
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                    <Button type="submit" className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl uppercase tracking-widest shadow-lg">
                      Join the Newsletter
                    </Button>
                  </form>
                  <p className="mt-4 text-[10px] text-slate-400 uppercase tracking-widest">No spam, only quality journalism.</p>
                </>
              ) : (
                <div className="py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="h-8 w-8 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-tight mb-2">You&apos;re on the list!</h3>
                  <p className="text-slate-500 dark:text-slate-400">Thanks for subscribing. We&apos;ve sent a confirmation to <span className="font-bold text-slate-900 dark:text-white">{email}</span>.</p>
                  <Button
                    variant="outline"
                    onClick={() => setIsSubscribeOpen(false)}
                    className="mt-8 rounded-xl px-8"
                  >
                    Close
                  </Button>
                </div>
              )}
            </div>
            <button
              onClick={() => setIsSubscribeOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Search Overlay */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 z-[110] bg-black/50 backdrop-blur-sm flex items-start justify-center pt-24 px-4"
          onClick={() => setIsSearchOpen(false)}
        >
          <div
            className="w-full max-w-[600px] bg-background border border-slate-200 dark:border-white/10 rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200"
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
