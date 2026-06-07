"use client"

import { useState } from "react"
import { X, ExternalLink } from "lucide-react"

interface Ad {
  id: string
  company: string
  tagline: string
  cta: string
  color: string
  textColor: string
  url: string
  badge: string
}

const ads: Ad[] = [
  {
    id: "emzor",
    company: "Emzor Pharmaceuticals",
    tagline: "Nigeria's Most Trusted Drug Manufacturer — Quality You Can Count On",
    cta: "View Products",
    color: "from-blue-600 to-blue-800",
    textColor: "text-white",
    url: "https://emzor.com",
    badge: "Sponsored"
  },
  {
    id: "healthplus",
    company: "HealthPlus Pharmacy",
    tagline: "Order wholesale drugs online — Fast delivery across Nigeria",
    cta: "Order Now",
    color: "from-green-600 to-emerald-700",
    textColor: "text-white",
    url: "#",
    badge: "Featured Partner"
  },
  {
    id: "mayandBaker",
    company: "May & Baker Nigeria",
    tagline: "Affordable, quality medicines made in Nigeria for Nigerians",
    cta: "Learn More",
    color: "from-red-600 to-red-800",
    textColor: "text-white",
    url: "#",
    badge: "Sponsored"
  },
]

export function SponsoredBanner() {
  const [dismissed, setDismissed] = useState(false)
  const [currentAd] = useState(() => ads[Math.floor(Math.random() * ads.length)])

  if (dismissed) return null

  return (
    <div className={`relative bg-gradient-to-r ${currentAd.color} px-4 py-3`}>
      <div className="container mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className="shrink-0 rounded-full bg-white/20 px-2 py-0.5 text-xs font-medium text-white">
            {currentAd.badge}
          </span>
          <div className="min-w-0">
            <span className="font-semibold text-white text-sm">{currentAd.company}: </span>
            <span className="text-white/90 text-sm truncate">{currentAd.tagline}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          
            href={currentAd.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 rounded-full bg-white/20 hover:bg-white/30 px-3 py-1 text-xs font-medium text-white transition-colors"
          >
            {currentAd.cta} <ExternalLink className="h-3 w-3" />
          </a>
          <button
            onClick={() => setDismissed(true)}
            className="rounded-full p-1 text-white/60 hover:text-white hover:bg-white/20 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
