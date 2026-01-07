import { NextResponse } from "next/server"

const OPENROUTER_ENDPOINT = "https://openrouter.ai/api/v1/chat/completions"

const DATA_URL_REGEX = /data:image\/[^;]+;base64,[A-Za-z0-9+/=]+/i

const defaultProviderOrder = ["fal"]

const getImageUrlFromEntry = (entry: any): string | undefined => {
  if (!entry) {
    return undefined
  }

  if (typeof entry === "string") {
    const match = entry.match(DATA_URL_REGEX)
    if (match) {
      return match[0]
    }

    if (entry.startsWith("http")) {
      return entry
    }

    return undefined
  }

  return (
    entry.image_url?.url ??
    entry.imageUrl?.url ??
    entry.image?.url ??
    entry.url ??
    undefined
  )
}

const extractImageUrlFromArray = (entries: any): string | undefined => {
  if (!Array.isArray(entries)) {
    return undefined
  }

  for (const entry of entries) {
    const url = getImageUrlFromEntry(entry)
    if (url) {
      return url
    }
  }

  return undefined
}

const findImageUrlFromResponse = (data: any): string | undefined => {
  if (!data) {
    return undefined
  }

  const choices = Array.isArray(data.choices) ? data.choices : []
  for (const choice of choices) {
    const message = choice?.message ?? choice
    const candidate =
      getImageUrlFromEntry(message) ??
      extractImageUrlFromArray(message?.images) ??
      extractImageUrlFromArray(message?.content) ??
      extractImageUrlFromArray(message?.data) ??
      extractImageUrlFromArray(message?.delta?.content)

    if (candidate) {
      return candidate
    }

    const text = message?.text ?? message?.delta?.text
    if (typeof text === "string") {
      const match = text.match(DATA_URL_REGEX)
      if (match) {
        return match[0]
      }
    }
  }

  return (
    extractImageUrlFromArray(data?.output) ??
    extractImageUrlFromArray(data?.data) ??
    undefined
  )
}

type RequestBody = {
  prompt?: string
  image?: string
  aspectRatio?: string
}

export async function POST(request: Request) {
  const { prompt, image, aspectRatio } = (await request.json()) as RequestBody

  if (!prompt || !image) {
    return NextResponse.json(
      { error: "Both prompt and image are required" },
      { status: 400 }
    )
  }

  const apiKey = process.env.OPENROUTER_API_KEY

  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing OpenRouter API key on the server" },
      { status: 500 }
    )
  }

  const payload: Record<string, any> = {
    model: "google/gemini-2.5-flash-image",
    messages: [
      {
        role: "system",
        content:
          "You are an image editing model. You MUST return at least one generated image as output. Do not describe the image in text unless you are unable to generate an image; in that case, reply with a short error message.",
      },
      {
        role: "user",
        content: [
          { type: "text", text: `${prompt}\n\nReturn only the edited image.` },
          {
            type: "image_url",
            image_url: {
              url: image,
            },
          },
        ],
      },
    ],
    modalities: ["image", "text"],
    provider: {
      require_parameters: true,
      order: defaultProviderOrder,
    },
    ...(aspectRatio && aspectRatio !== "auto"
      ? {
          image_config: {
            aspect_ratio: aspectRatio,
          },
        }
      : {}),
  }

  const doRequest = (body: Record<string, any>) =>
    fetch(OPENROUTER_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    })

  const parseError = (errorText: string) => {
    let parsedError: any = undefined

    try {
      parsedError = JSON.parse(errorText)
    } catch {
      parsedError = undefined
    }

    const messageFromJson =
      parsedError?.error?.message ??
      parsedError?.message ??
      parsedError?.error ??
      undefined

    const message =
      typeof messageFromJson === "string" && messageFromJson.trim().length > 0
        ? messageFromJson
        : errorText || "OpenRouter returned an error"

    return { message, raw: parsedError ?? errorText }
  }

  let response = await doRequest(payload)
  let data: any = undefined

  if (!response.ok) {
    const errorText = await response.text()
    const parsed = parseError(errorText)

    const looksLikeProviderRoutingIssue =
      response.status === 400 &&
      typeof parsed.message === "string" &&
      /(provider|routing|order)/i.test(parsed.message) &&
      payload.provider

    if (looksLikeProviderRoutingIssue) {
      const retryPayload = { ...payload }
      delete retryPayload.provider
      response = await doRequest(retryPayload)

      if (!response.ok) {
        const retryErrorText = await response.text()
        const retryParsed = parseError(retryErrorText)
        return NextResponse.json(
          { error: retryParsed.message, raw: retryParsed.raw },
          { status: response.status }
        )
      }

      data = await response.json()
    } else {
      return NextResponse.json(
        { error: parsed.message, raw: parsed.raw },
        { status: response.status }
      )
    }
  } else {
    data = await response.json()
  }

  const imageUrl =
    findImageUrlFromResponse(data) ??
    data?.choices?.[0]?.message?.images?.[0]?.image_url?.url

  if (!imageUrl) {
    return NextResponse.json(
      { error: "No generated image found in OpenRouter response", raw: data },
      { status: 502 }
    )
  }

  return NextResponse.json({ imageUrl, raw: data })
}
