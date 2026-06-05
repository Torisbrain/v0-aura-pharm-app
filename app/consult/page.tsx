"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AuraBot } from "@/components/aura-bot"
import { 
  Stethoscope, Pill, Heart, CheckCircle, 
  Loader2, Phone, Clock, AlertTriangle,
  MessageCircle, Calendar
} from "lucide-react"

const specialists = [
  { 
    id: "pharmacist", 
    label: "Pharmacist", 
    icon: Pill, 
    color: "bg-green-100 text-green-700",
    border: "border-green-200",
    desc: "Drug questions, interactions, dosages, NAFDAC",
    wait: "~30 mins",
    available: true
  },
  { 
    id: "doctor", 
    label: "General Doctor", 
    icon: Stethoscope, 
    color: "bg-blue-100 text-blue-700",
    border: "border-blue-200",
    desc: "Symptoms, diagnosis guidance, prescriptions",
    wait: "~1 hour",
    available: true
  },
  { 
    id: "nurse", 
    label: "Nurse", 
    icon: Heart, 
    color: "bg-pink-100 text-pink-700",
    border: "border-pink-200",
    desc: "Patient care, wound care, health advice",
    wait: "~20 mins",
    available: true
  },
]

export default function ConsultPage() {
  const [step, setStep] = useState<"select" | "book" | "confirm">("select")
  const [selected, setSelected] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [bookingId, setBookingId] = useState("")
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    symptoms: "",
    preferred_time: "",
    urgency: "normal"
  })

  const selectSpecialist = (id: string) => {
    setSelected(id)
    setStep("book")
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          specialist_type: selected
        })
      })
      const data = await res.json()
      if (data.error) {
        setError(data.error)
        setLoading(false)
        return
      }
      setBookingId(data.id)
      setStep("confirm")
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const currentSpecialist = specialists.find(s => s.id === selected)

  if (step === "confirm") {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto max-w-lg px-4 py-16">
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="mb-4 text-2xl font-bold text-foreground">Consultation Booked!</h1>
            <p className="mb-2 text-muted-foreground">Your booking reference:</p>
            <p className="mb-6 font-mono text-sm font-bold text-green-600 bg-green-50 rounded-lg px-4 py-2 inline-block">
              #{bookingId.slice(0, 8).toUpperCase()}
            </p>

            <Card className="mb-6 text-left border-green-200">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <MessageCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">WhatsApp Contact</p>
                    <p className="text-sm text-muted-foreground">A {currentSpecialist?.label} will contact you on <strong>{form.phone}</strong> via WhatsApp within {currentSpecialist?.wait}.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Response Time</p>
                    <p className="text-sm text-muted-foreground">Expected response: {currentSpecialist?.wait}. {form.preferred_time && `You requested: ${form.preferred_time}`}</p>
                  </div>
                </div>
                {form.urgency === "urgent" && (
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm text-red-600">Urgent Request</p>
                      <p className="text-sm text-muted-foreground">Your case has been flagged as urgent. For life-threatening emergencies, call <strong>112</strong> immediately.</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Button className="w-full gap-2 bg-green-600 hover:bg-green-700" onClick={() => window.open(`https://wa.me/2348000000000?text=Hi, my booking reference is %23${bookingId.slice(0,8).toUpperCase()}. I need to consult a ${currentSpecialist?.label}.`, '_blank')}>
                <MessageCircle className="h-4 w-4" />
                Open WhatsApp
              </Button>
              <Button variant="outline" className="w-full" onClick={() => { setStep("select"); setSelected(null); setForm({ name: "", phone: "", email: "", symptoms: "", preferred_time: "", urgency: "normal" }) }}>
                Book Another Consultation
              </Button>
            </div>

            <p className="mt-6 text-xs text-muted-foreground">
              For medical emergencies, call <strong>112</strong> or go to your nearest hospital immediately.
            </p>
          </div>
        </main>
        <AuraBot />
      </div>
    )
  }

  if (step === "book" && currentSpecialist) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto max-w-lg px-4 py-12">
          <button onClick={() => setStep("select")} className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            ← Back to specialists
          </button>

          <div className={`mb-6 flex items-center gap-3 rounded-xl border-2 ${currentSpecialist.border} p-4`}>
            <div className={`flex h-12 w-12 items-center justify-center rounded-full ${currentSpecialist.color}`}>
              <currentSpecialist.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold">{currentSpecialist.label}</p>
              <p className="text-xs text-muted-foreground">{currentSpecialist.desc}</p>
              <p className="text-xs text-green-600 font-medium">Estimated response: {currentSpecialist.wait}</p>
            </div>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Full Name *</label>
              <input
                required
                value={form.name}
                onChange={e => setForm(p => ({...p, name: e.target.value}))}
                placeholder="Your full name"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">WhatsApp Number *</label>
              <input
                required
                value={form.phone}
                onChange={e => setForm(p => ({...p, phone: e.target.value}))}
                placeholder="+234 800 000 0000"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <p className="mt-1 text-xs text-muted-foreground">The specialist will contact you here</p>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Email (optional)</label>
              <input
                value={form.email}
                onChange={e => setForm(p => ({...p, email: e.target.value}))}
                placeholder="your@email.com"
                type="email"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Describe your symptoms or question *</label>
              <textarea
                required
                value={form.symptoms}
                onChange={e => setForm(p => ({...p, symptoms: e.target.value}))}
                placeholder="Describe what you are experiencing or what you need help with..."
                rows={4}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Preferred consultation time</label>
              <select
                value={form.preferred_time}
                onChange={e => setForm(p => ({...p, preferred_time: e.target.value}))}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">As soon as possible</option>
                <option value="Morning (8am - 12pm)">Morning (8am - 12pm)</option>
                <option value="Afternoon (12pm - 4pm)">Afternoon (12pm - 4pm)</option>
                <option value="Evening (4pm - 8pm)">Evening (4pm - 8pm)</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Urgency</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setForm(p => ({...p, urgency: "normal"}))}
                  className={`rounded-lg border-2 px-3 py-2 text-sm font-medium transition-colors ${form.urgency === "normal" ? "border-green-500 bg-green-50 text-green-700" : "border-border text-muted-foreground hover:bg-muted"}`}
                >
                  Normal
                </button>
                <button
                  type="button"
                  onClick={() => setForm(p => ({...p, urgency: "urgent"}))}
                  className={`rounded-lg border-2 px-3 py-2 text-sm font-medium transition-colors ${form.urgency === "urgent" ? "border-red-500 bg-red-50 text-red-700" : "border-border text-muted-foreground hover:bg-muted"}`}
                >
                  Urgent
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
            )}

            <Button type="submit" disabled={loading} className="w-full gap-2 bg-green-600 hover:bg-green-700">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Calendar className="h-4 w-4" />}
              Book Consultation
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              For emergencies, call <strong>112</strong> immediately
            </p>
          </form>
        </main>
        <AuraBot />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto max-w-2xl px-4 py-16">
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
            <Phone className="h-4 w-4" /> Real Healthcare Professionals
          </div>
          <h1 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">Consult a Specialist</h1>
          <p className="text-lg text-muted-foreground">Book a real consultation with a licensed healthcare professional. They will contact you via WhatsApp.</p>
        </div>

        <div className="space-y-4 mb-8">
          {specialists.map(s => (
            <Card
              key={s.id}
              className={`cursor-pointer border-2 hover:shadow-md transition-all hover:-translate-y-0.5 ${s.border}`}
              onClick={() => selectSpecialist(s.id)}
            >
              <CardContent className="p-6 flex items-center gap-4">
                <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${s.color}`}>
                  <s.icon className="h-7 w-7" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-lg">{s.label}</p>
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">Available</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                  <p className="mt-1 text-xs text-green-600 font-medium flex items-center gap-1">
                    <Clock className="h-3 w-3" /> Response time: {s.wait}
                  </p>
                </div>
                <span className="text-green-600 font-medium text-sm">Book →</span>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="rounded-xl bg-muted/50 border border-border p-6 text-center">
          <AlertTriangle className="mx-auto mb-2 h-6 w-6 text-yellow-600" />
          <p className="text-sm font-medium">Medical Emergency?</p>
          <p className="text-sm text-muted-foreground mt-1">Do not use this service for emergencies. Call <strong>112</strong> or go to your nearest hospital immediately.</p>
        </div>
      </main>
      <AuraBot />
    </div>
  )
}
