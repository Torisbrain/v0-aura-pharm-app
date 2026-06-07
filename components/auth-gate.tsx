"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { Shield, Mail, Lock, User, ArrowRight, Loader2, Zap, CheckCircle } from "lucide-react"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const AuthContext = createContext<{ user: any; signOut: () => void }>({ user: null, signOut: () => {} })
export const useAuth = () => useContext(AuthContext)

export function AuthGate({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(undefined) // undefined = loading
  const [mode, setMode] = useState<"signin" | "signup">("signup")
  const [form, setForm] = useState({ name: "", email: "", password: "", pharmacy: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [done, setDone] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => { await supabase.auth.signOut(); setUser(null) }

  const handle = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: form.email, password: form.password,
          options: { data: { name: form.name, pharmacy: form.pharmacy } }
        })
        if (error) { setError(error.message); setLoading(false); return }
        setDone(true)
        setLoading(false)
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password })
        if (error) { setError(error.message); setLoading(false); return }
      }
    } catch { setError("Something went wrong."); setLoading(false) }
  }

  // Loading state
  if (user === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="flex flex-col items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-green-600 flex items-center justify-center animate-pulse">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <p className="text-sm text-green-700 font-medium">Loading AuraBridge…</p>
        </div>
      </div>
    )
  }

  // Authenticated — show app
  if (user) {
    return <AuthContext.Provider value={{ user, signOut }}>{children}</AuthContext.Provider>
  }

  // Auth wall
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-950 to-slate-900 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-green-500/10 blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-emerald-400/10 blur-2xl animate-pulse [animation-delay:1s]" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-600 shadow-2xl shadow-green-900/50">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white">AuraBridge Health</h1>
          <p className="mt-2 text-green-300/80">AI pharmacy intelligence for West Africa</p>
        </div>

        {/* Benefits pills */}
        <div className="mb-6 flex flex-wrap justify-center gap-2">
          {["5 free verifications/day", "NAFDAC database", "AI drug checker", "24/7 consult"].map(b => (
            <span key={b} className="flex items-center gap-1 rounded-full bg-green-900/50 border border-green-700/50 px-3 py-1 text-xs text-green-300">
              <CheckCircle className="h-3 w-3" /> {b}
            </span>
          ))}
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl">
          {done ? (
            <div className="text-center py-4 space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20 border border-green-500/30">
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Check your email!</h2>
              <p className="text-green-300/80 text-sm">We sent a confirmation link to <strong className="text-white">{form.email}</strong>. Click it to activate your account.</p>
              <Button onClick={() => { setDone(false); setMode("signin") }} className="w-full bg-green-600 hover:bg-green-700">
                Sign In Instead
              </Button>
            </div>
          ) : (
            <>
              {/* Tabs */}
              <div className="mb-6 flex rounded-xl bg-white/5 p-1">
                {(["signup", "signin"] as const).map(m => (
                  <button key={m} onClick={() => { setMode(m); setError("") }}
                    className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-all ${mode === m ? "bg-green-600 text-white shadow-lg" : "text-green-300/60 hover:text-green-300"}`}>
                    {m === "signup" ? "Create Account" : "Sign In"}
                  </button>
                ))}
              </div>

              <form onSubmit={handle} className="space-y-4">
                {mode === "signup" && (
                  <>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-400/60" />
                      <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="Full name" className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-green-500" />
                    </div>
                    <div className="relative">
                      <Zap className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-400/60" />
                      <input required value={form.pharmacy} onChange={e => setForm(f => ({ ...f, pharmacy: e.target.value }))}
                        placeholder="Pharmacy name" className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-green-500" />
                    </div>
                  </>
                )}
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-400/60" />
                  <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="Email address" className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-400/60" />
                  <input required type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    placeholder="Password (min 6 chars)" minLength={6} className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                {error && <p className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-xs text-red-400">{error}</p>}
                <Button type="submit" disabled={loading} className="w-full h-12 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold text-base shadow-lg shadow-green-900/40 gap-2">
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
                  {mode === "signup" ? "Create Free Account" : "Sign In"}
                </Button>
              </form>
              <p className="mt-4 text-center text-xs text-white/30">
                {mode === "signup" ? "5 free drug verifications daily • No card needed" : "Don't have an account? Switch to Create Account above"}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
