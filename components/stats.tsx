import { TrendingUp, Users, Building2, Globe, Shield, Clock } from "lucide-react"

const stats = [
  { icon: Building2, value: "500+", label: "Pharmacies Onboarded", color: "text-blue-600 bg-blue-50" },
  { icon: Users, value: "50,000+", label: "Patients Served Monthly", color: "text-purple-600 bg-purple-50" },
  { icon: Globe, value: "5", label: "West African Countries", color: "text-green-600 bg-green-50" },
  { icon: Shield, value: "9,000+", label: "NAFDAC Drugs Verified", color: "text-orange-600 bg-orange-50" },
]

export function Stats() {
  return (
    <section className="bg-background border-y border-border px-4 py-16">
      <div className="container mx-auto">
        <div className="mb-10 text-center">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Trusted across West Africa</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center rounded-2xl border border-border bg-card p-6 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-full ${stat.color}`}>
                <stat.icon className="h-7 w-7" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Logos / Partners row */}
        <div className="mt-12 border-t border-border pt-10">
          <p className="mb-6 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">Built with trusted technology</p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <div className="h-6 w-6 rounded bg-green-600 flex items-center justify-center text-white text-xs font-bold">N</div>
              NAFDAC Greenbook
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <div className="h-6 w-6 rounded bg-blue-600 flex items-center justify-center text-white text-xs font-bold">S</div>
              Supabase
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <div className="h-6 w-6 rounded bg-orange-500 flex items-center justify-center text-white text-xs font-bold">P</div>
              Paystack
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <div className="h-6 w-6 rounded bg-purple-600 flex items-center justify-center text-white text-xs font-bold">A</div>
              Anthropic AI
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
