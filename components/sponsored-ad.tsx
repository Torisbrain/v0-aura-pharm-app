"use client"

import { useState, useEffect } from "react"
import { ExternalLink, Zap, ChevronRight, X } from "lucide-react"

// Sponsored drug listings — these slots get sold to pharma companies
// Each ad has: sponsor name, product, tagline, CTA, relevance keywords
const SPONSORED_ADS = [
  {
    id: "emzor-paracetamol",
    sponsor: "Emzor Pharmaceuticals",
    product: "Emzor Paracetamol 500mg",
    tagline: "Nigeria's most trusted paracetamol. NAFDAC registered. Available nationwide.",
    badge: "NAFDAC A4-0322",
    cta: "Order Now",
    url: "https://emzor.com",
    logo: "E",
    logoColor: "bg-blue-600",
    keywords: ["paracetamol", "pain", "fever", "analgesic", "acetaminophen"],
    category: "Analgesic",
  },
  {
    id: "gsk-amoxil",
    sponsor: "GSK Nigeria",
    product: "Amoxil 500mg Capsules",
    tagline: "Trusted antibiotic from GSK. Broad-spectrum coverage for bacterial infections.",
    badge: "NAFDAC A4-1201",
    cta: "Learn More",
    url: "https://gsk.com",
    logo: "G",
    logoColor: "bg-red-600",
    keywords: ["amoxicillin", "amoxil", "antibiotic", "infection", "bacteria", "penicillin"],
    category: "Antibiotic",
  },
  {
    id: "maybach-metformin",
    sponsor: "May & Baker Nigeria",
    product: "Glucoform Metformin 500mg",
    tagline: "First-line diabetes management. Clinically proven, locally manufactured.",
    badge: "NAFDAC A4-2891",
    cta: "Stock Now",
    url: "https://mayandbaker.com",
    logo: "M",
    logoColor: "bg-green-700",
    keywords: ["metformin", "diabetes", "glucoform", "blood sugar", "type 2", "glucose"],
    category: "Antidiabetic",
  },
  {
    id: "pfizer-azithromycin",
    sponsor: "Pfizer Nigeria",
    product: "Zithromax 500mg",
    tagline: "3-day antibiotic course. Highly effective for respiratory & STI infections.",
    badge: "NAFDAC A4-3344",
    cta: "Learn More",
    url: "https://pfizer.com",
    logo: "P",
    logoColor: "bg-indigo-600",
    keywords: ["azithromycin", "zithromax", "respiratory", "z-pack", "pneumonia", "chlamydia"],
    category: "Antibiotic",
  },
  {
    id: "drugstoc-general",
    sponsor: "DrugStoc",
    product: "Restock your pharmacy in 24hrs",
    tagline: "Order genuine medicines from verified manufacturers. Same-day delivery in Lagos & Abuja.",
    badge: "VERIFIED SUPPLIER",
    cta: "Order Now",
    url: "https://drugstoc.com",
    logo: "D",
    logoColor: "bg-orange-600",
    keywords: ["restock", "order", "supply", "wholesale", "inventory", "stock"],
    category: "Supplier",
  },
  {
    id: "coartem-novartis",
    sponsor: "Novartis Nigeria",
    product: "Coartem 20/120mg",
    tagline: "WHO-recommended artemether/lumefantrine. Gold standard malaria treatment.",
    badge: "WHO Essential Medicine",
    cta: "Stock Now",
    url: "https://novartis.com",
    logo: "N",
    logoColor: "bg-cyan-600",
    keywords: ["coartem", "malaria", "artemether", "lumefantrine", "antimalarial", "plasmodium"],
    category: "Antimalarial",
  },
]

// Track ad impressions (in production, POST to /api/ads/impression)
async function trackImpression(adId: string) {
  try {
    await fetch("/api/ads/impression", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adId, timestamp: new Date().toISOString() }),
    })
  } catch (_) {}
}

async function trackClick(adId: string) {
  try {
    await fetch("/api/ads/click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adId, timestamp: new Date().toISOString() }),
    })
  } catch (_) {}
}

