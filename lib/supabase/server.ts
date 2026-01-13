import { createServerClient } from "@supabase/ssr"
import type { SupabaseClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import { getSupabaseConfig } from "@/lib/supabase/env"

export async function createClient(): Promise<SupabaseClient | null> {
  const config = getSupabaseConfig()
  if (!config) return null

  const cookieStore = await cookies()

  return createServerClient(config.url, config.key, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options)
        })
      },
    },
  })
}
