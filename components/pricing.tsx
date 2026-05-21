import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"

const plans = [
  {
    name: "Starter",
    price: "12,000",
    description: "Perfect for small pharmacies getting started with AI tools",
    features: [
      "Inventory AI (up to 500 SKUs)",
      "Basic drug interaction checker",
      "SMS adherence reminders (100/month)",
      "Email support",
      "PharmVerify (50 scans/month)",
    ],
    popular: false,
  },
  {
    name: "Professional",
    price: "20,000",
    description: "For growing pharmacies that need more power and features",
    features: [
      "Inventory AI (unlimited SKUs)",
      "Advanced drug interaction checker",
      "SMS + USSD reminders (500/month)",
      "Priority support",
      "PharmVerify (200 scans/month)",
      "Multi-location support",
      "Analytics dashboard",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "28,000",
    description: "For pharmacy chains and large operations",
    features: [
      "Everything in Professional",
      "Unlimited SMS/USSD reminders",
      "PharmVerify (unlimited scans)",
      "Dedicated account manager",
      "API access",
      "Custom integrations",
      "On-site training",
    ],
    popular: false,
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="bg-background px-4 py-20">
      <div className="container mx-auto">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Simple, Transparent Pricing
          </h2>
          <p className="text-pretty text-lg text-muted-foreground">
            Choose the plan that fits your pharmacy. All plans include a 14-day free trial.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card 
              key={plan.name} 
              className={`relative flex flex-col ${
                plan.popular 
                  ? "border-2 border-primary shadow-lg" 
                  : "border-border/50"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                  Most Popular
                </div>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription className="min-h-[48px]">
                  {plan.description}
                </CardDescription>
                <div className="pt-4">
                  <span className="text-4xl font-bold text-foreground">
                    ₦{plan.price}
                  </span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  variant={plan.popular ? "default" : "outline"}
                >
                  Start Free Trial
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mx-auto mt-12 max-w-xl text-center">
          <p className="text-muted-foreground">
            Need a custom solution?{" "}
            <a href="#contact" className="font-medium text-primary underline-offset-4 hover:underline">
              Contact us
            </a>{" "}
            for enterprise pricing tailored to your pharmacy chain.
          </p>
        </div>
      </div>
    </section>
  )
}
