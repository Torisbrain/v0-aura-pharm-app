import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, AlertTriangle, Bell, Shield, ArrowRight } from "lucide-react"

const features = [
  {
    icon: BarChart3,
    title: "Inventory AI",
    description: "Demand forecasting and intelligent restock alerts with Claude AI vision scanning. Know what to order before stock runs out.",
    href: "/dashboard",
    badge: "Open Dashboard"
  },
  {
    icon: AlertTriangle,
    title: "Interaction Checker",
    description: "Real-time drug interaction queries at point of dispensing. Protect your patients with instant safety alerts for dangerous combinations.",
    href: "/interactions",
    badge: "Check Interactions"
  },
  {
    icon: Bell,
    title: "Adherence Nudges",
    description: "SMS and USSD reminders for chronic patients. Improve medication adherence with automated, personalized follow-up messages.",
    href: "/patient",
    badge: "Patient Portal"
  },
  {
    icon: Shield,
    title: "PharmVerify",
    description: "AI-powered counterfeit medicine detection. Scan products to get instant authenticity scores against NAFDAC Greenbook.",
    href: "/pharmverify",
    badge: "Launch Scanner"
  },
]

export function Features() {
  return (
    <section id="features" className="bg-background px-4 py-20">
      <div className="container mx-auto">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Everything Your Pharmacy Needs
          </h2>
          <p className="text-pretty text-lg text-muted-foreground">
            Click any feature below to launch the live tool in your browser.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Link key={feature.title} href={feature.href} className="group block">
              <Card className="h-full border-emerald-500/20 bg-card transition-all group-hover:border-emerald-500/50 group-hover:shadow-xl group-hover:-translate-y-1 flex flex-col justify-between">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl group-hover:text-emerald-600 transition-colors">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription className="text-sm leading-relaxed">
                    {feature.description}
                  </CardDescription>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 group-hover:text-emerald-500 pt-2">
                    {feature.badge} <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
