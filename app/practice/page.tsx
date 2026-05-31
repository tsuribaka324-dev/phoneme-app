'use client'

import { useState, useEffect, useCallback } from 'react'
import Nav from '@/components/Nav'
import MouthDiagram from '@/components/MouthDiagram'
import { PHONEMES, TROUBLE_SYMBOLS, type Phoneme } from '@/lib/phonemes'
import { loadScores, saveScore, getAccuracy, evalPhoneme, type ScoreMap } from '@/lib/scores'
import { useSpeech, useSpeechRecognition } from '@/lib/speech'

const COLORS = ['ph-color-0','ph-color-1','ph-color-2','ph-color-3','ph-color-4','ph-color-5']
const WC = ['wc-0','wc-1','wc-2','wc-3','wc-4','wc-5']

type Status = { dot: 'idle' | 'listening' | 'ok' | 'warn'; text: string }

export default function PracticePage() {
  const [scores, setScores] = useState<ScoreMap>({})
  const [selected, setSelected] = useState<Phoneme | null>(null)
  const [status, setStatus] = useState<Status>({ dot: 'idle', text: '音素を選んで練習を始めましょう' })
  const [lastScore, setLastScore] = useState<{ pct: number; ok: boolean } | null>(null)
  const [showTip, setShowTip] = useState(false)
  const [drillQueue, setDrillQueue] = useState<Phoneme[]>([])
  const [drillIdx, setDrillIdx] = useState(0)
  const { speak, voiceName } = useSpeech()

  useEffect(() => { setScores(loadScores()) }, [])

  const handleResult = useCallback((transcript: string, isFinal: boolean) => {
    if (!selected) return
    if (!isFinal) { setStatus({ dot: 'listening', text: `「${transcript}...」` }); return }
    const spoken = transcript.toLowerCase().trim()
    const { ok, best } = evalPhoneme(spoken, selected.ex)
    const updated = saveScore(selected.sym, ok)
    setScores(updated)
    const acc = getAccuracy(updated, selected.sym)
    setLastScore({ pct: Math.round(best * 100), ok })
    setStatus({
      dot: ok ? 'ok' : 'warn',
      text: ok ? `「${spoken}」— 良い音です！ 通算 ${acc}%` : `「${spoken}」— もう一度！ 通算 ${acc}%`,
    })
  }, [selected])

  const { start, stop, listening, supported } = useSpeechRecognition(handleResult)

  const selectPhoneme = (ph: Phoneme) => {
    setSelected(ph); setLastScore(null); setShowTip(false)
    setStatus({ dot: 'idle', text: '「例を聞く」で確認してから「発音する」を押してください' })
  }

  const startTroubleQueue = () => {
    const q = TROUBLE_SYMBOLS.map(s => PHONEMES.find(p => p.sym === s)!).filter(Boolean)
    setDrillQueue(q); setDrillIdx(0); selectPhoneme(q[0])
  }

  const nextInQueue = () => {
    const next = drillIdx + 1
    if (next < drillQueue.length) { setDrillIdx(next); selectPhoneme(drillQueue[next]) }
  }

  const dotColor = { idle: 'bg-ink-faint', listening: 'bg-red-500 animate-pulse', ok: 'bg-emerald-500', warn: 'bg-amber-500' }[status.dot]
  const vowels = PHONEMES.filter(p => p.cat === 'vowel')
  const consonants = PHONEMES.filter(p => p.cat === 'consonant')

  const chipClass = (ph: Phoneme, i: number) => {
    const base = `phoneme-chip ${COLORS[i % 6]}`
    const isSelected = selected?.sym === ph.sym
    return isSelected ? base + ' selected' : base
  }

  return (
    <div className="min-h-screen bg-paper">
      <Nav />
      <div className="max-w-3xl mx-auto px-4 py-6">
        {voiceName && <p className="text-xs text-ink-faint mb-4">🔊 {voiceName}</p>}

        <div className="grid md:grid-cols-[1fr_1.5fr] gap-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="section-label">音素マップ</p>
              <button onClick={startTroubleQueue} className="text-xs text-violet-600 font-medium hover:underline">
                🔥 苦手音を一気に練習
              </button>
            </div>

            <p className="section-label">母音</p>
            <div className="grid grid-cols-4 gap-1.5 mb-4">
              {vowels.map((ph, i) => (
                <button key={ph.sym} className={chipClass(ph, i)} onClick={() => selectPhoneme(ph)}>
                  <span className="font-mono text-base font-medium">{ph.sym}</span>
                  <span className="text-[9px] mt-0.5 opacity-70">{ph.name}</span>
                  {getAccuracy(scores, ph.sym) !== null && (
                    <span className="text-[9px] font-medium mt-0.5">{getAccuracy(scores, ph.sym)}%</span>
                  )}
                </button>
              ))}
            </div>

            <p className="section-label">子音</p>
            <div className="grid grid-cols-4 gap-1.5">
              {consonants.map((ph, i) => (
                <button key={ph.sym} className={chipClass(ph, i + 8)} onClick={() => selectPhoneme(ph)}>
                  <span className="font-mono text-base font-medium">{ph.sym}</span>
                  <span className="text-[9px] mt-0.5 opacity-70">{ph.name}</span>
                  {getAccuracy(scores, ph.sym) !== null && (
                    <span className="text-[9px] font-medium mt-0.5">{getAccuracy(scores, ph.sym)}%</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            {!selected ? (
              <div className="card flex flex-col items-center justify-center py-16 text-center">
                <div className="text-5xl mb-4">👈</div>
                <p className="text-ink-muted text-sm">左の音素を選ぶと<br />詳細と練習が始まります</p>
              </div>
            ) : (
              <div className="card space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-mono text-4xl font-medium text-violet-600">{selected.sym}</div>
                    <div className="text-sm font-medium text-ink mt-0.5 flex items-center gap-2">
                      {selected.name}
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${selected.cat === 'vowel' ? 'bg-violet-50 text-violet-700' : 'bg-blue-50 text-blue-700'}`}>
                        {selected.cat === 'vowel' ? '母音' : '子音'}
                      </span>
                      {selected.trouble && <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">要注意</span>}
                    </div>
                    <div className="text-xs text-ink-muted mt-1">{selected.desc}</div>
                  </div>
                  {getAccuracy(scores, selected.sym) !== null && (
                    <div className="text-right">
                      <div className="text-2xl font-medium text-violet-600">{getAccuracy(scores, selected.sym)}%</div>
                      <div className="text-[10px] text-ink-faint">{scores[selected.sym]?.attempts}回</div>
                    </div>
                  )}
                </div>

                <MouthDiagram ph={selected} />

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-violet-50 rounded-2xl p-3">
                    <div className="text-[10px] text-violet-500 mb-1">唇の形</div>
                    <div className="text-xs font-medium text-violet-800">{selected.lips}</div>
                  </div>
                  <div className="bg-emerald-50 rounded-2xl p-3">
                    <div className="text-[10px] text-emerald-600 mb-1">舌の位置</div>
                    <div className="text-xs font-medium text-emerald-800">{selected.tongue}</div>
                  </div>
                </div>

                <div className="bg-violet-50 rounded-2xl px-4 py-2.5 text-xs text-violet-700">
                  💡 {selected.jp}
                </div>

                <div>
                  <p className="section-label">例単語（タップで発音）</p>
                  <div className="flex flex-wrap gap-2">
                    {selected.ex.map((w, i) => (
                      <button key={w} onClick={() => speak(w)} className={`word-chip ${WC[i % 6]}`}>{w}</button>
                    ))}
                  </div>
                </div>

                <button onClick={() => setShowTip(v => !v)} className="text-xs text-ink-muted hover:text-violet-600 flex items-center gap-1 transition-colors">
                  {showTip ? '▲' : '▼'} 発音のコツ
                </button>
                {showTip && (
                  <div className="bg-amber-50 rounded-2xl px-4 py-3 text-xs text-amber-800 leading-relaxed border-l-2 border-amber-300">
                    {selected.jp}。舌の位置：{selected.tongue}。唇：{selected.lips}。
                    まず例単語を聞き、口の形を真似てから発音してください。
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  <button className="btn btn-primary" onClick={() => speak(selected.ex[0])}>🔊 例を聞く</button>
                  <button className="btn btn-ghost" onClick={() => speak(selected.ex[0], 0.5)}>🐢 ゆっくり</button>
                  {!listening ? (
                    <button className="btn btn-green" onClick={start} disabled={!supported}>🎙 発音する</button>
                  ) : (
                    <button className="btn btn-danger" onClick={stop}>⏹ 停止</button>
                  )}
                  {drillQueue.length > 0 && drillIdx < drillQueue.length - 1 && (
                    <button className="btn btn-ghost" onClick={nextInQueue}>次の音素 →</button>
                  )}
                </div>

                <div className="status-bar">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dotColor}`} />
                  <span className="text-sm">{status.text}</span>
                </div>

                {lastScore && (
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { num: `${lastScore.pct}%`, label: '今回', bg: 'bg-violet-50 text-violet-700' },
                      { num: `${getAccuracy(scores, selected.sym) ?? 0}%`, label: '通算', bg: 'bg-blue-50 text-blue-700' },
                      { num: scores[selected.sym]?.correct ?? 0, label: '成功', bg: 'bg-emerald-50 text-emerald-700' },
                      { num: scores[selected.sym]?.attempts ?? 0, label: '試行', bg: 'bg-amber-50 text-amber-700' },
                    ].map(c => (
                      <div key={c.label} className={`${c.bg} rounded-2xl p-2 text-center`}>
                        <div className="text-base font-medium">{c.num}</div>
                        <div className="text-[10px] opacity-70 mt-0.5">{c.label}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
