"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, CheckCircle, Camera, QrCode, Search, Loader2, XCircle, AlertTriangle, Zap, Lock } from "lucide-react"

let Html5Qrcode: any = null
let Html5QrcodeSupportedFormats: any = null

const CREDIT_BUNDLES = [
  { id: "starter", label: "50 verifications", credits: 50, amount: 500, display: "₦500" },
  { id: "pro", label: "200 verifications", credits: 200, amount: 1500, display: "₦1,500" },
  { id: "unlimited", label: "1000 verifications", credits: 1000, amount: 5000, display: "₦5,000" },
]

interface NAFDACResult {
  name: string
  registrationNumber: string
  manufacturer: string
  approvalDate: string
  strength?: string
  status: "verified" | "not_found" | "suspicious"
  smpc?: string
}

async function lookupNAFDAC(query: string): Promise<NAFDACResult> {
  const res = await fetch("/api/nafdac", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: query.trim() }),
  })
  if (!res.ok) return { name: query, registrationNumber: "—", manufacturer: "—", approvalDate: "—", status: "not_found" }
  const data = await res.json()
  return {
    name: data.name ?? query,
    registrationNumber: data.registrationNumber ?? "—",
    manufacturer: data.manufacturer ?? "—",
    approvalDate: data.approvalDate ?? "—",
    strength: data.activeIngredients,
    status: data.status === "verified" ? "verified" : data.status === "suspicious" ? "suspicious" : "not_found",
    smpc: data.smpc,
  }
}

// Stable session ID for anonymous users
function getSessionId() {
  if (typeof window === "undefined") return ""
  let id = localStorage.getItem("aura_session")
  if (!id) { id = `anon_${Date.now()}_${Math.random().toString(36).slice(2)}`; localStorage.setItem("aura_session", id) }
  return id
}

function loadPaystack() {
  return new Promise<void>(resolve => {
    if ((window as any).PaystackPop) return resolve()
    const s = document.createElement("script")
    s.src = "https://js.paystack.co/v1/inline.js"
    s.onload = () => resolve()
    document.head.appendChild(s)
  })
}

