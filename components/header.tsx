"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useState } from "react"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <span className="text-lg font-bold text-primary-foreground">A</span>
          </div>
          <span className="text-xl font-bold text-foreground">AuraBridge</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link href="#features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Features
          </Link>
          <Link href="#pharmverify" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            PharmVerify
          </Link>
          <Link href="#pricing" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Pricing
          </Link>
          <Link href="#contact" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Contact
          </Link>
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <Button variant="ghost" size="sm">
            Sign In
          </Button>
          <Button size="sm">
            Get Started
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t bg-background px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-4">
            <Link href="#features" className="text-sm font-medium text-muted-foreground">
              Features
            </Link>
            <Link href="#pharmverify" className="text-sm font-medium text-muted-foreground">
              PharmVerify
            </Link>
            <Link href="#pricing" className="text-sm font-medium text-muted-foreground">
              Pricing
            </Link>
            <Link href="#contact" className="text-sm font-medium text-muted-foreground">
              Contact
            </Link>
            <div className="flex flex-col gap-2 pt-4">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
              <Button size="sm">
                Get Started
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
