"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-secondary/20 py-20 md:py-32">
      {/* Decorative bananas */}
      <div className="absolute -right-20 top-10 rotate-12 text-9xl opacity-10">🍌</div>
      <div className="absolute -left-20 bottom-10 -rotate-12 text-9xl opacity-10">🍌</div>
      <div className="absolute right-1/4 top-32 rotate-45 text-6xl opacity-5">🍌</div>

      <div className="container relative z-10">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground">
            <Sparkles className="h-4 w-4" />
            <span>AI-Powered Image Editing</span>
          </div>

          <h1 className="mb-6 text-balance text-5xl font-bold tracking-tight md:text-7xl">
            Transform Images with{" "}
            <span className="bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">AI Magic</span>
          </h1>

          <p className="mb-8 text-pretty text-lg text-muted-foreground md:text-xl">
            Upload, edit, and create stunning visuals with natural language commands. Experience the future of image
            editing powered by advanced AI technology.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 group"
              onClick={() => {
                console.log("用户点击 - 开始编辑按钮")
                document.getElementById("editor")?.scrollIntoView({ behavior: "smooth" })
              }}
            >
              Start Editing Free
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                console.log("用户点击 - 查看示例按钮")
                document.getElementById("showcase")?.scrollIntoView({ behavior: "smooth" })
              }}
            >
              View Examples
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
