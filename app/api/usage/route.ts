import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const FREE_LIMIT = 5

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email") || ""
  const sessionId = req.nextUrl.searchParams.get("session") || ""
  const key = email || sessionId
  if (!key) return NextResponse.json({ count: 0, credits: 0, limit: FREE_LIMIT })

  const today = new Date().toISOString().split("T")[0]

  const { data: usage } = await supabase
    .from("verification_usage")
    .select("*")
    .eq("user_key", key)
    .eq("date", today)
    .single()

  const { data: credits } = await supabase
    .from("verification_credits")
    .select("credits")
    .eq("user_key", key)
    .single()

  return NextResponse.json({
    count: usage?.count || 0,
    credits: credits?.credits || 0,
    limit: FREE_LIMIT,
    canVerify: (usage?.count || 0) < FREE_LIMIT || (credits?.credits || 0) > 0,
  })
}

export async function POST(req: NextRequest) {
  const { userKey, useCredit } = await req.json()
  if (!userKey) return NextResponse.json({ error: "No user key" }, { status: 400 })

  const today = new Date().toISOString().split("T")[0]

  // Check current usage
  const { data: usage } = await supabase
    .from("verification_usage")
    .select("*")
    .eq("user_key", userKey)
    .eq("date", today)
    .single()

  const currentCount = usage?.count || 0

  // If over free limit, deduct a credit
  if (currentCount >= FREE_LIMIT) {
    if (!useCredit) return NextResponse.json({ error: "limit_reached" }, { status: 403 })

    const { data: credits } = await supabase
      .from("verification_credits")
      .select("credits")
      .eq("user_key", userKey)
      .single()

    if (!credits || credits.credits <= 0) {
      return NextResponse.json({ error: "no_credits" }, { status: 403 })
    }

    await supabase
      .from("verification_credits")
      .update({ credits: credits.credits - 1 })
      .eq("user_key", userKey)
  }

  // Increment daily count
  if (usage) {
    await supabase
      .from("verification_usage")
      .update({ count: currentCount + 1 })
      .eq("user_key", userKey)
      .eq("date", today)
  } else {
    await supabase
      .from("verification_usage")
      .insert({ user_key: userKey, date: today, count: 1 })
  }

  return NextResponse.json({ success: true, count: currentCount + 1 })
}
