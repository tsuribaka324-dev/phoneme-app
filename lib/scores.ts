'use client'

export type PhonemeScore = {
  attempts: number
  correct: number
}

export type ScoreMap = Record<string, PhonemeScore>

const KEY = 'phoneme_scores'

export function loadScores(): ScoreMap {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{}')
  } catch {
    return {}
  }
}

export function saveScore(sym: string, correct: boolean): ScoreMap {
  const scores = loadScores()
  if (!scores[sym]) scores[sym] = { attempts: 0, correct: 0 }
  scores[sym].attempts++
  if (correct) scores[sym].correct++
  localStorage.setItem(KEY, JSON.stringify(scores))
  return scores
}

export function getAccuracy(scores: ScoreMap, sym: string): number | null {
  const s = scores[sym]
  if (!s || s.attempts === 0) return null
  return Math.round((s.correct / s.attempts) * 100)
}

export function clearScores(): void {
  localStorage.removeItem(KEY)
}

export function levenshtein(a: string, b: string): number {
  const dp = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  )
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
  return dp[a.length][b.length]
}

export function similarity(a: string, b: string): number {
  if (a === b) return 1
  if (!a || !b) return 0
  const longer = a.length > b.length ? a : b
  const shorter = a.length > b.length ? b : a
  const dist = levenshtein(longer, shorter)
  return (longer.length - dist) / longer.length
}

export function evalPhoneme(spoken: string, exWords: string[]): { ok: boolean; best: number } {
  const s = spoken.toLowerCase().trim()
  let best = 0
  for (const w of exWords) {
    const score = similarity(s, w.toLowerCase())
    if (score > best) best = score
    if (s.includes(w.toLowerCase()) || w.toLowerCase().includes(s)) {
      best = Math.max(best, 0.85)
    }
  }
  return { ok: best >= 0.5, best }
}
