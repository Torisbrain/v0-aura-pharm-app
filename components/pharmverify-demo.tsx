"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Shield, CheckCircle, Camera, QrCode, Loader2, AlertTriangle, X } from "lucide-react"

type ScanState = "idle" | "scanning" | "result"
type ResultType = "verified" | "suspicious" | "unknown"

interface ScanResult {
  type: ResultType
  score: number
  productName: string
  manufacturer: string
  batchNumber: string
  expiryDate: string
}

const mockResults: Record<string, ScanResult> = {
  "AMX-2024-001": {
    type: "verified",
    score: 98,
    productName: "Amoxicillin 500mg",
    manufacturer: "GlaxoSmithKline",
    batchNumber: "AMX-2024-001",
    expiryDate: "Dec 2025",
  },
  "PAR-2024-102": {
    type: "verified",
    score: 95,
    productName: "Paracetamol 500mg",
    manufacturer: "Emzor Pharmaceuticals",
    batchNumber: "PAR-2024-102",
    expiryDate: "Aug 2025",
  },
  "FAKE-001": {
    type: "suspicious",
    score: 23,
    productName: "Unknown Product",
    manufacturer: "Unverified Source",
    batchNumber: "FAKE-001",
    expiryDate: "N/A",
  },
}

export function PharmVerifyDemo() {
  const [scanState, setScanState] = useState<ScanState>("idle")
  const [batchNumber, setBatchNumber] = useState("")
  const [result, setResult] = useState<ScanResult | null>(null)
  const [showScanner, setShowScanner] = useState(false)

  const handleScan = () => {
    if (!batchNumber.trim()) return
    
    setScanState("scanning")
    
    // Simulate scanning delay
    setTimeout(() => {
      const foundResult = mockResults[batchNumber.toUpperCase()]
      if (foundResult) {
        setResult(foundResult)
      } else {
        setResult({
          type: "unknown",
          score: 0,
          productName: "Product Not Found",
          manufacturer: "Unknown",
          batchNumber: batchNumber,
          expiryDate: "N/A",
        })
      }
      setScanState("result")
    }, 2000)
  }

  const handleReset = () => {
    setScanState("idle")
    setBatchNumber("")
    setResult(null)
  }

  const handleTryDemo = () => {
    setShowScanner(true)
    setBatchNumber("AMX-2024-001")
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
              PharmVerify uses AI and our extensive database to verify product authenticity in seconds.
            </p>
            
            <ul className="mb-8 space-y-4">
              {[
                "Scan barcode or enter batch number",
                "AI analyzes packaging and serial data",
                "Get instant authenticity score (0-100%)",
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
              onClick={handleTryDemo}
            >
              <Camera className="h-4 w-4" />
              Try PharmVerify Demo
            </Button>
            
            {showScanner && (
              <p className="mt-3 text-sm text-muted-foreground">
                Try these batch numbers: <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">AMX-2024-001</code>, <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">PAR-2024-102</code>, or <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">FAKE-001</code>
              </p>
            )}
          </div>
          
          <div className="flex justify-center">
            <Card className="w-full max-w-sm border-2 border-accent/20 bg-card shadow-xl">
              <CardHeader className="border-b bg-accent/5 text-center">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-accent">
                  <Shield className="h-6 w-6 text-accent-foreground" />
                </div>
                <CardTitle className="text-lg">PharmVerify Scanner</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {scanState === "idle" && (
                  <>
                    <div className="mb-4 flex aspect-square items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50">
                      <div className="text-center">
                        <QrCode className="mx-auto mb-2 h-12 w-12 text-muted-foreground/50" />
                        <p className="text-sm text-muted-foreground">Scan product barcode</p>
                        <p className="mt-1 text-xs text-muted-foreground/70">or enter batch number below</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Input
                        placeholder="Enter batch number (e.g., AMX-2024-001)"
                        value={batchNumber}
                        onChange={(e) => setBatchNumber(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleScan()}
                        className="text-center font-mono"
                      />
                      <Button 
                        className="w-full gap-2 bg-accent hover:bg-accent/90" 
                        onClick={handleScan}
                        disabled={!batchNumber.trim()}
                      >
                        <Camera className="h-4 w-4" />
                        Verify Product
                      </Button>
                    </div>
                  </>
                )}

                {scanState === "scanning" && (
                  <ScanningAnimation batchNumber={batchNumber} />
                )}

                {scanState === "result" && result && (
                  <ScanResult result={result} onReset={handleReset} />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

function ScanningAnimation({ batchNumber }: { batchNumber: string }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 5
      })
    }, 100)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="relative mb-6">
        <div className="h-20 w-20 animate-pulse rounded-full bg-accent/20" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-accent" />
        </div>
      </div>
      
      <p className="mb-2 font-medium">Scanning Product...</p>
      <p className="mb-4 font-mono text-sm text-muted-foreground">{batchNumber}</p>
      
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div 
          className="h-full bg-accent transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <p className="mt-2 text-xs text-muted-foreground">
        Checking database... {progress}%
      </p>
    </div>
  )
}

function ScanResult({ result, onReset }: { result: ScanResult; onReset: () => void }) {
  const isVerified = result.type === "verified"
  const isSuspicious = result.type === "suspicious"

  return (
    <div className="space-y-4">
      <div className={`flex flex-col items-center rounded-lg p-4 ${
        isVerified ? "bg-accent/10" : isSuspicious ? "bg-destructive/10" : "bg-muted"
      }`}>
        {isVerified ? (
          <CheckCircle className="mb-2 h-12 w-12 text-accent" />
        ) : isSuspicious ? (
          <AlertTriangle className="mb-2 h-12 w-12 text-destructive" />
        ) : (
          <X className="mb-2 h-12 w-12 text-muted-foreground" />
        )}
        
        <p className="font-semibold">
          {isVerified ? "Product Verified" : isSuspicious ? "Suspicious Product" : "Product Not Found"}
        </p>
        
        <div className={`mt-1 text-3xl font-bold ${
          isVerified ? "text-accent" : isSuspicious ? "text-destructive" : "text-muted-foreground"
        }`}>
          {result.score}%
        </div>
        <p className="text-xs text-muted-foreground">Authenticity Score</p>
      </div>

      <div className="space-y-2 rounded-lg bg-muted/50 p-3 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Product</span>
          <span className="font-medium">{result.productName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Manufacturer</span>
          <span className="font-medium">{result.manufacturer}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Batch</span>
          <span className="font-mono text-xs">{result.batchNumber}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Expiry</span>
          <span className="font-medium">{result.expiryDate}</span>
        </div>
      </div>

      {isSuspicious && (
        <Button variant="destructive" className="w-full gap-2">
          <AlertTriangle className="h-4 w-4" />
          Report This Product
        </Button>
      )}

      <Button variant="outline" className="w-full" onClick={onReset}>
        Scan Another Product
      </Button>
    </div>
  )
}