function getRelevantAds(query: string, maxAds = 2) {
  if (!query || query.length < 2) return SPONSORED_ADS.slice(0, 1)
  const q = query.toLowerCase()
  const scored = SPONSORED_ADS.map(ad => ({
    ...ad,
    score: ad.keywords.filter(k => q.includes(k) || k.includes(q)).length
  }))
  const relevant = scored.filter(a => a.score > 0).sort((a, b) => b.score - a.score)
  return relevant.length > 0 ? relevant.slice(0, maxAds) : SPONSORED_ADS.slice(0, 1)
}

// Inline sponsored result — appears inside search results
export function SponsoredListing({ query, className = "" }: { query: string; className?: string }) {
  const [dismissed, setDismissed] = useState<string[]>([])
  const ads = getRelevantAds(query).filter(a => !dismissed.includes(a.id))

  useEffect(() => {
    ads.forEach(ad => trackImpression(ad.id))
  }, [query])

  if (ads.length === 0) return null

  return (
    <div className={`space-y-2 ${className}`}>
      <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider flex items-center gap-1">
        <Zap className="h-2.5 w-2.5" /> Sponsored
      </p>
      {ads.map(ad => (
        <div key={ad.id}
          className="relative rounded-xl border-2 border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50 p-3 hover:border-amber-200 transition-all">
          <button
            onClick={() => setDismissed(d => [...d, ad.id])}
            className="absolute top-2 right-2 text-gray-300 hover:text-gray-500">
            <X className="h-3 w-3" />
          </button>
          <div className="flex items-start gap-3 pr-4">
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${ad.logoColor} text-white text-sm font-extrabold shadow-sm`}>
              {ad.logo}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <p className="text-sm font-bold text-gray-900">{ad.product}</p>
                <span className="rounded-full bg-amber-100 border border-amber-200 px-1.5 py-0.5 text-[10px] font-bold text-amber-700">
                  {ad.badge}
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-1 leading-relaxed">{ad.tagline}</p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-gray-400">by {ad.sponsor}</span>
                
                  href={ad.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackClick(ad.id)}
                  className="flex items-center gap-1 rounded-lg bg-white border border-amber-200 px-2.5 py-1 text-xs font-semibold text-amber-700 hover:bg-amber-50 transition-colors shadow-sm">
                  {ad.cta} <ChevronRight className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Dashboard banner ad — between sections
export function DashboardAd({ className = "" }: { className?: string }) {
  const [current, setCurrent] = useState(0)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    trackImpression(SPONSORED_ADS[current].id)
    const interval = setInterval(() => {
      setCurrent(c => (c + 1) % SPONSORED_ADS.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [current])

  if (dismissed) return null
  const ad = SPONSORED_ADS[current]

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-amber-100 bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 p-4 shadow-sm ${className}`}>
      <div className="absolute top-0 right-0 rounded-bl-2xl bg-amber-100 px-2 py-0.5">
        <span className="text-[10px] font-bold text-amber-600">SPONSORED</span>
      </div>
      <button onClick={() => setDismissed(true)} className="absolute top-2 right-12 text-gray-300 hover:text-gray-500">
        <X className="h-3 w-3" />
      </button>

      <div className="flex items-center gap-3">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${ad.logoColor} text-white text-lg font-extrabold shadow-md`}>
          {ad.logo}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-400 mb-0.5">{ad.sponsor} · {ad.category}</p>
          <p className="font-bold text-sm text-gray-900">{ad.product}</p>
          <p className="text-xs text-gray-500 truncate">{ad.tagline}</p>
        </div>
        
          href={ad.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackClick(ad.id)}
          className="shrink-0 flex items-center gap-1 rounded-xl bg-amber-500 hover:bg-amber-600 px-3 py-2 text-xs font-bold text-white shadow transition-colors">
          {ad.cta} <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      {/* Rotation dots */}
      <div className="flex justify-center gap-1 mt-3">
        {SPONSORED_ADS.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all ${i === current ? "w-4 bg-amber-500" : "w-1.5 bg-amber-200"}`} />
        ))}
      </div>
    </div>
  )
}
