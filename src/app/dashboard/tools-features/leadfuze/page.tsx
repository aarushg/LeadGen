'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AlertCircle, Loader, Download, Download2, Copy } from 'lucide-react'
import { toast } from 'sonner'

interface Lead {
  id: string
  company: string
  companySize: string
  industry: string
  contactName: string
  title: string
  email: string
  phone: string
  linkedinUrl: string
  location: string
  buyingIntent: 'high' | 'medium' | 'low'
  engagementScore: number
  dataQuality: 'verified' | 'likely' | 'potential'
}

interface LeadFuzeResult {
  leads: Lead[]
  totalFound: number
  filters: Record<string, string>
  sourceQuality: string
}

const companySizes = [
  '1-10',
  '11-50',
  '51-200',
  '201-500',
  '501-1000',
  '1000-5000',
  '5000+',
]

const industries = [
  'Technology',
  'Financial Services',
  'Healthcare',
  'Retail',
  'Manufacturing',
  'Real Estate',
  'Education',
  'Hospitality',
  'Legal',
  'Marketing/Advertising',
]

export default function LeadFuzePage() {
  const [targetRole, setTargetRole] = useState('')
  const [industry, setIndustry] = useState('')
  const [companySize, setCompanySize] = useState('')
  const [location, setLocation] = useState('')
  const [maxResults, setMaxResults] = useState('10')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<LeadFuzeResult | null>(null)
  const [error, setError] = useState('')

  async function handleSourceLeads() {
    if (!targetRole.trim() || !industry) {
      toast.error('Please select target role and industry')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/tools/leadfuze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetRole: targetRole.trim(),
          industry,
          companySize,
          location: location.trim(),
          maxResults: parseInt(maxResults),
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to source leads')
      }

      const data = await response.json()
      setResult(data.result)
      toast.success(`Found ${data.result.leads.length} leads`)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  function downloadAsCSV() {
    if (!result) return

    const headers = ['Company', 'Contact Name', 'Title', 'Email', 'Phone', 'Location', 'Buying Intent', 'Score']
    const rows = result.leads.map(lead => [
      lead.company,
      lead.contactName,
      lead.title,
      lead.email,
      lead.phone,
      lead.location,
      lead.buyingIntent,
      lead.engagementScore,
    ])

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'leadfuze-results.csv'
    link.click()
    toast.success('Leads downloaded as CSV')
  }

  function copyEmails() {
    if (!result) return
    const emails = result.leads.map(l => l.email).join('; ')
    navigator.clipboard.writeText(emails)
    toast.success(`Copied ${result.leads.length} emails`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">LeadFuze - AI Lead Sourcing</h1>
        <p className="text-muted-foreground mt-2">AI-powered lead generation and prospect sourcing</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Source Leads</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="role">Target Job Role *</Label>
              <Input
                id="role"
                placeholder="e.g., Sales Director, Marketing Manager"
                value={targetRole}
                onChange={e => setTargetRole(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="industry">Industry *</Label>
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger id="industry">
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map(ind => (
                    <SelectItem key={ind} value={ind}>
                      {ind}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="size">Company Size</Label>
              <Select value={companySize} onValueChange={setCompanySize}>
                <SelectTrigger id="size">
                  <SelectValue placeholder="Any size" />
                </SelectTrigger>
                <SelectContent>
                  {companySizes.map(size => (
                    <SelectItem key={size} value={size}>
                      {size} employees
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="e.g., United States, London"
                value={location}
                onChange={e => setLocation(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="results">Number of Leads</Label>
              <Input
                id="results"
                type="number"
                min="5"
                max="100"
                value={maxResults}
                onChange={e => setMaxResults(e.target.value)}
              />
            </div>
          </div>

          <Button onClick={handleSourceLeads} disabled={loading || !targetRole || !industry} className="w-full">
            {loading ? (
              <>
                <Loader className="h-4 w-4 mr-2 animate-spin" />
                Sourcing Leads...
              </>
            ) : (
              'Source Leads'
            )}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {result && (
        <div className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Found {result.leads.length} Leads</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={copyEmails}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Emails
                </Button>
                <Button variant="outline" size="sm" onClick={downloadAsCSV}>
                  <Download2 className="h-4 w-4 mr-2" />
                  CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-2 font-semibold">Company</th>
                      <th className="text-left py-2 px-2 font-semibold">Contact</th>
                      <th className="text-left py-2 px-2 font-semibold">Title</th>
                      <th className="text-left py-2 px-2 font-semibold">Intent</th>
                      <th className="text-left py-2 px-2 font-semibold">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.leads.map((lead, idx) => (
                      <tr key={idx} className="border-b hover:bg-muted/50">
                        <td className="py-2 px-2 font-medium">{lead.company}</td>
                        <td className="py-2 px-2">{lead.contactName}</td>
                        <td className="py-2 px-2 text-xs text-muted-foreground">{lead.title}</td>
                        <td className="py-2 px-2">
                          <Badge
                            variant={
                              lead.buyingIntent === 'high'
                                ? 'default'
                                : lead.buyingIntent === 'medium'
                                  ? 'secondary'
                                  : 'outline'
                            }
                          >
                            {lead.buyingIntent}
                          </Badge>
                        </td>
                        <td className="py-2 px-2 font-semibold">{lead.engagementScore}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
