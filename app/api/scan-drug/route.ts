import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "AI is not configured on this server." },
        { status: 500 }
      )
    }

    const { image, mediaType } = await req.json()

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 500,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mediaType || "image/jpeg",
                data: image,
              },
            },
            {
              type: "text",
              text: `Look at this photo of a medication box/package. Extract the following information and respond ONLY with valid JSON, no other text, no markdown formatting:
{
  "drugName": "the drug name and strength as printed, e.g. 'Amoxicillin 500mg'",
  "category": "best guess at category, e.g. Antibiotics, Analgesics, Antimalarials, etc.",
  "nafdac": "the NAFDAC registration number if visible, otherwise empty string",
  "confidence": "high, medium, or low depending on image clarity"
}
If you cannot clearly identify the drug from the image, set drugName to "Unable to identify - please enter manually" and confidence to "low".`,
            },
          ],
        },
      ],
    })

    const textBlock = response.content.find((block) => block.type === "text")
    const rawText = textBlock && "text" in textBlock ? textBlock.text : "{}"

    let parsed
    try {
      const cleaned = rawText.replace(/```json|```/g, "").trim()
      parsed = JSON.parse(cleaned)
    } catch {
      return NextResponse.json({
        drugName: "Unable to identify - please enter manually",
        category: "",
        nafdac: "",
        confidence: "low",
      })
    }

    return NextResponse.json(parsed)
  } catch (err) {
    console.error("Scan drug API error:", err)
    return NextResponse.json(
      { error: "Failed to analyze image. Please try again or enter details manually." },
      { status: 500 }
    )
  }
}
