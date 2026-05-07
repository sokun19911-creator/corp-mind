import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function extractJson(text: string): string | null {
  const start = text.indexOf("{");
  if (start === -1) return null;
  let depth = 0;
  let inString = false;
  let escape = false;
  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (escape) { escape = false; continue; }
    if (ch === "\\" && inString) { escape = true; continue; }
    if (ch === '"') { inString = !inString; continue; }
    if (inString) continue;
    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) return text.slice(start, i + 1);
    }
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const { system, userMessage } = await req.json();
    const messages: Anthropic.MessageParam[] = [{ role: "user", content: userMessage }];

    for (let i = 0; i < 8; i++) {
      const msg = await client.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 2048,
        tools: [{ type: "web_search_20250305" as const, name: "web_search" }],
        system,
        messages,
      });

      if (msg.stop_reason === "end_turn") {
        const text = msg.content.find((b) => b.type === "text")?.text ?? "";
        const jsonStr = extractJson(text);
        if (!jsonStr) return NextResponse.json({ error: "JSON not found" }, { status: 400 });
        return NextResponse.json(JSON.parse(jsonStr));
      }

      if (msg.stop_reason === "tool_use") {
        messages.push({ role: "assistant", content: msg.content });
        const results = msg.content
          .filter((b) => b.type === "tool_use")
          .map((b) => ({
            type: "tool_result" as const,
            tool_use_id: (b as Anthropic.ToolUseBlock).id,
            content: "検索を実行してください",
          }));
        messages.push({ role: "user", content: results });
      } else break;
    }
    return NextResponse.json({ error: "loop limit" }, { status: 500 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
