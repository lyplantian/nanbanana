"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, Wand2 } from "lucide-react"

export function EditorSection() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [prompt, setPrompt] = useState("")

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      console.log("图片上传 - 文件名:", file.name, "| 大小:", (file.size / 1024).toFixed(2), "KB", "| 类型:", file.type)
      const reader = new FileReader()
      reader.onload = (e) => {
        console.log("图片加载成功 - 预览已准备就绪")
        setSelectedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGenerate = () => {
    console.log("=== 开始AI图片编辑 ===")
    console.log("用户提示词:", prompt)
    console.log("图片状态:", selectedImage ? "✓ 已上传" : "✗ 未上传")
    console.log("提示词长度:", prompt.length, "个字符")
    console.log("====================")
    // Future: Add actual AI generation logic here
  }

  return (
    <section id="editor" className="relative py-20 md:py-32">
      <div className="absolute left-10 top-20 text-7xl opacity-5 rotate-[-15deg]">🍌</div>

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
                    onClick={() => setSelectedImage(null)}
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

              <Button
                className="mt-4 w-full bg-primary text-primary-foreground hover:bg-primary/90"
                size="lg"
                disabled={!selectedImage || !prompt}
                onClick={handleGenerate}
              >
                <Wand2 className="mr-2 h-4 w-4" />
                Generate Edit
              </Button>
            </Card>

            {/* Output Section */}
            <Card className="p-6">
              <Label className="mb-4 block text-lg font-semibold">Output Gallery</Label>

              <div className="flex min-h-[300px] items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30">
                <div className="text-center">
                  <div className="mb-4 text-6xl">✨</div>
                  <p className="text-sm font-medium text-muted-foreground">Ready for instant generation</p>
                  <p className="mt-2 text-xs text-muted-foreground">Upload an image and enter your prompt</p>
                </div>
              </div>

              <div className="mt-6 rounded-lg bg-accent/50 p-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🍌</span>
                  <div>
                    <p className="text-sm font-medium">Pro Tip</p>
                    <p className="text-xs text-muted-foreground">
                      Be specific with your prompts for best results. Try "Add sunset lighting" or "Change to winter
                      scene"
                    </p>
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
