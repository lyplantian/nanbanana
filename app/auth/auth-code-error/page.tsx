import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AuthCodeErrorPage({
  searchParams,
}: {
  searchParams?: { reason?: string }
}) {
  const isSupabaseNotConfigured = searchParams?.reason === "supabase_not_configured"

  return (
    <main className="container flex min-h-[60vh] flex-col items-center justify-center gap-4 py-16 text-center">
      <h1 className="text-2xl font-semibold">Authentication error</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        {isSupabaseNotConfigured
          ? "Authentication is disabled because Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY to .env.local, then restart the dev server."
          : "Something went wrong while signing you in. Please try again."}
      </p>
      <Button asChild>
        <Link href="/">Back to home</Link>
      </Button>
    </main>
  )
}
