"use client"

import * as React from "react"
import { Check, ChevronDown, Chrome, Copy, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type AuthUser = {
  id: string
  email?: string | null
  name?: string | null
  avatarUrl?: string | null
} | null

type AuthUserResponse = {
  user: AuthUser
  supabaseConfigured?: boolean
}

type AuthButtonProps = Pick<React.ComponentProps<typeof Button>, "className" | "size">

export function AuthButton({ className, size }: AuthButtonProps) {
  const [user, setUser] = React.useState<AuthUser>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [supabaseConfigured, setSupabaseConfigured] = React.useState(true)
  const [copied, setCopied] = React.useState(false)
  const [confirmSignOutOpen, setConfirmSignOutOpen] = React.useState(false)

  React.useEffect(() => {
    if (!copied) return
    const id = window.setTimeout(() => setCopied(false), 1200)
    return () => window.clearTimeout(id)
  }, [copied])

  React.useEffect(() => {
    let isMounted = true

    async function load() {
      try {
        const res = await fetch("/api/auth/user", { cache: "no-store" })
        const json = (await res.json()) as AuthUserResponse
        if (isMounted) setUser(json.user)
        if (isMounted) setSupabaseConfigured(json.supabaseConfigured ?? true)
      } catch {
        if (isMounted) setUser(null)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    load()

    return () => {
      isMounted = false
    }
  }, [])

  if (isLoading) {
    return (
      <Button className={className} size={size} variant="outline" disabled>
        <Chrome className="size-4" />
        Google 登录
      </Button>
    )
  }

  if (user) {
    const email = user.email ?? null
    const name = user.name ?? null
    const label = email ?? name ?? "已登录"
    const fallback =
      (name ?? email ?? "U")
        .trim()
        .slice(0, 2)
        .toUpperCase() || "U"

    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className={className} size={size} variant="outline">
              <Avatar className="size-6">
                {user.avatarUrl ? (
                  <AvatarImage src={user.avatarUrl} alt={name ?? email ?? ""} />
                ) : null}
                <AvatarFallback className="text-[10px]">{fallback}</AvatarFallback>
              </Avatar>
              <span className="max-w-[220px] truncate">{label}</span>
              <ChevronDown className="size-4 opacity-70" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[280px]">
            <DropdownMenuLabel className="py-2">
              <div className="flex items-center gap-3">
                <Avatar className="size-10">
                  {user.avatarUrl ? (
                    <AvatarImage src={user.avatarUrl} alt={name ?? email ?? ""} />
                  ) : null}
                  <AvatarFallback>{fallback}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  {name ? <div className="truncate text-sm font-medium">{name}</div> : null}
                  {email ? (
                    <div className="truncate text-xs text-muted-foreground">{email}</div>
                  ) : (
                    <div className="truncate text-xs text-muted-foreground">已登录</div>
                  )}
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              disabled={!email}
              onSelect={async (e) => {
                e.preventDefault()
                if (!email) return
                try {
                  await navigator.clipboard.writeText(email)
                  setCopied(true)
                } catch {
                  setCopied(false)
                }
              }}
            >
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
              {copied ? "已复制邮箱" : "复制邮箱"}
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onSelect={(e) => {
                e.preventDefault()
                setConfirmSignOutOpen(true)
              }}
            >
              <LogOut className="size-4" />
              退出登录
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <AlertDialog open={confirmSignOutOpen} onOpenChange={setConfirmSignOutOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>确认退出登录？</AlertDialogTitle>
              <AlertDialogDescription>
                {email ? `将退出当前账号：${email}` : "将退出当前账号。"}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>取消</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60"
                onClick={() => {
                  setConfirmSignOutOpen(false)
                  window.location.assign("/auth/signout")
                }}
              >
                退出
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    )
  }

  return (
    <Button
      className={className}
      size={size}
      variant="default"
      onClick={() => {
        window.location.assign(
          `/auth/signin?provider=google&next=${encodeURIComponent(window.location.pathname)}`
        )
      }}
      title={
        supabaseConfigured
          ? "Sign in with Google"
          : "Supabase 未配置：请在 .env.local 设置 NEXT_PUBLIC_SUPABASE_URL 和 NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY，然后重启开发服务器。"
      }
    >
      <Chrome className="size-4" />
      Google 登录
      {!supabaseConfigured ? <Badge variant="secondary">需配置</Badge> : null}
    </Button>
  )
}
