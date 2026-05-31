'use client'

import { useEffect, useRef, useState } from 'react'

export function useSpeech() {
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null)
  const [voiceName, setVoiceName] = useState('')

  useEffect(() => {
    const load = () => {
      const voices = speechSynthesis.getVoices().filter(v => v.lang.startsWith('en'))
      const preferred = ['Samantha', 'Alex', 'Google US English', 'Microsoft Zira', 'Karen']
      for (const p of preferred) {
        const v = voices.find(v => v.name.includes(p))
        if (v) { voiceRef.current = v; setVoiceName(v.name); return }
      }
      if (voices[0]) { voiceRef.current = voices[0]; setVoiceName(voices[0].name) }
    }
    if (typeof window !== 'undefined') {
      if (speechSynthesis.getVoices().length) load()
      else speechSynthesis.addEventListener('voiceschanged', load)
      return () => speechSynthesis.removeEventListener('voiceschanged', load)
    }
  }, [])

  const speak = (text: string, rate = 0.9) => {
    if (typeof window === 'undefined') return
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
  const [supported, setSupported] = useState(false)
  const onResultRef = useRef(onResult)
  onResultRef.current = onResult

  useEffect(() => {
    if (typeof window === 'undefined') return
    setSupported('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)
  }, [])

  const start = () => {
    if (typeof window === 'undefined' || !supported) return
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const rec = new SR()
    rec.lang = 'en-US'
    rec.continuous = false
    rec.interimResults = false
    rec.maxAlternatives = 1
    rec.onstart = () => { setListening(true) }
    rec.onresult = (e: any) => {
      try {
        const transcript = e.results[0][0].transcript
        onResultRef.current(transcript, true)
      } catch {}
    }
    rec.onspeechend = () => { try { rec.stop() } catch {} }
    rec.onerror = (e: any) => {
      if (e.error === 'not-allowed') onResultRef.current('マイクの許可が必要です', true)
      setListening(false)
    }
    rec.onend = () => { setListening(false) }
    recRef.current = rec
    try { rec.start() } catch { setListening(false) }
  }

  const stop = () => {
    try { recRef.current?.stop() } catch {}
    setListening(false)
  }

  return { start, stop, listening, supported }
}
