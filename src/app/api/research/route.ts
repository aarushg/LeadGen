import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { researchLead, formatResultsForClaude } from "@/lib/tavily";
// import { synthesizeResearch } from "@/lib/claude";
import { researchSchema } from "@/lib/validations";

  try {
    // TODO: Replace with real user auth
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
    // Step 3: Claude synthesizes intelligence brief
    const leadProfile = await synthesizeResearch(rawResearch, companyName, contactName);
    // Attach sources to profile
    const sources = results.map((r) => ({ title: r.title, url: r.url }));
    // Save research session
    await prisma.researchSession.create({
      data: {
        userId,
        query: companyName + (contactName ? ` · ${contactName}` : ""),
        sources: results,
      },
    });
    return NextResponse.json({ leadProfile, sources, queries });
  } catch (err) {
    console.error("[/api/research]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Research failed" },
      { status: 500 }
    );
  }
}
import { synthesizeResearch } from "@/lib/claude";
import { researchSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  try {
    // Auth
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate
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

    // Step 3: Claude synthesizes intelligence brief
    const leadProfile = await synthesizeResearch(rawResearch, companyName, contactName);

    // Attach sources to profile
    const sources = results.map((r) => ({ title: r.title, url: r.url }));

    // Save research session
    await supabase.from("research_sessions").insert({
      user_id: user.id,
      query: companyName + (contactName ? ` · ${contactName}` : ""),
      sources: results,
    });

    return NextResponse.json({ leadProfile, sources, queries });
  } catch (err) {
    console.error("[/api/research]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Research failed" },
      { status: 500 }
    );
  }
}
