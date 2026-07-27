'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { ShieldCheck, Stethoscope, Video, MessageSquare, Clock, FileText, ShoppingBag, ArrowRight, Star, LogOut, CheckCircle2 } from 'lucide-react'

const MOCK_DOCTORS = [
  { id: 'd1', name: 'Dr. Amina Bello', specialty: 'General Physician & Telemedicine', price: 5000, availability: 'Available Now', avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300' },
  { id: 'd2', name: 'Dr. Chidi Nnamdi', specialty: 'Clinical Pharmacology Specialist', price: 7500, availability: 'In 15 mins', avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300' },
  { id: 'd3', name: 'Dr. Yetunde Ogundipe', specialty: 'Pediatrician & Family Health', price: 6000, availability: 'Available Today', avatar: 'https://images.unsplash.com/photo-1594824813566-88855ce7890f?auto=format&fit=crop&q=80&w=300' }
]

export default function PatientHomePage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'consult' | 'prescriptions' | 'reminders'>('consult')
  const [inVideo, setInVideo] = useState(false)
  const [selectedDoc, setSelectedDoc] = useState<any>(null)

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16">
      
      {/* Header Bar */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-400">AuraBridge Health</span>
              <h1 className="text-sm font-black text-slate-100">Patient Care Hub</h1>
            </div>
          </div>

          <button onClick={handleSignOut} className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pt-6">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-emerald-900/60 to-slate-900 border border-emerald-500/30 rounded-2xl p-6 mb-6">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Patient Portal
          </span>
          <h2 className="text-2xl font-black text-slate-100 mt-2">Welcome to Your Personal Health Portal 👋</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Book instant video consultations with licensed doctors, view your digital e-prescriptions, and manage your dosage care plan.
          </p>

          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setActiveTab('consult')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'consult' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'}`}
            >
              <Stethoscope className="w-4 h-4 inline mr-1" /> Telehealth Booking
            </button>
            <button
              onClick={() => setActiveTab('prescriptions')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'prescriptions' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'}`}
            >
              <FileText className="w-4 h-4 inline mr-1" /> E-Prescriptions Wallet
            </button>
          </div>
        </div>

        {/* ACTIVE VIDEO SESSION SIMULATOR */}
        {inVideo && selectedDoc && (
          <div className="bg-slate-900 border border-emerald-500 rounded-2xl p-6 mb-8 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                <h3 className="font-bold text-emerald-400">Live Virtual Session: {selectedDoc.name}</h3>
              </div>
              <button onClick={() => setInVideo(false)} className="text-xs font-bold text-rose-400 bg-rose-500/10 px-3 py-1.5 rounded-lg border border-rose-500/30">
                End Call
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-h-[240px]">
              <div className="md:col-span-2 bg-slate-950 rounded-xl flex flex-col items-center justify-center p-6 border border-slate-800">
                <img src={selectedDoc.avatar} alt={selectedDoc.name} className="w-24 h-24 rounded-full border-2 border-emerald-500 mb-3 object-cover" />
                <h4 className="font-bold text-white">{selectedDoc.name}</h4>
                <p className="text-xs text-slate-400">{selectedDoc.specialty}</p>
                <span className="mt-3 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                  <Video className="w-3.5 h-3.5 inline mr-1" /> HD Encrypted Session
                </span>
              </div>

              <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Doctor Notes</h4>
                  <p className="text-xs text-slate-400">
                    Evaluating symptoms. Generating NAFDAC verified e-prescription for instant pharmacy fulfillment.
                  </p>
                </div>
                <button onClick={() => { setInVideo(false); alert('E-Prescription issued to your wallet!'); }} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2 rounded-lg">
                  Issue Digital Prescription
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: DOCTORS DIRECTORY */}
        {activeTab === 'consult' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {MOCK_DOCTORS.map((doc) => (
              <div key={doc.id} className="bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-5 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <img src={doc.avatar} alt={doc.name} className="w-14 h-14 rounded-full border-2 border-emerald-500 object-cover" />
                  <div>
                    <h3 className="font-bold text-sm text-slate-100">{doc.name}</h3>
                    <p className="text-xs text-emerald-400 font-semibold">{doc.specialty}</p>
                  </div>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex justify-between text-xs mb-4">
                  <span className="text-slate-400">Status: <strong className="text-emerald-400">{doc.availability}</strong></span>
                  <span className="text-slate-200 font-bold">₦{doc.price.toLocaleString()}</span>
                </div>

                <button
                  onClick={() => { setSelectedDoc(doc); setInVideo(true); }}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 rounded-xl flex items-center justify-center gap-1.5 shadow"
                >
                  <Video className="w-4 h-4" /> Start Video Consultation
                </button>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: PRESCRIPTIONS WALLET */}
        {activeTab === 'prescriptions' && (
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                <div>
                  <span className="font-bold text-emerald-400 text-sm">Script #RX-9021</span>
                  <p className="text-xs text-slate-400">Prescribed by Dr. Amina Bello (Acute Bronchial Infection)</p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Ready for Dispatch
                </span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
                <p>• Amoxicillin / Clavulanate 625mg — 1 tablet 12-hourly for 7 days</p>
                <p>• Paracetamol 500mg Extra — 2 tablets 8-hourly for 3 days</p>
              </div>
            </div>
          </div>
        )}

      </main>

    </div>
  )
}
