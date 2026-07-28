// app/api/verify-drug/route.ts
//
// Dedicated endpoint for PharmVerify's public authenticity-checking
// scanner — separate from /api/scan-drug (which is for pharmacies adding
// stock to inventory). This one is framed around verification: reading
// the NAFDAC number and packaging details off a photo so it can be
// cross-checked against the NAFDAC Greenbook via /api/nafdac.

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
              text: `You are helping a patient or member of the public verify whether a medication is genuine, using a photo of the drug packaging. Extract what's visible and respond ONLY with valid JSON, no other text, no markdown formatting:
{
  "drugName": "the drug name and strength as printed",
  "nafdacNumber": "the NAFDAC registration number if visible on the packaging, otherwise empty string",
  "manufacturer": "manufacturer name if visible, otherwise empty string",
  "packagingNotes": "brief note on anything unusual about the packaging quality, spelling, or printing that might suggest counterfeiting — or 'No obvious concerns' if nothing stands out. This is a visual observation only, not a definitive authenticity determination.",
  "confidence": "high, medium, or low depending on image clarity"
}
If you cannot clearly identify the drug from the image, set drugName to "Unable to identify - please try a clearer photo or search manually" and confidence to "low". Be clear this is a preliminary visual check only — the real verification is the NAFDAC database lookup that follows.`,
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
        drugName: "Unable to identify - please try a clearer photo or search manually",
        nafdacNumber: "",
        manufacturer: "",
        packagingNotes: "",
        confidence: "low",
      })
    }

    return NextResponse.json(parsed)
  } catch (err) {
    console.error("Verify drug API error:", err)
    return NextResponse.json(
      { error: "Failed to analyze image. Please try again or search manually." },
      { status: 500 }
    )
  }
}