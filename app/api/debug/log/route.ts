import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    console.log('[CLIENT DEBUG LOG]', body)
    return NextResponse.json({ success: true, loggedAt: new Date().toISOString() })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
