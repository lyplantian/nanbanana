import type { NextRequest } from "next/server"

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "")

export function getRequestOrigin(request: NextRequest): string {
  const explicit =
    process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL ?? undefined

  if (explicit && /^https?:\/\//i.test(explicit)) {
    return trimTrailingSlash(explicit)
  }

  const parsed = new URL(request.url)

  const forwardedProtoRaw = request.headers.get("x-forwarded-proto")
  const forwardedHostRaw = request.headers.get("x-forwarded-host")
  const hostRaw = request.headers.get("host")

  const proto = (forwardedProtoRaw ?? parsed.protocol.replace(":", "")).split(",")[0]?.trim()
  const host = (forwardedHostRaw ?? hostRaw ?? parsed.host).split(",")[0]?.trim()

  return `${proto}://${host}`
}

