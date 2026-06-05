"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Zap, Users, Star } from "lucide-react"

export function Hero() {
  const openSignup = () => document.dispatchEvent(new CustomEvent("open-auth", { detail: "signup" }))
  const openDemo = () => document.querySelector("#features")?.scrollIntoView({ behavior: "smooth" })

  return (
    <section className="relative overflow-hidden bg-white px-4 py-16 md:py-24">
      {/* Background gradient blobs */}
      <div className="absolute top-0 right-0 h-[600px] w-[600px] rounded-full bg-green-100/60 blur-[100px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-blue-100/40 blur-[80px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />

      <div className="container mx-auto relative z-10">
        <div className="grid items-center gap-16 lg:grid-cols-2">

          {/* LEFT */}
          <div>
            {/* Rating badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-amber-50 border border-amber-200 px-4 py-1.5">
              <div className="flex">
                {[1,2,3,4,5].map(i => <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />)}
              </div>
              <span className="text-sm font-medium text-amber-700">Trusted by 500+ pharmacies</span>
            </div>

            <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-gray-900 leading-[1.1] md:text-6xl">
              The Smart Way to{" "}
              <span className="relative">
                <span className="relative z-10 text-green-600">Run Your Pharmacy</span>
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                  <path d="M2 8.5C60 3 150 1 298 8.5" stroke="#86efac" strokeWidth="4" strokeLinecap="round"/>
                </svg>
              </span>
              {" "}in West Africa
            </h1>

            <p className="mb-8 text-xl text-gray-500 leading-relaxed max-w-lg">
              AI-powered inventory, real-time drug verification, interaction checks, and telemedicine — built specifically for Nigerian pharmacies.
            </p>

            <div className="flex flex-wrap gap-4 mb-10">
              <Button size="lg" className="gap-2 bg-green-600 hover:bg-green-700 text-white px-8 h-13 text-base rounded-xl shadow-lg shadow-green-200" onClick={openSignup}>
                Start Free — No Card Needed
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="h-13 text-base px-8 rounded-xl border-2" onClick={openDemo}>
                Watch Demo
              </Button>
            </div>

            {/* Trust row */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100"><Shield className="h-4 w-4 text-green-600" /></div>
                <span className="text-sm text-gray-600 font-medium">NAFDAC Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100"><Zap className="h-4 w-4 text-blue-600" /></div>
                <span className="text-sm text-gray-600 font-medium">Works on 2G/3G</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100"><Users className="h-4 w-4 text-purple-600" /></div>
                <span className="text-sm text-gray-600 font-medium">50,000+ Patients Served</span>
              </div>
            </div>
          </div>

          {/* RIGHT - Image grid */}
          <div className="relative hidden lg:block">
            <div className="grid grid-cols-2 gap-4">
              {/* Top full-width */}
              <div className="col-span-2 rounded-3xl overflow-hidden h-64 shadow-xl ring-1 ring-black/5">
                <img src="https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=900&q=85&fit=crop" alt="African pharmacist helping customer" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
              {/* Bottom two */}
              <div className="rounded-2xl overflow-hidden h-44 shadow-lg ring-1 ring-black/5">
                <img src="https://images.unsplash.com/photo-1550831107-1553da8c8464?w=500&q=85&fit=crop" alt="Pharmacy medicines shelf" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="rounded-2xl overflow-hidden h-44 shadow-lg ring-1 ring-black/5">
                <img src="https://images.unsplash.com/photo-1612277795421-9bc7706a4a34?w=500&q=85&fit=crop" alt="Doctor with patient" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
            </div>

            {/* Floating verified card */}
            <div className="absolute -bottom-5 -left-8 rounded-2xl bg-white border border-gray-100 shadow-2xl p-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 shrink-0">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">NAFDAC Database</p>
                <p className="font-bold text-gray-900 text-sm">9,058 Drugs Verified</p>
              </div>
            </div>

            {/* Floating live badge */}
            <div className="absolute -top-4 -right-4 rounded-2xl bg-green-600 text-white shadow-xl p-3">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-white animate-pulse" />
                <span className="text-xs font-bold">LIVE SYSTEM</span>
              </div>
              <p className="text-xs text-green-100 mt-0.5">Real-time drug data</p>
            </div>

            {/* Floating stat */}
            <div className="absolute top-1/2 -right-6 -translate-y-1/2 rounded-2xl bg-white border border-gray-100 shadow-xl p-3 text-center">
              <p className="text-2xl font-extrabold text-green-600">98%</p>
              <p className="text-xs text-gray-500 font-medium">Accuracy Rate</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
