import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import authOptions from "../../../../../pages/api/auth/[...nextauth]";
import * as XLSX from "xlsx";

// ── Column normaliser ─────────────────────────────────────────────────────────
// Maps raw header strings (lowercased, trimmed) to our Lead field names.
const HEADER_MAP: Record<string, string> = {
  // common
  "institute name": "company",
  "organization name": "company",
  "company": "company",
  "name": "company",
  "centre name": "company",
  "center name": "company",

  "phone number": "phone",
  "phone": "phone",
  "mobile": "phone",
  "contact": "phone",

  "email": "email",
  "email id": "email",
  "email address": "email",

  "website": "companyWebsite",
  "website url": "companyWebsite",
  "web": "companyWebsite",

  "city": "city",
  "town": "city",

  "state": "state",

  "address": "address",
  "full address": "address",

  // IELTS specific
  "notes / lead hook": "notes",
  "notes/lead hook": "notes",
  "notes": "notes",
  "lead priority": "leadPriority",
  "rating (google)": "googleRating",
  "google rating": "googleRating",
  "type": "type",
  "courses offered": "courses",
  "course fee (inr)": "courseFee",
  "affiliation / accreditation": "affiliation",
  "region": "region",
  "online / offline": "mode",

  // NCLEX specific
  "exam focus": "courses",
  "reviews": "reviews",
  "hours": "hours",
};

function normaliseHeader(h: string): string {
  return (h || "").toString().toLowerCase().trim();
}

function mapRow(headers: string[], values: unknown[]): Record<string, string> {
  const row: Record<string, string> = {};
  headers.forEach((h, i) => {
    const mapped = HEADER_MAP[normaliseHeader(h)];
    if (mapped && values[i] != null) {
      row[mapped] = String(values[i]).trim();
    }
  });
  return row;
}

// ── Detect which row contains the real headers ────────────────────────────────
function findHeaderRow(ws: XLSX.WorkSheet): number {
  const range = XLSX.utils.decode_range(ws["!ref"] || "A1");
  for (let r = range.s.r; r <= Math.min(range.s.r + 6, range.e.r); r++) {
    const cells = [];
    for (let c = range.s.c; c <= range.e.c; c++) {
      const cell = ws[XLSX.utils.encode_cell({ r, c })];
      cells.push(cell ? String(cell.v) : "");
    }
    // A row is a header row if at least 3 cells look like column labels (not numbers, not null)
    const nonNumeric = cells.filter((v) => v && isNaN(Number(v)) && v.length > 1);
    if (nonNumeric.length >= 3) return r;
  }
  return 0;
}

// ── Parse file buffer → array of mapped rows ──────────────────────────────────
function parseExcel(buffer: Buffer): {
  rows: Record<string, string>[];
  sheetName: string;
  totalRaw: number;
} {
  const wb = XLSX.read(buffer, { type: "buffer" });

  // Pick first data sheet (skip legend/summary sheets)
  const dataSheetName =
    wb.SheetNames.find((n) =>
      !n.toLowerCase().includes("legend") &&
      !n.toLowerCase().includes("summary") &&
      !n.toLowerCase().includes("note")
    ) || wb.SheetNames[0];

  const ws = wb.Sheets[dataSheetName];
  const headerRow = findHeaderRow(ws);
  const range = XLSX.utils.decode_range(ws["!ref"] || "A1");

  // Extract headers from detected row
  const headers: string[] = [];
  for (let c = range.s.c; c <= range.e.c; c++) {
    const cell = ws[XLSX.utils.encode_cell({ r: headerRow, c })];
    headers.push(cell ? String(cell.v) : "");
  }

  // Extract data rows
  const rows: Record<string, string>[] = [];
  for (let r = headerRow + 1; r <= range.e.r; r++) {
    const values: unknown[] = [];
    for (let c = range.s.c; c <= range.e.c; c++) {
      const cell = ws[XLSX.utils.encode_cell({ r, c })];
      values.push(cell ? cell.v : null);
    }

    const mapped = mapRow(headers, values);
    // Skip rows with no company name
    if (!mapped.company) continue;
    rows.push(mapped);
  }

  return { rows, sheetName: dataSheetName, totalRaw: range.e.r - headerRow };
}

