"use client"

import Link from "next/link"
import { AuthButton } from "@/components/auth-button"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🍌</span>
          <span className="text-xl font-bold">BananaEdit</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="#features"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Features
          </Link>
          <Link
            href="#showcase"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Showcase
          </Link>
          <Link
            href="#reviews"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Reviews
          </Link>
          <Link
            href="#faq"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            FAQ
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <AuthButton size="lg" />
          <Button
            size="lg"
            variant="secondary"
            onClick={() => {
              document.getElementById("editor")?.scrollIntoView({ behavior: "smooth" })
            }}
          >
            Get Started
          </Button>
        </div>
      </div>
    </header>
  )
}
