import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "AI is not configured on this server." },
        { status: 500 }
      )
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "No messages provided" }, { status: 400 })
    }

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 500,
      messages: messages.map((m: { content: string }) => ({
        role: "user" as const,
        content: m.content,
      })),
    })

    const textBlock = response.content.find((block) => block.type === "text")
    const message = textBlock && "text" in textBlock ? textBlock.text : "Sorry, I could not generate a response."

    return NextResponse.json({ message })
  } catch (err) {
    console.error("Chat API error:", err)
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    )
  }
}
