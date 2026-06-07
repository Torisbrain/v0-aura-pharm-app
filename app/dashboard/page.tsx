"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Package, Users, AlertTriangle, Plus, Loader2, LogOut,
  Bell, TrendingDown, Shield, Zap, BarChart3, ChevronRight,
  CheckCircle, Star, ArrowUpRight, Pill, Activity, Clock, X
} from "lucide-react"

interface InventoryItem { id: string; drug_name: string; stock: number; reorder_level: number; unit: string }
interface Patient { id: string; name: string; phone: string; drug: string; last_taken: string }
interface Pharmacy { id: string; name: string }

function StatCard({ icon: Icon, label, value, color, bg, trend }: any) {
  return (
    <div className={`relative overflow-hidden rounded-2xl p-5 ${bg} border border-white/20 shadow-lg`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-white/70 mb-1">{label}</p>
          <p className={`text-3xl font-extrabold ${color}`}>{value}</p>
        </div>
        <div className="rounded-xl bg-white/20 p-2.5">
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
      {trend && <p className="mt-2 text-xs text-white/60 flex items-center gap-1"><ArrowUpRight className="h-3 w-3" />{trend}</p>}
      {/* Decorative orb */}
      <div className="absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-white/5" />
      <div className="absolute -right-2 -bottom-2 h-12 w-12 rounded-full bg-white/5" />
    </div>
  )
}

export default function Dashboard() {
  const supabase = createClient()
  const router = useRouter()
  const [pharmacy, setPharmacy] = useState<Pharmacy | null>(null)
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<"inventory" | "patients">("inventory")
  const [showAddDrug, setShowAddDrug] = useState(false)
  const [showAddPatient, setShowAddPatient] = useState(false)
  const [newDrug, setNewDrug] = useState({ drug_name: "", stock: "", reorder_level: "50", unit: "units" })
  const [newPatient, setNewPatient] = useState({ name: "", phone: "", drug: "" })
  const [saving, setSaving] = useState(false)
  const [showBanner, setShowBanner] = useState(true)
  const [greeting, setGreeting] = useState("Good morning")

  useEffect(() => {
    const h = new Date().getHours()
    setGreeting(h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening")

    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push("/"); return }

      let { data: pharma } = await supabase.from("pharmacies").select("*").eq("user_id", user.id).single()
      if (!pharma) {
        const { data: newPharma } = await supabase.from("pharmacies")
          .insert({ user_id: user.id, name: user.email?.split("@")[0] + "'s Pharmacy" }).select().single()
        pharma = newPharma
      }
      setPharmacy(pharma)

      const [{ data: inv }, { data: pats }] = await Promise.all([
        supabase.from("inventory").select("*").eq("pharmacy_id", pharma.id).order("drug_name"),
        supabase.from("patients").select("*").eq("pharmacy_id", pharma.id).order("name"),
      ])
      setInventory(inv || [])
      setPatients(pats || [])
      setLoading(false)
    }
    init()
  }, [])

  const signOut = async () => { await supabase.auth.signOut(); router.push("/") }

  const addDrug = async () => {
    if (!pharmacy || !newDrug.drug_name || !newDrug.stock) return
    setSaving(true)
    const { data } = await supabase.from("inventory").insert({
      pharmacy_id: pharmacy.id, drug_name: newDrug.drug_name,
      stock: parseInt(newDrug.stock), reorder_level: parseInt(newDrug.reorder_level), unit: newDrug.unit,
    }).select().single()
    if (data) setInventory(prev => [...prev, data].sort((a, b) => a.drug_name.localeCompare(b.drug_name)))
    setNewDrug({ drug_name: "", stock: "", reorder_level: "50", unit: "units" })
    setShowAddDrug(false)
    setSaving(false)
  }

  const addPatient = async () => {
    if (!pharmacy || !newPatient.name) return
    setSaving(true)
    const { data } = await supabase.from("patients").insert({
      pharmacy_id: pharmacy.id, name: newPatient.name, phone: newPatient.phone, drug: newPatient.drug,
    }).select().single()
    if (data) setPatients(prev => [...prev, data])
    setNewPatient({ name: "", phone: "", drug: "" })
    setShowAddPatient(false)
    setSaving(false)
  }

  const updateStock = async (id: string, newStock: number) => {
    await supabase.from("inventory").update({ stock: newStock }).eq("id", id)
    setInventory(prev => prev.map(i => i.id === id ? { ...i, stock: newStock } : i))
  }

  const deleteItem = async (table: string, id: string) => {
    await supabase.from(table).delete().eq("id", id)
    if (table === "inventory") setInventory(prev => prev.filter(i => i.id !== id))
    else setPatients(prev => prev.filter(p => p.id !== id))
  }

  const lowStock = inventory.filter(i => i.stock <= i.reorder_level)
  const healthScore = inventory.length === 0 ? 100 : Math.round(((inventory.length - lowStock.length) / inventory.length) * 100)

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-green-950">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="h-16 w-16 rounded-2xl bg-green-600 flex items-center justify-center shadow-2xl shadow-green-900">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <div className="absolute -inset-1 rounded-2xl bg-green-500/30 animate-ping" />
        </div>
        <p className="text-green-300 font-medium text-sm animate-pulse">Loading your dashboard…</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f0fdf4]">

      {/* TOP HEADER */}
      <header className="bg-white border-b border-green-100 px-4 py-3 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto max-w-6xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-600 shadow-lg shadow-green-200">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-green-600 font-medium">AuraBridge Health</p>
              <h1 className="text-sm font-bold text-gray-900 leading-tight">{pharmacy?.name}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {lowStock.length > 0 && (
              <div className="relative">
                <Bell className="h-5 w-5 text-red-500" />
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">{lowStock.length}</span>
              </div>
            )}
            <Button variant="ghost" size="sm" onClick={signOut} className="gap-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50">
              <LogOut className="h-4 w-4" /> Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-6xl px-4 py-6">

        {/* PROMO BANNER — upgrade ad */}
        {showBanner && (
          <div className="relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 p-5 shadow-xl shadow-green-200">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="absolute rounded-full border border-white"
                  style={{ width: `${80+i*60}px`, height: `${80+i*60}px`, top: `${-20+i*10}px`, right: `${-20+i*15}px` }} />
              ))}
            </div>
            <button onClick={() => setShowBanner(false)} className="absolute top-3 right-3 text-white/60 hover:text-white">
              <X className="h-4 w-4" />
            </button>
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-white/20 p-3">
                  <Zap className="h-6 w-6 text-yellow-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="rounded-full bg-yellow-400 px-2 py-0.5 text-xs font-bold text-yellow-900">PRO</span>
                    <span className="text-white font-bold text-sm">Upgrade to AuraBridge Professional</span>
                  </div>
                  <p className="text-green-100 text-xs">Unlimited inventory · SMS reminders · Analytics · Priority support</p>
                  <div className="flex items-center gap-3 mt-2">
                    {["Unlimited drugs", "200 patients", "SMS alerts", "Analytics"].map(f => (
                      <span key={f} className="flex items-center gap-1 text-xs text-white/80">
                        <CheckCircle className="h-3 w-3 text-green-300" />{f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <Button className="shrink-0 bg-white text-green-700 hover:bg-green-50 font-bold shadow-lg gap-2 rounded-xl"
                onClick={() => router.push("/pricing")}>
                ₦15,000/mo <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* GREETING */}
        <div className="mb-6">
          <h2 className="text-2xl font-extrabold text-gray-900">{greeting}, {pharmacy?.name?.split("'")[0]}! 👋</h2>
          <p className="text-gray-500 text-sm mt-1">Here's what's happening at your pharmacy today.</p>
        </div>

        {/* STAT CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard icon={Package} label="Drug Items" value={inventory.length} bg="bg-gradient-to-br from-blue-500 to-blue-600" color="text-white" trend="In your inventory" />
          <StatCard icon={AlertTriangle} label="Low Stock" value={lowStock.length} bg="bg-gradient-to-br from-red-500 to-rose-600" color="text-white" trend={lowStock.length > 0 ? "Needs attention" : "All good!"} />
          <StatCard icon={Users} label="Patients" value={patients.length} bg="bg-gradient-to-br from-purple-500 to-violet-600" color="text-white" trend="Registered" />
          <StatCard icon={Activity} label="Health Score" value={`${healthScore}%`} bg="bg-gradient-to-br from-green-500 to-emerald-600" color="text-white" trend="Inventory health" />
        </div>

        {/* LOW STOCK ALERT */}
        {lowStock.length > 0 && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <p className="text-sm font-bold text-red-700">{lowStock.length} drug(s) need restocking</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {lowStock.map(i => (
                <span key={i.id} className="rounded-full bg-red-100 border border-red-200 px-3 py-0.5 text-xs font-medium text-red-700 flex items-center gap-1">
                  <TrendingDown className="h-3 w-3" /> {i.drug_name} ({i.stock} left)
                </span>
              ))}
            </div>
          </div>
        )}

        {/* QUICK ACTIONS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { icon: Shield, label: "Verify Drug", desc: "Scan NAFDAC", color: "bg-green-50 border-green-200 text-green-700", href: "/#pharmverify" },
            { icon: Pill, label: "Check Interaction", desc: "Drug safety", color: "bg-orange-50 border-orange-200 text-orange-700", href: "/interactions" },
            { icon: Users, label: "Consult Doctor", desc: "Book now", color: "bg-blue-50 border-blue-200 text-blue-700", href: "/consult" },
            { icon: BarChart3, label: "View Pricing", desc: "Upgrade plan", color: "bg-purple-50 border-purple-200 text-purple-700", href: "/pricing" },
          ].map(({ icon: Icon, label, desc, color, href }) => (
            <button key={label} onClick={() => router.push(href)}
              className={`flex flex-col items-start gap-2 rounded-2xl border-2 p-4 text-left transition-all hover:shadow-md hover:-translate-y-0.5 ${color}`}>
              <Icon className="h-5 w-5" />
              <div>
                <p className="text-sm font-bold">{label}</p>
                <p className="text-xs opacity-70">{desc}</p>
              </div>
            </button>
          ))}
        </div>

        {/* TABS */}
        <div className="flex gap-2 mb-4">
          {(["inventory", "patients"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${tab === t ? "bg-green-600 text-white shadow-lg shadow-green-200" : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50"}`}>
              {t === "inventory" ? `📦 Inventory (${inventory.length})` : `👥 Patients (${patients.length})`}
            </button>
          ))}
        </div>

        {/* INVENTORY TAB */}
        {tab === "inventory" && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-gray-900">Drug Inventory</h2>
              <Button size="sm" onClick={() => setShowAddDrug(true)} className="gap-1.5 bg-green-600 hover:bg-green-700 rounded-xl shadow-lg shadow-green-200">
                <Plus className="h-4 w-4" /> Add Drug
              </Button>
            </div>

            {showAddDrug && (
              <div className="rounded-2xl border-2 border-green-200 bg-white p-5 shadow-lg">
                <h3 className="font-bold text-sm mb-3 text-green-700">➕ Add New Drug</h3>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <input value={newDrug.drug_name} onChange={e => setNewDrug(p => ({...p, drug_name: e.target.value}))} placeholder="Drug name e.g. Amoxicillin 500mg" className="col-span-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                  <input type="number" value={newDrug.stock} onChange={e => setNewDrug(p => ({...p, stock: e.target.value}))} placeholder="Current stock" className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                  <input type="number" value={newDrug.reorder_level} onChange={e => setNewDrug(p => ({...p, reorder_level: e.target.value}))} placeholder="Reorder at" className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={addDrug} disabled={saving} className="bg-green-600 hover:bg-green-700 rounded-xl">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Drug"}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setShowAddDrug(false)} className="rounded-xl">Cancel</Button>
                </div>
              </div>
            )}

            {inventory.length === 0 && !showAddDrug && (
              <div className="rounded-2xl bg-white border-2 border-dashed border-gray-200 py-16 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50">
                  <Package className="h-8 w-8 text-green-400" />
                </div>
                <p className="font-bold text-gray-700 mb-1">No drugs yet</p>
                <p className="text-sm text-gray-400 mb-4">Add your first drug to start tracking inventory</p>
                <Button size="sm" onClick={() => setShowAddDrug(true)} className="bg-green-600 hover:bg-green-700 rounded-xl gap-1.5">
                  <Plus className="h-4 w-4" /> Add First Drug
                </Button>
              </div>
            )}

            <div className="space-y-2">
              {inventory.map(item => {
                const isLow = item.stock <= item.reorder_level
                const pct = Math.min(100, Math.round((item.stock / Math.max(item.reorder_level * 2, item.stock)) * 100))
                return (
                  <div key={item.id} className={`rounded-2xl bg-white border-2 p-4 transition-all hover:shadow-md ${isLow ? "border-red-200" : "border-transparent"}`}>
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${isLow ? "bg-red-100" : "bg-green-100"}`}>
                          <Pill className={`h-4 w-4 ${isLow ? "text-red-600" : "text-green-600"}`} />
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-gray-900">{item.drug_name}</p>
                          <p className="text-xs text-gray-400">Reorder at {item.reorder_level} {item.unit}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isLow && <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-600">Low</span>}
                        <input type="number" value={item.stock}
                          onChange={e => updateStock(item.id, parseInt(e.target.value) || 0)}
                          className={`w-20 rounded-xl border-2 px-2 py-1 text-sm text-center font-bold focus:outline-none ${isLow ? "border-red-200 text-red-600 bg-red-50" : "border-green-200 text-green-700 bg-green-50"}`}
                        />
                        <span className="text-xs text-gray-400">{item.unit}</span>
                        <button onClick={() => deleteItem("inventory", item.id)} className="text-gray-300 hover:text-red-400 transition-colors">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    {/* Stock bar */}
                    <div className="h-1.5 w-full rounded-full bg-gray-100">
                      <div className={`h-full rounded-full transition-all ${isLow ? "bg-red-400" : "bg-green-400"}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* PATIENTS TAB */}
        {tab === "patients" && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-gray-900">Patient List</h2>
              <Button size="sm" onClick={() => setShowAddPatient(true)} className="gap-1.5 bg-green-600 hover:bg-green-700 rounded-xl shadow-lg shadow-green-200">
                <Plus className="h-4 w-4" /> Add Patient
              </Button>
            </div>

            {showAddPatient && (
              <div className="rounded-2xl border-2 border-green-200 bg-white p-5 shadow-lg">
                <h3 className="font-bold text-sm mb-3 text-green-700">➕ Add New Patient</h3>
                <div className="space-y-2 mb-3">
                  <input value={newPatient.name} onChange={e => setNewPatient(p => ({...p, name: e.target.value}))} placeholder="Patient full name" className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                  <input value={newPatient.phone} onChange={e => setNewPatient(p => ({...p, phone: e.target.value}))} placeholder="+234 phone number" className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                  <input value={newPatient.drug} onChange={e => setNewPatient(p => ({...p, drug: e.target.value}))} placeholder="Current medication" className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={addPatient} disabled={saving} className="bg-green-600 hover:bg-green-700 rounded-xl">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Patient"}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setShowAddPatient(false)} className="rounded-xl">Cancel</Button>
                </div>
              </div>
            )}

            {patients.length === 0 && !showAddPatient && (
              <div className="rounded-2xl bg-white border-2 border-dashed border-gray-200 py-16 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-50">
                  <Users className="h-8 w-8 text-purple-400" />
                </div>
                <p className="font-bold text-gray-700 mb-1">No patients yet</p>
                <p className="text-sm text-gray-400 mb-4">Add patients to track their medications</p>
                <Button size="sm" onClick={() => setShowAddPatient(true)} className="bg-green-600 hover:bg-green-700 rounded-xl gap-1.5">
                  <Plus className="h-4 w-4" /> Add First Patient
                </Button>
              </div>
            )}

            <div className="space-y-2">
              {patients.map((patient, idx) => {
                const colors = ["bg-purple-100 text-purple-700", "bg-blue-100 text-blue-700", "bg-green-100 text-green-700", "bg-orange-100 text-orange-700"]
                const c = colors[idx % colors.length]
                return (
                  <div key={patient.id} className="rounded-2xl bg-white border-2 border-transparent p-4 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-extrabold ${c}`}>
                          {patient.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-gray-900">{patient.name}</p>
                          <p className="text-xs text-gray-400">{patient.drug || "No medication noted"} · {patient.phone || "No phone"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="hidden sm:flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-xs text-green-600">
                          <Clock className="h-3 w-3" /> Active
                        </span>
                        <button onClick={() => deleteItem("patients", patient.id)} className="text-gray-300 hover:text-red-400 transition-colors">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* FOOTER AD */}
        <div className="mt-8 rounded-2xl bg-gradient-to-r from-slate-900 to-green-900 p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              {["#ef4444","#f59e0b","#3b82f6"].map((c,i) => (
                <div key={i} className="h-8 w-8 rounded-full border-2 border-slate-900 flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: c }}>
                  {["A","B","C"][i]}
                </div>
              ))}
            </div>
            <div>
              <p className="font-bold text-sm flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                500+ pharmacies trust AuraBridge
              </p>
              <p className="text-xs text-white/60 mt-0.5">Join Nigeria's fastest-growing pharmacy network</p>
            </div>
          </div>
          <Button className="bg-green-500 hover:bg-green-400 text-white font-bold rounded-xl gap-2 shrink-0"
            onClick={() => router.push("/pricing")}>
            Upgrade Now <ArrowUpRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
