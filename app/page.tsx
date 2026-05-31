import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-paper flex flex-col">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-paper-border bg-white/80 backdrop-blur sticky top-0 z-10">
        <span className="font-display text-xl font-medium tracking-tight text-violet-600">Phoneme</span>
        <Link href="/practice" className="btn btn-primary text-sm">
          練習を始める →
        </Link>
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center relative overflow-hidden">
        {/* decorative blobs */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-violet-300 rounded-full opacity-10 blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-300 rounded-full opacity-10 blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-pink-300 rounded-full opacity-10 blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-50 text-violet-700 text-xs font-medium mb-8 border border-violet-100">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            ネイティブ音声 × マイク評価
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-medium tracking-tight text-ink leading-[1.1] mb-6">
            英語の音を<br />
            <span className="text-violet-600">正しく</span>出す。
          </h1>

          <p className="text-ink-muted text-lg max-w-md mb-12 leading-relaxed">
            /æ/ /θ/ /r/ /l/ — 日本人が苦手な音素を体系的に練習。<br />
            口の形・舌の位置・最小対で、発音を根本から直す。
          </p>

          <div className="flex flex-wrap gap-3 justify-center mb-16">
            <Link href="/practice" className="btn btn-primary px-7 py-3 text-base">
              音素ドリルを始める
            </Link>
            <Link href="/pairs" className="btn btn-ghost px-7 py-3 text-base">
              最小対を練習する
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl w-full mx-auto">
            {[
              { icon: '🗣', title: '18音素', desc: '母音8・子音10を網羅。口の断面図つき。', bg: 'bg-violet-50', border: 'border-violet-100' },
              { icon: '🎙', title: 'マイク評価', desc: '発音してスコアを記録。弱点が一目でわかる。', bg: 'bg-emerald-50', border: 'border-emerald-100' },
              { icon: '↔', title: '最小対', desc: 'rice/lice、sheep/shipを聞き比べ練習。', bg: 'bg-pink-50', border: 'border-pink-100' },
            ].map(f => (
              <div key={f.title} className={`${f.bg} border ${f.border} rounded-2xl p-5 text-left`}>
                <div className="text-2xl mb-3">{f.icon}</div>
                <div className="font-medium text-ink mb-1">{f.title}</div>
                <div className="text-sm text-ink-muted leading-relaxed">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer className="px-6 py-4 border-t border-paper-border text-xs text-ink-faint text-center">
        Phoneme — 英語発音練習アプリ
      </footer>
    </main>
  )
}
