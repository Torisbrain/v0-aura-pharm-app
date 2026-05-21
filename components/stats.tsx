import { Wifi, Users, Building2, Globe } from "lucide-react"

const stats = [
  {
    icon: Building2,
    value: "500+",
    label: "Pharmacies Onboarded",
  },
  {
    icon: Users,
    value: "50,000+",
    label: "Patients Served Monthly",
  },
  {
    icon: Globe,
    value: "5",
    label: "Countries in West Africa",
  },
  {
    icon: Wifi,
    value: "2G/3G",
    label: "Network Compatible",
  },
]

export function Stats() {
  return (
    <section className="bg-primary px-4 py-16">
      <div className="container mx-auto">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-foreground/10">
                <stat.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="text-3xl font-bold text-primary-foreground md:text-4xl">
                {stat.value}
              </div>
              <div className="mt-1 text-sm text-primary-foreground/80">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
