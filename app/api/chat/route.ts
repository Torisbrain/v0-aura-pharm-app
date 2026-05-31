import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        system: "You are AuraBot, an AI pharmacy assistant for AuraBridge Health in Nigeria and West Africa. Help with drug questions, interactions, NAFDAC, dosages, and pharmacy operations. Be concise and professional.",
        messages: messages.map((m: any) => ({ role: m.role, content: m.content })),
      }),
    })
    const data = await response.json()
    console.log("Anthropic response status:", response.status)
    console.log("Anthropic data:", JSON.stringify(data).slice(0, 300))
    const text = data.content?.[0]?.text
    if (!text) return NextResponse.json({ message: "No response from AI." })
    return NextResponse.json({ message: text })
  } catch (err) {
    console.error("Chat error:", err)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
