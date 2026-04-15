<<<<<<< Updated upstream
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getRequestSession } from '@/lib/auth/server-session'
import { canAccessLead } from '@/lib/auth/access'

export async function GET(req: NextRequest) {
  const session = getRequestSession(req)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const status = req.nextUrl.searchParams.get('status') ?? undefined
  const clientId = req.nextUrl.searchParams.get('clientId') ?? undefined

  const leads = await db.leads.list(status)
  const clients = await db.clients.list()
  const assignedClientIds = new Set(
    clients
      .filter((c) => c.assigned_user_ids.includes(session.userId))
      .map((c) => c.id)
  )

  const visibleLeads = leads.filter((lead) => canAccessLead(session, lead, assignedClientIds))
  const filteredByClient = clientId
    ? visibleLeads.filter((lead) => lead.client_id === clientId)
    : visibleLeads

  return NextResponse.json({ leads: filteredByClient })
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

  const lead = await db.leads.create({
    ...body,
    owner_user_id: session.userId,
    client_id: requestedClientId,
  })
  return NextResponse.json({ lead }, { status: 201 })
=======
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { saveLeadSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    let query = supabase
      .from("leads")
      .select("*", { count: "exact" })
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) query = query.eq("status", status);

    const { data, error, count } = await query;
    if (error) throw error;

    return NextResponse.json({ leads: data, total: count });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const parsed = saveLeadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("leads")
      .insert({ ...parsed.data, user_id: user.id })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ lead: data }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/leads]", err);
    return NextResponse.json({ error: "Failed to create lead" }, { status: 500 });
  }
>>>>>>> Stashed changes
}
