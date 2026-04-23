import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getSkill } from "@/lib/skills";
import { ollamaChat } from "@/lib/ollama";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { skillId, messages, provider = "claude", ollamaModel } = await req.json();

    if (!skillId || !messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "skillId and messages are required" }, { status: 400 });
    }

    const skill = getSkill(skillId);
    if (!skill) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }

    const formatted = messages.map((m: { role: string; content: string }) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

    let text = "";

    if (provider === "ollama") {
      if (!ollamaModel) {
        return NextResponse.json({ error: "ollamaModel is required when using Ollama" }, { status: 400 });
      }
      text = await ollamaChat(ollamaModel, [
        { role: "system", content: skill.systemPrompt },
        ...formatted,
      ]);
    } else {
      // Default: Claude
      if (!process.env.ANTHROPIC_API_KEY) {
        return NextResponse.json({ error: "ANTHROPIC_API_KEY is not set" }, { status: 500 });
      }
      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 2048,
        system: skill.systemPrompt,
        messages: formatted,
      });
      text = response.content[0].type === "text" ? response.content[0].text : "";
    }

    return NextResponse.json({ message: text });
  } catch (err) {
    console.error("Skills chat error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to get response" },
      { status: 500 }
    );
  }
}
