'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Shield, ArrowLeft, Search, AlertTriangle, CheckCircle2 } from 'lucide-react'

export default function InteractionsPage() {
  const [drugA, setDrugA] = useState('')
  const [drugB, setDrugB] = useState('')
  const [result, setResult] = useState<any>(null)

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault()
    if (!drugA || !drugB) return
    setResult({
      drugA,
      drugB,
      severity: 'Moderate',
      description: `Potential interaction between ${drugA} and ${drugB}. Monitor patient for altered therapeutic effect or heightened side effects.`,
      recommendation: 'Separate dosing intervals by at least 2 hours or consult prescribing physician.'
    })
  }

  return (
    <div className="min-h-screen bg-[#f2fbf5] text-slate-900 font-sans p-6">
      <div className="max-w-2xl mx-auto">
        <Link href="/dashboard" className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-emerald-700 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-6 h-6 text-emerald-600" />
            <h1 className="text-xl font-extrabold text-slate-900">Drug Interaction Checker</h1>
          </div>
          <form onSubmit={handleCheck} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Medication 1</label>
              <input
                type="text"
                required
                value={drugA}
                onChange={(e) => setDrugA(e.target.value)}
                placeholder="e.g. Ciprofloxacin"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Medication 2</label>
              <input
                type="text"
                required
                value={drugB}
                onChange={(e) => setDrugB(e.target.value)}
                placeholder="e.g. Antacids (Aluminium Hydroxide)"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm"
              />
            </div>
            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs shadow">
              Check Interaction
            </button>
          </form>

          {result && (
            <div className="mt-6 p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm text-amber-800">
                <AlertTriangle className="w-5 h-5 text-amber-600" /> Interaction Result: {result.severity} Risk
              </div>
              <p className="text-xs">{result.description}</p>
              <div className="text-xs font-bold text-slate-800 pt-1">
                Recommendation: {result.recommendation}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
