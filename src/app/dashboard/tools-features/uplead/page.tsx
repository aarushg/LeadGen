'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, Loader, Download, Check } from 'lucide-react'
import { toast } from 'sonner'

interface PersonInfo {
  firstName: string
  lastName: string
  title: string
  seniority: string
  linkedinUrl?: string
}

interface CompanyInfo {
  name: string
  domain: string
  industry: string
  size: string
  location: string
  website: string
  linkedinUrl?: string
}

interface VerificationInfo {
  emailValid: boolean
  webSignals: number
  sources: string[]
}

interface UpleadResult {
  email: string
  confidence: number
  person: PersonInfo
  company: CompanyInfo
  verification: VerificationInfo
  enrichmentLevel: string
  lastUpdated: string
}

export default function UpleadPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<UpleadResult | null>(null)
  const [error, setError] = useState('')

  async function handleEnrich() {
    if (!email.trim()) {
      toast.error('Please enter an email address')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/tools/uplead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to enrich contact')
      }

      const data = await response.json()
      setResult(data.result)
      toast.success('Contact enriched successfully')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  function downloadAsJSON() {
    if (!result) return
    const dataStr = JSON.stringify(result, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)
    const exportFileDefaultName = `${result.email}-enrichment.json`
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
    toast.success('Contact data downloaded')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">UpLead - Contact Enrichment</h1>
        <p className="text-muted-foreground mt-2">Enrich contacts with verified B2B data and firmographics</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Enrich Contact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              placeholder="john.doe@company.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleEnrich()}
            />
            <p className="text-xs text-muted-foreground mt-1">Enter an email address to enrich</p>
          </div>

          <Button onClick={handleEnrich} disabled={loading || !email.trim()} className="w-full">
            {loading ? (
              <>
                <Loader className="h-4 w-4 mr-2 animate-spin" />
                Enriching...
              </>
            ) : (
              'Enrich Contact'
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
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Enriched Contact Data</CardTitle>
              <Button variant="outline" size="sm" onClick={downloadAsJSON}>
                <Download className="h-4 w-4 mr-2" />
                Export JSON
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Confidence */}
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="text-sm font-semibold">Verification Confidence</p>
                  <p className="text-xs text-muted-foreground">Data accuracy score</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{result.confidence}%</p>
                  <p className="text-xs text-muted-foreground">{result.enrichmentLevel}</p>
                </div>
              </div>

              {/* Person Info */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  Person Information
                </h3>
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Full Name</p>
                    <p className="font-medium">
                      {result.person.firstName} {result.person.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Job Title</p>
                    <p className="font-medium">{result.person.title}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Seniority Level</p>
                    <p className="font-medium">{result.person.seniority}</p>
                  </div>
                  {result.person.linkedinUrl && (
                    <div>
                      <p className="text-xs text-muted-foreground">LinkedIn Profile</p>
                      <a
                        href={result.person.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline text-sm"
                      >
                        View Profile
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Company Info */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  Company Information
                </h3>
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Company Name</p>
                    <p className="font-medium">{result.company.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Domain</p>
                    <p className="font-mono text-sm">{result.company.domain}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Industry</p>
                    <p className="font-medium">{result.company.industry}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Company Size</p>
                    <p className="font-medium">{result.company.size}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="font-medium">{result.company.location}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Website</p>
                    <a
                      href={`https://${result.company.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-sm"
                    >
                      {result.company.website}
                    </a>
                  </div>
                </div>
              </div>

              {/* Verification */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  Verification Details
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded">
                    <span className="text-sm">Email Valid</span>
                    <Badge variant={result.verification.emailValid ? 'default' : 'destructive'}>
                      {result.verification.emailValid ? 'Valid' : 'Invalid'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded">
                    <span className="text-sm">Web Signals Found</span>
                    <Badge variant="secondary">{result.verification.webSignals}</Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">Data Sources</p>
                    <div className="flex flex-wrap gap-2">
                      {result.verification.sources.map((source, idx) => (
                        <Badge key={idx} variant="outline">
                          {source}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-xs text-muted-foreground pt-3 border-t">
                Last updated: {new Date(result.lastUpdated).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
