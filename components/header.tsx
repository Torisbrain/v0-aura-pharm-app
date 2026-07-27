'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Shield, Activity, Stethoscope } from "lucide-react"
import { useState } from "react"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-foreground">AuraBridge</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/dashboard" className="text-sm font-semibold text-muted-foreground transition-colors hover:text-emerald-600">
            Pharmacy Dashboard
          </Link>
          <Link href="/patient" className="text-sm font-semibold text-muted-foreground transition-colors hover:text-emerald-600">
            Patient Portal
          </Link>
          <Link href="/consult" className="text-sm font-semibold text-muted-foreground transition-colors hover:text-emerald-600">
            AI Triage & Consult
          </Link>
          <Link href="/pharmverify" className="text-sm font-semibold text-muted-foreground transition-colors hover:text-emerald-600">
            PharmVerify AI
          </Link>
          <Link href="/interactions" className="text-sm font-semibold text-muted-foreground transition-colors hover:text-emerald-600">
            Interaction Checker
          </Link>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </Link>
          <Link href="/login">
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white">
              Get Started
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-slate-700"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t bg-background px-4 py-4 md:hidden shadow-lg">
          <nav className="flex flex-col gap-3">
            <Link href="/dashboard" className="text-sm font-bold text-slate-800 hover:text-emerald-600">
              Pharmacy Dashboard
            </Link>
            <Link href="/patient" className="text-sm font-bold text-slate-800 hover:text-emerald-600">
              Patient Portal
            </Link>
            <Link href="/consult" className="text-sm font-bold text-slate-800 hover:text-emerald-600">
              AI Triage & Consult
            </Link>
            <Link href="/pharmverify" className="text-sm font-bold text-slate-800 hover:text-emerald-600">
              PharmVerify Counterfeit Scan
            </Link>
            <Link href="/interactions" className="text-sm font-bold text-slate-800 hover:text-emerald-600">
              Drug Interaction Checker
            </Link>
            <div className="flex flex-col gap-2 pt-3 border-t border-slate-200">
              <Link href="/login" className="w-full">
                <Button variant="outline" size="sm" className="w-full">
                  Sign In
                </Button>
              </Link>
              <Link href="/login" className="w-full">
                <Button size="sm" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white">
                  Get Started
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
