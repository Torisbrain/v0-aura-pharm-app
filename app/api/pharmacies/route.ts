import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const lat = searchParams.get("lat")
  const lon = searchParams.get("lon")
  if (!lat || !lon) return NextResponse.json({ error: "Missing coordinates" }, { status: 400 })

  const query = `[out:json][timeout:25];(node["amenity"="pharmacy"](around:3000,${lat},${lon});way["amenity"="pharmacy"](around:3000,${lat},${lon}););out body;`
  
  try {
    const res = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`)
    const data = await res.json()
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch pharmacies" }, { status: 500 })
  }
}
