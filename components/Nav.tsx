'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/practice', label: '音素ドリル' },
  { href: '/pairs', label: '最小対' },
  { href: '/phonemes', label: '音素一覧' },
  { href: '/stats', label: '記録' },
]

export default function Nav() {
  const path = usePathname()
  return (
    <nav className="sticky top-0 z-10 bg-paper/90 backdrop-blur border-b border-paper-border">
      <div className="max-w-3xl mx-auto px-4 flex items-center justify-between h-14">
        <Link href="/" className="font-display text-lg font-medium tracking-tight text-ink">
          Phoneme
        </Link>
        <div className="flex items-center gap-1">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                path.startsWith(l.href)
                  ? 'bg-ink text-paper'
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
