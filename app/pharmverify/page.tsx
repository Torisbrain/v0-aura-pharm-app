'use client'

import React from 'react'
import { PharmVerifyDemo } from '@/components/pharmverify-demo'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function PharmVerifyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4">
      <div className="max-w-4xl mx-auto py-6">
        <Link href="/dashboard" className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <PharmVerifyDemo />
      </div>
    </div>
  )
}
