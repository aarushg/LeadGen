'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Plus, Trash2, Phone, Mail, Clock, TrendingUp } from 'lucide-react'
import { toast } from 'sonner'
import { loadToolState, saveToolState } from '@/lib/tool-state-client'

interface Account {
  id: string
  name: string
  industry: string
  annualRevenue: number
  contacts: number
  lastActivity: string
  salesOwner: string
  stage: 'prospect' | 'customer' | 'churned'
}

interface Activity {
  id: string
  accountId: string
  type: 'call' | 'email' | 'meeting' | 'note'
  subject: string
  timestamp: string
  notes?: string
}

export default function ZendeskPage() {
  const TOOL_ID = 'zendesk'
  const [accounts, setAccounts] = useState<Account[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [showCreateAccount, setShowCreateAccount] = useState(false)
  const [showAddActivity, setShowAddActivity] = useState(false)
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    industry: 'Technology',
    annualRevenue: 0,
    salesOwner: '',
  })
  const [activityForm, setActivityForm] = useState({
    type: 'email' as const,
    subject: '',
    notes: '',
  })

  useEffect(() => {
    let cancelled = false
    async function restore() {
      const state = await loadToolState<{ accounts: Account[]; activities: Activity[] }>(TOOL_ID)
      if (!cancelled) {
        if (state?.accounts) setAccounts(state.accounts)
        if (state?.activities) setActivities(state.activities)
      }
    }
    restore()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    void saveToolState(TOOL_ID, { accounts, activities })
  }, [accounts, activities])

  function saveAccount() {
    if (!formData.name || !formData.salesOwner) {
      toast.error('Fill in required fields')
      return
    }

    const newAccount: Account = {
      id: `account-${Date.now()}`,
      name: formData.name,
      industry: formData.industry,
      annualRevenue: formData.annualRevenue,
      contacts: Math.floor(Math.random() * 10) + 2,
      lastActivity: new Date().toISOString(),
      salesOwner: formData.salesOwner,
      stage: 'prospect',
    }
    setAccounts([newAccount, ...accounts])
    toast.success('Account created')
    setFormData({ name: '', industry: 'Technology', annualRevenue: 0, salesOwner: '' })
    setShowCreateAccount(false)
  }

  function deleteAccount(id: string) {
    setAccounts(accounts.filter(a => a.id !== id))
    setActivities(activities.filter(act => act.accountId !== id))
    if (selectedAccountId === id) setSelectedAccountId(null)
    toast.success('Account deleted')
  }

  function addActivity() {
    if (!selectedAccountId || !activityForm.subject) {
      toast.error('Select account and enter subject')
      return
    }

    const newActivity: Activity = {
      id: `activity-${Date.now()}`,
      accountId: selectedAccountId,
      type: activityForm.type,
      subject: activityForm.subject,
      timestamp: new Date().toISOString(),
      notes: activityForm.notes,
    }
    setActivities([newActivity, ...activities])
    setAccountsLastActivity(selectedAccountId)
    setActivityForm({ type: 'email', subject: '', notes: '' })
    setShowAddActivity(false)
    toast.success('Activity logged')
  }

  function setAccountsLastActivity(accountId: string) {
    setAccounts(
      accounts.map(a =>
        a.id === accountId
          ? { ...a, lastActivity: new Date().toISOString() }
          : a
      )
    )
  }

  const selectedAccount = selectedAccountId
    ? accounts.find(a => a.id === selectedAccountId)
    : null
  const accountActivities = selectedAccountId
    ? activities.filter(a => a.accountId === selectedAccountId)
    : []

  const stats = {
    totalAccounts: accounts.length,
    prospects: accounts.filter(a => a.stage === 'prospect').length,
    customers: accounts.filter(a => a.stage === 'customer').length,
    totalRevenue: accounts.reduce((acc, a) => acc + a.annualRevenue, 0),
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Zendesk Sell - Sales CRM</h1>
        <p className="text-muted-foreground mt-2">Manage accounts, contacts, and sales activities</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Total Accounts</p>
            <p className="text-2xl font-bold">{stats.totalAccounts}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Prospects</p>
            <p className="text-2xl font-bold text-blue-600">{stats.prospects}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Customers</p>
            <p className="text-2xl font-bold text-green-600">{stats.customers}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">ARR</p>
            <p className="text-2xl font-bold">${(stats.totalRevenue / 1000).toFixed(0)}K</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Accounts List */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Accounts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {!showCreateAccount ? (
              <Button onClick={() => setShowCreateAccount(true)} className="w-full">
                <Plus className="h-4 w-4 mr-1" />
                Add Account
              </Button>
            ) : (
              <div className="space-y-2 border-t pt-2">
                <Input
                  placeholder="Account name"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
                <Input
                  placeholder="Sales owner"
                  value={formData.salesOwner}
                  onChange={e => setFormData({ ...formData, salesOwner: e.target.value })}
                />
                <select
                  className="w-full px-2 py-1 border rounded text-sm"
                  value={formData.industry}
                  onChange={e => setFormData({ ...formData, industry: e.target.value })}
                >
                  <option>Technology</option>
                  <option>Finance</option>
                  <option>Healthcare</option>
                  <option>Manufacturing</option>
                </select>
                <div className="flex gap-1">
                  <Button size="sm" onClick={saveAccount} className="flex-1">
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowCreateAccount(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-1 pt-2 max-h-72 overflow-y-auto">
              {accounts.map(account => (
                <div
                  key={account.id}
                  onClick={() => setSelectedAccountId(account.id)}
                  className={`p-2 rounded text-xs cursor-pointer transition-colors border ${
                    selectedAccountId === account.id
                      ? 'bg-primary/10 border-primary'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  <p className="font-semibold">{account.name}</p>
                  <p className="text-muted-foreground">{account.salesOwner}</p>
                  <p className="text-muted-foreground">
                    {account.contacts} contacts • {account.industry}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={e => {
                      e.stopPropagation()
                      deleteAccount(account.id)
                    }}
                    className="w-full mt-1"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Account Details & Activities */}
        <div className="md:col-span-2 space-y-4">
          {selectedAccount ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>{selectedAccount.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="border rounded p-3">
                      <p className="text-muted-foreground text-xs">Owner</p>
                      <p className="font-semibold">{selectedAccount.salesOwner}</p>
                    </div>
                    <div className="border rounded p-3">
                      <p className="text-muted-foreground text-xs">Industry</p>
                      <p className="font-semibold">{selectedAccount.industry}</p>
                    </div>
                    <div className="border rounded p-3">
                      <p className="text-muted-foreground text-xs">Annual Revenue</p>
                      <p className="font-semibold">
                        ${(selectedAccount.annualRevenue / 1000).toFixed(0)}K
                      </p>
                    </div>
                    <div className="border rounded p-3">
                      <p className="text-muted-foreground text-xs">Contacts</p>
                      <p className="font-semibold">{selectedAccount.contacts}</p>
                    </div>
                  </div>

                  <Button className="w-full">
                    <Phone className="h-4 w-4 mr-2" />
                    Schedule Call
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Activities
                    </CardTitle>
                    <Button
                      size="sm"
                      onClick={() => setShowAddActivity(!showAddActivity)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {showAddActivity && (
                    <div className="border rounded p-3 space-y-2 bg-muted">
                      <select
                        className="w-full px-2 py-1 border rounded text-sm"
                        value={activityForm.type}
                        onChange={e => setActivityForm({ ...activityForm, type: e.target.value as any })}
                      >
                        <option value="email">Email</option>
                        <option value="call">Call</option>
                        <option value="meeting">Meeting</option>
                        <option value="note">Note</option>
                      </select>
                      <Input
                        size={30}
                        placeholder="Subject..."
                        value={activityForm.subject}
                        onChange={e =>
                          setActivityForm({ ...activityForm, subject: e.target.value })
                        }
                      />
                      <textarea
                        className="w-full px-2 py-1 border rounded text-sm"
                        placeholder="Notes..."
                        rows={2}
                        value={activityForm.notes}
                        onChange={e =>
                          setActivityForm({ ...activityForm, notes: e.target.value })
                        }
                      />
                      <Button onClick={addActivity} className="w-full">
                        Log Activity
                      </Button>
                    </div>
                  )}

                  {accountActivities.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-4">
                      No activities yet
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-72 overflow-y-auto">
                      {accountActivities.map(activity => (
                        <div key={activity.id} className="border rounded p-2 text-xs">
                          <div className="flex items-center gap-2">
                            {activity.type === 'call' && (
                              <Phone className="h-3 w-3 text-blue-600" />
                            )}
                            {activity.type === 'email' && (
                              <Mail className="h-3 w-3 text-green-600" />
                            )}
                            {activity.type === 'meeting' && (
                              <Clock className="h-3 w-3 text-orange-600" />
                            )}
                            <span className="font-semibold capitalize">
                              {activity.type}
                            </span>
                          </div>
                          <p className="font-semibold mt-1">{activity.subject}</p>
                          <p className="text-muted-foreground">
                            {new Date(activity.timestamp).toLocaleString()}
                          </p>
                          {activity.notes && (
                            <p className="mt-1 text-muted-foreground">{activity.notes}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="pt-8 pb-8 text-center">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Select an account to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
