"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle, X, Loader2, Zap, Building2, Globe } from "lucide-react"

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: 5000,
    priceDisplay: "₦5,000",
    description: "Perfect for small independent pharmacies",
    color: "from-blue-50 to-blue-100/50",
    border: "border-blue-200",
    btn: "border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white",
    icon: Zap,
    iconBg: "bg-blue-100 text-blue-600",
    features: ["PharmVerify unlimited", "Drug Interaction Checker", "50 drug inventory", "AuraBot AI", "20 patients", "Email support"],
    missing: ["Advanced Analytics", "Priority Support", "Multi-branch"],
    popular: false,
  },
  {
    id: "professional",
    name: "Professional",
    price: 15000,
    priceDisplay: "₦15,000",
    description: "For growing pharmacies that need more",
    color: "from-green-600 to-green-700",
    border: "border-green-500",
    btn: "bg-white text-green-700 hover:bg-green-50 font-bold",
    icon: Building2,
    iconBg: "bg-white/20 text-white",
    features: ["Everything in Starter", "Unlimited inventory", "Unlimited patients", "SMS reminders", "Consultation booking", "Analytics dashboard", "Priority WhatsApp support", "3 staff accounts"],
    missing: ["Multi-branch"],
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 45000,
    priceDisplay: "₦45,000",
    description: "For pharmacy chains and healthcare groups",
    color: "from-purple-50 to-purple-100/50",
    border: "border-purple-200",
    btn: "border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white",
    icon: Globe,
    iconBg: "bg-purple-100 text-purple-600",
    features: ["Everything in Professional", "Multi-branch management", "Unlimited staff", "Custom integrations", "Dedicated account manager", "SLA guarantee", "API access", "Custom reports"],
    missing: [],
    popular: false,
  },
]

export function Pricing() {
  const [loading, setLoading] = useState<string | null>(null)
  const [email, setEmail] = useState("")
  const [showModal, setShowModal] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const pay = (planId: string) => setShowModal(planId)

  const doPayment = async (planId: string) => {
    if (!email.trim()) return
    const plan = plans.find(p => p.id === planId)!
    setLoading(planId)
    setShowModal(null)

    const loadPaystack = () => new Promise<void>(resolve => {
      if ((window as any).PaystackPop) return resolve()
      const s = document.createElement("script")
      s.src = "https://js.paystack.co/v1/inline.js"
      s.onload = () => resolve()
      document.head.appendChild(s)
    })

    await loadPaystack()

    const handler = (window as any).PaystackPop.setup({
      key: "pk_test_0e46245f77b55a611e54114577e72ce540945e26",
      email,
      amount: plan.price * 100,
      currency: "NGN",
      ref: `AURA-${Date.now()}`,
      callback: async (res: any) => {
        await fetch("/api/payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, plan: planId, amount: plan.price, reference: res.reference }),
        })
        setSuccess(planId)
        setLoading(null)
      },
      onClose: () => setLoading(null),
    })
    handler.openIframe()
  }

  return (
    <section id="pricing" className="bg-muted/30 px-4 py-20">
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-background p-6 shadow-2xl">
            <h3 className="mb-1 text-lg font-bold">Enter your email</h3>
            <p className="mb-4 text-sm text-muted-foreground">Your receipt will be sent here.</p>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@pharmacy.com" className="mb-4 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" autoFocus onKeyDown={e => e.key === "Enter" && doPayment(showModal)} />
            <Button className="w-full bg-green-600 hover:bg-green-700 mb-2" onClick={() => doPayment(showModal)} disabled={!email.trim()}>Continue to Payment →</Button>
            <button onClick={() => setShowModal(null)} className="w-full text-sm text-muted-foreground hover:text-foreground">Cancel</button>
          </div>
        </div>
      )}

      <div className="container mx-auto">
        <div className="mb-12 text-center">
          <span className="mb-4 inline-block rounded-full bg-green-100 px-4 py-1 text-sm font-medium text-green-700">Simple Pricing</span>
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Choose Your Plan</h2>
          <p className="text-lg text-muted-foreground">14-day free trial on all plans. No credit card required.</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 mx-auto max-w-5xl items-center">
          {plans.map(plan => (
            <div key={plan.id} className={`relative rounded-2xl border-2 ${plan.border} overflow-hidden ${plan.popular ? "scale-105 shadow-2xl" : "shadow-md"} transition-transform hover:scale-[1.02]`}>
              {plan.popular && <div className="absolute top-0 left-0 right-0 bg-green-600 py-1.5 text-center text-xs font-bold text-white tracking-wider">MOST POPULAR</div>}
              <div className={`bg-gradient-to-br ${plan.color} p-6 ${plan.popular ? "pt-10" : ""}`}>
                <div className={`mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl ${plan.iconBg}`}>
                  <plan.icon className="h-5 w-5" />
                </div>
                <h3 className={`text-xl font-bold ${plan.popular ? "text-white" : "text-foreground"}`}>{plan.name}</h3>
                <p className={`text-sm mb-4 ${plan.popular ? "text-green-100" : "text-muted-foreground"}`}>{plan.description}</p>
                <div className={`text-4xl font-extrabold ${plan.popular ? "text-white" : "text-foreground"}`}>
                  {plan.priceDisplay}<span className={`text-base font-normal ${plan.popular ? "text-green-100" : "text-muted-foreground"}`}>/mo</span>
                </div>
              </div>
              <div className="bg-background p-6 space-y-5">
                <div className="space-y-2.5">
                  {plan.features.map(f => (
                    <div key={f} className="flex items-center gap-2.5">
                      <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                      <span className="text-sm">{f}</span>
                    </div>
                  ))}
                  {plan.missing.map(f => (
                    <div key={f} className="flex items-center gap-2.5 opacity-35">
                      <X className="h-4 w-4 shrink-0" />
                      <span className="text-sm line-through">{f}</span>
                    </div>
                  ))}
                </div>
                {success === plan.id ? (
                  <div className="rounded-xl bg-green-50 border border-green-200 p-4 text-center">
                    <CheckCircle className="mx-auto mb-1 h-7 w-7 text-green-600" />
                    <p className="font-semibold text-green-700">Payment Successful!</p>
                    <p className="text-xs text-green-600 mt-1">Welcome to AuraBridge {plan.name} 🎉</p>
                  </div>
                ) : (
                  <Button className={`w-full h-11 text-sm font-semibold rounded-xl ${plan.btn}`} variant="outline" onClick={() => pay(plan.id)} disabled={loading === plan.id}>
                    {loading === plan.id ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Processing...</> : "Get Started →"}
                  </Button>
                )}
                <p className="text-center text-xs text-muted-foreground">14-day free trial • Cancel anytime</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
