cat > components/features.tsx << 'ENDOFFILE'
"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { BarChart3, AlertTriangle, Bell, Shield, Search, Loader2, CheckCircle, Package, TrendingUp, TrendingDown } from "lucide-react"

function InventoryDemo() {
  const inventory = [
    { name: "Amoxicillin 500mg", stock: 12, status: "critical", trend: "down" },
    { name: "Paracetamol 500mg", stock: 340, status: "ok", trend: "up" },
    { name: "Coartem 20/120mg", stock: 8, status: "critical", trend: "down" },
    { name: "Metformin 500mg", stock: 60, status: "warning", trend: "down" },
    { name: "Lisinopril 10mg", stock: 180, status: "ok", trend: "up" },
    { name: "Omeprazole 20mg", stock: 25, status: "warning", trend: "down" },
  ]
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">AI-powered stock forecast. Red = reorder now.</p>
      {inventory.map((item) => (
        <div key={item.name} className={"flex items-center justify-between rounded-lg border p-3 " + (item.status === "critical" ? "border-red-200 bg-red-50" : item.status === "warning" ? "border-yellow-200 bg-yellow-50" : "border-green-200 bg-green-50")}>
          <div className="flex items-center gap-2">
            <Package className={"h-4 w-4 " + (item.status === "critical" ? "text-red-500" : item.status === "warning" ? "text-yellow-500" : "text-green-500")} />
            <span className="text-sm font-medium">{item.name}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className={"font-bold " + (item.status === "critical" ? "text-red-600" : item.status === "warning" ? "text-yellow-600" : "text-green-600")}>{item.stock} units</span>
            {item.trend === "down" ? <TrendingDown className="h-4 w-4 text-red-400" /> : <TrendingUp className="h-4 w-4 text-green-400" />}
            {item.status !== "ok" && <span className={"rounded-full px-2 py-0.5 text-xs font-medium " + (item.status === "critical" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700")}>{item.status === "critical" ? "Reorder Now" : "Low Soon"}</span>}
          </div>
        </div>
      ))}
      <Button className="w-full mt-2" size="sm">Generate Full Restock Report</Button>
    </div>
  )
}

function InteractionDemo() {
  const [drug1, setDrug1] = useState("")
  const [drug2, setDrug2] = useState("")
  const [result, setResult] = useState(null as null | { safe: boolean; message: string; severity: string })
  const [loading, setLoading] = useState(false)
  const known = {
    "warfarin+aspirin": { safe: false, message: "HIGH RISK: Warfarin + Aspirin significantly increases bleeding risk.", severity: "high" },
    "metformin+alcohol": { safe: false, message: "WARNING: Metformin + Alcohol increases risk of lactic acidosis.", severity: "moderate" },
    "amoxicillin+metronidazole": { safe: true, message: "Generally safe combination. Monitor for GI side effects.", severity: "none" },
    "lisinopril+potassium": { safe: false, message: "CAUTION: Can cause dangerous hyperkalemia. Monitor potassium.", severity: "high" },
    "paracetamol+ibuprofen": { safe: true, message: "Safe at normal doses. Better pain relief than either alone.", severity: "none" },
    "ciprofloxacin+antacid": { safe: false, message: "WARNING: Antacids reduce Ciprofloxacin absorption by 90%. Give 2hrs apart.", severity: "moderate" },
  } as Record<string, { safe: boolean; message: string; severity: string }>
  const check = () => {
    if (!drug1.trim() || !drug2.trim()) return
    setLoading(true)
    setTimeout(() => {
      const k1 = drug1.toLowerCase().trim() + "+" + drug2.toLowerCase().trim()
      const k2 = drug2.toLowerCase().trim() + "+" + drug1.toLowerCase().trim()
      setResult(known[k1] || known[k2] || { safe: true, message: "No known major interactions found. Always verify with a pharmacist.", severity: "none" })
      setLoading(false)
    }, 1000)
  }
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Enter two drug names to check for dangerous interactions.</p>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Drug 1</label>
          <input value={drug1} onChange={e => setDrug1(e.target.value)} placeholder="e.g. Warfarin" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Drug 2</label>
          <input value={drug2} onChange={e => setDrug2(e.target.value)} placeholder="e.g. Aspirin" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
      </div>
      <Button onClick={check} disabled={loading || !drug1.trim() || !drug2.trim()} className="w-full gap-2">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
        Check Interaction
      </Button>
      {result && (
        <div className={"rounded-lg border p-4 " + (result.severity === "high" ? "border-red-200 bg-red-50" : result.severity === "moderate" ? "border-yellow-200 bg-yellow-50" : "border-green-200 bg-green-50")}>
          <div className="flex items-start gap-2">
            {result.safe ? <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-600" /> : <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />}
            <p className={"text-sm font-medium " + (result.severity === "high" ? "text-red-700" : result.severity === "moderate" ? "text-yellow-700" : "text-green-700")}>{result.message}</p>
          </div>
        </div>
      )}
      <p className="text-xs text-muted-foreground">Try: warfarin + aspirin, ciprofloxacin + antacid</p>
    </div>
  )
}

function AdherenceDemo() {
  const [phone, setPhone] = useState("")
  const [drug, setDrug] = useState("")
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const patients = [
    { name: "Mrs. Adaeze Obi", drug: "Metformin 500mg", adherence: 94, lastTaken: "Today 8:00am", status: "good" },
    { name: "Mr. Emeka Nwosu", drug: "Lisinopril 10mg", adherence: 61, lastTaken: "2 days ago", status: "poor" },
    { name: "Mrs. Fatima Bello", drug: "Coartem", adherence: 80, lastTaken: "Yesterday", status: "ok" },
  ]
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Monitor patient adherence and send SMS reminders.</p>
      <div className="space-y-2">
        {patients.map(p => (
          <div key={p.name} className={"flex items-center justify-between rounded-lg border p-3 " + (p.status === "poor" ? "border-red-200 bg-red-50" : p.status === "ok" ? "border-yellow-200 bg-yellow-50" : "border-green-200 bg-green-50")}>
            <div>
              <div className="text-sm font-medium">{p.name}</div>
              <div className="text-xs text-muted-foreground">{p.drug} · Last: {p.lastTaken}</div>
            </div>
            <div className="text-right">
              <div className={"text-sm font-bold " + (p.status === "poor" ? "text-red-600" : p.status === "ok" ? "text-yellow-600" : "text-green-600")}>{p.adherence}%</div>
              {p.status === "poor" && <span className="text-xs text-red-600">Needs reminder</span>}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t pt-4">
        <p className="mb-2 text-sm font-medium">Send SMS Reminder</p>
        <div className="grid grid-cols-2 gap-2">
          <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+234 phone number" className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          <input value={drug} onChange={e => setDrug(e.target.value)} placeholder="Drug name" className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <Button onClick={() => { setLoading(true); setTimeout(() => { setSent(true); setLoading(false) }, 1200) }} disabled={loading || sent || !phone.trim() || !drug.trim()} className="mt-2 w-full gap-2" size="sm">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : sent ? <CheckCircle className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
          {sent ? "Reminder Sent!" : "Send SMS Reminder"}
        </Button>
        {sent && <p className="mt-2 text-center text-xs text-green-600">SMS reminder queued for {phone}</p>}
      </div>
    </div>
  )
}

type FeatureKey = "Inventory AI" | "Interaction Checker" | "Adherence Nudges" | "PharmVerify"

const featureConfig: { icon: React.ElementType; title: FeatureKey; description: string; color: string; href?: string }[] = [
  { icon: BarChart3, title: "Inventory AI", description: "Demand forecasting and intelligent restock alerts. Know what to order before you run out, reducing stockouts and overstock costs.", color: "bg-blue-500/10 text-blue-600" },
  { icon: AlertTriangle, title: "Interaction Checker", description: "Real-time drug interaction queries at point of dispensing. Protect your patients with instant safety alerts for dangerous combinations.", color: "bg-orange-500/10 text-orange-600" },
  { icon: Bell, title: "Adherence Nudges", description: "SMS and USSD reminders for chronic patients. Improve medication adherence with automated, personalized follow-up messages.", color: "bg-purple-500/10 text-purple-600" },
  { icon: Shield, title: "PharmVerify", description: "AI-powered counterfeit medicine detection. Scan products to get instant authenticity scores and protect your patients from fake drugs.", color: "bg-green-500/10 text-green-600", href: "#pharmverify" },
]

function DemoContent({ title }: { title: FeatureKey }) {
  if (title === "Inventory AI") return <InventoryDemo />
  if (title === "Interaction Checker") return <InteractionDemo />
  if (title === "Adherence Nudges") return <AdherenceDemo />
  return null
}

export function Features() {
  const [open, setOpen] = useState(null as FeatureKey | null)
  return (
    <section id="features" className="bg-background px-4 py-20">
      <div className="container mx-auto">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">Everything Your Pharmacy Needs</h2>
          <p className="text-pretty text-lg text-muted-foreground">Purpose-built tools for West African pharmacies, designed to work reliably on any network connection.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {featureConfig.map((feature) => (
            <Card key={feature.title} onClick={() => feature.href ? document.querySelector(feature.href)?.scrollIntoView({ behavior: "smooth" }) : setOpen(feature.title)} className="cursor-pointer border-border/50 bg-card transition-all hover:shadow-lg hover:-translate-y-1 active:scale-95">
              <CardHeader>
                <div className={"mb-4 flex h-12 w-12 items-center justify-center rounded-lg " + feature.color}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
                <p className="mt-3 text-xs font-medium text-primary">{feature.href ? "View demo ↓" : "Try demo →"}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <Dialog open={!!open} onOpenChange={() => setOpen(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{open} — Live Demo</DialogTitle>
          </DialogHeader>
          {open && <DemoContent title={open} />}
        </DialogContent>
      </Dialog>
    </section>
  )
}
ENDOFFILE

git add components/features.tsx
git commit -m "feat: clickable feature demos - inventory, interactions, adherence"
git push origin main
