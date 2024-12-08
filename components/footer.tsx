import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t flex justify-center">
      <div className="container flex flex-col items-center justify-between px-4 gap-4 py-10 md:h-24 md:flex-row md:py-0 ">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <Link href="/">
            <span className="font-bold">NewsNow</span>
          </Link>
          <p className="text-center text-sm leading-loose md:text-left">
            &copy; 2024 NewsNow. All rights reserved. Developed by @{" "}
            <a
              href="https://github.com/mochrks"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              mochrks
            </a>
            .
          </p>
        </div>
        <div className="flex gap-4">
          <Link href="/about" className="text-sm underline underline-offset-4">About</Link>
          <Link href="/contact" className="text-sm underline underline-offset-4">Contact</Link>
          <Link href="/privacy" className="text-sm underline underline-offset-4">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  )
}

