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
    
    // Gives React 150ms to mount the DOM container safely before booting the hardware track
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
    <section id="pharmverify" className="bg-muted/50 px-4
