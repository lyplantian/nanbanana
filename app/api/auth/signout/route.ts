import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST() {
  const supabase = await createClient()
  if (!supabase) {
    return NextResponse.json({ ok: true, supabaseConfigured: false })
  }

  await supabase.auth.signOut()
  return NextResponse.json({ ok: true, supabaseConfigured: true })
}

