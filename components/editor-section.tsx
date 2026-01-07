"use client"

import type React from "react"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, Wand2 } from "lucide-react"

type GalleryImage = {
  src: string
  alt?: string
}

const ASPECT_RATIOS = [
  { label: "Auto (input)", value: "auto", hint: "Matches the uploaded photo" },
  { label: "Square 1:1", value: "1:1", hint: "Classic social square" },
  { label: "Landscape 16:9", value: "16:9", hint: "Widescreen format" },
  { label: "Portrait 9:16", value: "9:16", hint: "Tall smartphone view" },
  { label: "Wide 21:9", value: "21:9", hint: "Cinematic banner" },
  { label: "Classic 4:5", value: "4:5", hint: "Portrait printing" },
]

export function EditorSection() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [galleryImage, setGalleryImage] = useState<GalleryImage | null>(null)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [aspectRatio, setAspectRatio] = useState(ASPECT_RATIOS[0].value)
  const selectedRatioLabel = ASPECT_RATIOS.find((item) => item.value === aspectRatio)?.hint

  const finalButtonText = useMemo(() => {
    if (isGenerating) return "Generating..."
    if (galleryImage) return "Generate Again"
    return "Generate Edit"
  }, [galleryImage, isGenerating])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string | undefined
      setSelectedImage(dataUrl ?? null)
    }
    reader.readAsDataURL(file)
  }

  const handleGenerate = async () => {
    if (!selectedImage) return

    setErrorMessage(null)
    setGalleryImage(null)
    setIsGenerating(true)

    const ratioLabel =
      aspectRatio && aspectRatio !== "auto"
        ? `${aspectRatio} aspect ratio`
        : "native aspect ratio"

    setStatusMessage(`Sending prompt to Gemini 2.5 Flash Image (${ratioLabel})`)
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          image: selectedImage,
          aspectRatio: aspectRatio === "auto" ? undefined : aspectRatio,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || "Failed to generate image")
      }

      const payload = await response.json()

      if (payload?.imageUrl) {
        setGalleryImage({ src: payload.imageUrl, alt: "AI edited result" })
        setStatusMessage("Output ready in the gallery below")
      } else {
        throw new Error("No image returned from API")
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Generation failed"
      setErrorMessage(message)
      setStatusMessage("Something went wrong")
    } finally {
      setIsGenerating(false)
    }
  }

  const outputContent = () => {
    if (galleryImage) {
      return (
        <img
          src={galleryImage.src}
          alt={galleryImage.alt ?? "Generated output"}
          className="h-full w-full rounded-lg object-cover"
        />
      )
    }

    return (
      <div className="text-center">
        <div className="mb-4 text-6xl">🎨</div>
        <p className="text-sm font-medium text-muted-foreground">Ready for instant generation</p>
        <p className="mt-2 text-xs text-muted-foreground">Upload an image and enter your prompt</p>
      </div>
    )
  }

  return (
    <section id="editor" className="relative py-20 md:py-32">
      <div className="absolute left-10 top-20 text-7xl opacity-5 rotate-[-15deg]">📷</div>

      <div className="container">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-balance text-4xl font-bold md:text-5xl">Try The AI Editor</h2>
            <p className="text-pretty text-lg text-muted-foreground">
              Experience the power of natural language image editing. Transform any photo with simple text commands.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Upload Section */}
            <Card className="p-6">
              <Label className="mb-4 block text-lg font-semibold">Upload Image</Label>

              {!selectedImage ? (
                <label className="flex min-h-[300px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50 transition-colors hover:bg-muted">
                  <Upload className="mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="mb-2 text-sm font-medium">Click to upload image</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
              ) : (
                <div className="relative">
                  <img src={selectedImage || "/placeholder.svg"} alt="Uploaded" className="w-full rounded-lg" />
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute right-2 top-2"
                    onClick={() => {
                      setSelectedImage(null)
                      setGalleryImage(null)
                    }}
                  >
                    Change
                  </Button>
                </div>
              )}

              <div className="mt-6">
                <Label htmlFor="prompt" className="mb-2 block">
                  Edit Prompt
                </Label>
                <Textarea
                  id="prompt"
                  placeholder="Describe how you want to edit the image... e.g., 'Make the background a sunny beach' or 'Add a rainbow in the sky'"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <div className="mt-4">
                <Label className="mb-2 block">Target Aspect Ratio</Label>
                <div className="flex flex-wrap gap-2">
                  {ASPECT_RATIOS.map((option) => {
                    const isActive = option.value === aspectRatio
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setAspectRatio(option.value)}
                        className={`rounded-full border px-4 py-1 text-xs font-semibold transition ${
                          isActive
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-transparent text-muted-foreground"
                        }`}
                        aria-pressed={isActive}
                      >
                        {option.label}
                      </button>
                    )
                  })}
                </div>
                {selectedRatioLabel && (
                  <p className="mt-2 text-xs text-muted-foreground">{selectedRatioLabel}</p>
                )}
              </div>

              <Button
                className="mt-4 w-full bg-primary text-primary-foreground hover:bg-primary/90"
                size="lg"
                disabled={!selectedImage || !prompt || isGenerating}
                onClick={handleGenerate}
              >
                <Wand2 className="mr-2 h-4 w-4" />
                {finalButtonText}
              </Button>
            </Card>

            {/* Output Section */}
            <Card className="p-6">
              <Label className="mb-4 block text-lg font-semibold">Output Gallery</Label>

              <div className="flex min-h-[300px] items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30">
                {outputContent()}
              </div>

              <div className="mt-6 rounded-lg bg-accent/50 p-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🎯</span>
                  <div className="space-y-1 text-sm">
                    {statusMessage && <p className="font-medium">{statusMessage}</p>}
                    {errorMessage && <p className="text-destructive">{errorMessage}</p>}
                    {!statusMessage && !errorMessage && (
                      <p className="text-muted-foreground">
                        Be specific with your prompt for best results. Try "Add sunset lighting" or "Change to winter
                        scene".
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
