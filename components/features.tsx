import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, AlertTriangle, Bell, Shield } from "lucide-react"

const features = [
  {
    icon: BarChart3,
    title: "Inventory AI",
    description: "Demand forecasting and intelligent restock alerts. Know what to order before you run out, reducing stockouts and overstock costs.",
  },
  {
    icon: AlertTriangle,
    title: "Interaction Checker",
    description: "Real-time drug interaction queries at point of dispensing. Protect your patients with instant safety alerts for dangerous combinations.",
  },
  {
    icon: Bell,
    title: "Adherence Nudges",
    description: "SMS and USSD reminders for chronic patients. Improve medication adherence with automated, personalized follow-up messages.",
  },
  {
    icon: Shield,
    title: "PharmVerify",
    description: "AI-powered counterfeit medicine detection. Scan products to get instant authenticity scores and protect your patients from fake drugs.",
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
            Purpose-built tools for West African pharmacies, designed to work reliably on any network connection.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card key={feature.title} className="border-border/50 bg-card transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
