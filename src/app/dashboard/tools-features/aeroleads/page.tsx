'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select } from '@/components/ui/select'
import { Search, Mail, Copy, Download, Loader2, Filter } from 'lucide-react'
import { toast } from 'sonner'

interface EmailResult {
  id: string
  email: string
  firstName: string
  lastName: string
  title: string
  company: string
  confidence: number
  source: string
  linkedinURL?: string
}

export default function AeroleadsPage() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<EmailResult[]>([])
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [filters, setFilters] = useState({
    company: '',
    title: '',
    seniority: 'all', // executive, manager, individual
  })

  async function searchEmails() {
    if (!filters.company || !filters.title) {
      toast.error('Enter company name and job title')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/tools/aeroleads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filters),
      })

      if (!response.ok) throw new Error('Search failed')

      const data = await response.json()
      setResults(data.results || [])
      setSearchHistory([`${filters.company} - ${filters.title}`, ...searchHistory.slice(0, 4)])
      toast.success(`Found ${data.results?.length || 0} emails`)
    } catch (error) {
      toast.error('Search failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  function copyEmail(email: string) {
    navigator.clipboard.writeText(email)
    toast.success('Email copied to clipboard')
  }

  function exportResults() {
    const csvContent =
      'Email,First Name,Last Name,Title,Company,Confidence,LinkedIn\n' +
      results
        .map(
          r =>
            `${r.email},${r.firstName},${r.lastName},${r.title},${r.company},${r.confidence}%,${r.linkedinURL || 'N/A'}`
        )
        .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `aeroleads-results-${Date.now()}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
    toast.success('Results exported to CSV')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">AeroLeads - B2B Email Finder</h1>
        <p className="text-muted-foreground mt-2">Find verified B2B professional emails quickly</p>
      </div>

      {/* Search Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Find Emails
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div>
              <Label>Company Name</Label>
              <Input
                placeholder="e.g., Google, Microsoft, Tesla"
                value={filters.company}
                onChange={e => setFilters({ ...filters, company: e.target.value })}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label>Job Title</Label>
                <Input
                  placeholder="e.g., Marketing Manager"
                  value={filters.title}
                  onChange={e => setFilters({ ...filters, title: e.target.value })}
                />
              </div>

              <div>
                <Label>Seniority Level</Label>
                <select className="w-full px-3 py-2 border rounded-md">
                  <option value="all">All Levels</option>
                  <option value="executive">C-Level / Executive</option>
                  <option value="manager">Manager / Director</option>
                  <option value="individual">Individual Contributor</option>
                </select>
              </div>

              <div className="flex items-end">
                <Button
                  onClick={searchEmails}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {searchHistory.length > 0 && (
            <div className="pt-4 border-t">
              <p className="text-xs font-semibold text-muted-foreground mb-2">Recent Searches</p>
              <div className="flex flex-wrap gap-2">
                {searchHistory.map((search, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      const [company, title] = search.split(' - ')
                      setFilters({ ...filters, company, title })
                    }}
                    className="bg-muted hover:bg-muted/80 px-3 py-1 rounded text-xs transition-colors"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Results ({results.length})
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={exportResults}
              >
                <Download className="h-4 w-4 mr-1" />
                Export CSV
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {results.map(result => (
                <div
                  key={result.id}
                  className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="font-semibold text-sm">
                          {result.firstName} {result.lastName}
                        </p>
                        <Badge variant="outline">{result.title}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{result.company}</p>
                      <p className="text-sm font-mono text-primary mt-2">{result.email}</p>

                      <div className="flex items-center gap-4 mt-3 text-xs">
                        <div className="flex items-center gap-1">
                          <div className="h-2 w-16 bg-muted rounded overflow-hidden">
                            <div
                              className="h-full bg-green-500"
                              style={{ width: `${result.confidence}%` }}
                            />
                          </div>
                          <span className="text-muted-foreground">{result.confidence}%</span>
                        </div>
                        <span className="text-muted-foreground">Source: {result.source}</span>
                      </div>

                      {result.linkedinURL && (
                        <a
                          href={result.linkedinURL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline mt-2 inline-block"
                        >
                          View LinkedIn Profile →
                        </a>
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyEmail(result.email)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {results.length === 0 && !loading && (
        <Card>
          <CardContent className="pt-8 pb-8 text-center">
            <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Enter company and job title to find emails</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
