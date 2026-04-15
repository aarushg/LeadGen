import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateOutreachMessage } from "@/lib/claude";
import { outreachSchema } from "@/lib/validations";

  try {
    // TODO: Replace with real user auth
    const userId = "1";
    const body = await req.json();
    const parsed = outreachSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const result = await generateOutreachMessage(parsed.data);
    // If lead ID provided, update lead
    if (parsed.data.leadId) {
      await prisma.lead.update({
        where: { id: parsed.data.leadId },
        data: {
          outreachMessage: result.message,
          outreachTone: parsed.data.tone,
          outreachChannel: parsed.data.channel,
          status: "researched",
        },
      });
    }
    return NextResponse.json(result);
  } catch (err) {
    console.error("[/api/outreach]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to generate message" },
      { status: 500 }
    );
  }
}
