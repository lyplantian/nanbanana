import { NextResponse, type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const provider = searchParams.get("provider")
  const next = searchParams.get("next") ?? "/"

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
