import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const referralUrl = process.env.CARESHIFT_REFERRAL_URL || 'https://careshift-placeholder.internal/api/referral'

    // CareShift auto-referral trigger
    if (process.env.CARESHIFT_REFERRAL_URL) {
      await fetch(referralUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...body,
          referredFrom: 'AuraBridge Health Platform',
          timestamp: new Date().toISOString()
        }),
      })
    }

    return NextResponse.json({ success: true, message: 'CareShift auto-referral triggered', referral: body })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