// ── Route handler ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    // Auth — accept NextAuth session OR cookie-based session
    const session = await getServerSession(authOptions as never);
    const cookieUserId = req.cookies.get("auth_user_id")?.value;
    const userId: string | null = (session as { user?: { id?: string } })?.user?.id || cookieUserId || null;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!["xlsx", "xls", "csv"].includes(ext || "")) {
      return NextResponse.json({ error: "Only .xlsx, .xls, or .csv files are supported" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const { rows, sheetName, totalRaw } = parseExcel(buffer);

    if (rows.length === 0) {
      return NextResponse.json({ error: "No valid lead rows found in file" }, { status: 400 });
    }

    // Build extra metadata to store in researchData
    const buildResearchData = (row: Record<string, string>) => {
      const extra: Record<string, string> = {};
      const metaFields = ["city", "state", "address", "region", "type", "courses", "courseFee", "affiliation", "mode", "googleRating", "reviews", "hours", "leadPriority"];
      metaFields.forEach((f) => { if (row[f]) extra[f] = row[f]; });
      return Object.keys(extra).length > 0 ? extra : null;
    };

    // Bulk insert — skip duplicates by checking company+userId
    const existingCompanies = new Set(
      (await prisma.lead.findMany({
        where: { userId },
        select: { company: true },
      })).map((l) => l.company.toLowerCase())
    );

    const toInsert = rows.filter(
      (r) => !existingCompanies.has((r.company || "").toLowerCase())
    );

    if (toInsert.length === 0) {
      return NextResponse.json({
        message: "All leads already exist for your account",
        imported: 0,
        skipped: rows.length,
      });
    }

    await prisma.lead.createMany({
      data: toInsert.map((row) => ({
        userId,
        company: row.company,
        companyWebsite: row.companyWebsite || null,
        email: row.email || null,
        notes: buildNote(row),
        researchData: buildResearchData(row) as never,
        status: mapPriority(row.leadPriority),
        tags: [sheetName].filter(Boolean).join(","),
      })),
      // skipDuplicates removed: not supported by current Prisma version
    });

    return NextResponse.json({
      message: `Successfully imported ${toInsert.length} leads`,
      imported: toInsert.length,
      skipped: rows.length - toInsert.length,
      sheet: sheetName,
    });
  } catch (err) {
    console.error("[/api/leads/import]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Import failed" },
      { status: 500 }
    );
  }
}

// ── Preview endpoint (GET with query) — returns first 10 rows ─────────────────
export async function PUT(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const { rows, sheetName, totalRaw } = parseExcel(buffer);

    return NextResponse.json({
      preview: rows.slice(0, 10),
      total: rows.length,
      sheet: sheetName,
    });
  } catch (err) {
    return NextResponse.json({ error: "Preview failed" }, { status: 500 });
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function buildNote(row: Record<string, string>): string | null {
  const parts: string[] = [];
  if (row.notes) parts.push(row.notes);
  if (row.city && row.state) parts.push(`Location: ${row.city}, ${row.state}`);
  else if (row.city) parts.push(`City: ${row.city}`);
  if (row.phone) parts.push(`Phone: ${row.phone}`);
  if (row.courses) parts.push(`Courses: ${row.courses}`);
  if (row.googleRating) parts.push(`Rating: ${row.googleRating}★`);
  if (row.hours) parts.push(`Hours: ${row.hours}`);
  return parts.length > 0 ? parts.join("\n") : null;
}

function mapPriority(priority: string | undefined): string {
  if (!priority) return "new";
  const p = priority.toLowerCase();
  if (p === "high") return "qualified";
  if (p === "medium") return "researched";
  return "new";
}
