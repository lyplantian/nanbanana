import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = await createClient()
  if (!supabase) {
    return NextResponse.json({ user: null, supabaseConfigured: false })
  }

  const { data } = await supabase.auth.getUser()

  const metadata = (data.user?.user_metadata ?? {}) as Record<string, unknown>
  const name =
    (metadata.full_name as string | undefined) ??
    (metadata.name as string | undefined) ??
    (metadata.preferred_username as string | undefined) ??
    null
  const avatarUrl =
    (metadata.avatar_url as string | undefined) ??
    (metadata.picture as string | undefined) ??
    null

  return NextResponse.json({
    user: data.user
      ? {
          id: data.user.id,
          email: data.user.email,
          name,
          avatarUrl,
        }
      : null,
    supabaseConfigured: true,
  })
}
