
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateProposal } from "@/lib/claude";
import { intakeFormSchema } from "@/lib/validations";

  try {
    // TODO: Replace with real user auth
    const userId = "1";
    const proposals = await prisma.proposal.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ proposals });
  } catch {
    return NextResponse.json({ error: "Failed to fetch proposals" }, { status: 500 });
  }
}

  try {
    // TODO: Replace with real user auth
    const userId = "1";
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
    const content = await generateProposal({
      clientName,
      clientCompany,
      projectType,
      projectGoals,
      budgetRange,
      timelineWeeks,
      additionalContext,
    });
    const proposal = await prisma.proposal.create({
      data: {
        userId,
        leadId: leadId || null,
        clientName,
        clientCompany,
        clientEmail: clientEmail || null,
        projectType,
        projectGoals,
        budgetRange,
        timelineWeeks,
        additionalContext: additionalContext || null,
        content,
        status: "draft",
      },
    });
    return NextResponse.json({ proposal }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/proposals]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to generate proposal" },
      { status: 500 }
    );
  }
}
