'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { CameraCapture } from '@/components/camera-capture'
import { 
  Shield, Zap, ChevronRight, PhoneCall, HeartHandshake, Stethoscope, 
  Package, AlertTriangle, Users, Activity, Plus, Camera, Search, 
  Trash2, Edit3, Send, CheckCircle2, X, RefreshCw, LogOut, Bell
} from 'lucide-react'

const INITIAL_DRUGS = [
  { id: '1', name: 'Coartem 80/480mg', category: 'Antimalarial', price: 3200, stock: 145, nafdac: 'NAFDAC Reg B4-1029', source: 'manual' },
  { id: '2', name: 'Augmentin 625mg', category: 'Antibiotics', price: 8500, stock: 68, nafdac: 'NAFDAC Reg A4-0812', source: 'manual' },
  { id: '3', name: 'Glucophage 500mg', category: 'Diabetes Care', price: 4100, stock: 210, nafdac: 'NAFDAC Reg 04-2910', source: 'manual' },
  { id: '4', name: 'Paracetamol 500mg Extra', category: 'Pain Relief', price: 950, stock: 450, nafdac: 'NAFDAC Reg 04-1023', source: 'manual' }
]

const INITIAL_PATIENTS = [
  { id: '1', name: 'Toriola Adeyemi', phone: '+234 802 111 2233', adherence: 92, condition: 'Hypertension', lastRefill: '2026-07-15', carePlan: 'Take Amlodipine 10mg daily after breakfast' },
  { id: '2', name: 'Emem Bassey', phone: '+234 813 999 8877', adherence: 54, condition: 'Type 2 Diabetes', lastRefill: '2026-06-20', carePlan: 'Glucophage 500mg twice daily with meals' },
  { id: '3', name: 'Babatunde Sanusi', phone: '+234 803 444 5566', adherence: 78, condition: 'Asthma', lastRefill: '2026-07-02', carePlan: 'Ventolin inhaler 2 puffs as needed for shortness of breath' }
]

function getTimeGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 17) return "Good afternoon"
  return "Good evening"
}

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  
  const [drugs, setDrugs] = useState<any[]>(INITIAL_DRUGS)
  const [patients, setPatients] = useState<any[]>(INITIAL_PATIENTS)
  const [searchTerm, setSearchTerm] = useState('')
  
  const [showAddModal, setShowAddModal] = useState(false)
  const [showScanModal, setShowScanModal] = useState(false)
  const [showSosModal, setShowSosModal] = useState(false)
  const [showTriageModal, setShowTriageModal] = useState(false)
  const [triageStep, setTriageStep] = useState(1)
  const [triageSymptom, setTriageSymptom] = useState('')
  const [triageSeverity, setTriageSeverity] = useState('')
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  const [showCarePlanModal, setShowCarePlanModal] = useState(false)

  const [drugName, setDrugName] = useState('')
  const [category, setCategory] = useState('Antibiotics')
  const [price, setPrice] = useState('3500')
  const [stock, setStock] = useState('100')
  const [nafdac, setNafdac] = useState('')
  const [scanSource, setScanSource] = useState<'manual' | 'ai_scan'>('manual')

  const [scanning, setScanning] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [carePlanText, setCarePlanText] = useState('')
  const [refillDate, setRefillDate] = useState('')

  useEffect(() => {
    async function loadData() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session?.user) {
          router.push('/')
          return
        }
        setUser(session.user)

        const { data: dbDrugs } = await supabase.from('drugs').select('*')
        if (dbDrugs && dbDrugs.length > 0) {
          setDrugs(dbDrugs)
        }

        const { data: dbPatients } = await supabase.from('patients').select('*')
        if (dbPatients && dbPatients.length > 0) {
          setPatients(dbPatients)
        }
      } catch (err) {
        console.error('Data load error:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [router])

  const handlePhotoCaptured = async (base64: string, mediaType: string) => {
    setScanning(true)

    try {
      const res = await fetch("/api/scan-drug", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64, mediaType }),
      })
      const data = await res.json()

      setDrugName(data.drugName || "Unable to identify - please enter manually")
      setCategory(data.category || "Antibiotics")
      setNafdac(data.nafdac || "")
      setScanSource("ai_scan")
    } catch (err) {
      console.error("Scan failed:", err)
      setDrugName("Scan failed - please enter manually")
    } finally {
      setScanning(false)
      setShowScanModal(false)
      setShowAddModal(true)
    }
  }

  const handleAddDrug = async (e: React.FormEvent) => {
    e.preventDefault()
    const newDrug = {
      id: `d-${Date.now()}`,
      name: drugName,
      category,
      price: parseFloat(price) || 0,
      stock: parseInt(stock) || 0,
      nafdac,
      source: scanSource,
      updated_at: new Date().toISOString()
    }

    setDrugs(prev => [newDrug, ...prev])
    
    try {
      await supabase.from('drugs').insert(newDrug)
    } catch (err) {
      console.log('Supabase insert fallback:', err)
    }

    setShowAddModal(false)
    resetForm()
  }

  const resetForm = () => {
    setDrugName('')
    setCategory('Antibiotics')
    setPrice('3500')
    setStock('100')
    setNafdac('')
    setScanSource('manual')
  }

  const handleDeleteDrug = async (id: string) => {
    setDrugs(prev => prev.filter(d => d.id !== id))
    try {
      await supabase.from('drugs').delete().eq('id', id)
    } catch (err) { console.log(err) }
  }

  const handleSendReminder = async (patient: any) => {
    try {
      await fetch('/api/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName: patient.name,
          phone: patient.phone,
          message: `AuraBridge Care Reminder: Hello ${patient.name}, it is time for your medication refill (${patient.carePlan}).`
        })
      })
      alert(`Reminder notification sent to ${patient.name} (${patient.phone})`)
    } catch (err) {
      alert(`Reminder queued for ${patient.name}`)
    }
  }

  const handleSaveCarePlan = async () => {
    if (!selectedPatient) return
    const updated = patients.map(p => 
      p.id === selectedPatient.id 
        ? { ...p, carePlan: carePlanText, lastRefill: refillDate || p.lastRefill } 
        : p
    )
    setPatients(updated)
    
    try {
      await supabase.from('patients').upsert({
        id: selectedPatient.id,
        care_plan: carePlanText,
        last_refill: refillDate || selectedPatient.lastRefill
      })
    } catch (err) { console.log(err) }

    setShowCarePlanModal(false)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const getRiskBadge = (adherence: number) => {
    if (adherence < 60) {
      return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-700 border border-rose-300">High Risk ({adherence}%)</span>
    } else if (adherence <= 85) {
      return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">Moderate Risk ({adherence}%)</span>
    }
    return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">Low Risk ({adherence}%)</span>
  }

  const lowStockCount = drugs.filter(d => d.stock < 100).length
  const filteredDrugs = drugs.filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()))

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-emerald-50 text-emerald-900">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-bold">Loading Dashboard…</p>
        </div>
      </div>
    )
  }

  const pharmacyName = user?.user_metadata?.pharmacy_name || user?.user_metadata?.full_name || "victoriarobintoris32's Pharmacy"

  return (
    <div className="min-h-screen bg-[#f2fbf5] text-slate-900 font-sans pb-16">
      
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#00a859] rounded-xl flex items-center justify-center shadow-md shadow-emerald-600/20">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#00a859] block">AuraBridge Health</span>
              <h1 className="text-base font-extrabold text-slate-900 leading-tight">{pharmacyName}</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleSignOut}
              className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        
        <div className="bg-gradient-to-r from-[#00a859] to-[#059669] text-white rounded-2xl p-5 shadow-lg mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded bg-yellow-300 text-yellow-950 font-black text-xs">PRO</span>
                <strong className="text-lg font-bold">Upgrade to AuraBridge Professional</strong>
              </div>
              <p className="text-xs text-white/90 mb-1">
                Unlimited Inventory · SMS reminders · Analytics · Priority support
              </p>
              <div className="flex flex-wrap gap-3 text-[11px] text-white/95 font-medium">
                <span>✓ Unlimited drugs</span>
                <span>✓ 200 patients</span>
                <span>✓ SMS alerts</span>
                <span>✓ Analytics</span>
              </div>
            </div>
          </div>

          <button className="bg-white text-[#00a859] font-extrabold text-sm px-4 py-2.5 rounded-full shadow-md hover:scale-105 transition-all flex items-center gap-1 shrink-0">
            ₦15,000/mo <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-black text-slate-900">
            {getTimeGreeting()}, {user?.user_metadata?.full_name || 'Victoria Robin'}! 👋
          </h2>
          <p className="text-sm text-slate-600">Here's what's happening at your pharmacy today.</p>
        </div>

        <div className="bg-white border border-emerald-200/80 rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#00a859]">Care center</span>
              <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">Fast-track patient support in one tap</h3>
              <p className="text-xs text-slate-600 mt-1">
                Open urgent workflows for SOS, triage, CareShift referrals, or doctor consults without leaving the dashboard.
              </p>
            </div>
            <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center">
              <Shield className="w-5 h-5 text-[#00a859]" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div 
              onClick={() => setShowSosModal(true)}
              className="bg-red-50/80 border border-red-200 rounded-xl p-4 cursor-pointer hover:border-red-400 transition-all"
            >
              <div className="flex items-center gap-2 font-bold text-sm text-red-700 mb-1">
                <PhoneCall className="w-4 h-4 text-red-600" /> Emergency SOS
              </div>
              <p className="text-xs text-red-900/80">Call emergency services or guide patients to nearby care.</p>
            </div>

            <div 
              onClick={() => setShowTriageModal(true)}
              className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 cursor-pointer hover:border-amber-400 transition-all"
            >
              <div className="flex items-center gap-2 font-bold text-sm text-amber-800 mb-1">
                <HeartHandshake className="w-4 h-4 text-amber-600" /> AuraMedic
              </div>
              <p className="text-xs text-amber-900/80">Start a guided triage flow for safe next steps and referrals.</p>
            </div>

            <Link 
              href="/consult"
              className="bg-blue-50/80 border border-blue-200 rounded-xl p-4 cursor-pointer hover:border-blue-400 transition-all block"
            >
              <div className="flex items-center gap-2 font-bold text-sm text-blue-700 mb-1">
                <Stethoscope className="w-4 h-4 text-blue-600" /> Doctor Consultation
              </div>
              <p className="text-xs text-blue-900/80">Book a real consultation or open the help desk quickly.</p>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl p-5 shadow-md flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold opacity-90">Drug Items</span>
              <h4 className="text-2xl font-black mt-1">{drugs.length} items</h4>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <Package className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-rose-600 to-rose-700 text-white rounded-2xl p-5 shadow-md flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold opacity-90">Low Stock</span>
              <h4 className="text-2xl font-black mt-1">{lowStockCount} items</h4>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-2xl p-5 shadow-md flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold opacity-90">Patients</span>
              <h4 className="text-2xl font-black mt-1">{patients.length} active</h4>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white rounded-2xl p-5 shadow-md flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold opacity-90">Health Score</span>
              <h4 className="text-2xl font-black mt-1">98% Excellent</h4>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <Activity className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-black text-slate-900">Inventory Catalog</h3>
              <p className="text-xs text-slate-500">Manage NAFDAC verified drugs, pricing in ₦ NGN, and stock levels.</p>
            </div>

            <div className="flex items-center gap-2">
              <CameraCapture
                open={showCamera}
                onClose={() => setShowCamera(false)}
                onCapture={handlePhotoCaptured}
              />

              <button
                onClick={() => setShowCamera(true)}
                className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                <Camera className="w-4 h-4" /> 📷 Scan & Add Stock
              </button>

              <button
                onClick={() => { resetForm(); setShowAddModal(true); }}
                className="bg-[#00a859] hover:bg-[#008746] text-white font-bold text-xs px-3.5 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> + Add Drug
              </button>
            </div>
          </div>

          <div className="mb-4">
            <input
              type="text"
              placeholder="Search drug name or category…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-900 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-600 font-bold text-xs border-b border-slate-200">
                <tr>
                  <th className="p-3">Drug Name</th>
                  <th className="p-3">NAFDAC Reg No.</th>
                  <th className="p-3">Price (₦)</th>
                  <th className="p-3">Stock Count</th>
                  <th className="p-3">Source</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDrugs.map((drug) => (
                  <tr key={drug.id} className="hover:bg-slate-50">
                    <td className="p-3">
                      <strong className="font-bold text-slate-900 block">{drug.name}</strong>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full inline-block mt-0.5">{drug.category}</span>
                    </td>
                    <td className="p-3 font-semibold text-emerald-600 text-xs">{drug.nafdac || '—'}</td>
                    <td className="p-3 font-extrabold text-slate-900">₦{drug.price?.toLocaleString()}</td>
                    <td className="p-3">
                      <span className={`font-bold ${drug.stock < 100 ? 'text-amber-600' : 'text-slate-700'}`}>
                        {drug.stock} units
                      </span>
                    </td>
                    <td className="p-3">
                      {drug.source === 'ai_scan' ? (
                        <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-300">Claude Vision 📷</span>
                      ) : (
                        <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">Manual</span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <button onClick={() => handleDeleteDrug(drug.id)} className="text-rose-600 hover:text-rose-800 p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-black text-slate-900">Patient Adherence & Care Plans</h3>
              <p className="text-xs text-slate-500">Monitor risk badges derived from patient refill history and send care reminders.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-600 font-bold text-xs border-b border-slate-200">
                <tr>
                  <th className="p-3">Patient Name</th>
                  <th className="p-3">Condition</th>
                  <th className="p-3">Risk Level</th>
                  <th className="p-3">Care Plan Instructions</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {patients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-slate-50">
                    <td className="p-3">
                      <strong className="font-bold text-slate-900 block">{patient.name}</strong>
                      <span className="text-xs text-slate-500">{patient.phone}</span>
                    </td>
                    <td className="p-3 font-semibold text-slate-700">{patient.condition}</td>
                    <td className="p-3">{getRiskBadge(patient.adherence)}</td>
                    <td className="p-3 text-xs text-slate-600 max-w-xs truncate">{patient.carePlan}</td>
                    <td className="p-3 text-right flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setSelectedPatient(patient)
                          setCarePlanText(patient.carePlan)
                          setRefillDate(patient.lastRefill)
                          setShowCarePlanModal(true)
                        }}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Care Plan
                      </button>

                      <button
                        onClick={() => handleSendReminder(patient)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 shadow"
                      >
                        <Send className="w-3.5 h-3.5" /> Send Reminder
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {scanning && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center">
          <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-6 text-center text-white max-w-sm">
            <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h4 className="font-bold text-lg">Claude Vision Scanning Drug Box…</h4>
            <p className="text-xs text-slate-400 mt-2">Extracting drug name, category, and NAFDAC registration number.</p>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-lg text-slate-900">
                {scanSource === 'ai_scan' ? '📷 Confirm Claude AI Scanned Drug' : '+ Add Drug to Catalog'}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddDrug} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Drug Name & Strength</label>
                <input
                  type="text"
                  required
                  value={drugName}
                  onChange={(e) => setDrugName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">NAFDAC Registration Number</label>
                <input
                  type="text"
                  value={nafdac}
                  onChange={(e) => setNafdac(e.target.value)}
                  placeholder="e.g. NAFDAC Reg A4-1029"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Price (₦ NGN)</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Pharmacist set price"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Initial Stock</label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="Pharmacist set stock"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm text-slate-900"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 bg-slate-100 text-slate-700 py-2 rounded-lg font-bold text-xs">
                  Cancel
                </button>
                <button type="submit" className="flex-1 bg-[#00a859] hover:bg-[#008746] text-white py-2 rounded-lg font-bold text-xs shadow">
                  Save Drug
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showSosModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center shadow-2xl border border-red-200">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <PhoneCall className="w-6 h-6" />
            </div>
            <h3 className="font-black text-lg text-slate-900">Emergency SOS Dispatch</h3>
            <p className="text-xs text-slate-600 mt-1 mb-4">Directly trigger Nigerian national emergency medical dispatch (112).</p>

            <a
              href="tel:112"
              className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl block shadow-md text-sm mb-2"
            >
              📞 Call Emergency 112 Now
            </a>

            <button onClick={() => setShowSosModal(false)} className="text-xs font-semibold text-slate-500 hover:text-slate-800">
              Close Workflow
            </button>
          </div>
        </div>
      )}

      {showCarePlanModal && selectedPatient && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-slate-200">
            <h3 className="font-black text-lg text-slate-900 mb-1">Edit Care Plan: {selectedPatient.name}</h3>
            <p className="text-xs text-slate-500 mb-4">Update dosage instructions and target refill date.</p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Care Plan / Dosage Instructions</label>
                <textarea
                  rows={3}
                  value={carePlanText}
                  onChange={(e) => setCarePlanText(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Refill Date</label>
                <input
                  type="date"
                  value={refillDate}
                  onChange={(e) => setRefillDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm text-slate-900"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button type="button" onClick={() => setShowCarePlanModal(false)} className="flex-1 bg-slate-100 text-slate-700 py-2 rounded-lg font-bold text-xs">
                  Cancel
                </button>
                <button type="button" onClick={handleSaveCarePlan} className="flex-1 bg-[#00a859] text-white py-2 rounded-lg font-bold text-xs shadow">
                  Save Care Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Triage Modal */}
      {showTriageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-xl font-semibold">Care Triage</h3>
            
            {triageStep === 1 && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">Select main symptom category:</p>
                <div className="grid grid-cols-2 gap-3">
                  {['Fever', 'Pain', 'Breathing', 'Injury', 'Other'].map(sym => (
                    <button
                      key={sym}
                      onClick={() => { setTriageSymptom(sym); setTriageStep(2); }}
                      className={`rounded-lg border p-3 text-sm font-medium transition-colors hover:border-primary hover:bg-primary/5 ${triageSymptom === sym ? 'border-primary bg-primary/10' : ''}`}
                    >
                      {sym}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {triageStep === 2 && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">Symptom: {triageSymptom}</p>
                <p className="text-sm text-gray-600">Select severity:</p>
                <div className="flex flex-col gap-3">
                  {['Mild', 'Moderate', 'Severe'].map(sev => (
                    <button
                      key={sev}
                      onClick={() => { setTriageSeverity(sev); setTriageStep(3); }}
                      className={`rounded-lg border p-3 text-left text-sm font-medium transition-colors hover:border-primary hover:bg-primary/5 ${triageSeverity === sev ? 'border-primary bg-primary/10' : ''}`}
                    >
                      {sev}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setTriageStep(1)}
                  className="mt-2 text-sm text-gray-500 hover:text-gray-700"
                >
                  Back
                </button>
              </div>
            )}

            {triageStep === 3 && (
              <div className="space-y-4">
                <div className="rounded-lg bg-gray-50 p-4">
                  <h4 className="mb-2 font-medium">Recommendation</h4>
                  <p className="text-sm text-gray-600">
                    {triageSeverity === 'Mild' && "Self-care at home. Rest, hydrate, and monitor. Revisit pharmacy if symptoms persist > 48 hours."}
                    {triageSeverity === 'Moderate' && "Schedule a pharmacist consultation or book a telemedicine visit via Consult."}
                    {triageSeverity === 'Severe' && "Recommend hospital referral. Consider CareShift emergency pathway."}
                  </p>
                </div>
                
                <div className="flex flex-col gap-3 pt-4">
                  {triageSeverity === 'Severe' && (
                    <button 
                      onClick={() => {
                        fetch('/api/careshift/refer', { method: 'POST' }).catch(console.error);
                        alert("Referral sent to CareShift");
                        setShowTriageModal(false);
                        setTriageStep(1);
                        setTriageSymptom('');
                        setTriageSeverity('');
                      }}
                      className="w-full rounded-lg bg-red-600 py-2 text-white hover:bg-red-700 font-medium transition-colors"
                    >
                      Refer to CareShift
                    </button>
                  )}
                  <button
                    onClick={() => setTriageStep(2)}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Back
                  </button>
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3 border-t pt-4">
              <button
                onClick={() => {
                  setShowTriageModal(false);
                  setTriageStep(1);
                  setTriageSymptom('');
                  setTriageSeverity('');
                }}
                className="rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-100 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}