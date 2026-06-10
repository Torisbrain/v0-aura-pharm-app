import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { adId, timestamp } = await req.json()
    await supabase.from("ad_impressions").insert({ ad_id: adId, created_at: timestamp })
    return NextResponse.json({ ok: true })
  } catch { return NextResponse.json({ ok: false }) }
}
