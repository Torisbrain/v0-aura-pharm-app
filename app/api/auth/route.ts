import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    return NextResponse.json({ authenticated: !!session, session })
  } catch (err: any) {
    return NextResponse.json({ authenticated: false, error: err.message }, { status: 500 })
  }
}
