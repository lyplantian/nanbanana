import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const supabase = await createClient()
  if (supabase) {
    await supabase.auth.signOut()
  }
  return NextResponse.redirect(new URL("/", url.origin))
}
