"use client";

import Link from "next/link";
import {
  Mail, PenTool, Search, TrendingUp, Layers, Share2, Lightbulb, BarChart3,
  ArrowRight,
} from "lucide-react";
import { SKILLS, SKILL_CATEGORIES } from "@/lib/skills";
import { useState } from "react";

const ICON_MAP: Record<string, React.ElementType> = {
  Mail, PenTool, Search, TrendingUp, Layers, Share2, Lightbulb, BarChart3,
};

const CATEGORY_COLORS: Record<string, string> = {
  "Sales & Outreach": "text-blue-400 bg-blue-500/10 border-blue-500/20",
  "Content & Copy": "text-purple-400 bg-purple-500/10 border-purple-500/20",
  "SEO & Discovery": "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  "Conversion Optimization": "text-amber-400 bg-amber-500/10 border-amber-500/20",
  "Strategy & Monetization": "text-rose-400 bg-rose-500/10 border-rose-500/20",
};

export default function SkillsPage() {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = ["All", ...SKILL_CATEGORIES];
  const filtered = activeCategory === "All"
    ? SKILLS
    : SKILLS.filter((s) => s.category === activeCategory);

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Marketing Skills</h1>
        <p className="text-muted-foreground text-sm mt-1">
          AI-powered marketing tools — each one is an expert built with a deep system prompt.
          Pick a skill and start chatting.
        </p>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
              activeCategory === cat
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Skills grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((skill) => {
          const Icon = ICON_MAP[skill.icon] ?? Lightbulb;
          const colorClass = CATEGORY_COLORS[skill.category] ?? "text-primary bg-primary/10 border-primary/20";

          return (
            <Link
              key={skill.id}
              href={`/skills/${skill.id}`}
              className="glass rounded-2xl p-5 hover:border-primary/40 transition-all group flex flex-col gap-3"
            >
              <div className="flex items-start justify-between">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${colorClass}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all mt-1" />
              </div>

              <div>
                <h3 className="font-semibold text-sm">{skill.label}</h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{skill.description}</p>
              </div>

              <div className={`self-start px-2 py-0.5 rounded-full text-[10px] font-medium border ${colorClass}`}>
                {skill.category}
              </div>

              {/* Starter prompts preview */}
              <div className="space-y-1.5 mt-auto">
                {skill.starterPrompts.slice(0, 2).map((prompt) => (
                  <div
                    key={prompt}
                    className="text-[10px] text-muted-foreground bg-secondary/60 rounded-lg px-2.5 py-1.5 line-clamp-1"
                  >
                    "{prompt}"
                  </div>
                ))}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
