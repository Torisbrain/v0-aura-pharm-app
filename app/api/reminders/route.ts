import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const webhookUrl = process.env.MAKE_WEBHOOK_URL || process.env.CARESHIFT_WEBHOOK_URL

    if (!webhookUrl) {
      console.warn('Reminder not sent: no MAKE_WEBHOOK_URL configured', body)
      return NextResponse.json({
        success: false,
        dispatched: false,
        message: 'Reminder automation is not configured yet.',
      })
    }

    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
    } catch (err) {
      console.error('Reminder webhook call failed', err)
      return NextResponse.json({
        success: false,
        dispatched: false,
        message: 'Reminder service is unreachable right now.',
      })
    }

    return NextResponse.json({ success: true, dispatched: true, message: 'Reminder dispatched', data: body })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
} 