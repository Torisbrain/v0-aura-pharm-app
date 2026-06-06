"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { AuraBot } from "@/components/aura-bot"
import { Button } from "@/components/ui/button"
import { Send, Loader2, Clock, AlertTriangle, MessageCircle, Calendar, CheckCircle, X, Phone } from "lucide-react"

const specialists = [
  {
    id: "pharmacist",
    label: "Pharmacist",
    title: "Clinical Pharmacist",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&q=85&fit=crop&crop=face",
    color: "from-green-500 to-emerald-600",
    lightColor: "bg-green-50 border-green-200",
    badge: "bg-green-100 text-green-700",
    desc: "Drug questions, interactions, dosages, NAFDAC",
    longDesc: "Get expert advice on medications, dosages, drug interactions, and NAFDAC registration from our certified clinical pharmacists.",
    wait: "~30 mins",
    rating: "4.9",
    consultations: "2,340+",
  },
  {
    id: "doctor",
    label: "General Doctor",
    title: "MBBS, General Practitioner",
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&q=85&fit=crop&crop=face",
    color: "from-blue-500 to-blue-700",
    lightColor: "bg-blue-50 border-blue-200",
    badge: "bg-blue-100 text-blue-700",
    desc: "Symptoms, diagnosis guidance, prescriptions",
    longDesc: "Consult with experienced general practitioners for symptom assessment, diagnosis guidance, and when to seek emergency care.",
    wait: "~1 hour",
    rating: "4.8",
    consultations: "1,890+",
  },
  {
    id: "nurse",
    label: "Nurse",
    title: "Registered Nurse (RN)",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=85&fit=crop&crop=face",
    color: "from-pink-500 to-rose-600",
    lightColor: "bg-pink-50 border-pink-200",
    badge: "bg-pink-100 text-pink-700",
    desc: "Patient care, wound care, health advice",
    longDesc: "Our registered nurses provide compassionate guidance on patient care, wound management, vital signs, and everyday health concerns.",
    wait: "~20 mins",
    rating: "4.9",
    consultations: "3,120+",
  },
]

interface Message { role: "user" | "assistant"; content: string }

const systemPrompts: Record<string, string> = {
  pharmacist: "You are an expert clinical pharmacist in Nigeria with 15+ years experience. Help with drug questions, interactions, dosages, side effects, NAFDAC regulations, and medication counseling. Be professional and accurate.",
  doctor: "You are an experienced general practitioner doctor in Nigeria. Help with symptom assessment, general health guidance, and referrals. Always clarify serious cases need in-person evaluation.",
  nurse: "You are a registered nurse in Nigeria. Help with patient care, wound management, vital signs, and health education. Be caring and practical.",
}

