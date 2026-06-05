"use client"

import { useState, useEffect, useRef } from "react"
import { MapPin, Loader2, Navigation, Phone, Clock, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface Pharmacy {
  id: string
  name: string
  address: string
  distance: string
  lat: number
  lon: number
  phone?: string
  opening_hours?: string
}

export function NearbyPharmacies() {
  const [loading, setLoading] = useState(false)
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([])
  const [error, setError] = useState("")
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null)
  const [mapReady, setMapReady] = useState(false)
  const mapRef = useRef<any>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)

  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2
    const d = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return d < 1 ? `${Math.round(d * 1000)}m` : `${d.toFixed(1)}km`
  }

  const findPharmacies = async () => {
    setLoading(true)
    setError("")
    setPharmacies([])
    setMapReady(false)
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lon } = pos.coords
        setUserLocation({ lat, lon })
        try {
          const res = await fetch(`/api/pharmacies?lat=${lat}&lon=${lon}`)
          const data = await res.json()
          const results: Pharmacy[] = (data.elements || [])
            .filter((el: any) => el.tags?.name)
            .slice(0, 10)
            .map((el: any) => ({
              id: String(el.id),
              name: el.tags.name || "Pharmacy",
              address: [el.tags["addr:street"], el.tags["addr:city"]].filter(Boolean).join(", ") || el.tags["addr:full"] || "Address not available",
              distance: getDistance(lat, lon, el.lat || lat, el.lon || lon),
              lat: el.lat || lat,
              lon: el.lon || lon,
              phone: el.tags.phone || el.tags["contact:phone"],
              opening_hours: el.tags.opening_hours,
            }))
          setPharmacies(results)
          setMapReady(true)
        } catch {
          setError("Could not fetch nearby pharmacies. Please try again.")
        } finally {
          setLoading(false)
        }
      },
      (err) => {
        setLoading(false)
        setError(err.code === 1 ? "Location access denied. Please allow location access and try again." : "Could not get your location. Please try again.")
      },
      { timeout: 10000 }
    )
  }

  useEffect(() => {
    if (!mapReady || !userLocation || !mapContainerRef.current || pharmacies.length === 0) return
    const initMap = async () => {
      const L = (await import("leaflet")).default
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      })
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null }
      const map = L.map(mapContainerRef.current!).setView([userLocation.lat, userLocation.lon], 14)
      mapRef.current = map
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "© OpenStreetMap" }).addTo(map)
      const userIcon = L.divIcon({ html: `<div style="background:#2563eb;width:14px;height:14px;border-radius:50%;border:3px solid white;box-shadow:0 0 0 3px #2563eb40"></div>`, iconSize: [14, 14], iconAnchor: [7, 7], className: "" })
      L.marker([userLocation.lat, userLocation.lon], { icon: userIcon }).addTo(map).bindPopup("<b>You are here</b>")
      const pharmIcon = L.divIcon({ html: `<div style="background:#16a34a;width:12px;height:12px;border-radius:50%;border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,0.4)"></div>`, iconSize: [12, 12], iconAnchor: [6, 6], className: "" })
      pharmacies.forEach(p => { L.marker([p.lat, p.lon], { icon: pharmIcon }).addTo(map).bindPopup(`<b>${p.name}</b><br/>${p.address}<br/><span style="color:#16a34a">${p.distance} away</span>`) })
    }
    initMap()
    return () => { if (mapRef.current) { mapRef.current.remove(); mapRef.current = null } }
  }, [mapReady, userLocation, pharmacies])

  return (
    <section id="nearby" className="bg-muted/30 px-4 py-20">
      <div className="container mx-auto">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
            <MapPin className="h-4 w-4" />
            Pharmacy Locator
          </div>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">Find Pharmacies Near You</h2>
          <p className="text-lg text-muted-foreground">Locate verified pharmacies in your area instantly using your device location.</p>
        </div>
        {!userLocation && !loading && (
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <Navigation className="h-10 w-10 text-green-600" />
            </div>
            <Button size="lg" onClick={findPharmacies} className="gap-2 bg-green-600 hover:bg-green-700 text-white px-8">
              <MapPin className="h-5 w-5" />Find Pharmacies Near Me
            </Button>
            <p className="text-xs text-muted-foreground">We will ask for your location</p>
          </div>
        )}
        {loading && (
          <div className="flex flex-col items-center gap-3 py-12">
            <Loader2 className="h-10 w-10 animate-spin text-green-600" />
            <p className="text-muted-foreground">Finding pharmacies near you...</p>
          </div>
        )}
        {error && (
          <div className="mx-auto max-w-md rounded-lg border border-red-200 bg-red-50 p-4 text-center">
            <AlertCircle className="mx-auto mb-2 h-6 w-6 text-red-500" />
            <p className="text-sm text-red-700">{error}</p>
            <Button variant="outline" size="sm" onClick={findPharmacies} className="mt-3">Try Again</Button>
          </div>
        )}
        {pharmacies.length > 0 && (
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="order-2 lg:order-1">
              <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css" />
              <div ref={mapContainerRef} className="h-[420px] w-full rounded-2xl border border-border shadow-md overflow-hidden" />
            </div>
            <div className="order-1 lg:order-2 space-y-3 max-h-[420px] overflow-y-auto pr-1">
              <p className="text-sm font-medium text-muted-foreground">{pharmacies.length} pharmacies found within 10km</p>
              {pharmacies.map((p, i) => (
                <Card key={p.id} className="border-border/50 hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-700">{i + 1}</div>
                        <div>
                          <p className="font-semibold text-foreground">{p.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{p.address}</p>
                          {p.phone && <a href={`tel:${p.phone}`} className="mt-1 flex items-center gap-1 text-xs text-green-600 hover:underline"><Phone className="h-3 w-3" />{p.phone}</a>}
                          {p.opening_hours && <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><Clock className="h-3 w-3" />{p.opening_hours}</p>}
                        </div>
                      </div>
                      <span className="shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">{p.distance}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button variant="outline" size="sm" onClick={findPharmacies} className="w-full gap-2 mt-2">
                <Navigation className="h-4 w-4" /> Refresh
              </Button>
            </div>
          </div>
        )}
        {pharmacies.length === 0 && userLocation && !loading && !error && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No pharmacies found within 10km.</p>
            <Button variant="outline" size="sm" onClick={findPharmacies} className="mt-3">Try Again</Button>
          </div>
        )}
      </div>
    </section>
  )
}
