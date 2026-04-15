'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Building2, Plus, Search, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { loadToolState, saveToolState, trackToolEvent } from '@/lib/tool-state-client'

interface CompanyRecord {
  id: string
  companyName: string
  domain: string
  industry: string
  employeeRange: string
  revenueRange: string
  fitScore: number
  createdAt: string
}

interface CompanyForm {
  companyName: string
  domain: string
  industry: string
  employeeRange: string
  revenueRange: string
}

const TOOL_ID = 'dnb-hoovers'

const DEFAULT_FORM: CompanyForm = {
  companyName: '',
  domain: '',
  industry: '',
  employeeRange: '50-200',
  revenueRange: '$5M-$20M',
}

export default function DnbHooversPage() {
  const [records, setRecords] = useState<CompanyRecord[]>([])
  const [form, setForm] = useState<CompanyForm>(DEFAULT_FORM)
  const [query, setQuery] = useState('')

  useEffect(() => {
    let cancelled = false
    async function restore() {
      const state = await loadToolState<{ records: CompanyRecord[] }>(TOOL_ID)
      if (!cancelled && state?.records) {
        setRecords(state.records)
      }
    }
    restore()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    void saveToolState(TOOL_ID, { records })
  }, [records])

  function addRecord() {
    if (!form.companyName.trim() || !form.domain.trim() || !form.industry.trim()) {
      toast.error('Enter company name, domain, and industry')
      return
    }

    const fitScore = Math.min(
      99,
      55 +
        Math.round((form.industry.length + form.companyName.length) % 35) +
        (form.employeeRange.includes('200') ? 6 : 0)
    )

    const record: CompanyRecord = {
      id: `co-${Date.now()}`,
      companyName: form.companyName.trim(),
      domain: form.domain.trim(),
      industry: form.industry.trim(),
      employeeRange: form.employeeRange,
      revenueRange: form.revenueRange,
      fitScore,
      createdAt: new Date().toISOString(),
    }

    setRecords([record, ...records])
    setForm(DEFAULT_FORM)
    void trackToolEvent(TOOL_ID, 'company_profile_created', { fitScore })
    toast.success('Company profile added')
  }

  function removeRecord(id: string) {
    setRecords(records.filter(record => record.id !== id))
    void trackToolEvent(TOOL_ID, 'company_profile_deleted')
    toast.success('Company profile removed')
  }

  const filteredRecords = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return records
    return records.filter(record =>
      [record.companyName, record.domain, record.industry].some(value =>
        value.toLowerCase().includes(normalized)
      )
    )
  }, [records, query])

  const averageFit = records.length
    ? Math.round(records.reduce((sum, item) => sum + item.fitScore, 0) / records.length)
    : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">D&B Hoovers - Company Intelligence</h1>
        <p className="text-muted-foreground mt-2">
          Build account profiles with firmographic signals and ideal-customer-fit scoring
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Profiles</p>
            <p className="text-2xl font-bold">{records.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Avg. Fit Score</p>
            <p className="text-2xl font-bold">{averageFit}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Top Segment</p>
            <p className="text-2xl font-bold">{records[0]?.industry || '-'}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Add Company Intelligence
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Company Name</Label>
              <Input
                placeholder="Northstar Logistics"
                value={form.companyName}
                onChange={e => setForm({ ...form, companyName: e.target.value })}
              />
            </div>
            <div>
              <Label>Domain</Label>
              <Input
                placeholder="northstarlogistics.com"
                value={form.domain}
                onChange={e => setForm({ ...form, domain: e.target.value })}
              />
            </div>
            <div>
              <Label>Industry</Label>
              <Input
                placeholder="Transportation"
                value={form.industry}
                onChange={e => setForm({ ...form, industry: e.target.value })}
              />
            </div>
            <div className="grid gap-4 grid-cols-2">
              <div>
                <Label>Employees</Label>
                <select
                  className="w-full px-3 py-2 border rounded-md"
                  value={form.employeeRange}
                  onChange={e => setForm({ ...form, employeeRange: e.target.value })}
                >
                  <option>1-50</option>
                  <option>50-200</option>
                  <option>200-1000</option>
                  <option>1000+</option>
                </select>
              </div>
              <div>
                <Label>Revenue</Label>
                <select
                  className="w-full px-3 py-2 border rounded-md"
                  value={form.revenueRange}
                  onChange={e => setForm({ ...form, revenueRange: e.target.value })}
                >
                  <option>$1M-$5M</option>
                  <option>$5M-$20M</option>
                  <option>$20M-$100M</option>
                  <option>$100M+</option>
                </select>
              </div>
            </div>
          </div>
          <Button onClick={addRecord} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Save Intelligence Profile
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Saved Company Profiles</span>
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                className="w-56"
                placeholder="Search companies"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {filteredRecords.length === 0 && (
            <p className="text-sm text-muted-foreground">No matching company profiles yet.</p>
          )}
          {filteredRecords.map(record => (
            <div key={record.id} className="border rounded-lg p-4 flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold">{record.companyName}</p>
                <p className="text-sm text-muted-foreground">{record.domain}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline">{record.industry}</Badge>
                  <Badge variant="outline">{record.employeeRange} employees</Badge>
                  <Badge variant="outline">{record.revenueRange}</Badge>
                  <Badge>Fit {record.fitScore}</Badge>
                </div>
              </div>
              <Button variant="destructive" size="sm" onClick={() => removeRecord(record.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
