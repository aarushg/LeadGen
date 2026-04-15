<<<<<<< Updated upstream
import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { ollamaChat } from '@/lib/ollama'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

async function tavilySearch(query: string, maxResults = 5) {
  const res = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: process.env.TAVILY_API_KEY,
      query,
      max_results: maxResults,
      search_depth: 'advanced',
    }),
  })
  if (!res.ok) return { results: [] }
  const data = await res.json()
  return data
}

export async function POST(req: NextRequest) {
  const {
    company, website, contactName, contactTitle, linkedinUrl,
    tone, channel,
    aiProvider = 'claude',
    ollamaModel = 'llama3',
  } = await req.json()

  if (!company) return NextResponse.json({ error: 'Company name is required' }, { status: 400 })

  // Parallel searches
  const queries = [`${company} company news funding recent 2024 2025`]
  if (contactName) queries.push(`${contactName} ${company} ${contactTitle || ''}`)

  const searchResults = await Promise.all(queries.map(q => tavilySearch(q)))
  const allResults = searchResults.flatMap(r => r.results || [])
  const sources = allResults.slice(0, 6).map((r: { title: string; url: string; content?: string }) => ({
    title: r.title,
    url: r.url,
    snippet: r.content?.slice(0, 300),
  }))

  const contextBlock = sources.map((s, i) => `[${i + 1}] ${s.title}\n${s.snippet || ''}`).join('\n\n')

  const prompt = `You are an expert sales intelligence analyst. Based on the research below, generate a detailed intelligence brief and personalized outreach message.

TARGET:
- Company: ${company}${website ? `\n- Website: ${website}` : ''}${contactName ? `\n- Contact: ${contactName}${contactTitle ? `, ${contactTitle}` : ''}` : ''}${linkedinUrl ? `\n- LinkedIn: ${linkedinUrl}` : ''}

RESEARCH DATA:
${contextBlock || 'No specific search results found — use your knowledge of the company.'}

Generate a JSON response with this exact structure:
{
  "brief": {
    "background": "2-3 sentence company overview covering what they do, market position, and key facts",
    "painPoints": ["specific pain point 1", "specific pain point 2", "specific pain point 3"],
    "recentMoves": ["recent news/move 1", "recent news/move 2"],
    "contactProfile": "${contactName ? 'brief profile of ' + contactName + ' based on their role' : null}"
  },
  "outreachMessage": "A highly personalized ${channel} message in ${tone} tone. Reference SPECIFIC details from the research — company news, their actual challenges, recent moves. Do NOT use generic opener lines like 'I hope this finds you well'. Open with something specific and relevant. Keep it concise (under 150 words for LinkedIn/Twitter, under 200 for email). End with a clear, low-friction CTA."
}

IMPORTANT: Return ONLY the JSON object, no markdown, no extra text.`

  let text: string

  if (aiProvider === 'ollama') {
    try {
      text = await ollamaChat(ollamaModel, [{ role: 'user', content: prompt }], { temperature: 0.7 })
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Ollama unreachable'
      return NextResponse.json({ error: `Ollama error: ${msg}` }, { status: 503 })
    }
  } else {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    })
    text = response.content[0].type === 'text' ? response.content[0].text : ''
  }

  let parsed
  try {
    parsed = JSON.parse(text)
  } catch {
    const match = text.match(/\{[\s\S]*\}/)
    if (!match) return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 })
    parsed = JSON.parse(match[0])
  }

  return NextResponse.json({
    brief: parsed.brief,
    outreachMessage: parsed.outreachMessage,
    sources: sources.map(s => ({ title: s.title, url: s.url })),
    aiProvider,
  })
=======
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { researchLead, formatResultsForClaude } from "@/lib/tavily";
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
>>>>>>> Stashed changes
}
