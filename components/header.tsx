"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🍌</span>
          <span className="text-xl font-bold">BananaEdit</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="#features"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => console.log("导航点击 - 功能特性")}
          >
            Features
          </Link>
          <Link
            href="#showcase"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => console.log("导航点击 - 案例展示")}
          >
            Showcase
          </Link>
          <Link
            href="#reviews"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => console.log("导航点击 - 用户评价")}
          >
            Reviews
          </Link>
          <Link
            href="#faq"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => console.log("导航点击 - 常见问题")}
          >
            FAQ
          </Link>
        </nav>

        <Button
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => {
            console.log("导航操作 - 开始使用")
            document.getElementById("editor")?.scrollIntoView({ behavior: "smooth" })
          }}
        >
          Get Started
        </Button>
      </div>
    </header>
  )
}
