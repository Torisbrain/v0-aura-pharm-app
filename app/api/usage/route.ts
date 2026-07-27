import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    scansThisMonth: 142,
    triageSessions: 89,
    remindersSent: 420,
    activePatients: 38
  })
}
