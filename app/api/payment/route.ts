import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { email, plan, amount, reference } = await req.json()

    // Verify payment with Paystack
    const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    })
    const verifyData = await verifyRes.json()

    if (!verifyData.data || verifyData.data.status !== "success") {
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 })
    }

    // Save subscription to database
    const { error } = await supabase.from("subscriptions").insert({
      email,
      plan,
      amount,
      reference,
      status: "active",
      paid_at: new Date().toISOString(),
    })

    if (error) console.error("DB error:", error)

    return NextResponse.json({ success: true, message: "Payment verified successfully" })
  } catch (err) {
    console.error("Payment error:", err)
    return NextResponse.json({ error: "Payment verification failed" }, { status: 500 })
  }
}