export default function ConsultPage() {
  const [step, setStep] = useState<"select" | "book" | "chat" | "confirm">("select")
  const [selected, setSelected] = useState<string | null>(null)
  const [mode, setMode] = useState<"book" | "chat" | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [bookingId, setBookingId] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [form, setForm] = useState({ name: "", phone: "", email: "", symptoms: "", preferred_time: "", urgency: "normal" })

  const currentSpec = specialists.find(s => s.id === selected)

  const startConsult = (id: string, m: "book" | "chat") => {
    setSelected(id)
    setMode(m)
    if (m === "chat") {
      const s = specialists.find(s => s.id === id)!
      setMessages([{ role: "assistant", content: `Hello! I am your AI ${s.label}. I am here to help with ${s.desc.toLowerCase()}. How can I assist you today?

Note: This AI assistant does not replace professional medical care for serious conditions.` }])
      setStep("chat")
    } else {
      setStep("book")
    }
  }

  const sendChat = async () => {
    if (!input.trim() || loading) return
    const newMessages: Message[] = [...messages, { role: "user", content: input }]
    setMessages(newMessages)
    setInput("")
    setLoading(true)
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: `[You are: ${systemPrompts[selected!]}]

${newMessages.map(m => `${m.role}: ${m.content}`).join("\n")}` }]
        })
      })
      const data = await res.json()
      setMessages([...newMessages, { role: "assistant", content: data.message || "Sorry, I could not respond." }])
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "Connection error. Please try again." }])
    } finally {
      setLoading(false)
    }
  }

  const submitBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, specialist_type: selected })
      })
      const data = await res.json()
      if (data.error) { setError(data.error); setLoading(false); return }
      setBookingId(data.id)
      setStep("confirm")
    } catch {
      setError("Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  // CONFIRM PAGE
  if (step === "confirm") {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto max-w-lg px-4 py-16 text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="mb-2 text-2xl font-bold">Consultation Booked!</h1>
          <p className="mb-1 text-muted-foreground">Reference:</p>
          <p className="mb-6 inline-block rounded-lg bg-green-50 px-4 py-2 font-mono font-bold text-green-600">#{bookingId.slice(0,8).toUpperCase()}</p>
          <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-5 text-left space-y-3">
            <div className="flex gap-3"><MessageCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" /><div><p className="font-medium text-sm">WhatsApp Contact</p><p className="text-sm text-muted-foreground">A {currentSpec?.label} will contact <strong>{form.phone}</strong> within {currentSpec?.wait}</p></div></div>
            <div className="flex gap-3"><Clock className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" /><div><p className="font-medium text-sm">Preferred Time</p><p className="text-sm text-muted-foreground">{form.preferred_time || "As soon as possible"}</p></div></div>
          </div>
          <Button className="w-full mb-3 bg-green-600 hover:bg-green-700 gap-2" onClick={() => window.open(`https://wa.me/2348000000000?text=Booking+%23${bookingId.slice(0,8).toUpperCase()}`, "_blank")}>
            <MessageCircle className="h-4 w-4" /> Open WhatsApp
          </Button>
          <button onClick={() => { setStep("select"); setSelected(null); setMode(null) }} className="text-sm text-muted-foreground hover:text-foreground">Book another consultation</button>
        </main>
        <AuraBot />
      </div>
    )
  }

  // CHAT PAGE
  if (step === "chat" && currentSpec) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <div className={`bg-gradient-to-r ${currentSpec.color} px-4 py-4`}>
          <div className="container mx-auto max-w-2xl flex items-center gap-4">
            <img src={currentSpec.image} alt={currentSpec.label} className="h-12 w-12 rounded-full object-cover ring-2 ring-white/50" />
            <div className="flex-1">
              <p className="font-bold text-white">{currentSpec.label}</p>
              <p className="text-xs text-white/80">{currentSpec.title} • AI-Powered</p>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1">
              <span className="h-2 w-2 rounded-full bg-green-300 animate-pulse" />
              <span className="text-xs text-white font-medium">Online</span>
            </div>
            <button onClick={() => { setStep("select"); setMessages([]) }} className="text-white/70 hover:text-white text-sm">← Back</button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4 max-w-2xl mx-auto w-full py-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
              {msg.role === "assistant" && <img src={currentSpec.image} alt="" className="h-8 w-8 rounded-full object-cover shrink-0" />}
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${msg.role === "user" ? "bg-green-600 text-white rounded-tr-sm" : "bg-muted text-foreground rounded-tl-sm"}`}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <img src={currentSpec.image} alt="" className="h-8 w-8 rounded-full object-cover shrink-0" />
              <div className="flex items-center gap-1 rounded-2xl bg-muted px-4 py-3">
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:0ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:150ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:300ms]" />
              </div>
            </div>
          )}
        </div>
        <div className="border-t p-4 max-w-2xl mx-auto w-full">
          <div className="flex gap-2">
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendChat()} placeholder={`Ask the ${currentSpec.label}...`} className="flex-1 rounded-full border border-input bg-muted px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" disabled={loading} />
            <button onClick={sendChat} disabled={loading || !input.trim()} className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-r ${currentSpec.color} text-white disabled:opacity-50`}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </button>
          </div>
          <p className="mt-2 text-center text-xs text-muted-foreground">AI assistant only • For emergencies call <strong>112</strong></p>
        </div>
      </div>
    )
  }

  // BOOKING FORM
  if (step === "book" && currentSpec) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto max-w-lg px-4 py-12">
          <button onClick={() => setStep("select")} className="mb-6 text-sm text-muted-foreground hover:text-foreground">← Back to specialists</button>
          <div className={`mb-8 rounded-2xl border-2 ${currentSpec.lightColor} p-5 flex items-center gap-4`}>
            <img src={currentSpec.image} alt={currentSpec.label} className="h-16 w-16 rounded-full object-cover ring-2 ring-white shadow-md" />
            <div>
              <p className="font-bold text-lg">{currentSpec.label}</p>
              <p className="text-sm text-muted-foreground">{currentSpec.title}</p>
              <p className="text-xs text-green-600 font-medium mt-1">Response: {currentSpec.wait} • ⭐ {currentSpec.rating}</p>
            </div>
          </div>
          <form onSubmit={submitBooking} className="space-y-4">
            <div><label className="mb-1 block text-sm font-medium">Full Name *</label><input required value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} placeholder="Your full name" className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" /></div>
            <div><label className="mb-1 block text-sm font-medium">WhatsApp Number *</label><input required value={form.phone} onChange={e => setForm(p => ({...p, phone: e.target.value}))} placeholder="+234 800 000 0000" className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" /><p className="mt-1 text-xs text-muted-foreground">The specialist will contact you here</p></div>
            <div><label className="mb-1 block text-sm font-medium">Email (optional)</label><input value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))} placeholder="your@email.com" type="email" className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" /></div>
            <div><label className="mb-1 block text-sm font-medium">Describe your symptoms or question *</label><textarea required value={form.symptoms} onChange={e => setForm(p => ({...p, symptoms: e.target.value}))} placeholder="Describe what you are experiencing..." rows={4} className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" /></div>
            <div><label className="mb-1 block text-sm font-medium">Preferred time</label><select value={form.preferred_time} onChange={e => setForm(p => ({...p, preferred_time: e.target.value}))} className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"><option value="">As soon as possible</option><option value="Morning (8am-12pm)">Morning (8am-12pm)</option><option value="Afternoon (12pm-4pm)">Afternoon (12pm-4pm)</option><option value="Evening (4pm-8pm)">Evening (4pm-8pm)</option></select></div>
            <div><label className="mb-1 block text-sm font-medium">Urgency</label><div className="grid grid-cols-2 gap-2"><button type="button" onClick={() => setForm(p => ({...p, urgency: "normal"}))} className={`rounded-xl border-2 px-3 py-2.5 text-sm font-medium ${form.urgency === "normal" ? "border-green-500 bg-green-50 text-green-700" : "border-border text-muted-foreground"}`}>Normal</button><button type="button" onClick={() => setForm(p => ({...p, urgency: "urgent"}))} className={`rounded-xl border-2 px-3 py-2.5 text-sm font-medium ${form.urgency === "urgent" ? "border-red-500 bg-red-50 text-red-700" : "border-border text-muted-foreground"}`}>Urgent</button></div></div>
            {error && <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div>}
            <Button type="submit" disabled={loading} className="w-full h-12 text-base rounded-xl bg-green-600 hover:bg-green-700 gap-2">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Calendar className="h-4 w-4" />}
              Book Consultation
            </Button>
            <p className="text-center text-xs text-muted-foreground">For emergencies call <strong>112</strong> immediately</p>
          </form>
        </main>
        <AuraBot />
      </div>
    )
  }

  // SELECT PAGE
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green-600 to-emerald-700 px-4 py-16 text-white">
        <div className="absolute inset-0 opacity-10">
          <img src="https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=1200&q=60&fit=crop" alt="" className="h-full w-full object-cover" />
        </div>
        <div className="container mx-auto max-w-3xl relative z-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium">
            <Phone className="h-4 w-4" /> Real Healthcare Professionals
          </div>
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">Consult a Specialist</h1>
          <p className="text-xl text-green-100">Book a real consultation or chat instantly with our AI-powered healthcare team. Available 24/7 across Nigeria.</p>
        </div>
      </div>

      <main className="container mx-auto max-w-4xl px-4 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {specialists.map(s => (
            <div key={s.id} className={`rounded-3xl border-2 ${s.lightColor} overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1`}>
              {/* Image */}
              <div className={`relative h-56 bg-gradient-to-b ${s.color}`}>
                <img src={s.image} alt={s.label} className="h-full w-full object-cover object-top mix-blend-overlay opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium mb-1 ${s.badge}`}>Available Now</span>
                  <p className="text-white font-bold text-lg">{s.label}</p>
                  <p className="text-white/80 text-xs">{s.title}</p>
                </div>
                <div className="absolute top-3 right-3 rounded-full bg-white/20 backdrop-blur px-2 py-1 flex items-center gap-1">
                  <span className="text-yellow-300 text-xs">★</span>
                  <span className="text-white text-xs font-bold">{s.rating}</span>
                </div>
              </div>

              {/* Info */}
              <div className="p-5">
                <p className="text-sm text-muted-foreground mb-1">{s.longDesc}</p>
                <div className="flex items-center gap-2 mt-3 mb-4">
                  <Clock className="h-3.5 w-3.5 text-green-600" />
                  <span className="text-xs text-green-600 font-medium">Response: {s.wait}</span>
                  <span className="text-xs text-muted-foreground">• {s.consultations} consultations</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button size="sm" variant="outline" className="rounded-xl text-xs h-9 border-2" onClick={() => startConsult(s.id, "chat")}>
                    Chat with AI
                  </Button>
                  <Button size="sm" className={`rounded-xl text-xs h-9 bg-gradient-to-r ${s.color} text-white border-0 hover:opacity-90`} onClick={() => startConsult(s.id, "book")}>
                    Book Real Call
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl bg-red-50 border border-red-200 p-5 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-700 text-sm">Medical Emergency?</p>
            <p className="text-sm text-red-600 mt-0.5">Do not use this service for emergencies. Call <strong>112</strong> or go to your nearest hospital immediately.</p>
          </div>
        </div>
      </main>
      <AuraBot />
    </div>
  )
}
