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
  const recRef = useRef<SpeechRecognition | null>(null)
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
    const rec: SpeechRecognition = new SR()
    rec.lang = 'en-US'
    rec.continuous = false
    rec.interimResults = true
    rec.onresult = e => {
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
