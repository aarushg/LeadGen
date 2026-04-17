import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { researchLead, formatResultsForClaude } from "@/lib/tavily";
import { synthesizeResearch } from "@/lib/claude";
import { researchSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  try {
    const userId = "1";
    const body = await req.json();
    const parsed = researchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const { companyName, contactName, website } = parsed.data;
    // Step 1: Run web research via Tavily
    const { results, queries } = await researchLead({
      companyName,
      contactName,
      website,
    });
    // Step 2: Format results for Claude
    const rawResearch = formatResultsForClaude(results);
    // Step 3: Claude synthesizes intelligence brief.
    const leadProfile = await synthesizeResearch(rawResearch, companyName, contactName);
    // Attach sources to profile
    const sources = results.map((r) => ({ title: r.title, url: r.url }));
    // save research session (disabled, model missing)
    // await prisma.researchSession.create({
    //   data: {
    //     userId,
    //     query: companyName + (contactName ? ` .b7 ${contactName}` : ""),
    //     sources: results,
    //   },
    // });
    return NextResponse.json({ leadProfile, sources, queries });
  } catch (err) {
    console.error("[/api/research]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Research failed" },
      { status: 500 }
    );
  }
}

