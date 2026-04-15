
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateProposal } from "@/lib/claude";
import { intakeFormSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase
      .from("proposals")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ proposals: data });
  } catch {
    return NextResponse.json({ error: "Failed to fetch proposals" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const parsed = intakeFormSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const {
    } = parsed.data;

    const {
      clientName,
      clientCompany,
      clientEmail,
      projectType,
      projectGoals,
      budgetRange,
      timelineWeeks,
      additionalContext,
      leadId,
    } = parsed.data;

    // Generate proposal content with Claude
    const content = await generateProposal({
      clientName,
      clientCompany,
      projectType,
      projectGoals,
      budgetRange,
      timelineWeeks,
      additionalContext,
    });

    // Save to DB
    const { data, error } = await supabase
      .from("proposals")
      .insert({
        user_id: user.id,
        lead_id: leadId || null,
        client_name: clientName,
        client_company: clientCompany,
        client_email: clientEmail || null,
        project_type: projectType,
        project_goals: projectGoals,
        budget_range: budgetRange,
        timeline_weeks: timelineWeeks,
        additional_context: additionalContext || null,
        content,
        status: "draft",
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ proposal: data }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/proposals]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to generate proposal" },
      { status: 500 }
    );
  }
}
