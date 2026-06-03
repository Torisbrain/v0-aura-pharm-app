"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Users, AlertTriangle, Plus, Loader2, LogOut, Bell, TrendingDown } from "lucide-react"

interface InventoryItem {
  id: string
  drug_name: string
  stock: number
  reorder_level: number
  unit: string
}

interface Patient {
  id: string
  name: string
  phone: string
  drug: string
  last_taken: string
}

interface Pharmacy {
  id: string
  name: string
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

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push("/"); return }

      // Get or create pharmacy
      let { data: pharma } = await supabase
        .from("pharmacies")
        .select("*")
        .eq("user_id", user.id)
        .single()

      if (!pharma) {
        const { data: newPharma } = await supabase
          .from("pharmacies")
          .insert({ user_id: user.id, name: user.email?.split("@")[0] + "'s Pharmacy" })
          .select()
          .single()
        pharma = newPharma
      }

      setPharmacy(pharma)

      // Load inventory and patients
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

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const addDrug = async () => {
    if (!pharmacy || !newDrug.drug_name || !newDrug.stock) return
    setSaving(true)
    const { data } = await supabase.from("inventory").insert({
      pharmacy_id: pharmacy.id,
      drug_name: newDrug.drug_name,
      stock: parseInt(newDrug.stock),
      reorder_level: parseInt(newDrug.reorder_level),
      unit: newDrug.unit,
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
      pharmacy_id: pharmacy.id,
      name: newPatient.name,
      phone: newPatient.phone,
      drug: newPatient.drug,
    }).select().single()
    if (data) setPatients(prev => [...prev, data])
    setNewPatient({ name: "", phone: "", drug: "" })
    setShowAddPatient(false)
    setSaving(false)
  }

  const updateStock = async (id: string, newStock: number) => {
    await supabase.from("inventory").update({ stock: newStock, updated_at: new Date().toISOString() }).eq("id", id)
    setInventory(prev => prev.map(i => i.id === id ? { ...i, stock: newStock } : i))
  }

  const deleteItem = async (table: string, id: string) => {
    await supabase.from(table).delete().eq("id", id)
    if (table === "inventory") setInventory(prev => prev.filter(i => i.id !== id))
    else setPatients(prev => prev.filter(p => p.id !== id))
  }

  const lowStock = inventory.filter(i => i.stock <= i.reorder_level)

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-green-600" />
    </div>
  )

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="border-b bg-background px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-foreground">{pharmacy?.name}</h1>
          <p className="text-xs text-muted-foreground">AuraBridge Dashboard</p>
        </div>
        <Button variant="ghost" size="sm" onClick={signOut} className="gap-2">
          <LogOut className="h-4 w-4" /> Sign Out
        </Button>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <Package className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{inventory.length}</p>
                <p className="text-xs text-muted-foreground">Drug Items</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-2xl font-bold text-red-600">{lowStock.length}</p>
                <p className="text-xs text-muted-foreground">Low Stock</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <Users className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{patients.length}</p>
                <p className="text-xs text-muted-foreground">Patients</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Low stock alert */}
        {lowStock.length > 0 && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3">
            <p className="text-sm font-medium text-red-700 flex items-center gap-2">
              <Bell className="h-4 w-4" /> {lowStock.length} drug(s) need restocking: {lowStock.map(i => i.drug_name).join(", ")}
            </p>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <button onClick={() => setTab("inventory")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === "inventory" ? "bg-green-600 text-white" : "bg-background border border-border text-muted-foreground hover:bg-muted"}`}>
            Inventory
          </button>
          <button onClick={() => setTab("patients")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === "patients" ? "bg-green-600 text-white" : "bg-background border border-border text-muted-foreground hover:bg-muted"}`}>
            Patients
          </button>
        </div>

        {/* Inventory Tab */}
        {tab === "inventory" && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold">Drug Inventory</h2>
              <Button size="sm" onClick={() => setShowAddDrug(true)} className="gap-1 bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4" /> Add Drug
              </Button>
            </div>

            {showAddDrug && (
              <Card className="border-green-200">
                <CardContent className="p-4 space-y-3">
                  <h3 className="font-medium text-sm">Add New Drug</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <input value={newDrug.drug_name} onChange={e => setNewDrug(p => ({...p, drug_name: e.target.value}))} placeholder="Drug name e.g. Amoxicillin 500mg" className="col-span-2 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                    <input type="number" value={newDrug.stock} onChange={e => setNewDrug(p => ({...p, stock: e.target.value}))} placeholder="Current stock" className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                    <input type="number" value={newDrug.reorder_level} onChange={e => setNewDrug(p => ({...p, reorder_level: e.target.value}))} placeholder="Reorder at" className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={addDrug} disabled={saving} className="bg-green-600 hover:bg-green-700">
                      {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setShowAddDrug(false)}>Cancel</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {inventory.length === 0 && !showAddDrug && (
              <div className="text-center py-12 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>No drugs in inventory yet. Add your first drug.</p>
              </div>
            )}

            {inventory.map(item => (
              <Card key={item.id} className={item.stock <= item.reorder_level ? "border-red-200" : ""}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1">
                      <Package className={`h-5 w-5 shrink-0 ${item.stock <= item.reorder_level ? "text-red-500" : "text-green-500"}`} />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.drug_name}</p>
                        <p className="text-xs text-muted-foreground">Reorder at: {item.reorder_level} {item.unit}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.stock <= item.reorder_level && <TrendingDown className="h-4 w-4 text-red-500" />}
                      <input
                        type="number"
                        value={item.stock}
                        onChange={e => updateStock(item.id, parseInt(e.target.value) || 0)}
                        className={`w-20 rounded-md border px-2 py-1 text-sm text-center font-bold focus:outline-none focus:ring-2 focus:ring-green-500 ${item.stock <= item.reorder_level ? "border-red-300 text-red-600 bg-red-50" : "border-green-300 text-green-600 bg-green-50"}`}
                      />
                      <span className="text-xs text-muted-foreground">{item.unit}</span>
                      <button onClick={() => deleteItem("inventory", item.id)} className="text-muted-foreground hover:text-red-500 text-xs">✕</button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Patients Tab */}
        {tab === "patients" && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold">Patient List</h2>
              <Button size="sm" onClick={() => setShowAddPatient(true)} className="gap-1 bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4" /> Add Patient
              </Button>
            </div>

            {showAddPatient && (
              <Card className="border-green-200">
                <CardContent className="p-4 space-y-3">
                  <h3 className="font-medium text-sm">Add New Patient</h3>
                  <div className="space-y-2">
                    <input value={newPatient.name} onChange={e => setNewPatient(p => ({...p, name: e.target.value}))} placeholder="Patient full name" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                    <input value={newPatient.phone} onChange={e => setNewPatient(p => ({...p, phone: e.target.value}))} placeholder="+234 phone number" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                    <input value={newPatient.drug} onChange={e => setNewPatient(p => ({...p, drug: e.target.value}))} placeholder="Current medication" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={addPatient} disabled={saving} className="bg-green-600 hover:bg-green-700">
                      {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setShowAddPatient(false)}>Cancel</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {patients.length === 0 && !showAddPatient && (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>No patients added yet.</p>
              </div>
            )}

            {patients.map(patient => (
              <Card key={patient.id}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-100 text-sm font-bold text-purple-700">
                      {patient.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{patient.name}</p>
                      <p className="text-xs text-muted-foreground">{patient.drug} · {patient.phone}</p>
                    </div>
                  </div>
                  <button onClick={() => deleteItem("patients", patient.id)} className="text-muted-foreground hover:text-red-500 text-xs">✕</button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
