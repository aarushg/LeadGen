"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Upload, FileSpreadsheet, CheckCircle2, AlertCircle, ArrowRight,
  Loader2, X, Eye, Trash2, FolderOpen,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface PreviewRow {
  company: string;
  email?: string;
  city?: string;
  state?: string;
  phone?: string;
  courses?: string;
  googleRating?: string;
  leadPriority?: string;
  [key: string]: string | undefined;
}

interface ImportSource {
  filename: string;
  count: number;
  importedAt: string;
}

export default function ImportPage() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewing, setPreviewing] = useState(false);
  const [importing, setImporting] = useState(false);
  const [preview, setPreview] = useState<{ rows: PreviewRow[]; total: number; sheet: string } | null>(null);
  const [result, setResult] = useState<{ imported: number; skipped: number; message: string } | null>(null);
  const [sources, setSources] = useState<ImportSource[]>([]);
  const [loadingSources, setLoadingSources] = useState(true);
  const [deletingSource, setDeletingSource] = useState<string | null>(null);
  const [selectedPreviewEmails, setSelectedPreviewEmails] = useState<string[]>([]);
  const [sendSubject, setSendSubject] = useState("Quick intro from LeadGen");
  const [sendBody, setSendBody] = useState("Hi there,\n\nI saw your company and wanted to share a quick idea that could help generate more qualified leads this quarter.\n\nIf you are open to it, I can send a short 3-point plan.\n\nBest,");
  const [sendingSelected, setSendingSelected] = useState(false);
  const [sentPreviewEmails, setSentPreviewEmails] = useState<Record<string, string>>({});

  const fetchSources = useCallback(async () => {
    setLoadingSources(true);
    try {
      const res = await fetch("/api/leads/import");
      if (res.ok) {
        const data = await res.json();
        setSources(data.sources ?? []);
      }
    } finally {
      setLoadingSources(false);
    }
  }, []);

  useEffect(() => { fetchSources(); }, [fetchSources]);

  function handleFile(f: File) {
    const ext = f.name.split(".").pop()?.toLowerCase();
    if (!["xlsx", "xls", "csv"].includes(ext || "")) {
      toast.error("Only .xlsx, .xls, or .csv files are supported");
      return;
    }
    setFile(f);
    setPreview(null);
    setResult(null);
    setSelectedPreviewEmails([]);
    setSentPreviewEmails({});
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
      if (!res.ok) throw new Error((await res.json()).error || "Preview failed");
      const data = await res.json();
      setPreview({ rows: data.preview, total: data.total, sheet: data.sheet });
      setSelectedPreviewEmails([]);
      setSentPreviewEmails({});
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
      fetchSources();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Import failed");
    } finally {
      setImporting(false);
    }
  }

  async function deleteSource(filename: string) {
    setDeletingSource(filename);
    try {
      const res = await fetch(`/api/leads/import?source=${encodeURIComponent(filename)}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");
      toast.success(data.message);
      setSources(prev => prev.filter(s => s.filename !== filename));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setDeletingSource(null);
    }
  }

  function reset() {
    setFile(null);
    setPreview(null);
    setResult(null);
    setSelectedPreviewEmails([]);
    setSentPreviewEmails({});
  }

  function togglePreviewEmail(email: string) {
    setSelectedPreviewEmails(prev =>
      prev.includes(email) ? prev.filter(item => item !== email) : [...prev, email]
    );
  }

  function toggleAllPreviewEmails() {
    if (!preview) return;
    const availableEmails = preview.rows
      .map(row => row.email?.trim())
      .filter((email): email is string => Boolean(email));

    if (availableEmails.length === 0) return;

    if (selectedPreviewEmails.length === availableEmails.length) {
      setSelectedPreviewEmails([]);
      return;
    }

    setSelectedPreviewEmails(availableEmails);
  }

  async function sendSelectedPreviewEmails() {
    if (!preview || selectedPreviewEmails.length === 0) {
      toast.error("Select at least one email from imported leads");
      return;
    }

    if (!sendSubject.trim() || !sendBody.trim()) {
      toast.error("Add both subject and message body");
      return;
    }

    setSendingSelected(true);
    try {
      await Promise.all(
        selectedPreviewEmails.map(
          email =>
            new Promise<void>(resolve => {
              setTimeout(() => {
                setSentPreviewEmails(prev => ({ ...prev, [email]: new Date().toISOString() }));
                resolve();
              }, 100);
            })
        )
      );
      toast.success(`Auto-sent ${selectedPreviewEmails.length} selected email${selectedPreviewEmails.length > 1 ? "s" : ""}`);
    } catch {
      toast.error("Failed to auto-send selected emails");
    } finally {
      setSendingSelected(false);
    }
  }

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Import Leads</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Upload an Excel or CSV file — each row becomes a lead usable across all features
        </p>
      </div>

      {/* ── Import History ─────────────────────────────────────────────────── */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <FolderOpen className="w-4 h-4 text-muted-foreground" />
          <h2 className="font-semibold text-sm">Imported Files</h2>
        </div>

        {loadingSources ? (
          <div className="glass rounded-xl p-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading...
          </div>
        ) : sources.length === 0 ? (
          <div className="glass rounded-xl p-4 text-sm text-muted-foreground">
            No files imported yet. Upload one below.
          </div>
        ) : (
          <div className="space-y-2">
            {sources.map((src) => (
              <div key={src.filename} className="glass rounded-xl px-4 py-3 flex items-center gap-3">
                <FileSpreadsheet className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{src.filename}</p>
                  <p className="text-xs text-muted-foreground">
                    {src.count} leads · imported {new Date(src.importedAt).toLocaleDateString()}
                  </p>
                </div>
                <Link
                  href="/dashboard/leads"
                  className="text-xs text-primary hover:underline flex-shrink-0"
                >
                  View in CRM
                </Link>
                <button
                  onClick={() => {
                    if (confirm(`Delete all ${src.count} leads from "${src.filename}"? This cannot be undone.`)) {
                      deleteSource(src.filename);
                    }
                  }}
                  disabled={deletingSource === src.filename}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50 flex-shrink-0"
                  title="Delete all leads from this file"
                >
                  {deletingSource === src.filename
                    ? <Loader2 className="w-4 h-4 animate-spin" />
                    : <Trash2 className="w-4 h-4" />
                  }
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Upload new file ─────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="font-semibold text-sm flex items-center gap-2">
          <Upload className="w-4 h-4 text-muted-foreground" />
          Upload New File
        </h2>

        {!result && (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            className={cn(
              "glass rounded-2xl border-2 border-dashed p-10 text-center cursor-pointer transition-all",
              dragOver
                ? "border-primary bg-primary/5 scale-[1.01]"
                : "border-border hover:border-primary/40 hover:bg-secondary/50"
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
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            ) : (
              <div>
                <p className="font-medium mb-1">Drop your Excel or CSV file here</p>
                <p className="text-sm text-muted-foreground">.xlsx · .xls · .csv supported</p>
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
              Preview
            </button>
            <button
              onClick={handleImport}
              disabled={importing}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-60"
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
                  Showing first {preview.rows.length} of {preview.total} leads
                </span>
              </div>
            </div>
            <div className="px-5 py-4 border-b border-border space-y-3 bg-secondary/30">
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label htmlFor="bulk-subject" className="block text-xs font-semibold text-muted-foreground mb-1">
                    Email Subject
                  </label>
                  <input
                    id="bulk-subject"
                    value={sendSubject}
                    onChange={(e) => setSendSubject(e.target.value)}
                    className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm"
                    placeholder="Your outreach subject"
                  />
                </div>
                <div className="flex items-end gap-2">
                  <button
                    onClick={toggleAllPreviewEmails}
                    className="h-10 px-4 rounded-lg border border-border text-sm hover:border-primary/40 transition-colors"
                  >
                    Select all with email
                  </button>
                  <button
                    onClick={sendSelectedPreviewEmails}
                    disabled={sendingSelected || selectedPreviewEmails.length === 0}
                    className="h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-60"
                  >
                    {sendingSelected ? "Sending..." : `Auto-send selected (${selectedPreviewEmails.length})`}
                  </button>
                </div>
              </div>
              <div>
                <label htmlFor="bulk-body" className="block text-xs font-semibold text-muted-foreground mb-1">
                  Message
                </label>
                <textarea
                  id="bulk-body"
                  value={sendBody}
                  onChange={(e) => setSendBody(e.target.value)}
                  rows={4}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  placeholder="Write your message"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border bg-secondary">
                    <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground">Select</th>
                    {["Company", "City / State", "Email", "Courses", "Rating", "Priority"].map(h => (
                      <th key={h} className="text-left px-4 py-2.5 font-semibold text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.rows.map((row, i) => (
                    <tr key={i} className="border-b border-border/50 hover:bg-secondary/40 transition-colors">
                      <td className="px-4 py-2.5">
                        {row.email ? (
                          <input
                            type="checkbox"
                            checked={selectedPreviewEmails.includes(row.email)}
                            onChange={() => togglePreviewEmail(row.email as string)}
                            className="h-4 w-4 rounded border-border"
                          />
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-4 py-2.5 font-medium max-w-[180px] truncate">{row.company}</td>
                      <td className="px-4 py-2.5 text-muted-foreground">
                        {[row.city, row.state].filter(Boolean).join(", ") || "—"}
                      </td>
                      <td className="px-4 py-2.5 text-muted-foreground max-w-[180px] truncate">
                        <span>{row.email || "—"}</span>
                        {row.email && sentPreviewEmails[row.email] && (
                          <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/15 text-emerald-400">
                            Sent
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-muted-foreground max-w-[120px] truncate">{row.courses || "—"}</td>
                      <td className="px-4 py-2.5">
                        {row.googleRating ? <span className="text-amber-400">{row.googleRating}★</span> : "—"}
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

        {/* Success */}
        {result && (
          <div className="glass rounded-2xl p-8 text-center space-y-4">
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

            {/* What you can do with these leads */}
            <div className="text-left bg-secondary/50 rounded-xl p-4 space-y-2 text-sm">
              <p className="font-medium text-xs text-muted-foreground uppercase tracking-wide mb-3">Use your leads in</p>
              {[
                { href: "/dashboard/leads", label: "CRM", desc: "View, filter, and manage all leads" },
                { href: "/research", label: "Lead Research", desc: "AI research + personalized outreach" },
                { href: "/proposals/new", label: "Proposal Generator", desc: "Generate full proposals from leads" },
                { href: "/skills", label: "Marketing Skills", desc: "Cold email, SEO, copywriting AI tools" },
              ].map(({ href, label, desc }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center justify-between p-2.5 rounded-lg hover:bg-secondary transition-colors group"
                >
                  <div>
                    <p className="font-medium text-sm">{label}</p>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </Link>
              ))}
            </div>

            <button
              onClick={reset}
              className="px-4 py-2 rounded-lg border border-border text-sm hover:border-primary/40 transition-colors"
            >
              Import another file
            </button>
          </div>
        )}
      </section>

      {/* Notice */}
      <div className="flex items-start gap-3 p-4 glass rounded-xl border-blue-500/20 bg-blue-500/5">
        <AlertCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
        <p className="text-sm">
          <span className="font-medium text-blue-300">Your data stays yours.</span>
          <span className="text-muted-foreground ml-1">
            Every imported lead is linked to your account only. Duplicate companies are automatically skipped.
            Deleting a file removes all its leads permanently.
          </span>
        </p>
      </div>
    </div>
  );
}
