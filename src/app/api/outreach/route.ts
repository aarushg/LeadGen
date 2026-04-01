import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateOutreachMessage } from "@/lib/claude";
import { outreachSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = outreachSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const result = await generateOutreachMessage(parsed.data);

    // If lead ID provided, save message to lead
    if (parsed.data.leadId) {
      await supabase
        .from("leads")
        .update({
          outreach_message: result.message,
          outreach_tone: parsed.data.tone,
          outreach_channel: parsed.data.channel,
          status: "researched",
        })
        .eq("id", parsed.data.leadId)
        .eq("user_id", user.id);
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
