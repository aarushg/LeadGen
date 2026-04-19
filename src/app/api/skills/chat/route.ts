import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getSkill } from "@/lib/skills";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { skillId, messages } = await req.json();

    if (!skillId || !messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "skillId and messages are required" }, { status: 400 });
    }

    const skill = getSkill(skillId);
    if (!skill) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2048,
      system: skill.systemPrompt,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";

    return NextResponse.json({ message: text });
  } catch (err) {
    console.error("Skills chat error:", err);
    return NextResponse.json({ error: "Failed to get response" }, { status: 500 });
  }
}
