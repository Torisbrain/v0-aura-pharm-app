import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background px-4 py-20 md:py-32">
      <div className="container mx-auto">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            AI-Powered Pharmacy Intelligence
          </div>
          
          <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Smarter Pharmacy Operations for{" "}
            <span className="text-primary">West Africa</span>
          </h1>
          
          <p className="mb-8 text-pretty text-lg text-muted-foreground md:text-xl">
            AuraBridge Health brings AI pharmacy intelligence built for Nigeria and West Africa. 
            Inventory forecasting, drug interaction checks, adherence nudges, and counterfeit detection — 
            all optimized for low-bandwidth environments.
          </p>
          
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="gap-2">
              Start Free Trial
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline">
              Book a Demo
            </Button>
          </div>
          
          <p className="mt-6 text-sm text-muted-foreground">
            Works on 2G/3G networks. No credit card required.
          </p>
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute -top-40 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
    </section>
  )
}
