"use client"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, User, Mail, Building, Phone, Save } from "lucide-react"

export default function AccountPage() {
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [pharmacy, setPharmacy] = useState<any>(null)
  const [form, setForm] = useState({ name: "", phone: "", address: "" })

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push("/"); return }
      setUser(user)
      const { data: pharma } = await supabase.from("pharmacies").select("*").eq("user_id", user.id).single()
      if (pharma) {
        setPharmacy(pharma)
        setForm({ name: pharma.name || "", phone: pharma.phone || "", address: pharma.address || "" })
      }
      setLoading(false)
    }
    init()
  }, [])

  const save = async () => {
    if (!pharmacy) return
    setSaving(true)
    await supabase.from("pharmacies").update({ name: form.name, phone: form.phone, address: form.address }).eq("id", pharmacy.id)
    setSaved(true)
    setSaving(false)
    setTimeout(() => setSaved(false), 3000)
  }

  if (loading) return <div className="flex min-h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-green-600" /></div>

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      <main className="container mx-auto max-w-2xl px-4 py-12">
        <h1 className="mb-8 text-2xl font-bold">Account Settings</h1>

        <Card className="mb-6">
          <CardHeader><CardTitle className="flex items-center gap-2"><User className="h-5 w-5" /> Profile</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-muted-foreground">Email</label>
              <div className="flex items-center gap-2 rounded-md border border-input bg-muted px-3 py-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{user?.email}</span>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Pharmacy Name</label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} className="w-full rounded-md border border-input bg-background py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input value={form.phone} onChange={e => setForm(p => ({...p, phone: e.target.value}))} placeholder="+234..." className="w-full rounded-md border border-input bg-background py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Pharmacy Address</label>
              <textarea value={form.address} onChange={e => setForm(p => ({...p, address: e.target.value}))} rows={2} placeholder="Full address..." className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <Button onClick={save} disabled={saving} className="gap-2 bg-green-600 hover:bg-green-700">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saved ? "Saved!" : "Save Changes"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-red-600">Danger Zone</CardTitle></CardHeader>
          <CardContent>
            <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50" onClick={async () => { await supabase.auth.signOut(); router.push("/") }}>
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
