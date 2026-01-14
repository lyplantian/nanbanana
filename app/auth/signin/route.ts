import { NextResponse, type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getRequestOrigin } from "@/lib/supabase/origin"

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const provider = url.searchParams.get("provider")
  const next = url.searchParams.get("next") ?? "/"
  const origin = getRequestOrigin(request)

  if (provider !== "google") {
    return NextResponse.redirect(new URL("/auth/auth-code-error", origin))
  }

  const supabase = await createClient()
  if (!supabase) {
    return NextResponse.redirect(
      new URL("/auth/auth-code-error?reason=supabase_not_configured", origin)
    )
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  })

  if (error || !data?.url) {
    return NextResponse.redirect(new URL("/auth/auth-code-error", origin))
  }

  return NextResponse.redirect(data.url)
}
