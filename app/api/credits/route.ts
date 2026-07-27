import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ creditsRemaining: 500, tier: 'Professional', currency: 'NGN' })
}
