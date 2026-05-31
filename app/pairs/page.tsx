'use client'

import Nav from '@/components/Nav'
import { PHONEMES } from '@/lib/phonemes'
import { useSpeech } from '@/lib/speech'

export default function PairsPage() {
  const { speak } = useSpeech()

  const allPairs = PHONEMES.flatMap(ph =>
    ph.pairs.map(pair => ({ ...pair, sym: ph.sym, name: ph.name, cat: ph.cat }))
  )

  return (
    <div className="min-h-screen bg-paper">
      <Nav />
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-medium text-ink">最小対 Minimal Pairs</h1>
          <p className="text-sm text-ink-muted mt-1">
            1音だけ違う単語ペア。聞き比べて、違いを体で覚えましょう。
          </p>
        </div>

        <div className="space-y-2">
          {allPairs.map((pair, i) => (
            <div key={i} className="card">
              <div className="flex items-center gap-1 mb-3">
                <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-paper-warm text-ink-muted border border-paper-border">
                  {pair.sym}
                </span>
                <span className="text-xs text-ink-faint">{pair.name}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { word: pair.a, ipa: pair.ia, meaning: pair.ma },
                  { word: pair.b, ipa: pair.ib, meaning: pair.mb },
                ].map((item, j) => (
                  <button
                    key={j}
                    onClick={() => speak(item.word)}
                    className="flex items-center justify-between p-3 rounded-xl bg-paper-warm hover:bg-paper-border/30 transition-colors text-left group"
                  >
                    <div>
                      <div className="text-base font-medium text-ink group-hover:text-accent transition-colors">
                        {item.word}
                      </div>
                      <div className="font-mono text-xs text-ink-muted">{item.ipa}</div>
                      <div className="text-xs text-ink-faint mt-0.5">{item.meaning}</div>
                    </div>
                    <span className="text-ink-faint group-hover:text-accent text-lg transition-colors">🔊</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
