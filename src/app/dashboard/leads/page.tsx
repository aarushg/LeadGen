'use client'

import { useEffect, useState } from 'react'
import { Trash2, ChevronDown } from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { formatRelativeDate } from '@/lib/utils'

type LeadStatus = 'new' | 'researched' | 'contacted' | 'replied' | 'qualified' | 'closed_won' | 'closed_lost'

interface Lead {
  id: string
  full_name: string | null
  company: string
  title: string | null
  email: string | null
  status: LeadStatus
  notes: string | null
  outreach_message: string | null
  created_at: string
}

const STATUS_OPTIONS: LeadStatus[] = ['new', 'researched', 'contacted', 'replied', 'qualified', 'closed_won', 'closed_lost']

const STATUS_VARIANT: Record<LeadStatus, 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline'> = {
  new: 'secondary',
  researched: 'outline',
  contacted: 'default',
  replied: 'success',
  qualified: 'warning',
  closed_won: 'success',
  closed_lost: 'destructive',
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [filter, setFilter] = useState<LeadStatus | 'all'>('all')
  const [selected, setSelected] = useState<Lead | null>(null)
  const [loading, setLoading] = useState(true)

  async function fetchLeads() {
    const url = filter === 'all' ? '/api/leads' : `/api/leads?status=${filter}`
    const res = await fetch(url)
    if (res.ok) {
      const data = await res.json()
      setLeads(data.leads ?? [])
    }
    setLoading(false)
  }

  useEffect(() => { fetchLeads() }, [filter])

  async function updateStatus(id: string, status: LeadStatus) {
    const res = await fetch(`/api/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (res.ok) {
      setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l))
      if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null)
      toast.success('Status updated')
    }
  }

  async function deleteLead(id: string) {
    const res = await fetch(`/api/leads/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setLeads(prev => prev.filter(l => l.id !== id))
      setSelected(null)
      toast.success('Lead deleted')
    }
  }

  const filters: Array<LeadStatus | 'all'> = ['all', ...STATUS_OPTIONS]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">CRM</h1>
        <p className="text-muted-foreground">Manage your lead pipeline</p>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        {filters.map(f => (
          <Button
            key={f}
            size="sm"
            variant={filter === f ? 'default' : 'outline'}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'All' : f.replace('_', ' ')}
          </Button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Leads {leads.length > 0 && `(${leads.length})`}</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="py-8 text-center text-muted-foreground">Loading...</p>
          ) : leads.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">No leads found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-3 pr-4 font-medium">Name</th>
                    <th className="pb-3 pr-4 font-medium">Company</th>
                    <th className="pb-3 pr-4 font-medium">Status</th>
                    <th className="pb-3 pr-4 font-medium hidden sm:table-cell">Added</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {leads.map(lead => (
                    <tr
                      key={lead.id}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => setSelected(lead)}
                    >
                      <td className="py-3 pr-4 font-medium">{lead.full_name || '—'}</td>
                      <td className="py-3 pr-4 text-muted-foreground">{lead.company}</td>
                      <td className="py-3 pr-4" onClick={e => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-1">
                              <Badge variant={STATUS_VARIANT[lead.status]}>
                                {lead.status.replace('_', ' ')}
                              </Badge>
                              <ChevronDown className="h-3 w-3 text-muted-foreground" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            {STATUS_OPTIONS.map(s => (
                              <DropdownMenuItem key={s} onClick={() => updateStatus(lead.id, s)}>
                                {s.replace('_', ' ')}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                      <td className="py-3 pr-4 text-muted-foreground hidden sm:table-cell">
                        {formatRelativeDate(lead.created_at)}
                      </td>
                      <td className="py-3" onClick={e => e.stopPropagation()}>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          onClick={() => deleteLead(lead.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lead detail dialog */}
      <Dialog open={!!selected} onOpenChange={open => !open && setSelected(null)}>
        {selected && (
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{selected.full_name || selected.company}</DialogTitle>
              <DialogDescription>{selected.title} — {selected.company}</DialogDescription>
            </DialogHeader>
            <div className="space-y-3 text-sm">
              {selected.email && (
                <div><span className="font-medium">Email: </span>{selected.email}</div>
              )}
              <div>
                <span className="font-medium">Status: </span>
                <Badge variant={STATUS_VARIANT[selected.status]}>{selected.status.replace('_', ' ')}</Badge>
              </div>
              {selected.outreach_message && (
                <div>
                  <p className="font-medium mb-1">Outreach message:</p>
                  <p className="text-muted-foreground whitespace-pre-wrap rounded-md bg-muted p-3 text-xs">
                    {selected.outreach_message}
                  </p>
                </div>
              )}
              {selected.notes && (
                <div>
                  <p className="font-medium mb-1">Notes:</p>
                  <p className="text-muted-foreground">{selected.notes}</p>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteLead(selected.id)}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}
