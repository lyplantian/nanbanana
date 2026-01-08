"use client"

import type React from "react"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Download, Maximize2, Upload, Wand2 } from "lucide-react"

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
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
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
    setIsPreviewOpen(false)
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

  const formatTimestamp = (date: Date) => {
    const pad = (value: number) => value.toString().padStart(2, "0")
    return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}-${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`
  }

  const getFileExtension = (src: string) => {
    const dataUrlMatch = src.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,/)
    if (dataUrlMatch?.[1]) {
      const subtype = dataUrlMatch[1].split("/")[1]
      return subtype || "png"
    }

    try {
      const parsed = new URL(src)
      const pathname = parsed.pathname
      const extMatch = pathname.match(/\.([a-zA-Z0-9]+)$/)
      return extMatch?.[1]?.toLowerCase() || "png"
    } catch {
      const extMatch = src.split("?")[0]?.match(/\.([a-zA-Z0-9]+)$/)
      return extMatch?.[1]?.toLowerCase() || "png"
    }
  }

  const buildFileName = (src: string) => {
    const ext = getFileExtension(src)
    const normalizedPrompt = prompt
      .trim()
      .slice(0, 40)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    const base = normalizedPrompt || "ai-edit"
    return `${base}-${formatTimestamp(new Date())}.${ext}`
  }

  const downloadImage = async (src: string) => {
    const fileName = buildFileName(src)

    try {
      const response = await fetch(src)
      if (!response.ok) {
        throw new Error("Failed to fetch image")
      }

      const blob = await response.blob()
      const objectUrl = URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.href = objectUrl
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      link.remove()

      setTimeout(() => URL.revokeObjectURL(objectUrl), 0)
    } catch {
      window.open(src, "_blank", "noopener,noreferrer")
    }
  }

  const outputContent = () => {
    if (galleryImage) {
      return (
        <button
          type="button"
          className="group relative h-full w-full cursor-zoom-in rounded-lg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          onClick={() => setIsPreviewOpen(true)}
          aria-label="Preview generated image"
        >
          <img
            src={galleryImage.src}
            alt={galleryImage.alt ?? "Generated output"}
            className="h-full w-full rounded-lg object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/0 opacity-0 transition group-hover:bg-black/35 group-hover:opacity-100">
            <div className="inline-flex items-center gap-2 rounded-full bg-background/90 px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm">
              <Maximize2 className="h-4 w-4" />
              Click to preview
            </div>
          </div>
        </button>
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
                      setIsPreviewOpen(false)
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

              {galleryImage && (
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button type="button" variant="secondary" onClick={() => setIsPreviewOpen(true)}>
                    <Maximize2 className="mr-2 h-4 w-4" />
                    Preview
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => downloadImage(galleryImage.src)}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              )}

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

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Generated Image</DialogTitle>
            <DialogDescription>Click download to save the full-resolution output.</DialogDescription>
          </DialogHeader>

          {galleryImage ? (
            <div className="space-y-4">
              <div className="flex max-h-[70vh] items-center justify-center overflow-hidden rounded-lg border bg-muted/30">
                <img
                  src={galleryImage.src}
                  alt={galleryImage.alt ?? "Generated output preview"}
                  className="max-h-[70vh] w-auto max-w-full object-contain"
                />
              </div>

              <div className="flex flex-wrap justify-end gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => downloadImage(galleryImage.src)}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">No image to preview.</div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}
