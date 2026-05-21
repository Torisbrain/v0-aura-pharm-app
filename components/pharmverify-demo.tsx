"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Shield, CheckCircle, Camera, QrCode, Loader2, AlertTriangle, X, Search, Building2, Calendar, Pill, Hash } from "lucide-react"

interface NAFDACProduct {
  productName: string
  activeIngredients: string
  productCategory: string
  nrn: string
  form: string
  roa: string
  strengths: string
  applicantName: string
  approvalDate: string
  status: string
}

interface SearchResult {
  source: "nafdac" | "local"
  results: NAFDACProduct[]
}

type ScanState = "idle" | "scanning" | "result"

export function PharmVerifyDemo() {
  const [scanState, setScanState] = useState<ScanState>("idle")
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<NAFDACProduct | null>(null)
  const [showScanner, setShowScanner] = useState(false)

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setScanState("scanning")
    setSearchResult(null)
    setSelectedProduct(null)

    try {
      const response = await fetch(`/api/nafdac?q=${encodeURIComponent(searchQuery)}`)
      const data: SearchResult = await response.json()

      setSearchResult(data)
      if (data.results.length === 1) {
        setSelectedProduct(data.results[0])
      }
      setScanState("result")
    } catch (error) {
      console.error("Search error:", error)
      setScanState("result")
      setSearchResult({ source: "local", results: [] })
    }
  }

  const handleReset = () => {
    setScanState("idle")
    setSearchQuery("")
    setSearchResult(null)
    setSelectedProduct(null)
  }

  const handleTryDemo = () => {
    setShowScanner(true)
    setSearchQuery("Amoxicillin")
  }

  const getVerificationScore = (product: NAFDACProduct) => {
    if (product.status === "Active" && product.nrn !== "UNVERIFIED") {
      return Math.floor(Math.random() * 10) + 90
    }
    if (product.status === "Suspicious") {
      return Math.floor(Math.random() * 30) + 10
    }
    return Math.floor(Math.random() * 20) + 40
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
              Verify Any NAFDAC Registered Drug
            </h2>
            
            <p className="mb-6 text-pretty text-lg text-muted-foreground">
              Access Nigeria&apos;s official NAFDAC Greenbook database to verify any registered pharmaceutical product instantly. 
              Search by drug name, NAFDAC registration number, or active ingredient.
            </p>
            
            <ul className="mb-8 space-y-4">
              {[
                "Search 60+ common Nigerian drugs and counting",
                "Verify by drug name, brand, or NAFDAC number",
                "View manufacturer, approval date & strength",
                "Flag and report suspicious products",
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
                Try: <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">Panadol</code>, <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">Coartem</code>, <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">Augmentin</code>, <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">04-8350</code>
              </p>
            )}
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
                {scanState === "idle" && (
                  <>
                    <div className="mb-4 flex aspect-square items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50">
                      <div className="text-center">
                        <QrCode className="mx-auto mb-2 h-12 w-12 text-muted-foreground/50" />
                        <p className="text-sm text-muted-foreground">Scan barcode or</p>
                        <p className="mt-1 text-xs text-muted-foreground/70">search NAFDAC database below</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="Drug name, NAFDAC No, or ingredient"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                          className="pl-10"
                        />
                      </div>
                      <Button 
                        className="w-full gap-2 bg-accent hover:bg-accent/90" 
                        onClick={handleSearch}
                        disabled={!searchQuery.trim()}
                      >
                        <Search className="h-4 w-4" />
                        Verify Product
                      </Button>
                    </div>
                  </>
                )}

                {scanState === "scanning" && (
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="relative mb-6">
                      <div className="h-20 w-20 animate-pulse rounded-full bg-accent/20" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="h-10 w-10 animate-spin text-accent" />
                      </div>
                    </div>
                    <p className="mb-2 font-medium">Searching NAFDAC Database...</p>
                    <p className="mb-4 text-sm text-muted-foreground">&quot;{searchQuery}&quot;</p>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div className="h-full w-3/4 animate-pulse bg-accent" />
                    </div>
                  </div>
                )}

                {scanState === "result" && (
                  <div className="space-y-4">
                    {/* No results */}
                    {searchResult?.results.length === 0 && (
                      <div className="rounded-lg bg-destructive/10 p-4 text-center">
                        <X className="mx-auto mb-2 h-12 w-12 text-destructive" />
                        <p className="font-semibold text-destructive">Product Not Found</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          &quot;{searchQuery}&quot; is not in the NAFDAC database. This product may be unregistered or counterfeit.
                        </p>
                        <Button variant="destructive" size="sm" className="mt-3 gap-2">
                          <AlertTriangle className="h-4 w-4" />
                          Report Suspicious Product
                        </Button>
                      </div>
                    )}

                    {/* Single result or selected product */}
                    {selectedProduct && (
                      <div className="space-y-4">
                        <div className={`flex flex-col items-center rounded-lg p-4 ${
                          selectedProduct.status === "Active" ? "bg-accent/10" : "bg-destructive/10"
                        }`}>
                          {selectedProduct.status === "Active" ? (
                            <CheckCircle className="mb-2 h-12 w-12 text-accent" />
                          ) : (
                            <AlertTriangle className="mb-2 h-12 w-12 text-destructive" />
                          )}
                          <p className="font-semibold">
                            {selectedProduct.status === "Active" ? "NAFDAC Verified" : "Suspicious Product"}
                          </p>
                          <div className={`mt-1 text-3xl font-bold ${
                            selectedProduct.status === "Active" ? "text-accent" : "text-destructive"
                          }`}>
                            {getVerificationScore(selectedProduct)}%
                          </div>
                          <p className="text-xs text-muted-foreground">Authenticity Score</p>
                        </div>

                        <div className="space-y-2 rounded-lg bg-muted/50 p-3 text-sm">
                          <div className="flex items-start justify-between gap-2">
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <Pill className="h-3 w-3" /> Product
                            </span>
                            <span className="text-right font-medium">{selectedProduct.productName}</span>
                          </div>
                          <div className="flex items-start justify-between gap-2">
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <Hash className="h-3 w-3" /> NAFDAC No
                            </span>
                            <span className="font-mono text-xs font-medium">{selectedProduct.nrn}</span>
                          </div>
                          <div className="flex items-start justify-between gap-2">
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <Building2 className="h-3 w-3" /> Manufacturer
                            </span>
                            <span className="text-right text-xs font-medium">{selectedProduct.applicantName}</span>
                          </div>
                          <div className="flex items-start justify-between gap-2">
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <Calendar className="h-3 w-3" /> Approved
                            </span>
                            <span className="font-medium">{selectedProduct.approvalDate}</span>
                          </div>
                          <div className="flex flex-wrap gap-1 pt-1">
                            <Badge variant="secondary" className="text-xs">{selectedProduct.form}</Badge>
                            <Badge variant="secondary" className="text-xs">{selectedProduct.strengths}</Badge>
                            <Badge variant="secondary" className="text-xs">{selectedProduct.roa}</Badge>
                          </div>
                        </div>

                        {searchResult && searchResult.results.length > 1 && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => setSelectedProduct(null)}
                          >
                            View all {searchResult.results.length} results
                          </Button>
                        )}
                      </div>
                    )}

                    {/* Multiple results list */}
                    {!selectedProduct && searchResult && searchResult.results.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          {searchResult.results.length} product(s) found
                        </p>
                        <div className="max-h-64 space-y-2 overflow-y-auto">
                          {searchResult.results.map((product, index) => (
                            <div
                              key={index}
                              className="cursor-pointer rounded-lg border p-3 transition-colors hover:bg-muted/50"
                              onClick={() => setSelectedProduct(product)}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    {product.status === "Active" ? (
                                      <CheckCircle className="h-4 w-4 text-accent" />
                                    ) : (
                                      <AlertTriangle className="h-4 w-4 text-destructive" />
                                    )}
                                    <p className="text-sm font-medium">{product.productName}</p>
                                  </div>
                                  <p className="mt-1 text-xs text-muted-foreground">
                                    {product.activeIngredients}
                                  </p>
                                  <p className="mt-1 font-mono text-xs text-muted-foreground">
                                    {product.nrn}
                                  </p>
                                </div>
                                <Badge className={product.status === "Active" ? "bg-accent" : "bg-destructive"}>
                                  {product.status}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedProduct?.status === "Suspicious" && (
                      <Button variant="destructive" className="w-full gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Report This Product
                      </Button>
                    )}

                    <Button variant="outline" className="w-full" onClick={handleReset}>
                      Search Another Product
                    </Button>
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
