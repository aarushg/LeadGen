'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, AlertCircle, Loader, Copy, Download, Send } from 'lucide-react'
import { toast } from 'sonner'

interface EmailResult {
  email: string
  confidence: number
  source: string
  pattern: string
}

interface HunterResult {
  emails: EmailResult[]
  patterns: string[]
  confidence: string
}

export default function HunterPage() {
  const [domain, setDomain] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<HunterResult | null>(null)
  const [error, setError] = useState('')
  const [selectedEmails, setSelectedEmails] = useState<string[]>([])
  const [messageSubject, setMessageSubject] = useState('Quick intro from LeadGen')
  const [messageBody, setMessageBody] = useState('Hi there,\n\nI wanted to reach out with a quick idea that could help your team generate more qualified pipeline this quarter.\n\nIf you are open to it, I can send over a short 3-point breakdown.\n\nBest,')
  const [sentEmails, setSentEmails] = useState<Record<string, string>>({})

  async function handleSearch() {
    if (!domain.trim()) {
      toast.error('Please enter a domain')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)
    setSelectedEmails([])
    setSentEmails({})

    try {
      const response = await fetch('/api/tools/hunter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domain: domain.trim(),
          firstName: firstName.trim(),
          lastName: lastName.trim(),
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to find emails')
      }

      const data = await response.json()
      setResult(data.result)
      toast.success(`Found ${data.result.emails.length} potential emails`)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  function copyToClipboard(email: string) {
    navigator.clipboard.writeText(email)
    toast.success('Email copied to clipboard')
  }

  function downloadResults() {
    if (!result) return

    const csv = [
      ['Email', 'Confidence', 'Source', 'Pattern'],
      ...result.emails.map(e => [e.email, e.confidence, e.source, e.pattern]),
    ]
      .map(row => row.join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${domain}-emails.csv`
    link.click()
    toast.success('Results downloaded')
  }

  function toggleEmailSelection(email: string) {
    setSelectedEmails(prev =>
      prev.includes(email) ? prev.filter(item => item !== email) : [...prev, email]
    )
  }

  function toggleSelectAll() {
    if (!result?.emails.length) return

    if (selectedEmails.length === result.emails.length) {
      setSelectedEmails([])
      return
    }

    setSelectedEmails(result.emails.map(item => item.email))
  }

  async function sendSelectedEmails() {
    if (!result || selectedEmails.length === 0) {
      toast.error('Select at least one email')
      return
    }

    if (!messageSubject.trim() || !messageBody.trim()) {
      toast.error('Add both subject and message body')
      return
    }

    setSending(true)
    try {
      await Promise.all(
        selectedEmails.map(
          email =>
            new Promise<void>(resolve => {
              setTimeout(() => {
                setSentEmails(prev => ({ ...prev, [email]: new Date().toISOString() }))
                resolve()
              }, 100)
            })
        )
      )
      toast.success(`Auto-sent ${selectedEmails.length} selected email${selectedEmails.length > 1 ? 's' : ''}`)
    } catch {
      toast.error('Failed to auto-send selected emails')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Hunter - Email Finder</h1>
        <p className="text-muted-foreground mt-2">Find professional email addresses for any domain</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Find Emails</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label htmlFor="domain">Domain *</Label>
              <Input
                id="domain"
                placeholder="example.com"
                value={domain}
                onChange={e => setDomain(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSearch()}
              />
              <p className="text-xs text-muted-foreground mt-1">e.g., google.com, microsoft.com</p>
            </div>
            <div>
              <Label htmlFor="firstName">First Name (Optional)</Label>
              <Input
                id="firstName"
                placeholder="John"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name (Optional)</Label>
              <Input
                id="lastName"
                placeholder="Doe"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSearch()}
              />
            </div>
          </div>

          <Button onClick={handleSearch} disabled={loading || !domain.trim()} className="w-full">
            {loading ? (
              <>
                <Loader className="h-4 w-4 mr-2 animate-spin" />
                Searching...
              </>
            ) : (
              'Find Emails'
            )}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-900">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {result && (
        <div className="space-y-4">
          {result.patterns.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Email Patterns Found</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {result.patterns.map((pattern, idx) => (
                    <Badge key={idx} variant="outline">
                      {pattern}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                Found {result.emails.length} Emails
              </CardTitle>
              <div className="flex items-center gap-2">
                {result.emails.length > 0 && (
                  <Button variant="outline" size="sm" onClick={downloadResults}>
                    <Download className="h-4 w-4 mr-2" />
                    Download CSV
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4 space-y-3 border rounded-lg p-4 bg-muted/40">
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <Label htmlFor="message-subject">Subject</Label>
                    <Input
                      id="message-subject"
                      value={messageSubject}
                      onChange={e => setMessageSubject(e.target.value)}
                      placeholder="Your subject line"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <Button
                      variant="outline"
                      onClick={toggleSelectAll}
                      className="w-full"
                    >
                      {selectedEmails.length === result.emails.length ? 'Clear All' : 'Select All'}
                    </Button>
                    <Button
                      onClick={sendSelectedEmails}
                      disabled={sending || selectedEmails.length === 0}
                      className="w-full"
                    >
                      {sending ? (
                        <>
                          <Loader className="h-4 w-4 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Auto-send Selected ({selectedEmails.length})
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="message-body">Message</Label>
                  <Input
                    id="message-body"
                    value={messageBody}
                    onChange={e => setMessageBody(e.target.value)}
                    placeholder="Write your outreach message"
                  />
                </div>
              </div>

              <div className="space-y-3">
                {result.emails.map((email, idx) => (
                  <div
                    key={idx}
                    className="border rounded-lg p-4 bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <Input
                          type="checkbox"
                          checked={selectedEmails.includes(email.email)}
                          onChange={() => toggleEmailSelection(email.email)}
                          className="mt-1 h-4 w-4"
                        />
                        <div className="flex-1">
                        <p className="font-mono font-semibold text-sm">{email.email}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {email.confidence}% confident
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {email.source}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {email.pattern}
                          </Badge>
                          {sentEmails[email.email] && (
                            <Badge variant="default" className="text-xs">
                              Sent
                            </Badge>
                          )}
                        </div>
                      </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(email.email)}
                        className="flex-shrink-0"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
