import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export const CREDIT_BUNDLES = [
  { id: "starter", label: "50 verifications", credits: 50, amount: 500, display: "₦500" },
  { id: "pro", label: "200 verifications", credits: 200, amount: 1500, display: "₦1,500" },
  { id: "unlimited", label: "1000 verifications", credits: 1000, amount: 5000, display: "₦5,000" },
]

export async function POST(req: NextRequest) {
  try {
    const { reference, userKey, bundleId } = await req.json()
    const bundle = CREDIT_BUNDLES.find(b => b.id === bundleId)
    if (!bundle) return NextResponse.json({ error: "Invalid bundle" }, { status: 400 })

    // Verify payment with Paystack
    const verify = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
    })
    const verifyData = await verify.json()
    if (!verifyData.data || verifyData.data.status !== "success") {
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 })
    }

    // Add credits to user
    const { data: existing } = await supabase
      .from("verification_credits")
      .select("credits")
      .eq("user_key", userKey)
      .single()

    if (existing) {
      await supabase
        .from("verification_credits")
        .update({ credits: existing.credits + bundle.credits })
        .eq("user_key", userKey)
    } else {
      await supabase
        .from("verification_credits")
        .insert({ user_key: userKey, credits: bundle.credits })
    }

    // Log transaction
    await supabase.from("credit_purchases").insert({
      user_key: userKey,
      bundle_id: bundleId,
      credits: bundle.credits,
      amount: bundle.amount,
      reference,
      purchased_at: new Date().toISOString(),
    })

    return NextResponse.json({ success: true, credits: bundle.credits })
  } catch (err) {
    return NextResponse.json({ error: "Failed to process" }, { status: 500 })
  }
}
