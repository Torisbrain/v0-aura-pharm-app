import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        max_tokens: 1024,
        messages: [
          { role: "system", content: "You are AuraBot, an AI pharmacy assistant for AuraBridge Health in Nigeria and West Africa. Help with drug questions, NAFDAC, dosages, interactions and pharmacy operations. Be concise and professional." },
          ...messages
        ],
      }),
    })
    const data = await response.json()
    const text = data.choices?.[0]?.message?.content
    return NextResponse.json({ message: text })
  } catch (err) {
    console.error("Chat error:", err)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
