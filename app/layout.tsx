import type { Metadata } from 'next'
import { Noto_Serif_Display, DM_Sans, DM_Mono } from 'next/font/google'
import './globals.css'

const display = Noto_Serif_Display({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600'],
})

const body = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '500'],
})

const mono = DM_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500'],
})

export const metadata: Metadata = {
  title: 'Phoneme — 英語発音練習',
  description: '英語の音素を体系的に練習。ネイティブ音声 × マイク評価でスコアが上がる。',
  openGraph: {
    title: 'Phoneme — 英語発音練習',
    description: '音素ドリル・最小対・スコア記録で発音を劇的に改善',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="bg-paper text-ink antialiased">{children}</body>
    </html>
  )
}
