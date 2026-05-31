"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Menu, X, Mail, Lock, User, ArrowRight, Loader2 } from "lucide-react"
import { useState } from "react"

function AuthDialog({ mode, onClose }: { mode: "signin" | "signup"; onClose: () => void }) {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [form, setForm] = useState({ name: "", email: "", password: "", pharmacy: "" })

  const handle = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => { setLoading(false); setDone(true) }, 1500)
  }

  return (
    <DialogContent className="max-w-sm">
      <DialogHeader>
        <DialogTitle>{mode === "signin" ? "Sign In to AuraBridge" : "Create Your Account"}</DialogTitle>
      </DialogHeader>
      {done ? (
        <div className="py-6 text-center space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
            <User className="h-7 w-7 text-green-600" />
          </div>
          <p className="font-semibold text-foreground">{mode === "signin" ? "Welcome back!" : "Account created!"}</p>
          <p className="text-sm text-muted-foreground">
            {mode === "signup" ? "Thank you for joining AuraBridge. Full authentication coming soon — we'll email you when it's ready." : "Full auth is coming soon. Thank you for your interest in AuraBridge!"}
          </p>
          <Button className="w-full" onClick={onClose}>Got it</Button>
        </div>
      ) : (
        <form onSubmit={handle} className="space-y-3 pt-2">
          {mode === "signup" && (
            <>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Victoria Robin" className="w-full rounded-md border border-input bg-background py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Pharmacy Name</label>
                <input required value={form.pharmacy} onChange={e => setForm(f => ({ ...f, pharmacy: e.target.value }))} placeholder="Your Pharmacy Ltd" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </>
          )}
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@pharmacy.com" className="w-full rounded-md border border-input bg-background py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input required type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="••••••••" className="w-full rounded-md border border-input bg-background py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>
          <Button type="submit" disabled={loading} className="w-full gap-2 mt-2">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
            {mode === "signin" ? "Sign In" : "Create Account"}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            {mode === "signin" ? "No account? " : "Already have one? "}
            <button type="button" className="text-primary underline" onClick={onClose}>
              {mode === "signin" ? "Sign up free" : "Sign in"}
            </button>
          </p>
        </form>
      )}
    </DialogContent>
  )
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [authMode, setAuthMode] = useState<"signin" | "signup" | null>(null)

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <span className="text-lg font-bold text-primary-foreground">A</span>
            </div>
            <span className="text-xl font-bold text-foreground">AuraBridge</span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <Link href="#features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Features</Link>
            <Link href="#pharmverify" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">PharmVerify</Link>
            <Link href="#pricing" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Pricing</Link>
            <Link href="#nearby" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Nearby</Link>
            <Link href="#nearby" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Nearby</Link>
            <Link href="#nearby" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Nearby</Link>
            <Link href="#contact" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Contact</Link>
          </nav>

          <div className="hidden items-center gap-4 md:flex">
            <Button variant="ghost" size="sm" onClick={() => setAuthMode("signin")}>Sign In</Button>
            <Button size="sm" onClick={() => setAuthMode("signup")}>Get Started</Button>
          </div>

          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="border-t bg-background px-4 py-4 md:hidden">
            <nav className="flex flex-col gap-4">
              <Link href="#features" className="text-sm font-medium text-muted-foreground" onClick={() => setMobileMenuOpen(false)}>Features</Link>
              <Link href="#pharmverify" className="text-sm font-medium text-muted-foreground" onClick={() => setMobileMenuOpen(false)}>PharmVerify</Link>
              <Link href="#pricing" className="text-sm font-medium text-muted-foreground" onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
              <Link href="#nearby" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Nearby</Link>
            <Link href="#nearby" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Nearby</Link>
            <Link href="#contact" className="text-sm font-medium text-muted-foreground" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
              <div className="flex flex-col gap-2 pt-4 border-t">
                <Button variant="ghost" size="sm" onClick={() => { setAuthMode("signin"); setMobileMenuOpen(false) }}>Sign In</Button>
                <Button size="sm" onClick={() => { setAuthMode("signup"); setMobileMenuOpen(false) }}>Get Started</Button>
              </div>
            </nav>
          </div>
        )}
      </header>

      <Dialog open={!!authMode} onOpenChange={() => setAuthMode(null)}>
        {authMode && <AuthDialog mode={authMode} onClose={() => setAuthMode(null)} />}
      </Dialog>
    </>
  )
}
