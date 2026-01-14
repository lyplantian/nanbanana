import { NextResponse, type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getRequestOrigin } from "@/lib/supabase/origin"

export async function GET(request: NextRequest) {
  const origin = getRequestOrigin(request)
  const supabase = await createClient()
  if (supabase) {
    await supabase.auth.signOut()
  }
  return NextResponse.redirect(new URL("/", origin))
}
