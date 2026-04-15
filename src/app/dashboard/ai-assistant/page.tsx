'use client'

import { useEffect, useRef, useState } from 'react'
import { Send, Bot, User, Loader2, AlertCircle, RefreshCw, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const SUGGESTED_PROMPTS = [
  'How do I qualify a B2B lead effectively?',
  'Write a cold email framework for SaaS companies',
  'What questions should I ask on a discovery call?',
  'How do I handle a prospect who went silent?',
  'Give me 5 LinkedIn outreach templates for agency owners',
  'What makes a proposal win vs lose?',
  'How do I shorten my sales cycle?',
  'Explain BANT, MEDDIC, and SPIN selling in simple terms',
]

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [models, setModels] = useState<string[]>([])
  const [selectedModel, setSelectedModel] = useState('')
  const [ollamaRunning, setOllamaRunning] = useState<boolean | null>(null)
  const [modelMenuOpen, setModelMenuOpen] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    fetch('/api/ollama/status')
      .then(r => r.json())
      .then(data => {
        setOllamaRunning(data.running)
        setModels(data.models ?? [])
        if (data.models?.length) setSelectedModel(data.models[0])
      })
      .catch(() => setOllamaRunning(false))
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage(text: string) {
    if (!text.trim() || streaming) return
    const userMsg: Message = { role: 'user', content: text.trim() }
    const history = [...messages, userMsg]
    setMessages(history)
    setInput('')
    setStreaming(true)

    const assistantMsg: Message = { role: 'assistant', content: '' }
    setMessages(prev => [...prev, assistantMsg])

    try {
      const res = await fetch('/api/ollama/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: selectedModel,
          messages: [
            {
              role: 'system',
              content:
                'You are an expert sales and lead generation assistant for a marketing agency. Help users with lead qualification, outreach strategy, proposal writing, pipeline management, and sales tactics. Be concise, practical, and specific.',
            },
            ...history,
          ],
        }),
      })

      if (!res.ok || !res.body) throw new Error('Stream failed')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        accumulated += decoder.decode(value, { stream: true })
        setMessages(prev => {
          const updated = [...prev]
          updated[updated.length - 1] = { role: 'assistant', content: accumulated }
          return updated
        })
      }
    } catch {
      setMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = {
          role: 'assistant',
          content: 'Error: Could not reach Ollama. Make sure it is running on port 11434.',
        }
        return updated
      })
    } finally {
      setStreaming(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  function checkOllama() {
    setOllamaRunning(null)
    fetch('/api/ollama/status')
      .then(r => r.json())
      .then(data => {
        setOllamaRunning(data.running)
        setModels(data.models ?? [])
        if (data.models?.length && !selectedModel) setSelectedModel(data.models[0])
      })
      .catch(() => setOllamaRunning(false))
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold">AI Assistant</h1>
          <p className="text-muted-foreground text-sm">Powered by Ollama — runs locally, no data leaves your machine</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Ollama status */}
          {ollamaRunning === null && (
            <Badge variant="secondary" className="gap-1">
              <Loader2 className="h-3 w-3 animate-spin" /> Checking...
            </Badge>
          )}
          {ollamaRunning === false && (
            <div className="flex items-center gap-2">
              <Badge variant="destructive" className="gap-1">
                <AlertCircle className="h-3 w-3" /> Ollama offline
              </Badge>
              <Button size="sm" variant="outline" onClick={checkOllama} className="gap-1">
                <RefreshCw className="h-3 w-3" /> Retry
              </Button>
            </div>
          )}
          {ollamaRunning === true && (
            <Badge variant="secondary" className="gap-1 border-green-500 text-green-700 bg-green-50">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 inline-block" /> Online
            </Badge>
          )}

          {/* Model selector */}
          {models.length > 0 && (
            <div className="relative">
              <Button
                size="sm"
                variant="outline"
                className="gap-1 min-w-[120px] justify-between"
                onClick={() => setModelMenuOpen(o => !o)}
              >
                <span className="truncate max-w-[140px]">{selectedModel || 'Select model'}</span>
                <ChevronDown className="h-3 w-3 shrink-0" />
              </Button>
              {modelMenuOpen && (
                <div className="absolute right-0 top-full mt-1 z-50 w-56 rounded-md border bg-background shadow-md">
                  {models.map(m => (
                    <button
                      key={m}
                      className={cn(
                        'w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors truncate',
                        m === selectedModel && 'bg-accent font-medium'
                      )}
                      onClick={() => { setSelectedModel(m); setModelMenuOpen(false) }}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-4 flex-1 min-h-0">
        {/* Suggested prompts */}
        <div className="hidden lg:flex flex-col gap-2 w-56 shrink-0">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-1">Suggested</p>
          {SUGGESTED_PROMPTS.map(p => (
            <button
              key={p}
              disabled={streaming || !ollamaRunning}
              onClick={() => sendMessage(p)}
              className="text-left text-xs rounded-lg border px-3 py-2 hover:bg-accent hover:border-accent-foreground/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed leading-snug"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Chat area */}
        <div className="flex flex-col flex-1 min-h-0">
          <Card className="flex flex-col flex-1 min-h-0">
            {/* Messages */}
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground gap-3">
                  <Bot className="h-12 w-12 opacity-20" />
                  <div>
                    <p className="font-medium">Your local AI sales assistant</p>
                    <p className="text-sm mt-1">
                      {ollamaRunning === false
                        ? 'Start Ollama on your machine to begin'
                        : 'Ask anything about leads, outreach, or sales strategy'}
                    </p>
                  </div>
                </div>
              )}
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={cn('flex gap-3', msg.role === 'user' ? 'justify-end' : 'justify-start')}
                >
                  {msg.role === 'assistant' && (
                    <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                  <div
                    className={cn(
                      'rounded-2xl px-4 py-2.5 text-sm max-w-[75%] whitespace-pre-wrap leading-relaxed',
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-tr-sm'
                        : 'bg-muted rounded-tl-sm'
                    )}
                  >
                    {msg.content}
                    {streaming && i === messages.length - 1 && msg.role === 'assistant' && !msg.content && (
                      <span className="inline-flex gap-1 items-center">
                        <span className="h-1.5 w-1.5 rounded-full bg-current animate-bounce [animation-delay:0ms]" />
                        <span className="h-1.5 w-1.5 rounded-full bg-current animate-bounce [animation-delay:150ms]" />
                        <span className="h-1.5 w-1.5 rounded-full bg-current animate-bounce [animation-delay:300ms]" />
                      </span>
                    )}
                  </div>
                  {msg.role === 'user' && (
                    <div className="h-7 w-7 rounded-full bg-secondary flex items-center justify-center shrink-0 mt-0.5">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))}
              <div ref={bottomRef} />
            </CardContent>

            {/* Input */}
            <div className="border-t p-3 shrink-0">
              {ollamaRunning === false && (
                <p className="text-xs text-destructive mb-2 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Ollama is not running. Run <code className="bg-muted px-1 rounded">ollama serve</code> in your terminal.
                </p>
              )}
              <div className="flex gap-2 items-end">
                <textarea
                  ref={textareaRef}
                  rows={1}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={streaming || ollamaRunning === false}
                  placeholder={ollamaRunning === false ? 'Start Ollama to chat...' : 'Ask about leads, outreach, strategy… (Enter to send, Shift+Enter for newline)'}
                  className="flex-1 resize-none rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring min-h-[2.5rem] max-h-40 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ height: 'auto' }}
                  onInput={e => {
                    const el = e.currentTarget
                    el.style.height = 'auto'
                    el.style.height = `${el.scrollHeight}px`
                  }}
                />
                <Button
                  size="icon"
                  disabled={!input.trim() || streaming || ollamaRunning === false}
                  onClick={() => sendMessage(input)}
                >
                  {streaming ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
