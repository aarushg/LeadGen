


import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { saveLeadSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  try {
    // TODO: Replace with real user auth
    const userId = "1";
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    const where: any = { userId };
    if (status) where.status = status;

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: offset,
        take: limit,
      }),
      prisma.lead.count({ where }),
    ]);

    return NextResponse.json({ leads, total });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // TODO: Replace with real user auth
    const userId = "1";
    const body = await req.json();
    const parsed = saveLeadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    // Convert tags array to comma-separated string or null
    const tags = Array.isArray(parsed.data.tags)
      ? parsed.data.tags.join(",")
      : parsed.data.tags ?? null;
    const lead = await prisma.lead.create({
      data: { ...parsed.data, userId, tags },
    });
    return NextResponse.json({ lead }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/leads]", err);
    return NextResponse.json({ error: "Failed to create lead" }, { status: 500 });
  }
}
