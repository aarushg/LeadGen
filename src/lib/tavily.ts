export interface TavilyResult {
  title: string;
  url: string;
  content: string;
  score: number;
  published_date?: string;
}

export interface TavilyResponse {
  results: TavilyResult[];
  query: string;
}

const TAVILY_API_URL = "https://api.tavily.com/search";

async function tavilySearch(
  query: string,
  maxResults = 5
): Promise<TavilyResult[]> {
  const res = await fetch(TAVILY_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.TAVILY_API_KEY}`,
    },
    body: JSON.stringify({
      query,
      max_results: maxResults,
      search_depth: "advanced",
      include_answer: false,
      include_raw_content: false,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Tavily search failed: ${err}`);
  }

  const data: TavilyResponse = await res.json();
  return data.results || [];
}

export async function researchLead(params: {
  companyName: string;
  contactName?: string;
  website?: string;
}): Promise<{ results: TavilyResult[]; queries: string[] }> {
  const { companyName, contactName, website } = params;

  const queries = [
    `${companyName} company overview funding news 2024 2025`,
    `${companyName} recent announcements press release product launch`,
    `${companyName} challenges problems pain points industry`,
    contactName
      ? `${contactName} ${companyName} LinkedIn background experience`
      : `${companyName} CEO founder leadership team`,
    website
      ? `site:${website} OR "${companyName}" blog insights`
      : `${companyName} marketing strategy customers`,
  ];

  // Run all searches in parallel
  const searchResults = await Promise.allSettled(
    queries.map((q) => tavilySearch(q, 4))
  );

  const allResults: TavilyResult[] = [];
  const usedUrls = new Set<string>();

  for (const result of searchResults) {
    if (result.status === "fulfilled") {
      for (const item of result.value) {
        if (!usedUrls.has(item.url)) {
          usedUrls.add(item.url);
          allResults.push(item);
        }
      }
    }
  }

  // Sort by score descending
  allResults.sort((a, b) => (b.score || 0) - (a.score || 0));

  return { results: allResults.slice(0, 15), queries };
}

export function formatResultsForClaude(results: TavilyResult[]): string {
  return results
    .map(
      (r, i) =>
        `[Source ${i + 1}] ${r.title}
URL: ${r.url}
${r.published_date ? `Date: ${r.published_date}` : ""}
Content: ${r.content.slice(0, 500)}`
    )
    .join("\n\n---\n\n");
}
