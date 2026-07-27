'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Shield, ArrowLeft, Send, Sparkles, User, CheckCircle2, MessageSquare, PhoneCall, Loader2 } from 'lucide-react'

const SPECIALISTS = [
  { id: 'pharmacist', name: 'Clinical Pharmacist', role: 'Medication Safety & Dosage Checks', availability: 'Available Now' },
  { id: 'doctor', name: 'General Practitioner', role: 'Primary Triage & Consultations', availability: 'Available Now' },
  { id: 'nurse', name: 'Triage Nurse', role: 'Follow-up Care & Chronic Nudges', availability: 'Available Now' }
]

export default function ConsultPage() {
  const [selectedSpecialist, setSelectedSpecialist] = useState('pharmacist')
  const [messages, setMessages] = useState<Array<{ sender: string; text: string }>>([
    { sender: 'aura', text: 'Hello! I am Aura, your clinical assistant. How can I help you or guide your care today?' }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim() || chatLoading) return

    const userMsg = { sender: 'user', text: inputMessage }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInputMessage('')
    setChatLoading(true)

    const specialist = SPECIALISTS.find(s => s.id === selectedSpecialist)
    const systemPrompt = `You are Aura, an AI clinical assistant acting as a ${specialist?.name || 'clinical specialist'} for AuraBridge Health in Nigeria. Provide general health and medication guidance only. Do NOT give specific drug dosages or definitive diagnoses. Always advise the person to confirm any treatment with a licensed doctor or pharmacist in person, especially for children, pregnancy, or serious/urgent symptoms. Keep responses concise and clear.`

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: `[You are: ${systemPrompt}]\n\n${newMessages.map(m => `${m.sender === 'user' ? 'Patient' : 'Aura'}: ${m.text}`).join('\n')}`
          }]
        })
      })
      const data = await res.json()
      setMessages(prev => [...prev, { sender: 'aura', text: data.message || 'Sorry, I could not respond right now. Please try again or book a real consultation below.' }])
    } catch {
      setMessages(prev => [...prev, { sender: 'aura', text: 'Connection error. Please try again, or book a real consultation with a specialist below.' }])
    } finally {
      setChatLoading(false)
    }
  }

  const handleBookSpecialist = (specialistName: string) => {
    setBookingSuccess(true)
    const text = encodeURIComponent(`Hello AuraBridge Health, I would like to book a consultation with a ${specialistName}.`)
    setTimeout(() => {
      window.open(`https://wa.me/2348000000000?text=${text}`, '_blank')
    }, 1200)
  }

  return (
    <div className="min-h-screen bg-[#f2fbf5] text-slate-900 font-sans pb-12">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-emerald-700">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-sm text-slate-900">AuraBridge Clinical Consult</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 pt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="md:col-span-1 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <h2 className="font-black text-sm uppercase tracking-wider text-emerald-700 mb-3 flex items-center gap-1.5">
              <User className="w-4 h-4" /> Select Specialist
            </h2>
            <div className="space-y-2">
              {SPECIALISTS.map((s) => (
                <div
                  key={s.id}
                  onClick={() => setSelectedSpecialist(s.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedSpecialist === s.id
                      ? 'bg-emerald-50 border-emerald-500 shadow-sm'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <strong className="text-xs font-bold text-slate-900">{s.name}</strong>
                    <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      {s.availability}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">{s.role}</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleBookSpecialist(s.name)
                    }}
                    className="mt-2.5 w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] py-1.5 rounded-lg shadow-xs"
                  >
                    Book Consultation (WhatsApp)
                  </button>
                </div>
              ))}
            </div>
          </div>

          {bookingSuccess && (
            <div className="bg-emerald-100 border border-emerald-300 text-emerald-900 p-4 rounded-2xl text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              Opening WhatsApp referral handoff to book your clinician…
            </div>
          )}
        </div>

        <div className="md:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col h-[600px]">
          
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 rounded-t-2xl">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Aura AI Clinical Triage</h3>
                <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1">
                  ● Powered by Claude 3.5 Sonnet
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-emerald-600 text-white font-medium rounded-tr-none'
                      : 'bg-slate-100 text-slate-800 border border-slate-200/60 rounded-tl-none'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {chatLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-100 text-slate-500 border border-slate-200/60 p-3 rounded-2xl text-xs flex items-center gap-2 rounded-tl-none">
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                  Aura AI is thinking…
                </div>
              </div>
            )}
          </div>

          <div className="p-3 border-t border-slate-100 bg-slate-50 rounded-b-2xl">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                disabled={chatLoading}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about symptoms, drug interactions, or dosage guidance…"
                className="flex-1 bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={chatLoading || !inputMessage.trim()}
                className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1 shadow"
              >
                {chatLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </form>
            <p className="text-[10px] text-slate-400 mt-2 text-center">
              Disclaimer: Aura AI provides general triage information only, not specific dosages or diagnoses. Always consult a licensed Nigerian doctor for medical care. For emergencies call 112.
            </p>
          </div>

        </div>

      </main>
    </div>
  )
}
