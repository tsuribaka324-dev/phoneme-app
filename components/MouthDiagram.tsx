import type { Phoneme } from '@/lib/phonemes'

type Config = {
  ow: number; oh: number; ty: number; tx: number
  tcolor: string; ttext: string; note: string
}

const CONFIGS: Record<string, Config> = {
  'wide-open':        { ow: 52, oh: 28, ty: -14, tx: 0,  tcolor: '#DC2626', ttext: '舌：低・前',   note: '口を横に大きく' },
  'half-open':        { ow: 40, oh: 20, ty: -10, tx: 0,  tcolor: '#D97706', ttext: '舌：中央',     note: '軽く開ける' },
  'spread':           { ow: 46, oh: 14, ty: -14, tx: -4, tcolor: '#DC2626', ttext: '舌：高・前',   note: '横に広げる' },
  'high-front-lax':   { ow: 42, oh: 16, ty: -12, tx: -2, tcolor: '#D97706', ttext: '舌：やや高',   note: '力を抜く' },
  'high-back':        { ow: 20, oh: 20, ty: -12, tx: 0,  tcolor: '#DC2626', ttext: '舌：高・後',   note: '唇を丸める' },
  'high-back-lax':    { ow: 26, oh: 18, ty: -10, tx: 0,  tcolor: '#D97706', ttext: '舌：やや後',   note: '軽く丸める' },
  'back-mid':         { ow: 30, oh: 26, ty: -10, tx: 0,  tcolor: '#D97706', ttext: '舌：後・中',   note: '丸めて開く' },
  'mid-front':        { ow: 38, oh: 18, ty: -10, tx: -2, tcolor: '#D97706', ttext: '舌：中・前',   note: '「エ」に近い' },
  'interdental':      { ow: 36, oh: 14, ty: -4,  tx: 0,  tcolor: '#2563EB', ttext: '舌：歯の間',   note: '舌を歯に当てる' },
  'upper-teeth lower-lip': { ow: 34, oh: 12, ty: -16, tx: 0, tcolor: '#2563EB', ttext: '舌：リラックス', note: '歯を唇に当てる' },
  'retroflex — touches nothing': { ow: 28, oh: 14, ty: -8, tx: 2, tcolor: '#DC2626', ttext: '舌：後ろに引く', note: '舌を浮かせる' },
  'alveolar tip contact': { ow: 32, oh: 14, ty: -4, tx: 0, tcolor: '#2563EB', ttext: '舌先：歯茎',  note: '舌先を当てる' },
  'velar nasal':      { ow: 32, oh: 10, ty: -12, tx: 0,  tcolor: '#059669', ttext: '舌：後・上',   note: '鼻から出す' },
  'alveolar-palatal': { ow: 26, oh: 14, ty: -10, tx: 0,  tcolor: '#2563EB', ttext: '舌：口蓋',     note: '' },
  'palatal':          { ow: 22, oh: 14, ty: -10, tx: 0,  tcolor: '#2563EB', ttext: '舌：口蓋',     note: '唇を丸める' },
  'rounded protruded → open': { ow: 16, oh: 16, ty: -12, tx: 0, tcolor: '#DC2626', ttext: '舌：後・高', note: 'すぼめて開く' },
  'rounded':          { ow: 20, oh: 20, ty: -12, tx: 0,  tcolor: '#DC2626', ttext: '舌：高・後',   note: '唇を丸める' },
}

function getCfg(ph: Phoneme): Config {
  return CONFIGS[ph.tongue] || CONFIGS['half-open']
}

export default function MouthDiagram({ ph }: { ph: Phoneme }) {
  const c = getCfg(ph)
  return (
    <svg viewBox="0 0 260 120" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-sm mx-auto block">
      <rect width="260" height="120" fill="#FAFAF8" rx="10" />
      <text x="130" y="18" textAnchor="middle" fontSize="11" fill="#B0B0B0">{ph.sym} の口の形</text>
      {/* Outer lip outline */}
      <ellipse cx="130" cy="70" rx="46" ry="34" fill="white" stroke="#E8E5DF" strokeWidth="1" />
      {/* Mouth opening */}
      <ellipse cx="130" cy="70" rx={c.ow} ry={c.oh} fill="#1A1A1A" opacity="0.88" />
      {/* Tongue */}
      <ellipse
        cx={130 + c.tx}
        cy={70 + c.ty}
        rx={Math.round(c.ow * 0.72)}
        ry={Math.round(c.oh * 0.46)}
        fill={c.tcolor}
        opacity="0.85"
      />
      <text x="130" y="110" textAnchor="middle" fontSize="11" fill="#6B6B6B">
        {c.ttext}{c.note ? ` — ${c.note}` : ''}
      </text>
    </svg>
  )
}
