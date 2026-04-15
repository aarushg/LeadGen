"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Save, User, Key } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({ full_name: "", company: "", email: "" });

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (data) {
        setProfile({
          full_name: data.full_name || "",
          company: data.company || "",
          email: data.email || user.email || "",
        });
      }
      setLoading(false);
    }
    load();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from("profiles").update({
      full_name: profile.full_name,
      company: profile.company,
    }).eq("id", user.id);
    if (error) {
      toast.error("Failed to save");
    } else {
      toast.success("Profile saved");
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Manage your account and API keys</p>
      </div>

      {/* Profile */}
      <form onSubmit={handleSave} className="glass rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <User className="w-4 h-4 text-muted-foreground" />
          <h2 className="font-semibold">Profile</h2>
        </div>

        <div>
          <label className="text-sm font-medium mb-1.5 block">Full Name</label>
          <input
            value={profile.full_name}
            onChange={(e) => setProfile((p) => ({ ...p, full_name: e.target.value }))}
            className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border focus:border-primary/60 focus:outline-none text-sm"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1.5 block">Company</label>
          <input
            value={profile.company}
            onChange={(e) => setProfile((p) => ({ ...p, company: e.target.value }))}
            placeholder="Your agency name"
            className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border focus:border-primary/60 focus:outline-none text-sm"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1.5 block">Email</label>
          <input
            value={profile.email}
            disabled
            className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm text-muted-foreground cursor-not-allowed"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-60"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save changes
        </button>
      </form>

      {/* API Keys info */}
      <div className="glass rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Key className="w-4 h-4 text-muted-foreground" />
          <h2 className="font-semibold">API Keys</h2>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          API keys are configured via environment variables in your deployment. You need:
        </p>
        <div className="space-y-2">
          {[
            { key: "ANTHROPIC_API_KEY", desc: "Claude AI for research synthesis and message generation", link: "console.anthropic.com" },
            { key: "TAVILY_API_KEY", desc: "Web search for lead research", link: "tavily.com" },
            { key: "NEXT_PUBLIC_SUPABASE_URL", desc: "Supabase project URL", link: "supabase.com" },
            { key: "NEXT_PUBLIC_SUPABASE_ANON_KEY", desc: "Supabase public key", link: "supabase.com" },
          ].map((k) => (
            <div key={k.key} className="flex items-start gap-3 p-3 rounded-lg bg-secondary border border-border">
              <code className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded flex-shrink-0">
                {k.key}
              </code>
              <span className="text-xs text-muted-foreground">{k.desc}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          See <code className="text-primary">.env.example</code> in the project root for the full list.
        </p>
      </div>
    </div>
  );
}
