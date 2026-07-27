import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { amount, email, plan } = await req.json()
    return NextResponse.json({
      success: true,
      status: 'pending_paystack',
      authorizationUrl: 'https://checkout.paystack.com/demo-aurabridge',
      reference: `AB-${Date.now()}`
    })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
