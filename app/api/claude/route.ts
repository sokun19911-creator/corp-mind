import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const { system, content, maxTokens = 2048 } = await req.json();
  const msg = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: maxTokens,
    system,
    messages: [{ role: "user", content }],
  });
  const text = msg.content.find((b) => b.type === "text")?.text ?? "{}";
  console.log("[claude-route] raw response:", text.slice(0, 500));
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return NextResponse.json({ error: "JSON not found", raw: text.slice(0, 300) }, { status: 400 });
  return NextResponse.json(JSON.parse(match[0]));
}
