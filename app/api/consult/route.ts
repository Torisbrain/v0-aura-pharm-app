import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { name, phone, email, specialist_type, symptoms, preferred_time, urgency } = await req.json()

    if (!name || !phone || !symptoms || !specialist_type) {
      return NextResponse.json({ error: "Please fill all required fields" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("consultations")
      .insert({ name, phone, email, specialist_type, symptoms, preferred_time, urgency })
      .select()
      .single()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: "Failed to book consultation" }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      id: data.id,
      message: "Consultation booked successfully" 
    })
  } catch (err) {
    console.error("Consult error:", err)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}

export async function GET() {
  const { data, error } = await supabase
    .from("consultations")
    .select("*")
    .order("created_at", { ascending: false })
  
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ consultations: data })
}
