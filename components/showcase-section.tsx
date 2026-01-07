import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"

const showcaseItems = [
  {
    image: "/dramatic-mountain-landscape.png",
    title: "Ultra-Fast Mountain Generation",
    description: "Created in 0.8 seconds with optimized neural engine",
    badge: "Speed",
  },
  {
    image: "/beautiful-garden-with-flowers.jpg",
    title: "Instant Garden Creation",
    description: "Complex scene rendered in milliseconds using AI technology",
    badge: "Speed",
  },
  {
    image: "/tropical-beach-sunset.png",
    title: "Real-time Beach Synthesis",
    description: "Photorealistic results at lightning speed",
    badge: "Speed",
  },
  {
    image: "/northern-lights-aurora-sky.jpg",
    title: "Rapid Aurora Generation",
    description: "Advanced effects processed instantly with AI",
    badge: "Speed",
  },
]

export function ShowcaseSection() {
  return (
    <section id="showcase" className="relative py-20 md:py-32">
      <div className="absolute left-1/4 top-40 text-7xl opacity-5 -rotate-12">🍌</div>

      <div className="container">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="mb-4 text-balance text-4xl font-bold md:text-5xl">Lightning-Fast AI Creations</h2>
          <p className="text-pretty text-lg text-muted-foreground">See what BananaEdit generates in milliseconds</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {showcaseItems.map((item, index) => (
            <Card key={index} className="overflow-hidden transition-all hover:shadow-xl">
              <div className="relative aspect-video overflow-hidden bg-muted">
                <img src={item.image || "/placeholder.svg"} alt={item.title} className="h-full w-full object-cover" />
                <div className="absolute left-4 top-4">
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                    <span>🍌</span>
                    {item.badge}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button size="lg" variant="outline" className="group bg-transparent">
            Try BananaEdit Generator
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  )
}
