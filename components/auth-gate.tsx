'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { ShieldCheck, User, Store, ArrowRight, Lock, Mail, Phone, Building, FileText, CheckCircle2 } from 'lucide-react'

export function AuthGate({ children }: { children?: React.ReactNode }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  
  // Auth Form State
  const [mode, setMode] = useState<'login' | 'signup'>('signup')
  const [role, setRole] = useState<'patient' | 'pharmacy'>('patient')
  
  // Fields
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [pharmacyName, setPharmacyName] = useState('')
  const [pcnLicense, setPcnLicense] = useState('')
  const [city, setCity] = useState('Lagos')

  const [errorMsg, setErrorMsg] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    async function checkUser() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          setUser(session.user)
          const userRole = session.user.user_metadata?.role || 'patient'
          // Route based on role if logged in
          if (window.location.pathname === '/' || window.location.pathname === '/login') {
            if (userRole === 'pharmacy') {
              router.push('/dashboard')
            } else {
              router.push('/patient')
            }
          }
        }
      } catch (err) {
        console.error('Auth check error:', err)
      } finally {
        setLoading(false)
      }
    }
    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user)
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setSubmitting(true)

    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              phone: phone || undefined,
              pharmacy_name: role === 'pharmacy' ? pharmacyName : undefined,
              pcn_license: role === 'pharmacy' ? pcnLicense : undefined,
              city,
              role,
            },
          },
        })

        if (error) throw error

        if (data.user) {
          // Store role in profiles table
          await supabase.from('profiles').upsert({
            id: data.user.id,
            full_name: fullName,
            email,
            phone,
            role,
            pharmacy_name: role === 'pharmacy' ? pharmacyName : null,
            pcn_license: role === 'pharmacy' ? pcnLicense : null,
            city,
            updated_at: new Date().toISOString(),
          })

          if (role === 'pharmacy') {
            router.push('/dashboard')
          } else {
            router.push('/patient')
          }
        }
      } else {
        // Login
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error

        if (data.user) {
          const userRole = data.user.user_metadata?.role || 'patient'
          if (userRole === 'pharmacy') {
            router.push('/dashboard')
          } else {
            router.push('/patient')
          }
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please check credentials.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-emerald-400">Loading AuraBridge Health…</p>
        </div>
      </div>
    )
  }

  // If already authenticated and children provided, render children
  if (user && children) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 text-slate-100">
      <div className="w-full max-w-md bg-slate-900 border border-emerald-500/20 rounded-2xl p-6 shadow-2xl backdrop-blur-xl">
        
        {/* Header Branding */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center mb-3 shadow-lg shadow-emerald-500/20">
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            AuraBridge <span className="text-emerald-400">Health</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            B2B Pharmacy Intelligence & Telehealth Platform for West Africa 🇳🇬
          </p>
        </div>

        {/* TWO-SIDED ROLE SELECTOR TABS */}
        <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 mb-6">
          <button
            type="button"
            onClick={() => setRole('patient')}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
              role === 'patient'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-4 h-4" /> I'm a Patient
          </button>

          <button
            type="button"
            onClick={() => setRole('pharmacy')}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
              role === 'pharmacy'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Store className="w-4 h-4" /> I'm a Pharmacy
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        {/* AUTH FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Toriola Adeyemi"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
          )}

          {mode === 'signup' && role === 'pharmacy' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Registered Pharmacy Name</label>
                <input
                  type="text"
                  required
                  value={pharmacyName}
                  onChange={(e) => setPharmacyName(e.target.value)}
                  placeholder="e.g. MedPlus Clinical Pharmacy"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">PCN License Number</label>
                <input
                  type="text"
                  required
                  value={pcnLicense}
                  onChange={(e) => setPcnLicense(e.target.value)}
                  placeholder="e.g. PCN/LAG/2024/0891"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </>
          )}

          {mode === 'signup' && role === 'patient' && (
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Phone Number (+234)</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+234 802 111 2233"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.ng"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={`w-full py-2.5 px-4 rounded-lg font-bold text-sm text-white transition-all flex items-center justify-center gap-2 ${
              role === 'pharmacy'
                ? 'bg-amber-600 hover:bg-amber-500 shadow-lg shadow-amber-600/25'
                : 'bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/25'
            }`}
          >
            {submitting ? 'Processing…' : mode === 'signup' ? `Register as ${role === 'patient' ? 'Patient' : 'Pharmacy'}` : 'Sign In'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Toggle Login/Signup */}
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}
            className="text-xs font-semibold text-emerald-400 hover:underline"
          >
            {mode === 'signup' ? 'Already have an account? Sign In' : "Don't have an account? Register"}
          </button>
        </div>

      </div>
    </div>
  )
}
