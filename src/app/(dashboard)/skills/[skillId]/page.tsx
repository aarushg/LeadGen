"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Send, Loader2, Bot, User, RotateCcw,
  Mail, PenTool, Search, TrendingUp, Layers, Share2, Lightbulb, BarChart3,
} from "lucide-react";
import { getSkill } from "@/lib/skills";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const ICON_MAP: Record<string, React.ElementType> = {
  Mail, PenTool, Search, TrendingUp, Layers, Share2, Lightbulb, BarChart3,
};

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function SkillChatPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const skillId = (params?.skillId ?? "") as string;
  const skill = getSkill(skillId);
  const prefill = searchParams?.get("prefill") ?? "";

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState<"claude" | "ollama">("claude");
  const [ollamaModels, setOllamaModels] = useState<string[]>([]);
  const [ollamaModel, setOllamaModel] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetch("/api/ollama/status")
      .then(r => r.json())
      .then(data => {
        if (data.running && data.models?.length) {
          setOllamaModels(data.models);
          setOllamaModel(data.models[0]);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!skill) {
    router.push("/skills");
    return null;
  }

  const Icon = ICON_MAP[skill.icon] ?? Lightbulb;

  async function sendMessage(content: string) {
    if (!content.trim() || loading) return;

    const userMsg: Message = { role: "user", content: content.trim() };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/skills/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skillId: skill!.id,
          messages: updated,
          provider,
          ollamaModel: provider === "ollama" ? ollamaModel : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to get response");

      setMessages((prev) => [...prev, { role: "assistant", content: data.message }]);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-3.5rem)] md:max-h-screen">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card/50 backdrop-blur-xl flex-shrink-0">
        <Link href="/skills" className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-semibold text-sm truncate">{skill.label}</h1>
          <p className="text-xs text-muted-foreground truncate">{skill.category}</p>
        </div>
        {/* AI provider toggle */}
        <div className="flex items-center gap-1 bg-secondary rounded-lg p-0.5 text-xs">
          <button
            onClick={() => setProvider("claude")}
            className={cn("px-2.5 py-1 rounded-md font-medium transition-colors",
              provider === "claude" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            )}
          >
            Claude
          </button>
          <button
            onClick={() => { if (ollamaModels.length) setProvider("ollama"); }}
            disabled={!ollamaModels.length}
            title={ollamaModels.length ? "Use Ollama" : "Start Ollama to enable"}
            className={cn("px-2.5 py-1 rounded-md font-medium transition-colors disabled:opacity-40",
              provider === "ollama" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            )}
          >
            <Bot className="w-3 h-3 inline mr-1" />
            Local
          </button>
        </div>
        {provider === "ollama" && ollamaModels.length > 1 && (
          <select
            value={ollamaModel}
            onChange={e => setOllamaModel(e.target.value)}
            className="text-xs bg-secondary rounded-lg px-2 py-1 border-none outline-none"
          >
            {ollamaModels.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        )}
        {messages.length > 0 && (
          <button
            onClick={() => setMessages([])}
            className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
            title="Clear chat"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          /* Welcome state */
          <div className="flex flex-col items-center justify-center h-full p-6 text-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Icon className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">{skill.label}</h2>
              <p className="text-sm text-muted-foreground max-w-sm">{skill.description}</p>
            </div>

            {/* Lead context prefill */}
            {prefill && (
              <div className="w-full max-w-lg bg-primary/5 border border-primary/20 rounded-xl p-4 text-left space-y-2">
                <p className="text-xs font-medium text-primary uppercase tracking-wide">Lead context loaded</p>
                <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-sans">{prefill}</pre>
                <button
                  onClick={() => sendMessage(`Here is my lead:\n\n${prefill}\n\nPlease help me with this lead using your expertise.`)}
                  className="w-full py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Start with this lead
                </button>
              </div>
            )}

            {/* Starter prompts */}
            <div className="w-full max-w-lg space-y-2">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Or try asking</p>
              {skill.starterPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  className="w-full text-left px-4 py-3 glass rounded-xl text-sm hover:border-primary/40 transition-all"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-4 max-w-3xl mx-auto">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={cn("flex gap-3", msg.role === "user" ? "justify-end" : "justify-start")}
              >
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5 text-primary" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-3 text-sm",
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "glass rounded-bl-sm"
                  )}
                >
                  <pre className="whitespace-pre-wrap font-sans leading-relaxed">{msg.content}</pre>
                </div>
                {msg.role === "user" && (
                  <div className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 justify-start">
                <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5 text-primary" />
                </div>
                <div className="glass rounded-2xl rounded-bl-sm px-4 py-3">
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex-shrink-0 px-4 py-3 border-t border-border bg-card/50 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Ask ${skill.label}...`}
            rows={1}
            className="flex-1 resize-none px-4 py-3 rounded-xl bg-secondary border border-border focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-colors max-h-32 overflow-y-auto"
            style={{ minHeight: "2.75rem" }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-40 flex-shrink-0"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
        <p className="text-center text-[10px] text-muted-foreground mt-2">
          Press Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
