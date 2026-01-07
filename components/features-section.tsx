import { Card } from "@/components/ui/card"
import { Sparkles, Users, Layers, Zap, ImageIcon, Palette } from "lucide-react"

const features = [
  {
    icon: Sparkles,
    title: "Natural Language Editing",
    description: "Edit images using simple text prompts. Our AI understands complex instructions like a human would.",
  },
  {
    icon: Users,
    title: "Character Consistency",
    description: "Maintain perfect character details across edits. Excel at preserving faces and identities.",
  },
  {
    icon: Layers,
    title: "Scene Preservation",
    description: "Seamlessly blend edits with original backgrounds. Superior scene fusion technology.",
  },
  {
    icon: Zap,
    title: "One-Shot Editing",
    description: "Perfect results in a single attempt. No need for multiple iterations or adjustments.",
  },
  {
    icon: ImageIcon,
    title: "Multi-Image Support",
    description: "Process multiple images simultaneously. Advanced multi-image editing workflows.",
  },
  {
    icon: Palette,
    title: "AI Content Creation",
    description: "Create consistent AI influencers and UGC content. Perfect for social media and marketing.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="relative bg-secondary/30 py-20 md:py-32">
      <div className="absolute right-20 bottom-10 text-8xl opacity-5 rotate-12">🍌</div>

      <div className="container">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="mb-4 text-balance text-4xl font-bold md:text-5xl">Core Features</h2>
          <p className="text-pretty text-lg text-muted-foreground">
            Why choose BananaEdit? The most advanced AI image editor with revolutionary natural language understanding.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} className="p-6 transition-all hover:shadow-lg">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
