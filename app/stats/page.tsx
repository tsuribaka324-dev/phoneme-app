'use client'

import { useEffect, useState } from 'react'
import Nav from '@/components/Nav'
import { PHONEMES } from '@/lib/phonemes'
import { loadScores, getAccuracy, clearScores, type ScoreMap } from '@/lib/scores'

export default function StatsPage() {
  const [scores, setScores] = useState<ScoreMap>({})
  useEffect(() => { setScores(loadScores()) }, [])

  const practiced = PHONEMES.filter(p => scores[p.sym]?.attempts > 0)
  const totalAttempts = Object.values(scores).reduce((a, s) => a + s.attempts, 0)
  const totalCorrect = Object.values(scores).reduce((a, s) => a + s.correct, 0)
  const overallAcc = totalAttempts ? Math.round((totalCorrect / totalAttempts) * 100) : 0

  const sorted = [...practiced].sort((a, b) => (getAccuracy(scores, a.sym) ?? 0) - (getAccuracy(scores, b.sym) ?? 0))
  const weak = sorted.slice(0, 4)
  const strong = [...sorted].reverse().slice(0, 4)

  const handleClear = () => {
    if (confirm('練習記録をすべて削除しますか？')) {
      clearScores()
      setScores({})
    }
  }

  return (
    <div className="min-h-screen bg-paper">
      <Nav />
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl font-medium text-ink">練習記録</h1>
            <p className="text-sm text-ink-muted mt-1">あなたの発音スコア</p>
          </div>
          {totalAttempts > 0 && (
            <button onClick={handleClear} className="text-xs text-ink-faint hover:text-red-500 transition-colors">
              記録を削除
            </button>
          )}
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { num: totalAttempts, label: '総試行回数' },
            { num: `${overallAcc}%`, label: '全体正解率' },
            { num: practiced.length, label: '練習済み音素' },
          ].map(c => (
            <div key={c.label} className="card text-center">
              <div className="text-2xl font-medium text-ink">{c.num}</div>
              <div className="text-xs text-ink-muted mt-1">{c.label}</div>
            </div>
          ))}
        </div>

        {practiced.length === 0 ? (
          <div className="card text-center py-16">
            <div className="text-3xl mb-3">📊</div>
            <p className="text-ink-muted">まだ練習記録がありません。</p>
            <p className="text-sm text-ink-faint mt-1">「音素ドリル」から練習を始めましょう！</p>
          </div>
        ) : (
          <div className="space-y-6">
            {weak.length > 0 && (
              <div>
                <h2 className="section-label">苦手な音素</h2>
                <div className="card space-y-3">
                  {weak.map(ph => {
                    const acc = getAccuracy(scores, ph.sym)!
                    const s = scores[ph.sym]
                    return (
                      <div key={ph.sym} className="flex items-center gap-3">
                        <span className="font-mono text-lg font-medium text-ink w-10">{ph.sym}</span>
                        <div className="flex-1">
                          <div className="flex justify-between text-xs text-ink-muted mb-1">
                            <span>{ph.name}</span>
                            <span>{s.correct}/{s.attempts}回</span>
                          </div>
                          <div className="h-2 bg-paper-border rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-red-400 transition-all"
                              style={{ width: `${acc}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-sm font-medium text-red-500 w-10 text-right">{acc}%</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {strong.length > 0 && (
              <div>
                <h2 className="section-label">得意な音素</h2>
                <div className="card space-y-3">
                  {strong.map(ph => {
                    const acc = getAccuracy(scores, ph.sym)!
                    const s = scores[ph.sym]
                    return (
                      <div key={ph.sym} className="flex items-center gap-3">
                        <span className="font-mono text-lg font-medium text-ink w-10">{ph.sym}</span>
                        <div className="flex-1">
                          <div className="flex justify-between text-xs text-ink-muted mb-1">
                            <span>{ph.name}</span>
                            <span>{s.correct}/{s.attempts}回</span>
                          </div>
                          <div className="h-2 bg-paper-border rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-emerald-400 transition-all"
                              style={{ width: `${acc}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-sm font-medium text-emerald-600 w-10 text-right">{acc}%</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* All phonemes */}
            <div>
              <h2 className="section-label">全音素スコア</h2>
              <div className="card">
                <div className="grid grid-cols-2 gap-2">
                  {PHONEMES.map(ph => {
                    const acc = getAccuracy(scores, ph.sym)
                    return (
                      <div key={ph.sym} className="flex items-center gap-2 py-1.5">
                        <span className="font-mono text-sm font-medium text-ink w-10">{ph.sym}</span>
                        <div className="flex-1 h-1.5 bg-paper-border rounded-full overflow-hidden">
                          {acc !== null && (
                            <div
                              className={`h-full rounded-full ${acc >= 75 ? 'bg-emerald-400' : acc >= 50 ? 'bg-amber-400' : 'bg-red-400'}`}
                              style={{ width: `${acc}%` }}
                            />
                          )}
                        </div>
                        <span className="text-xs text-ink-faint w-8 text-right">
                          {acc !== null ? `${acc}%` : '—'}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
