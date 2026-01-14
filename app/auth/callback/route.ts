import { NextResponse, type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getRequestOrigin } from "@/lib/supabase/origin"

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const code = url.searchParams.get("code")
  const next = url.searchParams.get("next") ?? "/"
  const origin = getRequestOrigin(request)

  if (code) {
    const supabase = await createClient()
    if (!supabase) {
      return NextResponse.redirect(
        new URL("/auth/auth-code-error?reason=supabase_not_configured", origin)
      )
    }

    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(new URL(next, origin))
    }
  }

  return NextResponse.redirect(new URL("/auth/auth-code-error", origin))
}
