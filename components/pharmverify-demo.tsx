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

// Database of verified products - supports batch numbers and drug names
const mockDatabase: Record<string, ScanResult> = {
  // Batch numbers
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
  // Common drug names (case-insensitive matching handled below)
  "amoxicillin": {
    type: "verified",
    score: 96,
    productName: "Amoxicillin 500mg",
    manufacturer: "GlaxoSmithKline",
    batchNumber: "AMX-2024-087",
    expiryDate: "Mar 2026",
  },
  "paracetamol": {
    type: "verified",
    score: 94,
    productName: "Paracetamol 500mg",
    manufacturer: "Emzor Pharmaceuticals",
    batchNumber: "PAR-2024-201",
    expiryDate: "Nov 2025",
  },
  "ibuprofen": {
    type: "verified",
    score: 97,
    productName: "Ibuprofen 400mg",
    manufacturer: "May & Baker Nigeria",
    batchNumber: "IBU-2024-045",
    expiryDate: "Jul 2026",
  },
  "metformin": {
    type: "verified",
    score: 95,
    productName: "Metformin 500mg",
    manufacturer: "Fidson Healthcare",
    batchNumber: "MET-2024-112",
    expiryDate: "Sep 2025",
  },
  "amlodipine": {
    type: "verified",
    score: 98,
    productName: "Amlodipine 5mg",
    manufacturer: "Swiss Pharma Nigeria",
    batchNumber: "AML-2024-033",
    expiryDate: "Feb 2026",
  },
  "ciprofloxacin": {
    type: "verified",
    score: 93,
    productName: "Ciprofloxacin 500mg",
    manufacturer: "Chi Pharmaceuticals",
    batchNumber: "CIP-2024-078",
    expiryDate: "Apr 2026",
  },
  "omeprazole": {
    type: "verified",
    score: 96,
    productName: "Omeprazole 20mg",
    manufacturer: "Neimeth Pharmaceuticals",
    batchNumber: "OME-2024-156",
    expiryDate: "Oct 2025",
  },
  "lisinopril": {
    type: "verified",
    score: 94,
    productName: "Lisinopril 10mg",
    manufacturer: "Shalina Healthcare",
    batchNumber: "LIS-2024-089",
    expiryDate: "Jun 2026",
  },
  "atorvastatin": {
    type: "verified",
    score: 97,
    productName: "Atorvastatin 20mg",
    manufacturer: "Ranbaxy Nigeria",
    batchNumber: "ATO-2024-067",
    expiryDate: "Aug 2026",
  },
  "azithromycin": {
    type: "verified",
    score: 95,
    productName: "Azithromycin 250mg",
    manufacturer: "Pfizer Nigeria",
    batchNumber: "AZI-2024-142",
    expiryDate: "May 2026",
  },
  "artemether": {
    type: "verified",
    score: 92,
    productName: "Artemether-Lumefantrine",
    manufacturer: "Novartis (Coartem)",
    batchNumber: "ART-2024-203",
    expiryDate: "Dec 2025",
  },
  "coartem": {
    type: "verified",
    score: 98,
    productName: "Coartem (Artemether-Lumefantrine)",
    manufacturer: "Novartis",
    batchNumber: "COA-2024-091",
    expiryDate: "Jan 2026",
  },
  "vitamin c": {
    type: "verified",
    score: 99,
    productName: "Vitamin C 1000mg",
    manufacturer: "Emzor Pharmaceuticals",
    batchNumber: "VTC-2024-304",
    expiryDate: "Dec 2026",
  },
  "folic acid": {
    type: "verified",
    score: 96,
    productName: "Folic Acid 5mg",
    manufacturer: "Juhel Nigeria",
    batchNumber: "FOL-2024-118",
    expiryDate: "Nov 2025",
  },
  "tramadol": {
    type: "suspicious",
    score: 34,
    productName: "Tramadol 100mg (Unverified)",
    manufacturer: "Unknown Source",
    batchNumber: "TRM-UNKNOWN",
    expiryDate: "Verification Required",
  },
  "codeine": {
    type: "suspicious",
    score: 28,
    productName: "Codeine Syrup (Unverified)",
    manufacturer: "Unregistered",
    batchNumber: "COD-UNKNOWN",
    expiryDate: "N/A",
  },
}

// Function to find product by partial match or exact match
function findProduct(input: string): ScanResult | null {
  const searchTerm = input.toLowerCase().trim()
  
  // First try exact match
  if (mockDatabase[searchTerm]) {
    return mockDatabase[searchTerm]
  }
  
  // Try uppercase for batch numbers
  if (mockDatabase[input.toUpperCase()]) {
    return mockDatabase[input.toUpperCase()]
  }
  
  // Try partial match on drug names
  for (const [key, value] of Object.entries(mockDatabase)) {
    if (key.toLowerCase().includes(searchTerm) || searchTerm.includes(key.toLowerCase())) {
      return value
    }
    // Also check product name
    if (value.productName.toLowerCase().includes(searchTerm)) {
      return value
    }
  }
  
  return null
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
      const foundResult = findProduct(batchNumber)
      if (foundResult) {
        setResult(foundResult)
      } else {
        setResult({
          type: "unknown",
          score: 0,
          productName: "Product Not in Database",
          manufacturer: "Not Registered",
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
                Try drug names like <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">Amoxicillin</code>, <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">Paracetamol</code>, <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">Ibuprofen</code>, <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">Metformin</code>, or <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">Coartem</code>
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
                        placeholder="Enter drug name (e.g., Amoxicillin)"
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
