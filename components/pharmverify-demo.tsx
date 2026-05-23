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
}

async function lookupNAFDAC(query: string): Promise<NAFDACResult> {
  const res = await fetch("/api/nafdac", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: query.trim() }),
  })
  
  if (!res.ok) {
    return {
      name: query,
      registrationNumber: "—",
      manufacturer: "—",
      approvalDate: "—",
      status: "not_found",
    }
  }
  
  const data = await res.json()
  return {
    name: data.name ?? query,
    registrationNumber: data.registrationNumber ?? "—",
    manufacturer: data.manufacturer ?? "—",
    approvalDate: data.approvalDate ?? "—",
    strength: data.activeIngredients,
    status: data.status === "verified"
      ? "verified"
      : data.status === "suspicious"
      ? "suspicious"
      : "not_found",
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
    
    // Give React time to reflect the DOM container change
    await new Promise(r => setTimeout(r, 150))
    
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
        if (scannerRef.current.isScanning) {
          await scannerRef.current.stop()
        }
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
    if (loading) return
    runLookup(searchQuery)
  }

  const reset = async () => {
    await stopScanner()
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
              PharmVerify uses AI and the NAFDAC Greenbook to verify product authenticity in seconds.
            </p>
            <ul className="mb-8 space-y-4">
              {[
                "Scan barcode or enter drug name / NAFDAC number",
                "Checks against official NAFDAC Greenbook database",
                "Get instant authenticity result powered by Claude AI",
                "Report suspicious products directly to NAFDAC",
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
                <p className="text-xs text-muted-foreground">Powered by Claude AI + NAFDAC Greenbook</p>
              </CardHeader>
              <CardContent className="p-6">
                <div className="mb-4 overflow-hidden rounded-lg border-2 border-dashed border-border bg-muted/50">
                  {/* Container stays persistent in the DOM to avoid lifecycle mount crashes */}
                  <div className={`w-full ${mode !== "scanning" ? "hidden" : "relative"}`}>
                    <div id={scannerDivId} className="w-full" />
                    <button
                      type="button"
                      onClick={stopScanner}
                      className="absolute right-2 top-2 z-1
