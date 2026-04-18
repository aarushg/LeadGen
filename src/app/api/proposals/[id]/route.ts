
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    // TODO: Replace with real user auth
    const userId = "1";
    const proposal = await prisma.proposal.findFirst({
      where: { id, userId },
    });
    if (!proposal) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ proposal });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    // TODO: Replace with real user auth
    const userId = "1";
    const body = await req.json();
    const proposal = await prisma.proposal.update({
      where: { id },
      data: body,
    });
    return NextResponse.json({ proposal });
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    // TODO: Replace with real user auth
    const userId = "1";
    await prisma.proposal.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
