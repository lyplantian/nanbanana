"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const faqs = [
  {
    question: "What is BananaEdit?",
    answer:
      "It's a revolutionary AI image editing tool that transforms photos using natural language prompts. This is currently one of the most powerful image editing models available, with exceptional consistency and superior performance for character editing and scene preservation.",
  },
  {
    question: "How does it work?",
    answer:
      'Simply upload an image and describe your desired edits in natural language. The AI understands complex instructions like "place the object in a snowy mountain" or "change the background to a sunset beach". It processes your text prompt and generates perfectly edited images.',
  },
  {
    question: "What makes it better than other tools?",
    answer:
      "BananaEdit excels in character consistency, scene blending, and one-shot editing. Users report superior results in preserving facial features and seamlessly integrating edits with backgrounds. It also supports multi-image context, making it ideal for creating consistent content.",
  },
  {
    question: "Can I use it for commercial projects?",
    answer:
      "Yes! It's perfect for creating content for social media campaigns, marketing materials, and professional projects. Many users leverage it for creating consistent AI influencers and product photography. The high-quality outputs are suitable for commercial use.",
  },
  {
    question: "What types of edits can it handle?",
    answer:
      "The editor handles complex edits including background changes, object placement, style transfers, character modifications, lighting adjustments, and scene composition. It excels at understanding contextual instructions while maintaining photorealistic quality.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "Yes! You can start editing for free right away. Simply upload your image, enter a text prompt describing your desired edits, and watch as the AI transforms your photo with incredible accuracy and consistency.",
  },
]

function FAQItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div className="rounded-lg border bg-card">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-accent/50"
      >
        <span className="text-base font-semibold pr-4">{question}</span>
        <ChevronDown
          className={cn(
            "h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-180",
          )}
        />
      </button>
      <div
        className={cn(
          "grid overflow-hidden transition-all duration-200 ease-in-out",
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <div className="px-6 pb-4 text-sm text-muted-foreground leading-relaxed">{answer}</div>
        </div>
      </div>
    </div>
  )
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="relative py-20 md:py-32">
      <div className="absolute left-1/3 bottom-20 text-9xl opacity-5 rotate-45">🍌</div>

      <div className="container">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-balance text-4xl font-bold md:text-5xl">Frequently Asked Questions</h2>
            <p className="text-pretty text-lg text-muted-foreground">Everything you need to know about BananaEdit</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                onToggle={() => setOpenIndex(openIndex === index ? null : index)}
              />
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">
              Still have questions?{" "}
              <a href="#" className="font-medium text-primary hover:underline">
                Contact our support team
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
