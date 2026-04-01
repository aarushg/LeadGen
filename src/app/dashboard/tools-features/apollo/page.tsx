'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Search, Copy, Download, Loader2, Mail, Star } from 'lucide-react'
import { toast } from 'sonner'

interface ApolloLead {
  id: string
  firstName: string
  lastName: string
  email: string
  company: string
  title: string
  industry: string
  seniority: string
  linkedinURL?: string
  phoneNumber?: string
  verified: boolean
  quality: 'verified' | 'likely' | 'potential'
}

export default function ApolloPage() {
  const [loading, setLoading] = useState(false)
  const [leads, setLeads] = useState<ApolloLead[]>([])
  const [filters, setFilters] = useState({
    company: '',
    searchTerm: '',
    industry: 'all',
    seniority: 'all',
  })
  const [savedLeads, setSavedLeads] = useState<string[]>([])

  async function searchLeads() {
    if (!filters.company && !filters.searchTerm) {
      toast.error('Enter company name or search term')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/tools/apollo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filters),
      })

      if (!response.ok) throw new Error('Search failed')

      const data = await response.json()
      setLeads(data.leads || [])
      toast.success(`Found ${data.leads?.length || 0} leads`)
    } catch (error) {
      toast.error('Search failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  function toggleSaveLead(id: string) {
    if (savedLeads.includes(id)) {
      setSavedLeads(savedLeads.filter(lid => lid !== id))
      toast.success('Lead removed from saved')
    } else {
      setSavedLeads([...savedLeads, id])
      toast.success('Lead saved')
    }
  }

  function copyEmail(email: string) {
    navigator.clipboard.writeText(email)
    toast.success('Email copied')
  }

  function exportLeads() {
    const toExport = leads.filter(l => savedLeads.includes(l.id))
    if (toExport.length === 0) {
      toast.error('No saved leads to export')
      return
    }

    const csvContent =
      'First Name,Last Name,Email,Title,Company,Industry,LinkedIn\n' +
      toExport
        .map(
          l =>
            `${l.firstName},${l.lastName},${l.email},${l.title},${l.company},${l.industry},${l.linkedinURL || 'N/A'}`
        )
        .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `apollo-leads-${Date.now()}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
    toast.success('Leads exported')
  }

  const savedCount = leads.filter(l => savedLeads.includes(l.id)).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Apollo.io - B2B Lead Database</h1>
        <p className="text-muted-foreground mt-2">Find and verify B2B professional contact information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Find Leads
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Company Name</Label>
              <Input
                placeholder="e.g., Google, Slack, HubSpot"
                value={filters.company}
                onChange={e => setFilters({ ...filters, company: e.target.value })}
              />
            </div>

            <div>
              <Label>Search Term</Label>
              <Input
                placeholder="e.g., Marketing Manager"
                value={filters.searchTerm}
                onChange={e => setFilters({ ...filters, searchTerm: e.target.value })}
              />
            </div>

            <div>
              <Label>Industry</Label>
              <select
                className="w-full px-3 py-2 border rounded-md"
                value={filters.industry}
                onChange={e => setFilters({ ...filters, industry: e.target.value })}
              >
                <option value="all">All Industries</option>
                <option value="technology">Technology</option>
                <option value="finance">Finance</option>
                <option value="healthcare">Healthcare</option>
                <option value="saas">SaaS</option>
              </select>
            </div>

            <div>
              <Label>Seniority</Label>
              <select
                className="w-full px-3 py-2 border rounded-md"
                value={filters.seniority}
                onChange={e => setFilters({ ...filters, seniority: e.target.value })}
              >
                <option value="all">All Levels</option>
                <option value="executive">Executive</option>
                <option value="manager">Manager</option>
                <option value="individual">Individual</option>
              </select>
            </div>
          </div>

          <Button onClick={searchLeads} disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Search Leads
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {leads.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                {leads.length} Leads Found
              </CardTitle>
              <div className="flex gap-2">
                <Badge variant="outline">{savedCount} saved</Badge>
                {savedCount > 0 && (
                  <Button size="sm" onClick={exportLeads} variant="outline">
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {leads.map(lead => (
                <div key={lead.id} className="border rounded-lg p-3 hover:bg-muted/50">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-sm">
                          {lead.firstName} {lead.lastName}
                        </p>
                        <Badge
                          variant={
                            lead.quality === 'verified' ? 'default' : 'outline'
                          }
                          className="text-xs"
                        >
                          {lead.quality}
                        </Badge>
                      </div>

                      <p className="text-xs text-muted-foreground">{lead.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {lead.company} • {lead.industry}
                      </p>

                      <div className="flex items-center gap-2 mt-2">
                        <p className="text-sm font-mono">{lead.email}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyEmail(lead.email)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>

                      {lead.phoneNumber && (
                        <p className="text-xs font-mono text-muted-foreground mt-1">
                          {lead.phoneNumber}
                        </p>
                      )}

                      {lead.linkedinURL && (
                        <a
                          href={lead.linkedinURL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline inline-block mt-1"
                        >
                          LinkedIn Profile →
                        </a>
                      )}
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSaveLead(lead.id)}
                      className={
                        savedLeads.includes(lead.id)
                          ? 'text-yellow-500'
                          : 'text-muted-foreground'
                      }
                    >
                      <Star className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
