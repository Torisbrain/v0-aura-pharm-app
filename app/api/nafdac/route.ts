import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { query } = await req.json();

  if (!query || typeof query !== "string" || query.trim().length < 2) {
    return NextResponse.json({ error: "Query too short" }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }

  const q = query.trim();
  const prompt = `You are a NAFDAC drug verification assistant for Nigeria. A user is searching for: "${q}". Check if this matches any drug registered in Nigeria NAFDAC Greenbook. Respond ONLY with raw JSON, no markdown. If NAFDAC registered: {"status":"verified","name":"full product name","activeIngredients":"ingredients and strength","registrationNumber":"NRN","manufacturer":"name","applicant":"Nigerian distributor","form":"Tablet or Capsule or Syrup etc","approvalDate":"year","score":98}. If not found: {"status":"not_found","name":"${q}","score":0}. If suspicious or counterfeit: {"status":"suspicious","name":"${q}","warning":"reason it is flagged","score":15}. Only output the JSON object.`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 500,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Service error" }, { status: 502 });
    }

    const data = await res.json();
    const text = (data.content?.[0]?.text ?? "").replace(/```json|```/g, "").trim();
    return NextResponse.json(JSON.parse(text));
  } catch {
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
