import Link from 'next/link'
import { Globe, AtSign, Rss } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="w-full bg-[#0a0a0a] py-12 text-slate-400">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 lg:col-span-2 pr-8">
            <h2 className="text-xl font-black tracking-tighter uppercase text-white mb-4">The Daily<span className="text-primary">.</span></h2>
            <p className="text-sm leading-relaxed mb-6 max-w-xs">
              Independent journalism for the modern world. We bring you clarity in times of uncertainty.
            </p>
            <div className="flex gap-4">
              <Link href="https://github.com/mochrks" target="_blank" className="hover:text-white transition-colors"><Globe className="h-5 w-5" /></Link>
              <Link href="https://github.com/mochrks" target="_blank" className="hover:text-white transition-colors"><AtSign className="h-5 w-5" /></Link>
              <Link href="https://github.com/mochrks" target="_blank" className="hover:text-white transition-colors"><Rss className="h-5 w-5" /></Link>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-widest text-xs mb-4">Sections</h4>
            <ul className="flex flex-col gap-2 text-sm">
              {['World', 'Business', 'Technology', 'Science', 'Health'].map(item => (
                <li key={item}><Link href="https://github.com/mochrks" target="_blank" className="hover:text-white transition-colors">{item}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-widest text-xs mb-4">Company</h4>
            <ul className="flex flex-col gap-2 text-sm">
              {['About Us', 'Careers', 'Code of Ethics', 'Contact'].map(item => (
                <li key={item}><Link href="https://github.com/mochrks" target="_blank" className="hover:text-white transition-colors">{item}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-widest text-xs mb-4">Support</h4>
            <ul className="flex flex-col gap-2 text-sm">
              {['Subscribe', 'Gift Subscriptions', 'Help Center', 'Sitemap'].map(item => (
                <li key={item}><Link href="https://github.com/mochrks" target="_blank" className="hover:text-white transition-colors">{item}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p>© 2025 The Daily News Portal. All rights reserved. Developed by <a href="https://github.com/mochrks" target="_blank" className="font-bold text-white hover:underline">mochrks</a>.</p>
          <div className="flex gap-6">
            <Link href="https://github.com/mochrks" target="_blank" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="https://github.com/mochrks" target="_blank" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="https://github.com/mochrks" target="_blank" className="hover:text-white transition-colors">Cookie Settings</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

