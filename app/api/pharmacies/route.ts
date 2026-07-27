import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    pharmacies: [
      { id: 'p-1', name: 'Aura Pharm Lagos Central', city: 'Lagos', state: 'Lagos', status: 'verified', pcn: 'PCN-LA-9012' },
      { id: 'p-2', name: 'MedPlus Abuja Garki', city: 'Abuja', state: 'FCT', status: 'verified', pcn: 'PCN-FC-4412' }
    ]
  })
}
