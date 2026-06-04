"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, CheckCircle, Camera, QrCode, Search, Loader2, XCircle, AlertTriangle } from "lucide-react"

let Html5Qrcode: any = null

interface NAFDACResult {
  name: string
  registrationNumber: string
  manufacturer: string
  approvalDate: string
  strength?: string
  status: "verified" | "not_found" | "suspicious"
  smpc?: string
  smpc?: string
}

async function lookupNAFDAC(query: string): Promise<NAFDACResult> {
  const res = await fetch("/api/nafdac", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: query.trim() }),
  })
  if (!res.ok) {
    return { name: query, registrationNumber: "—", manufacturer: "—", approvalDate: "—", status: "not_found" }
  }
  const data = await res.json()
  return {
    name: data.name ?? query,
    registrationNumber: data.registrationNumber ?? "—",
    manufacturer: data.manufacturer ?? "—",
    approvalDate: data.approvalDate ?? "—",
    strength: data.activeIngredients,
    status: data.status === "verified" ? "verified" : data.status === "suspicious" ? "suspicious" : "not_found",
    smpc: data.smpc,
    smpc: data.smpc,
  }
}

export function PharmVerifyDemo() {
  const [mode, setMode] = useState<"idle" | "scanning" | "manual">("idle")
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<NAFDACResult | null>(null)
  const [scanError, setScanError] = useState("")
  const scannerRef = useRef<any>(null)
  const scannerDivId = "pharm-qr-scanner"

  useEffect(() => {
    import("html5-qrcode").then(mod => {
      Html5Qrcode = mod.Html5Qrcode
    })
  }, [])

  const startScanner = async () => {
    setScanError("")
    setResult(null)
    setMode("scanning")
    await new Promise(r => setTimeout(r, 100))
    if (!Html5Qrcode) {
      setScanError("Scanner library not loaded yet. Try again in a moment.")
      setMode("idle")
      return
    }
    try {
      const scanner = new Html5Qrcode(scannerDivId)
      scannerRef.current = scanner
      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 220, height: 220 } },
        async (decodedText: string) => {
          await stopScanner()
          setSearchQuery(decodedText)
          runLookup(decodedText)
        },
        undefined
      )
    } catch (err: any) {
      setScanError(
        err?.message?.includes("Permission")
          ? "Camera access denied. Please allow camera access and try again."
          : "Could not start camera. Try manual search instead."
      )
      setMode("idle")
    }
  }

  const stopScanner = async () => {
    try {
      if (scannerRef.current) {
        await scannerRef.current.stop()
        scannerRef.current = null
      }
    } catch (_) {}
    setMode("idle")
  }

  const runLookup = async (query: string) => {
    if (!query.trim()) return
    setLoading(true)
    setResult(null)
    try {
      const res = await lookupNAFDAC(query.trim())
      setResult(res)
    } finally {
      setLoading(false)
    }
  }

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault()
    runLookup(searchQuery)
  }

  const reset = () => {
    stopScanner()
    setResult(null)
    setSearchQuery("")
    setScanError("")
    setMode("idle")
  }

  const statusConfig = {
    verified: {
      icon: <CheckCircle className="h-5 w-5 text-accent" />,
      label: "NAFDAC Verified",
      score: "98%",
      bg: "bg-accent/10",
      text: "text-accent",
    },
    not_found: {
      icon: <AlertTriangle className="h-5 w-5 text-yellow-600" />,
      label: "Not in Database",
      score: "—",
      bg: "bg-yellow-50",
      text: "text-yellow-700",
    },
    suspicious: {
      icon: <XCircle className="h-5 w-5 text-red-600" />,
      label: "Suspicious Product",
      score: "12%",
      bg: "bg-red-50",
      text: "text-red-700",
    },
  }

  return (
    <section id="pharmverify" className="bg-muted/50 px-4 py-20">
      <div className="container mx-auto">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-sm font-medium text-accent">
              <Shield className="h-4 w-4" />
              PharmVerify Technology
            </div>
            <h2 className="mb-6 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Detect Counterfeit Medicines Instantly
            </h2>
            <p className="mb-6 text-pretty text-lg text-muted-foreground">
              Counterfeit medicines are a major public health threat in West Africa.
              PharmVerify uses AI and the NAFDAC database to verify product authenticity in seconds.
            </p>
            <ul className="mb-8 space-y-4">
              {[
                "Scan barcode or enter drug name / NAFDAC number",
                "Checks against official NAFDAC Greenbook database",
                "Get instant authenticity result",
                "Report suspicious products directly",
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
            <Button
              size="lg"
              className="gap-2 bg-accent hover:bg-accent/90"
              onClick={startScanner}
              disabled={mode === "scanning"}
            >
              <Camera className="h-4 w-4" />
              Try PharmVerify Demo
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
              </CardHeader>

              <CardContent className="p-6">
                <div className="mb-4 overflow-hidden rounded-lg border-2 border-dashed border-border bg-muted/50">
                  {mode === "scanning" ? (
                    <div className="relative">
                      <div id={scannerDivId} className="w-full" />
                      <button
                        onClick={stopScanner}
                        className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white"
                        aria-label="Stop scanner"
                      >
                        <XCircle className="h-5 w-5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={startScanner}
                      className="flex w-full flex-col items-center justify-center gap-2 py-10 transition-colors hover:bg-accent/5"
                    >
                      <QrCode className="h-12 w-12 text-muted-foreground/50" />
                      <p className="text-sm text-muted-foreground">Tap to scan barcode</p>
                      <p className="text-xs text-muted-foreground/60">or search manually below</p>
                    </button>
                  )}
                </div>

                {scanError && (
                  <p className="mb-3 rounded-md bg-yellow-50 px-3 py-2 text-xs text-yellow-700">
                    ⚠️ {scanError}
                  </p>
                )}

                <form onSubmit={handleManualSearch} className="mb-4 flex gap-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Drug name, NAFDAC No, or ingredient"
                    className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <Button type="submit" size="sm" disabled={loading || !searchQuery.trim()} className="bg-accent hover:bg-accent/90">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  </Button>
                </form>

                {loading && (
                  <div className="flex items-center justify-center gap-2 py-4 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" /> Checking NAFDAC database…
                  </div>
                )}

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
                        <span className={`flex items-center gap-1 text-sm font-medium ${cfg.text}`}>
                          {cfg.icon} {cfg.label}
                        </span>
                      </div>
                      {result.status === "verified" && (
                        <div className="rounded-lg bg-muted p-3 text-sm">
                          <div className="font-medium">{result.name}</div>
                          <div className="mt-1 text-xs text-muted-foreground">Reg: {result.registrationNumber}</div>
                          <div className="text-xs text-muted-foreground">Mfr: {result.manufacturer}</div>
                          <div className="text-xs text-muted-foreground">Approved: {result.approvalDate}</div>
                          {result.strength && (
                            <div className="text-xs text-muted-foreground">Ingredients: {result.strength}</div>
                          )}
                          <div className="mt-2 flex flex-col gap-1">
                            {result.smpc && (
                              <a href={result.smpc} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
                                View Product Monograph (SMPC)
                              </a>
                            )}
                            
                              <a href={`https://greenbook.nafdac.gov.ng/search?q=${encodeURIComponent(result.name)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-green-600 hover:underline">
                                View on NAFDAC Greenbook
                              </a>
                          </div>
                        </div>
                      )}
                      {result.status === "not_found" && (
                        <div className="space-y-2">
                          <p className="rounded-lg bg-yellow-50 p-3 text-xs text-yellow-700">
                            This product was not found in the NAFDAC database. It may be unregistered or counterfeit. Do not use without consulting a pharmacist.
                          </p>
                          
                            href={`https://greenbook.nafdac.gov.ng/search?q=${encodeURIComponent(result.name)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full rounded-lg bg-green-600 px-3 py-2 text-xs font-medium text-white hover:bg-green-700"
                          >
                            Search NAFDAC Greenbook
                          </a>
                          
                            href="https://greenbook.nafdac.gov.ng/report"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full rounded-lg bg-red-600 px-3 py-2 text-xs font-medium text-white hover:bg-red-700"
                          >
                            Report Suspicious Product
                          </a>
                        </div>
                      )}
                      {result.status === "suspicious" && (
                        <p className="rounded-lg bg-red-50 p-3 text-xs text-red-700">
                          ⚠️ This product has been flagged as suspicious. Do not purchase or consume it.
                        </p>
                      )}
                      <button onClick={reset} className="w-full rounded-md border border-border py-1.5 text-xs text-muted-foreground hover:bg-muted">
                        Search another product
                      </button>
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