export function PharmVerifyDemo() {
  const [mode, setMode] = useState<"idle" | "scanning">("idle")
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<NAFDACResult | null>(null)
  const [scanError, setScanError] = useState("")
  const scannerRef = useRef<any>(null)
  const scannerDivId = "pharm-qr-scanner"

  const [usageCount, setUsageCount] = useState(0)
  const [credits, setCredits] = useState(0)
  const [showPaywall, setShowPaywall] = useState(false)
  const [paywallEmail, setPaywallEmail] = useState("")
  const [buyLoading, setBuyLoading] = useState<string | null>(null)
  const [buySuccess, setBuySuccess] = useState(false)

  const FREE_LIMIT = 5

  useEffect(() => {
    import("html5-qrcode").then(mod => {
      Html5Qrcode = mod.Html5Qrcode
      Html5QrcodeSupportedFormats = mod.Html5QrcodeSupportedFormats
    })
    fetchUsage()
  }, [])

  const fetchUsage = async () => {
    const session = getSessionId()
    const res = await fetch(`/api/usage?session=${session}`)
    const data = await res.json()
    setUsageCount(data.count)
    setCredits(data.credits)
  }

  const trackAndVerify = async (query: string) => {
    const session = getSessionId()
    const overLimit = usageCount >= FREE_LIMIT

    if (overLimit && credits <= 0) {
      setShowPaywall(true)
      return
    }

    // Track usage
    const trackRes = await fetch("/api/usage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userKey: session, useCredit: overLimit }),
    })
    const trackData = await trackRes.json()

    if (trackData.error === "limit_reached" || trackData.error === "no_credits") {
      setShowPaywall(true)
      return
    }

    setUsageCount(trackData.count)
    if (overLimit) setCredits(c => c - 1)
    runLookup(query)
  }

  const runLookup = async (query: string) => {
    if (!query.trim()) return
    setLoading(true)
    setResult(null)
    try {
      setResult(await lookupNAFDAC(query.trim()))
    } finally {
      setLoading(false)
    }
  }

  const buyBundle = async (bundleId: string) => {
    if (!paywallEmail.trim()) return
    setBuyLoading(bundleId)
    const bundle = CREDIT_BUNDLES.find(b => b.id === bundleId)!
    await loadPaystack()
    const handler = (window as any).PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "pk_test_0e46245f77b55a611e54114577e72ce540945e26",
      email: paywallEmail,
      amount: bundle.amount * 100,
      currency: "NGN",
      ref: `AURA-CREDITS-${Date.now()}`,
      callback: async (res: any) => {
        const session = getSessionId()
        await fetch("/api/credits", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reference: res.reference, userKey: session, bundleId }),
        })
        setCredits(c => c + bundle.credits)
        setBuySuccess(true)
        setBuyLoading(null)
        setTimeout(() => { setShowPaywall(false); setBuySuccess(false) }, 2000)
      },
      onClose: () => setBuyLoading(null),
    })
    handler.openIframe()
  }

  const startScanner = async () => {
    setScanError("")
    setResult(null)
    setMode("scanning")
    await new Promise(r => setTimeout(r, 150))
    if (!Html5Qrcode) { setScanError("Scanner not loaded yet. Try again."); setMode("idle"); return }
    try {
      const formats = Html5QrcodeSupportedFormats
        ? Object.values(Html5QrcodeSupportedFormats).filter((v): v is number => typeof v === "number")
        : undefined
      const scanner = new Html5Qrcode(scannerDivId, { formatsToSupport: formats, verbose: false })
      scannerRef.current = scanner
      await scanner.start(
        { facingMode: "environment" },
        { fps: 30, qrbox: { width: 320, height: 160 }, aspectRatio: 1.7, disableFlip: false, experimentalFeatures: { useBarCodeDetectorIfSupported: true } },
        async (decodedText: string) => {
          await stopScanner()
          setSearchQuery(decodedText)
          trackAndVerify(decodedText)
        },
        undefined
      )
    } catch (err: any) {
      setScanError(err?.message?.includes("Permission") ? "Camera access denied." : "Could not start camera. Try manual search.")
      setMode("idle")
    }
  }

  const stopScanner = async () => {
    try { if (scannerRef.current) { await scannerRef.current.stop(); scannerRef.current = null } } catch (_) {}
    setMode("idle")
  }

  const reset = () => { stopScanner(); setResult(null); setSearchQuery(""); setScanError(""); setMode("idle") }

  const statusConfig = {
    verified: { icon: <CheckCircle className="h-5 w-5 text-accent" />, label: "NAFDAC Verified", score: "98%", bg: "bg-accent/10", text: "text-accent" },
    not_found: { icon: <AlertTriangle className="h-5 w-5 text-yellow-600" />, label: "Not in Database", score: "—", bg: "bg-yellow-50", text: "text-yellow-700" },
    suspicious: { icon: <XCircle className="h-5 w-5 text-red-600" />, label: "Suspicious Product", score: "12%", bg: "bg-red-50", text: "text-red-700" },
  }

  const remaining = Math.max(0, FREE_LIMIT - usageCount)

  return (
    <section id="pharmverify" className="bg-muted/50 px-4 py-20">

      {/* PAYWALL MODAL */}
      {showPaywall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-background p-6 shadow-2xl">
            {buySuccess ? (
              <div className="text-center py-4">
                <CheckCircle className="mx-auto h-12 w-12 text-green-600 mb-3" />
                <p className="font-bold text-lg">Credits Added!</p>
                <p className="text-sm text-muted-foreground">Your verifications are ready.</p>
              </div>
            ) : (
              <>
                <div className="mb-4 text-center">
                  <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-orange-100">
                    <Lock className="h-7 w-7 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-bold">Free limit reached</h3>
                  <p className="text-sm text-muted-foreground mt-1">You've used your 5 free verifications today. Top up to continue.</p>
                </div>

                <div className="mb-4">
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Your email (for receipt)</label>
                  <input
                    type="email"
                    value={paywallEmail}
                    onChange={e => setPaywallEmail(e.target.value)}
                    placeholder="you@pharmacy.com"
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div className="space-y-2 mb-4">
                  {CREDIT_BUNDLES.map(bundle => (
                    <button
                      key={bundle.id}
                      onClick={() => buyBundle(bundle.id)}
                      disabled={!!buyLoading || !paywallEmail.trim()}
                      className="w-full flex items-center justify-between rounded-xl border-2 border-border px-4 py-3 hover:border-green-500 hover:bg-green-50 transition-colors disabled:opacity-50"
                    >
                      <div className="text-left">
                        <p className="font-semibold text-sm">{bundle.display}</p>
                        <p className="text-xs text-muted-foreground">{bundle.label}</p>
                      </div>
                      {buyLoading === bundle.id
                        ? <Loader2 className="h-4 w-4 animate-spin text-green-600" />
                        : <Zap className="h-4 w-4 text-green-600" />
                      }
                    </button>
                  ))}
                </div>

                <button onClick={() => setShowPaywall(false)} className="w-full text-sm text-muted-foreground hover:text-foreground">
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <div className="container mx-auto">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-sm font-medium text-accent">
              <Shield className="h-4 w-4" /> PharmVerify Technology
            </div>
            <h2 className="mb-6 text-3xl font-bold tracking-tight text-foreground md:text-4xl">Detect Counterfeit Medicines Instantly</h2>
            <p className="mb-6 text-lg text-muted-foreground">Counterfeit medicines are a major public health threat in West Africa. PharmVerify uses AI and the NAFDAC database to verify product authenticity in seconds.</p>
            <ul className="mb-8 space-y-4">
              {["Scan barcode or enter drug name / NAFDAC number","Checks against official NAFDAC Greenbook database","Get instant authenticity result","Report suspicious products directly"].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
            <Button size="lg" className="gap-2 bg-accent hover:bg-accent/90" onClick={startScanner} disabled={mode === "scanning"}>
              <Camera className="h-4 w-4" /> Try PharmVerify Demo
            </Button>
          </div>

          <div className="flex justify-center">
            <Card className="w-full max-w-sm border-2 border-accent/20 bg-card shadow-xl">
              <CardHeader className="border-b bg-accent/5 text-center">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-accent">
                  <Shield className="h-6 w-6 text-accent-foreground" />
                </div>
                <CardTitle className="text-lg">NAFDAC Drug Verification</CardTitle>
                <p className="text-xs text-muted-foreground">Powered by NAFDAC Greenbook Database</p>

                {/* Usage indicator */}
                <div className="mt-2 flex items-center justify-center gap-2">
                  {credits > 0 ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                      <Zap className="h-3 w-3" /> {credits} credits remaining
                    </span>
                  ) : (
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${remaining > 0 ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"}`}>
                      {remaining > 0 ? `${remaining} free verifications left today` : "Free limit reached — top up to continue"}
                    </span>
                  )}
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <div className="mb-4 overflow-hidden rounded-lg border-2 border-dashed border-border bg-black">
                  {mode === "scanning" ? (
                    <div className="relative">
                      <div id={scannerDivId} className="w-full" />
                      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                        <div className="h-16 w-64 rounded border-2 border-green-400 shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]">
                          <div className="h-full w-full animate-pulse rounded border border-green-300/40" />
                        </div>
                      </div>
                      <button onClick={stopScanner} className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white">
                        <XCircle className="h-5 w-5" />
                      </button>
                      <p className="absolute bottom-2 left-0 right-0 text-center text-xs text-white/80">Align barcode within the green box</p>
                    </div>
                  ) : (
                    <button onClick={startScanner} className="flex w-full flex-col items-center justify-center gap-2 py-10 hover:bg-accent/5">
                      <QrCode className="h-12 w-12 text-muted-foreground/50" />
                      <p className="text-sm text-muted-foreground">Tap to scan barcode</p>
                      <p className="text-xs text-muted-foreground/60">or search manually below</p>
                    </button>
                  )}
                </div>

                {scanError && <p className="mb-3 rounded-md bg-yellow-50 px-3 py-2 text-xs text-yellow-700">⚠️ {scanError}</p>}

                <form onSubmit={e => { e.preventDefault(); trackAndVerify(searchQuery) }} className="mb-4 flex gap-2">
                  <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Drug name, NAFDAC No, or ingredient" className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                  <Button type="submit" size="sm" disabled={loading || !searchQuery.trim()} className="bg-accent hover:bg-accent/90">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  </Button>
                </form>

                {loading && <div className="flex items-center justify-center gap-2 py-4 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Checking NAFDAC database…</div>}

                {result && !loading && (() => {
                  const cfg = statusConfig[result.status]
                  return (
                    <div className="space-y-2">
                      <div className={`flex items-center justify-between rounded-lg p-3 ${cfg.bg}`}>
                        <span className="text-sm font-medium">Authenticity Score</span>
                        <span className={`text-lg font-bold ${cfg.text}`}>{cfg.score}</span>
                      </div>
                      <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                        <span className="text-sm text-muted-foreground">Status</span>
                        <span className={`flex items-center gap-1 text-sm font-medium ${cfg.text}`}>{cfg.icon} {cfg.label}</span>
                      </div>
                      {result.status === "verified" && (
                        <div className="rounded-lg bg-muted p-3 text-sm">
                          <div className="font-medium">{result.name}</div>
                          <div className="mt-1 text-xs text-muted-foreground">Reg: {result.registrationNumber}</div>
                          <div className="text-xs text-muted-foreground">Mfr: {result.manufacturer}</div>
                          <div className="text-xs text-muted-foreground">Approved: {result.approvalDate}</div>
                          {result.strength && <div className="text-xs text-muted-foreground">Ingredients: {result.strength}</div>}
                          <div className="mt-2 flex flex-col gap-1">
                            {result.smpc && <a href={result.smpc} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">View Product Monograph</a>}
                            <a href={`https://greenbook.nafdac.gov.ng/search?q=${encodeURIComponent(result.name)}`} target="_blank" rel="noopener noreferrer" className="text-xs text-green-600 hover:underline">View on NAFDAC Greenbook</a>
                          </div>
                        </div>
                      )}
                      {result.status === "not_found" && (
                        <div className="space-y-2">
                          <p className="rounded-lg bg-yellow-50 p-3 text-xs text-yellow-700">Not found in NAFDAC database. May be unregistered or counterfeit.</p>
                          <a href={`https://greenbook.nafdac.gov.ng/search?q=${encodeURIComponent(result.name)}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full rounded-lg bg-green-600 px-3 py-2 text-xs font-medium text-white hover:bg-green-700">Search NAFDAC Greenbook</a>
                          <a href="https://greenbook.nafdac.gov.ng/report" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full rounded-lg bg-red-600 px-3 py-2 text-xs font-medium text-white hover:bg-red-700">Report Suspicious Product</a>
                        </div>
                      )}
                      {result.status === "suspicious" && <p className="rounded-lg bg-red-50 p-3 text-xs text-red-700">Flagged as suspicious. Do not purchase or consume.</p>}
                      <button onClick={reset} className="w-full rounded-md border border-border py-1.5 text-xs text-muted-foreground hover:bg-muted">Search another product</button>
                    </div>
                  )
                })()}

                {!result && !loading && mode === "idle" && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between rounded-lg bg-accent/10 p-3">
                      <span className="text-sm font-medium">Authenticity Score</span>
                      <span className="text-lg font-bold text-accent">—</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                      <span className="text-sm text-muted-foreground">Product Status</span>
                      <span className="text-sm text-muted-foreground">Awaiting scan</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
