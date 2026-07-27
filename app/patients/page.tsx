'use client'

import React from 'react'
import Link from 'next/link'
import { Shield, ArrowLeft, Users } from 'lucide-react'

export default function PatientsPage() {
  return (
    <div className="min-h-screen bg-[#f2fbf5] text-slate-900 font-sans p-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/dashboard" className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-emerald-700 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-6 h-6 text-emerald-600" />
            <h1 className="text-xl font-extrabold text-slate-900">Patient Directory</h1>
          </div>
          <p className="text-xs text-slate-600">Full chronic patient directory and refill management hub.</p>
        </div>
      </div>
    </div>
  )
}
