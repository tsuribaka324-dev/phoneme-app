'use client'

import { useEffect, useRef, useState } from 'react'

export function useSpeech() {
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null)
  const [voiceName, setVoiceName] = useState('')

  useEffect(() => {
    const load = () => {
      const vs = speechSynthesis.getVoices().filter(v => v.lang.startsWith('en'))
      const preferred = ['Samantha', 'Alex', 'Google US English', 'Microsoft Zira', 'Karen']
      for (const p of preferred) {
        const v = vs.find(v => v.name.includes(p))
        if (v) { voiceRef.current = v; setVoiceName(v.name); return }
      }
      if (vs[0]) { voiceRef.current = vs[0]; setVoiceName(vs[0].name) }
    }
    if (speechSynthesis.getVoices().length) load()
    else speechSynthesis.addEventListener('voiceschanged', load)
    return () => speechSynthesis.removeEventListener('voiceschanged', load)
  }, [])

  const speak = (text: string, rate = 0.9) => {
    speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'en-US'
    u.rate = rate
    if (voiceRef.current) u.voice = voiceRef.current
    speechSynthesis.speak(u)
    return u
  }

  return { speak, voiceName }
}

export function useSpeechRecognition(onResult: (transcript: string, isFinal: boolean) => void) {
  const recRef = useRef<any>(null)
  const [listening, setListening] = useState(false)
  const [supported, setSupported] = useState(true)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSupported('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)
    }
  }, [])

  const start = () => {
    if (!supported) return
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const rec = new SR()
    rec.lang = 'en-US'
    rec.continuous = false
    rec.interimResults = true
    rec.onresult = (e: any) => {
      let t = ''
      for (let i = 0; i < e.results.length; i++) t = e.results[i][0].transcript
      onResult(t, e.results[0].isFinal)
    }
    rec.onerror = () => { setListening(false) }
    rec.onend = () => { setListening(false) }
    recRef.current = rec
    rec.start()
    setListening(true)
  }

  const stop = () => {
    recRef.current?.stop()
    setListening(false)
  }

  return { start, stop, listening, supported }
}
