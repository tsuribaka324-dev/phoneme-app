'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/practice', label: '音素ドリル', color: 'text-violet-600 bg-violet-50' },
  { href: '/pairs', label: '最小対', color: 'text-pink-600 bg-pink-50' },
  { href: '/phonemes', label: '音素一覧', color: 'text-blue-600 bg-blue-50' },
  { href: '/stats', label: '記録', color: 'text-emerald-600 bg-emerald-50' },
]

export default function Nav() {
  const path = usePathname()
  return (
    <nav className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-paper-border">
      <div className="max-w-3xl mx-auto px-4 flex items-center justify-between h-14">
        <Link href="/" className="font-display text-lg font-medium tracking-tight text-violet-600">
          Phoneme
        </Link>
        <div className="flex items-center gap-1">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                path.startsWith(l.href)
                  ? l.color
                  : 'text-ink-muted hover:text-ink hover:bg-paper-warm'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
