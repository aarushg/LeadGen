'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select } from '@/components/ui/select'
import { Plus, Trash2, Edit2, TrendingUp, DollarSign, BarChart3 } from 'lucide-react'
import { toast } from 'sonner'
import { loadToolState, saveToolState } from '@/lib/tool-state-client'

interface Deal {
  id: string
  title: string
  companyName: string
  value: number
  stage: 'lead' | 'contact' | 'negotiation' | 'won' | 'lost'
  ownerName: string
  createdAt: string
  probability: number
  dueDate: string
}

interface DealFormData {
  title: string
  companyName: string
  value: number
  stage: Deal['stage']
  ownerName: string
  dueDate: string
}

export default function PipedrivePage() {
  const TOOL_ID = 'pipedrive'
  const [deals, setDeals] = useState<Deal[]>([])
  const [showCreate, setShowCreate] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<DealFormData>({
    title: '',
    companyName: '',
    value: 0,
    stage: 'lead',
    ownerName: '',
    dueDate: '',
  })

  useEffect(() => {
    let cancelled = false
    async function restore() {
      const state = await loadToolState<{ deals: Deal[] }>(TOOL_ID)
      if (!cancelled && state?.deals) {
        setDeals(state.deals)
      }
    }
    restore()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    void saveToolState(TOOL_ID, { deals })
  }, [deals])

  function saveDeal() {
    if (!formData.title || !formData.companyName || !formData.value || !formData.ownerName) {
      toast.error('Fill in all required fields')
      return
    }

    if (editingId) {
      setDeals(
        deals.map(d =>
          d.id === editingId
            ? {
                ...d,
                title: formData.title,
                companyName: formData.companyName,
                value: formData.value,
                stage: formData.stage,
                ownerName: formData.ownerName,
                dueDate: formData.dueDate,
              }
            : d
        )
      )
      setEditingId(null)
      toast.success('Deal updated')
    } else {
      const stageProbability: Record<string, number> = {
        lead: 10,
        contact: 25,
        negotiation: 60,
        won: 100,
        lost: 0,
      }

      const newDeal: Deal = {
        id: `deal-${Date.now()}`,
        title: formData.title,
        companyName: formData.companyName,
        value: formData.value,
        stage: formData.stage,
        ownerName: formData.ownerName,
        dueDate: formData.dueDate,
        createdAt: new Date().toISOString(),
        probability: stageProbability[formData.stage] || 10,
      }
      setDeals([newDeal, ...deals])
      toast.success('Deal added to pipeline')
    }
    resetForm()
  }

  function resetForm() {
    setFormData({
      title: '',
      companyName: '',
      value: 0,
      stage: 'lead',
      ownerName: '',
      dueDate: '',
    })
    setShowCreate(false)
    setEditingId(null)
  }

  function editDeal(deal: Deal) {
    setFormData({
      title: deal.title,
      companyName: deal.companyName,
      value: deal.value,
      stage: deal.stage,
      ownerName: deal.ownerName,
      dueDate: deal.dueDate,
    })
    setEditingId(deal.id)
    setShowCreate(true)
  }

  function deleteDeal(id: string) {
    setDeals(deals.filter(d => d.id !== id))
    toast.success('Deal deleted')
  }

  function moveDeal(id: string, newStage: 'lead' | 'contact' | 'negotiation' | 'won' | 'lost') {
    const stageProbability: Record<string, number> = {
      lead: 10,
      contact: 25,
      negotiation: 60,
      won: 100,
      lost: 0,
    }

    setDeals(
      deals.map(d =>
        d.id === id
          ? { ...d, stage: newStage, probability: stageProbability[newStage] || 10 }
          : d
      )
    )
    toast.success(`Deal moved to ${newStage}`)
  }

  const stages: Array<'lead' | 'contact' | 'negotiation' | 'won' | 'lost'> = [
    'lead',
    'contact',
    'negotiation',
    'won',
    'lost',
  ]
  const pipelines = stages.map(stage => ({
    stage,
    deals: deals.filter(d => d.stage === stage),
    value: deals
      .filter(d => d.stage === stage)
      .reduce((acc, d) => acc + d.value * (d.probability / 100), 0),
  }))

  const totalValue = deals.reduce((acc, d) => acc + d.value, 0)
  const expectedValue = deals.reduce((acc, d) => acc + d.value * (d.probability / 100), 0)
  const wonDeals = deals.filter(d => d.stage === 'won').length
  const wonValue = deals
    .filter(d => d.stage === 'won')
    .reduce((acc, d) => acc + d.value, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Pipedrive - Sales Pipeline</h1>
        <p className="text-muted-foreground mt-2">Manage deals and track your sales pipeline</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Total Pipeline</p>
            <p className="text-2xl font-bold">${(totalValue / 1000).toFixed(0)}K</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Expected Value</p>
            <p className="text-2xl font-bold text-blue-600">${(expectedValue / 1000).toFixed(0)}K</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Won Deals</p>
            <p className="text-2xl font-bold text-green-600">{wonDeals}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Won This Month</p>
            <p className="text-2xl font-bold">${(wonValue / 1000).toFixed(0)}K</p>
          </CardContent>
        </Card>
      </div>

      {!showCreate ? (
        <Button onClick={() => setShowCreate(true)} className="w-full md:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add Deal
        </Button>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Edit' : 'Add'} Deal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Deal Title</Label>
                <Input
                  placeholder="Website Redesign Project"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div>
                <Label>Company Name</Label>
                <Input
                  placeholder="Acme Corp"
                  value={formData.companyName}
                  onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                />
              </div>

              <div>
                <Label>Deal Value ($)</Label>
                <Input
                  type="number"
                  placeholder="25000"
                  value={formData.value}
                  onChange={e => setFormData({ ...formData, value: parseInt(e.target.value) })}
                />
              </div>

              <div>
                <Label>Sales Owner</Label>
                <Input
                  placeholder="John Smith"
                  value={formData.ownerName}
                  onChange={e => setFormData({ ...formData, ownerName: e.target.value })}
                />
              </div>

              <div>
                <Label>Stage</Label>
                <select
                  className="w-full px-3 py-2 border rounded-md"
                  value={formData.stage}
                  onChange={e => setFormData({ ...formData, stage: e.target.value as any })}
                >
                  <option value="lead">Lead</option>
                  <option value="contact">Contact</option>
                  <option value="negotiation">Negotiation</option>
                  <option value="won">Won</option>
                  <option value="lost">Lost</option>
                </select>
              </div>

              <div>
                <Label>Due Date</Label>
                <Input
                  type="date"
                  value={formData.dueDate}
                  onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={saveDeal} className="flex-1">
                {editingId ? 'Update' : 'Add'} Deal
              </Button>
              <Button variant="outline" onClick={resetForm} className="flex-1">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Kanban Pipeline View */}
      {deals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Sales Pipeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-5">
              {pipelines.map(pipeline => (
                <div key={pipeline.stage} className="border rounded-lg p-3">
                  <div className="mb-3">
                    <h4 className="font-semibold text-sm capitalize">{pipeline.stage}</h4>
                    <p className="text-xs text-muted-foreground">
                      {pipeline.deals.length} deals
                    </p>
                    <p className="text-sm font-mono font-bold text-primary mt-1">
                      ${(pipeline.value / 1000).toFixed(0)}K
                    </p>
                  </div>

                  <div className="space-y-2">
                    {pipeline.deals.map(deal => (
                      <div
                        key={deal.id}
                        className="bg-muted p-2 rounded text-xs border hover:bg-muted/80"
                      >
                        <p className="font-semibold truncate">{deal.title}</p>
                        <p className="text-muted-foreground truncate">{deal.companyName}</p>
                        <p className="font-mono font-bold text-primary mt-1">
                          ${(deal.value / 1000).toFixed(0)}K
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <div className="h-1.5 w-full bg-muted rounded overflow-hidden">
                            <div
                              className="h-full bg-blue-500"
                              style={{ width: `${deal.probability}%` }}
                            />
                          </div>
                          <span className="text-muted-foreground text-xs">
                            {deal.probability}%
                          </span>
                        </div>

                        <div className="flex gap-1 mt-2">
                          {pipeline.stage !== 'won' && pipeline.stage !== 'lost' && (
                            <>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6"
                                onClick={() => {
                                  const idx = stages.indexOf(pipeline.stage)
                                  moveDeal(deal.id, stages[idx + 1])
                                }}
                              >
                                →
                              </Button>
                            </>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 flex-1"
                            onClick={() => editDeal(deal)}
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6"
                            onClick={() => deleteDeal(deal.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
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
