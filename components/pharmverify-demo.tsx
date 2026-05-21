"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, CheckCircle, Camera, QrCode } from "lucide-react"

export function PharmVerifyDemo() {
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
            
            <Button size="lg" className="gap-2 bg-accent hover:bg-accent/90">
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
                <CardTitle className="text-lg">PharmVerify Scanner</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="mb-6 flex aspect-square items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50">
                  <div className="text-center">
                    <QrCode className="mx-auto mb-2 h-12 w-12 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground">Scan product barcode</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-lg bg-accent/10 p-3">
                    <span className="text-sm font-medium">Authenticity Score</span>
                    <span className="text-lg font-bold text-accent">98%</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                    <span className="text-sm text-muted-foreground">Product Status</span>
                    <span className="flex items-center gap-1 text-sm font-medium text-accent">
                      <CheckCircle className="h-4 w-4" />
                      Verified
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
