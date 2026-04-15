<<<<<<< Updated upstream
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getRequestSession } from '@/lib/auth/server-session'
import { canAccessProposal } from '@/lib/auth/access'

export async function GET(req: NextRequest) {
  const session = getRequestSession(req)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const clientId = req.nextUrl.searchParams.get('clientId') ?? undefined
  const proposals = await db.proposals.list()
  const clients = await db.clients.list()
  const assignedClientIds = new Set(
    clients
      .filter((c) => c.assigned_user_ids.includes(session.userId))
      .map((c) => c.id)
  )

  const visible = proposals.filter((proposal) => canAccessProposal(session, proposal, assignedClientIds))
  const filteredByClient = clientId ? visible.filter((proposal) => proposal.client_id === clientId) : visible
  return NextResponse.json({ proposals: filteredByClient })
}

export async function POST(req: NextRequest) {
  const session = getRequestSession(req)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const requestedClientId = typeof body.client_id === 'string' ? body.client_id : undefined

  if (requestedClientId) {
    const client = await db.clients.get(requestedClientId)
    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    const canUseClient = session.role === 'admin' || client.assigned_user_ids.includes(session.userId)
    if (!canUseClient) {
      return NextResponse.json({ error: 'Forbidden for this client' }, { status: 403 })
    }
  }

  const proposal = await db.proposals.create({
    ...body,
    owner_user_id: session.userId,
    client_id: requestedClientId,
  })
  return NextResponse.json({ proposal }, { status: 201 })
=======
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
>>>>>>> Stashed changes
}
