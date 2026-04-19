"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Loader2,
  X,
  Eye,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface PreviewRow {
  company: string;
  email?: string;
  companyWebsite?: string;
  city?: string;
  state?: string;
  phone?: string;
  courses?: string;
  googleRating?: string;
  leadPriority?: string;
  notes?: string;
  [key: string]: string | undefined;
}

export default function ImportPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewing, setPreviewing] = useState(false);
  const [importing, setImporting] = useState(false);
  const [preview, setPreview] = useState<{
    rows: PreviewRow[];
    total: number;
    sheet: string;
  } | null>(null);
  const [result, setResult] = useState<{
    imported: number;
    skipped: number;
    message: string;
  } | null>(null);

  function handleFile(f: File) {
    const ext = f.name.split(".").pop()?.toLowerCase();
    if (!["xlsx", "xls", "csv"].includes(ext || "")) {
      toast.error("Only .xlsx, .xls, or .csv files are supported");
      return;
    }
    setFile(f);
    setPreview(null);
    setResult(null);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }

  async function handlePreview() {
    if (!file) return;
    setPreviewing(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/leads/import", { method: "PUT", body: fd });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Preview failed");
      }
      const data = await res.json();
      setPreview(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Preview failed");
    } finally {
      setPreviewing(false);
    }
  }

  async function handleImport() {
    if (!file) return;
    setImporting(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/leads/import", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Import failed");
      setResult(data);
      toast.success(data.message);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Import failed");
    } finally {
      setImporting(false);
    }
  }

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="p-2 rounded-lg hover:bg-secondary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Import Leads</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Upload an Excel or CSV file — each row becomes a lead in your account
          </p>
        </div>
      </div>

      {/* Supported files info */}
      <div className="flex gap-3 flex-wrap">
        {[
          { name: "IELTS_Coaching_India_Leads.xlsx", rows: "~30 leads" },
          { name: "India_NCLEX_Centers_AllStates.xlsx", rows: "~104 leads" },
        ].map((f) => (
          <div
            key={f.name}
            className="flex items-center gap-2 px-3 py-2 glass rounded-lg text-xs"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span className="font-medium">{f.name}</span>
            <span className="text-muted-foreground">· {f.rows}</span>
          </div>
        ))}
      </div>

      {/* Drop zone */}
      {!result && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          className={cn(
            "relative glass rounded-2xl border-2 border-dashed p-10 text-center cursor-pointer transition-all",
            dragOver ? "border-primary bg-primary/5 scale-[1.01]" : "border-border hover:border-primary/40 hover:bg-secondary/50"
          )}
        >
          <input
            ref={fileRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            className="hidden"
            onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
          />
          <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          {file ? (
            <div>
              <div className="flex items-center justify-center gap-2 mb-1">
                <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                <span className="font-semibold">{file.name}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); setFile(null); setPreview(null); }}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
          ) : (
            <div>
              <p className="font-medium mb-1">Drop your Excel file here</p>
              <p className="text-sm text-muted-foreground">
                or click to browse · .xlsx, .xls, .csv supported
              </p>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      {file && !result && (
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handlePreview}
            disabled={previewing}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border hover:border-primary/40 text-sm font-medium transition-colors disabled:opacity-60"
          >
            {previewing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
            Preview data
          </button>
          <button
            onClick={handleImport}
            disabled={importing}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-60 shadow-lg shadow-primary/20"
          >
            {importing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {importing ? "Importing..." : "Import all leads"}
          </button>
        </div>
      )}

      {/* Preview table */}
      {preview && !result && (
        <div className="glass rounded-2xl overflow-hidden">
          <div className="px-5 py-3 border-b border-border flex items-center justify-between">
            <div>
              <span className="font-semibold text-sm">Preview — {preview.sheet}</span>
              <span className="text-xs text-muted-foreground ml-2">
                Showing first 10 of {preview.total} leads
              </span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-secondary">
                  <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground">Company</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground">City / State</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground">Email</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground">Courses</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground">Rating</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground">Priority</th>
                </tr>
              </thead>
              <tbody>
                {preview.rows.map((row, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-secondary/40 transition-colors">
                    <td className="px-4 py-2.5 font-medium max-w-[180px] truncate">{row.company}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">
                      {[row.city, row.state].filter(Boolean).join(", ") || "—"}
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground max-w-[140px] truncate">
                      {row.email || "—"}
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground max-w-[120px] truncate">
                      {row.courses || "—"}
                    </td>
                    <td className="px-4 py-2.5">
                      {row.googleRating ? (
                        <span className="text-amber-400">{row.googleRating}★</span>
                      ) : "—"}
                    </td>
                    <td className="px-4 py-2.5">
                      {row.leadPriority ? (
                        <span className={cn(
                          "px-1.5 py-0.5 rounded text-[10px] font-semibold",
                          row.leadPriority === "HIGH" ? "bg-emerald-500/15 text-emerald-400" :
                          row.leadPriority === "MEDIUM" ? "bg-amber-500/15 text-amber-400" :
                          "bg-secondary text-muted-foreground"
                        )}>
                          {row.leadPriority}
                        </span>
                      ) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-border flex justify-end">
            <button
              onClick={handleImport}
              disabled={importing}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-60"
            >
              {importing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              Import {preview.total} leads
            </button>
          </div>
        </div>
      )}

      {/* Success result */}
      {result && (
        <div className="glass rounded-2xl p-8 text-center space-y-4 animate-fade-in">
          <div className="w-14 h-14 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7 text-emerald-400" />
          </div>
          <h2 className="text-xl font-bold">{result.message}</h2>
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-400">{result.imported}</div>
              <div className="text-muted-foreground text-xs mt-0.5">Imported</div>
            </div>
            {result.skipped > 0 && (
              <div className="text-center">
                <div className="text-2xl font-bold text-muted-foreground">{result.skipped}</div>
                <div className="text-muted-foreground text-xs mt-0.5">Already existed</div>
              </div>
            )}
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => { setFile(null); setPreview(null); setResult(null); }}
              className="px-4 py-2 rounded-lg border border-border text-sm hover:border-primary/40 transition-colors"
            >
              Import another file
            </button>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              View leads <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Data separation notice */}
      <div className="flex items-start gap-3 p-4 glass rounded-xl border-blue-500/20 bg-blue-500/5">
        <AlertCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <span className="font-medium text-blue-300">Your data stays yours.</span>
          <span className="text-muted-foreground ml-1">
            Every imported lead is linked to your account only. Other users cannot see your leads. Duplicate companies are automatically skipped.
          </span>
        </div>
      </div>
    </div>
  );
}
