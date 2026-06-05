"use client"
import { useState } from "react"
import { Header } from "@/components/header"
import { AuraBot } from "@/components/aura-bot"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Loader2, CheckCircle, AlertTriangle, Shield } from "lucide-react"

export default function InteractionsPage() {
  const [drug1, setDrug1] = useState("")
  const [drug2, setDrug2] = useState("")
  const [result, setResult] = useState<null | { safe: boolean; message: string; severity: string }>(null)
  const [loading, setLoading] = useState(false)

  const check = async () => {
    if (!drug1.trim() || !drug2.trim()) return
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{
            role: "user",
            content: `Check drug interaction between ${drug1} and ${drug2}. Reply with: SAFE: yes/no | SEVERITY: none/moderate/high | INFO: brief explanation in 2-3 sentences`
          }]
        })
      })
      const data = await res.json()
      const text = data.message || ""
      const isSafe = text.toLowerCase().includes("safe: yes")
      const isHigh = text.toLowerCase().includes("severity: high")
      const isMod = text.toLowerCase().includes("severity: moderate")
      const infoMatch = text.match(/INFO:\s*(.+)/i)
      setResult({
        safe: isSafe,
        message: infoMatch ? infoMatch[1] : text,
        severity: isHigh ? "high" : isMod ? "moderate" : "none"
      })
    } catch {
      setResult({ safe: false, message: "Could not check. Please consult a pharmacist.", severity: "none" })
    } finally {
      setLoading(false)
    }
  }

  const examples = [
    { d1: "Warfarin", d2: "Aspirin" },
    { d1: "Metformin", d2: "Alcohol" },
    { d1: "Ciprofloxacin", d2: "Antacid" },
    { d1: "Paracetamol", d2: "Ibuprofen" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto max-w-2xl px-4 py-16">
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-700">
            <Shield className="h-4 w-4" /> AI Drug Interaction Checker
          </div>
          <h1 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">Check Drug Interactions</h1>
          <p className="text-lg text-muted-foreground">Enter any two medications to instantly check for dangerous interactions. Powered by AI.</p>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Drug 1</label>
                <input value={drug1} onChange={e => setDrug1(e.target.value)} placeholder="e.g. Warfarin" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Drug 2</label>
                <input value={drug2} onChange={e => setDrug2(e.target.value)} placeholder="e.g. Aspirin" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" onKeyDown={e => e.key === "Enter" && check()} />
              </div>
            </div>
            <Button onClick={check} disabled={loading || !drug1.trim() || !drug2.trim()} className="w-full gap-2">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              Check Interaction
            </Button>
          </CardContent>
        </Card>

        {result && (
          <Card className={`mb-6 border-2 ${result.severity === "high" ? "border-red-200" : result.severity === "moderate" ? "border-yellow-200" : "border-green-200"}`}>
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                {result.safe ? <CheckCircle className="h-6 w-6 text-green-600 shrink-0 mt-0.5" /> : <AlertTriangle className="h-6 w-6 text-red-600 shrink-0 mt-0.5" />}
                <div>
                  <p className={`font-semibold mb-1 ${result.severity === "high" ? "text-red-700" : result.severity === "moderate" ? "text-yellow-700" : "text-green-700"}`}>
                    {result.safe ? "No Major Interaction Found" : result.severity === "high" ? "High Risk Interaction!" : "Moderate Interaction - Use Caution"}
                  </p>
                  <p className="text-sm text-muted-foreground">{result.message}</p>
                  <p className="mt-3 text-xs text-muted-foreground italic">Always confirm with a licensed pharmacist for patient-specific advice.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div>
          <p className="mb-3 text-sm font-medium text-muted-foreground">Common combinations to check:</p>
          <div className="grid grid-cols-2 gap-2">
            {examples.map((ex, i) => (
              <button key={i} onClick={() => { setDrug1(ex.d1); setDrug2(ex.d2); setResult(null) }} className="rounded-lg border border-border bg-muted/50 px-3 py-2 text-left text-xs hover:bg-muted transition-colors">
                <span className="font-medium">{ex.d1}</span> + <span className="font-medium">{ex.d2}</span>
              </button>
            ))}
          </div>
        </div>
      </main>
      <AuraBot />
    </div>
  )
}
