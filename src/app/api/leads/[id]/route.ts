import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../pages/api/auth/[...nextauth]";
import { prisma } from "@/lib/prisma";

async function getUserId(): Promise<string> {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user) return (session.user as { id?: string }).id ?? "admin-2";
  } catch {}
  return "admin-2";
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const userId = await getUserId();
    const lead = await prisma.lead.findFirst({ where: { id, userId } });
    if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ lead });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const userId = await getUserId();
    const body = await req.json();

    const lead = await prisma.lead.updateMany({
      where: { id, userId },
      data: {
        ...(body.status !== undefined && { status: body.status }),
        ...(body.notes !== undefined && { notes: body.notes }),
        ...(body.outreachMessage !== undefined && { outreachMessage: body.outreachMessage }),
      },
    });

    return NextResponse.json({ lead });
  } catch (err) {
    console.error("[PATCH /api/leads/[id]]", err);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

// Support both PATCH and PUT
export { PATCH as PUT };

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const userId = await getUserId();
    await prisma.lead.deleteMany({ where: { id, userId } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/leads/[id]]", err);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
