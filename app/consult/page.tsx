"use client"
import { useState, useRef, useEffect } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Send, Loader2, Bot, User, Stethoscope, Pill, Heart } from "lucide-react"

interface Message { role: "user" | "assistant"; content: string }

const specialists = [
  { id: "pharmacist", label: "Pharmacist", icon: Pill, color: "bg-green-100 text-green-700", desc: "Drug questions, interactions, dosages" },
  { id: "doctor", label: "General Doctor", icon: Stethoscope, color: "bg-blue-100 text-blue-700", desc: "Symptoms, diagnosis guidance, referrals" },
  { id: "nurse", label: "Nurse", icon: Heart, color: "bg-pink-100 text-pink-700", desc: "Patient care, wound care, vitals" },
]

const systemPrompts: Record<string, string> = {
  pharmacist: "You are an expert clinical pharmacist in Nigeria with 15+ years experience. Help with drug questions, interactions, dosages, side effects, NAFDAC regulations, and medication counseling. Be professional, accurate, and always recommend in-person consultation for serious cases.",
  doctor: "You are an experienced general practitioner doctor in Nigeria. Help with symptom assessment, general health guidance, when to seek emergency care, and referrals. Always clarify you are an AI assistant and serious cases need in-person evaluation.",
  nurse: "You are a registered nurse in Nigeria with expertise in patient care, wound management, vital signs interpretation, and health education. Be caring, practical, and clear. Always recommend professional medical care when needed.",
}

export default function ConsultPage() {
  const [specialist, setSpecialist] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }) }, [messages, loading])

  const startConsult = (id: string) => {
    setSpecialist(id)
    const s = specialists.find(s => s.id === id)!
    setMessages([{ role: "assistant", content: `Hello! I am your AI ${s.label}. I am here to help with ${s.desc.toLowerCase()}. How can I assist you today?

Please note: This is an AI assistant and should not replace professional medical advice for serious conditions.` }])
  }

  const send = async () => {
    if (!input.trim() || loading || !specialist) return
    const newMessages: Message[] = [...messages, { role: "user", content: input }]
    setMessages(newMessages)
    setInput("")
    setLoading(true)
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "user", content: `[SYSTEM: ${systemPrompts[specialist]}]

${input}` },
            ...newMessages.slice(1)
          ]
        })
      })
      const data = await res.json()
      setMessages([...newMessages, { role: "assistant", content: data.message || "Sorry, I could not respond. Please try again." }])
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "Connection error. Please try again." }])
    } finally {
      setLoading(false)
    }
  }

  if (!specialist) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto max-w-2xl px-4 py-16">
          <div className="mb-10 text-center">
            <h1 className="mb-4 text-3xl font-bold text-foreground">Consult a Specialist</h1>
            <p className="text-lg text-muted-foreground">Get instant AI-powered medical guidance from our virtual healthcare team. Available 24/7.</p>
          </div>
          <div className="space-y-4">
            {specialists.map(s => (
              <Card key={s.id} className="cursor-pointer hover:shadow-md transition-shadow border-border/50" onClick={() => startConsult(s.id)}>
                <CardContent className="p-6 flex items-center gap-4">
                  <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${s.color}`}>
                    <s.icon className="h-7 w-7" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-lg">{s.label}</p>
                    <p className="text-sm text-muted-foreground">{s.desc}</p>
                  </div>
                  <span className="text-sm text-green-600 font-medium">Available →</span>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="mt-8 text-center text-xs text-muted-foreground">
            AI-powered consultations. For emergencies, call 112 or visit your nearest hospital.
          </p>
        </main>
      </div>
    )
  }

  const currentSpecialist = specialists.find(s => s.id === specialist)!

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <div className={`border-b px-4 py-3 flex items-center gap-3 ${currentSpecialist.color.split(" ")[0]}/20`}>
        <div className={`flex h-9 w-9 items-center justify-center rounded-full ${currentSpecialist.color}`}>
          <currentSpecialist.icon className="h-5 w-5" />
        </div>
        <div>
          <p className="font-semibold text-sm">AI {currentSpecialist.label}</p>
          <p className="text-xs text-green-600">Online • Responding instantly</p>
        </div>
        <button onClick={() => { setSpecialist(null); setMessages([]) }} className="ml-auto text-xs text-muted-foreground hover:text-foreground">Change specialist</button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-w-2xl mx-auto w-full">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${msg.role === "user" ? "bg-green-600" : currentSpecialist.color}`}>
              {msg.role === "user" ? <User className="h-4 w-4 text-white" /> : <currentSpecialist.icon className="h-4 w-4" />}
            </div>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${msg.role === "user" ? "bg-green-600 text-white rounded-tr-sm" : "bg-muted text-foreground rounded-tl-sm"}`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full ${currentSpecialist.color}`}>
              <currentSpecialist.icon className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-muted px-4 py-3">
              <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:0ms]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:150ms]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:300ms]" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="border-t p-4 max-w-2xl mx-auto w-full">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
            placeholder={`Ask the ${currentSpecialist.label}...`}
            className="flex-1 rounded-full border border-input bg-muted px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={loading}
          />
          <button onClick={send} disabled={loading || !input.trim()} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-600 text-white hover:bg-green-700 disabled:opacity-50">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </button>
        </div>
        <p className="mt-2 text-center text-xs text-muted-foreground">AI assistant only. Not a substitute for professional medical care.</p>
      </div>
    </div>
  )
}
