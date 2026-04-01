'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Plus, Target, TrendingUp, Users, Trash2, Edit2, Play } from 'lucide-react'
import { toast } from 'sonner'
import { loadToolState, saveToolState } from '@/lib/tool-state-client'

interface TargetAccount {
  id: string
  companyName: string
  website: string
  employees: string
  industry: string
  priority: 'high' | 'medium' | 'low'
  status: 'identified' | 'engaged' | 'progressing' | 'won'
  estimatedDealSize: number
  contacts: number
  campaignName: string
  createdAt: string
}

interface RollWorksFormData {
  companyName: string
  website: string
  employees: string
  industry: string
  priority: TargetAccount['priority']
  estimatedDealSize: number
  campaignName: string
}

export default function RollWorksPage() {
  const TOOL_ID = 'rollworks'
  const [accounts, setAccounts] = useState<TargetAccount[]>([])
  const [showCreate, setShowCreate] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<RollWorksFormData>({
    companyName: '',
    website: '',
    employees: '500-1000',
    industry: 'Technology',
    priority: 'high',
    estimatedDealSize: 50000,
    campaignName: '',
  })

  useEffect(() => {
    let cancelled = false
    async function restore() {
      const state = await loadToolState<{ accounts: TargetAccount[] }>(TOOL_ID)
      if (!cancelled && state?.accounts) {
        setAccounts(state.accounts)
      }
    }
    restore()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    void saveToolState(TOOL_ID, { accounts })
  }, [accounts])

  function saveAccount() {
    if (!formData.companyName || !formData.campaignName || !formData.website) {
      toast.error('Fill in all required fields')
      return
    }

    if (editingId) {
      setAccounts(
        accounts.map(a =>
          a.id === editingId
            ? {
                ...a,
                companyName: formData.companyName,
                website: formData.website,
                employees: formData.employees,
                industry: formData.industry,
                priority: formData.priority,
                estimatedDealSize: formData.estimatedDealSize,
                campaignName: formData.campaignName,
              }
            : a
        )
      )
      setEditingId(null)
      toast.success('Account updated')
    } else {
      const newAccount: TargetAccount = {
        id: `account-${Date.now()}`,
        companyName: formData.companyName,
        website: formData.website,
        employees: formData.employees,
        industry: formData.industry,
        priority: formData.priority,
        estimatedDealSize: formData.estimatedDealSize,
        campaignName: formData.campaignName,
        status: 'identified',
        contacts: Math.floor(Math.random() * 10) + 3,
        createdAt: new Date().toISOString(),
      }
      setAccounts([newAccount, ...accounts])
      toast.success('Account added to ABM campaign')
    }
    resetForm()
  }

  function resetForm() {
    setFormData({
      companyName: '',
      website: '',
      employees: '500-1000',
      industry: 'Technology',
      priority: 'high',
      estimatedDealSize: 50000,
      campaignName: '',
    })
    setShowCreate(false)
    setEditingId(null)
  }

  function editAccount(account: TargetAccount) {
    setFormData({
      companyName: account.companyName,
      website: account.website,
      employees: account.employees,
      industry: account.industry,
      priority: account.priority,
      estimatedDealSize: account.estimatedDealSize,
      campaignName: account.campaignName,
    })
    setEditingId(account.id)
    setShowCreate(true)
  }

  function deleteAccount(id: string) {
    setAccounts(accounts.filter(a => a.id !== id))
    toast.success('Account deleted')
  }

  function advanceStatus(id: string) {
    setAccounts(
      accounts.map(a => {
        if (a.id === id) {
          const statuses: Array<'identified' | 'engaged' | 'progressing' | 'won'> = [
            'identified',
            'engaged',
            'progressing',
            'won',
          ]
          const currentIdx = statuses.indexOf(a.status)
          const nextStatus = statuses[(currentIdx + 1) % statuses.length]
          toast.success(`Account moved to ${nextStatus}`)
          return { ...a, status: nextStatus }
        }
        return a
      })
    )
  }

  const stats = {
    totalAccounts: accounts.length,
    identified: accounts.filter(a => a.status === 'identified').length,
    engaged: accounts.filter(a => a.status === 'engaged').length,
    totalPipeline: accounts.reduce((acc, a) => acc + a.estimatedDealSize, 0),
  }

  const highPriorityAccounts = accounts.filter(a => a.priority === 'high')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">RollWorks - Account-Based Marketing</h1>
        <p className="text-muted-foreground mt-2">Target and engage high-value accounts strategically</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Target Accounts</p>
            <p className="text-2xl font-bold">{stats.totalAccounts}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Active Engagements</p>
            <p className="text-2xl font-bold text-blue-600">{stats.engaged}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">High Priority</p>
            <p className="text-2xl font-bold text-orange-600">{highPriorityAccounts.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Total Pipeline</p>
            <p className="text-2xl font-bold">${(stats.totalPipeline / 1000).toFixed(0)}K</p>
          </CardContent>
        </Card>
      </div>

      {!showCreate ? (
        <Button onClick={() => setShowCreate(true)} className="w-full md:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add Target Account
        </Button>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Edit' : 'Add'} Target Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Company Name</Label>
                <Input
                  placeholder="e.g., Acme Corporation"
                  value={formData.companyName}
                  onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                />
              </div>

              <div>
                <Label>Website</Label>
                <Input
                  placeholder="https://acme.com"
                  value={formData.website}
                  onChange={e => setFormData({ ...formData, website: e.target.value })}
                />
              </div>

              <div>
                <Label>Industry</Label>
                <select
                  className="w-full px-3 py-2 border rounded-md"
                  value={formData.industry}
                  onChange={e => setFormData({ ...formData, industry: e.target.value })}
                >
                  <option>Technology</option>
                  <option>Finance</option>
                  <option>Healthcare</option>
                  <option>Manufacturing</option>
                  <option>Retail</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <Label>Employee Size</Label>
                <select
                  className="w-full px-3 py-2 border rounded-md"
                  value={formData.employees}
                  onChange={e => setFormData({ ...formData, employees: e.target.value })}
                >
                  <option>100-500</option>
                  <option>500-1000</option>
                  <option>1000-5000</option>
                  <option>5000+</option>
                </select>
              </div>

              <div>
                <Label>Estimated Deal Size ($)</Label>
                <Input
                  type="number"
                  placeholder="50000"
                  value={formData.estimatedDealSize}
                  onChange={e =>
                    setFormData({ ...formData, estimatedDealSize: parseInt(e.target.value) })
                  }
                />
              </div>

              <div>
                <Label>Priority Level</Label>
                <select
                  className="w-full px-3 py-2 border rounded-md"
                  value={formData.priority}
                  onChange={e => setFormData({ ...formData, priority: e.target.value as any })}
                >
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
              </div>
            </div>

            <div>
              <Label>Campaign Name</Label>
              <Input
                placeholder="Q1 Enterprise Push"
                value={formData.campaignName}
                onChange={e => setFormData({ ...formData, campaignName: e.target.value })}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={saveAccount} className="flex-1">
                {editingId ? 'Update' : 'Add'} Account
              </Button>
              <Button variant="outline" onClick={resetForm} className="flex-1">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {accounts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Target Accounts ({accounts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {accounts.map(account => (
                <div
                  key={account.id}
                  className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{account.companyName}</h4>
                        <Badge
                          variant="outline"
                          className={
                            account.priority === 'high'
                              ? 'bg-red-50 text-red-700 border-red-200'
                              : account.priority === 'medium'
                                ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                : 'bg-blue-50 text-blue-700 border-blue-200'
                          }
                        >
                          {account.priority.charAt(0).toUpperCase() + account.priority.slice(1)}
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground">{account.website}</p>

                      <div className="grid grid-cols-3 gap-3 text-sm mt-3">
                        <div>
                          <p className="text-xs text-muted-foreground">Industry</p>
                          <p className="font-semibold">{account.industry}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Potential Deal</p>
                          <p className="font-semibold">${(account.estimatedDealSize / 1000).toFixed(0)}K</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Status</p>
                          <Badge
                            variant={
                              account.status === 'won'
                                ? 'default'
                                : account.status === 'progressing'
                                  ? 'secondary'
                                  : 'outline'
                            }
                          >
                            {account.status}
                          </Badge>
                        </div>
                      </div>

                      <p className="text-xs text-muted-foreground mt-2">
                        Campaign: {account.campaignName} • {account.contacts} contacts
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => advanceStatus(account.id)}
                      >
                        <Play className="h-3 w-3 mr-1" />
                        Advance
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => editAccount(account)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteAccount(account.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
