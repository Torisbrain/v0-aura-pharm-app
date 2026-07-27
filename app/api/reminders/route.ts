import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const webhookUrl = process.env.MAKE_WEBHOOK_URL || process.env.CARESHIFT_WEBHOOK_URL

    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
    }

    return NextResponse.json({ success: true, message: 'Reminder dispatched', data: body })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
