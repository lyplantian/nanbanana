import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Star } from "lucide-react"

const reviews = [
  {
    name: "Sarah Martinez",
    role: "Digital Creator",
    avatar: "SM",
    content:
      "This editor completely changed my workflow. The character consistency is incredible - miles ahead of other tools!",
    rating: 5,
  },
  {
    name: "James Chen",
    role: "UGC Specialist",
    avatar: "JC",
    content:
      "Creating consistent AI influencers has never been easier. It maintains perfect face details across edits!",
    rating: 5,
  },
  {
    name: "Emily Thompson",
    role: "Professional Editor",
    avatar: "ET",
    content: "One-shot editing is basically solved with this tool. The scene blending is so natural and realistic!",
    rating: 5,
  },
  {
    name: "Michael Rodriguez",
    role: "Content Creator",
    avatar: "MR",
    content:
      "The natural language processing is amazing. I can describe what I want and it just works perfectly every time.",
    rating: 5,
  },
  {
    name: "Lisa Park",
    role: "Marketing Designer",
    avatar: "LP",
    content:
      "Game changer for our marketing campaigns. We can create professional visuals in minutes instead of hours.",
    rating: 5,
  },
  {
    name: "David Wilson",
    role: "Photographer",
    avatar: "DW",
    content:
      "The quality is outstanding. My clients are always impressed with how quickly I can deliver edited photos.",
    rating: 5,
  },
]

export function ReviewsSection() {
  return (
    <section id="reviews" className="relative bg-secondary/30 py-20 md:py-32">
      <div className="absolute right-10 top-20 text-8xl opacity-5 rotate-[-20deg]">🍌</div>

      <div className="container">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="mb-4 text-balance text-4xl font-bold md:text-5xl">What Creators Are Saying</h2>
          <p className="text-pretty text-lg text-muted-foreground">
            Join thousands of satisfied creators who transformed their workflow
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, index) => (
            <Card key={index} className="p-6">
              <div className="mb-4 flex gap-1">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="mb-6 text-sm leading-relaxed text-foreground">"{review.content}"</p>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">{review.avatar}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold">{review.name}</p>
                  <p className="text-xs text-muted-foreground">{review.role}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
