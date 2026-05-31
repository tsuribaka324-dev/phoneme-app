'use client'

import Link from 'next/link'
import Nav from '@/components/Nav'
import { PHONEMES } from '@/lib/phonemes'
import { loadScores, getAccuracy } from '@/lib/scores'
import { useEffect, useState } from 'react'
import type { ScoreMap } from '@/lib/scores'

export default function PhonemesPage() {
  const [scores, setScores] = useState<ScoreMap>({})
  useEffect(() => { setScores(loadScores()) }, [])

  const vowels = PHONEMES.filter(p => p.cat === 'vowel')
  const consonants = PHONEMES.filter(p => p.cat === 'consonant')

  const Section = ({ title, list }: { title: string; list: typeof PHONEMES }) => (
    <div className="mb-8">
      <h2 className="font-display text-lg font-medium text-ink mb-4">{title}</h2>
      <div className="grid sm:grid-cols-2 gap-3">
        {list.map(ph => {
          const acc = getAccuracy(scores, ph.sym)
          return (
            <Link
              key={ph.sym}
              href={`/practice`}
              className="card hover:border-accent transition-colors group"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-2xl font-medium text-ink">{ph.sym}</span>
                  <div>
                    <div className="text-sm font-medium text-ink">{ph.name}</div>
                    {ph.trouble && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-700">
                        日本人要注意
                      </span>
                    )}
                  </div>
                </div>
                {acc !== null && (
                  <span className={`text-sm font-medium ${acc >= 75 ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {acc}%
                  </span>
                )}
              </div>
              <p className="text-xs text-ink-muted mb-2">{ph.desc}</p>
              <div className="flex flex-wrap gap-1.5">
                {ph.ex.slice(0, 4).map(w => (
                  <span key={w} className="text-xs px-2 py-0.5 rounded-full bg-paper-warm text-ink-muted">
                    {w}
                  </span>
                ))}
              </div>
              {acc !== null && (
                <div className="mt-3 h-1 bg-paper-border rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${acc >= 75 ? 'bg-emerald-400' : acc >= 50 ? 'bg-amber-400' : 'bg-red-400'}`}
                    style={{ width: `${acc}%` }}
                  />
                </div>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-paper">
      <Nav />
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-medium text-ink">音素一覧</h1>
          <p className="text-sm text-ink-muted mt-1">全18音素。クリックで練習ページへ。</p>
        </div>
        <Section title="母音 Vowels" list={vowels} />
        <Section title="子音 Consonants" list={consonants} />
      </div>
    </div>
  )
}
