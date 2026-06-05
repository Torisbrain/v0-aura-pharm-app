"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Shield, Zap, Users } from "lucide-react"
import Image from "next/image"

export function Hero() {
  const openSignup = () => {
    document.dispatchEvent(new CustomEvent("open-auth", { detail: "signup" }))
  }
  const openDemo = () => {
    document.querySelector("#features")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-background to-blue-50/30 px-4 py-16 md:py-24">
      <div className="container mx-auto">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left content */}
          <div className="order-2 lg:order-1">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-1.5 text-sm font-medium text-green-700">
              <Sparkles className="h-4 w-4" />
              AI-Powered Pharmacy Intelligence
            </div>

            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-[3.2rem] leading-tight">
              Smarter Pharmacy{" "}
              <span className="text-green-600">Operations</span>{" "}
              for West Africa
            </h1>

            <p className="mb-8 text-lg text-muted-foreground leading-relaxed">
              AuraBridge Health brings AI pharmacy intelligence built for Nigeria and West Africa.
              Manage inventory, verify drugs, check interactions and consult healthcare professionals — all in one platform.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row mb-10">
              <Button size="lg" className="gap-2 bg-green-600 hover:bg-green-700 text-white px-8 h-12 text-base" onClick={openSignup}>
                Start Free Trial
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="h-12 text-base px-8 border-2" onClick={openDemo}>
                See How It Works
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4 text-green-600" />
                <span>NAFDAC Verified Data</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Zap className="h-4 w-4 text-green-600" />
                <span>Works on 2G/3G</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4 text-green-600" />
                <span>500+ Pharmacies</span>
              </div>
            </div>
          </div>

          {/* Right - Image collage */}
          <div className="order-1 lg:order-2 relative">
            <div className="relative grid grid-cols-2 gap-3">
              {/* Main large image */}
              <div className="col-span-2 overflow-hidden rounded-2xl shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1576671081837-49000212a370?w=800&q=80"
                  alt="Pharmacist serving customer"
                  className="h-56 w-full object-cover"
                />
              </div>
              {/* Two smaller images */}
              <div className="overflow-hidden rounded-xl shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&q=80"
                  alt="Pharmacy medicines"
                  className="h-36 w-full object-cover"
                />
              </div>
              <div className="overflow-hidden rounded-xl shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80"
                  alt="Doctor consultation"
                  className="h-36 w-full object-cover"
                />
              </div>
            </div>

            {/* Floating stats card */}
            <div className="absolute -bottom-4 -left-4 rounded-xl bg-white border border-border shadow-xl p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                <Shield className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">NAFDAC Database</p>
                <p className="font-bold text-foreground">9,000+ Drugs Verified</p>
              </div>
            </div>

            {/* Floating online badge */}
            <div className="absolute -top-3 -right-3 rounded-full bg-green-600 text-white text-xs font-medium px-3 py-1.5 shadow-lg flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
              Live & Active
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
