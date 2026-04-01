'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Plus,
  Trash2,
  Edit2,
  BarChart3,
  Mail,
  Users,
  Zap,
  TrendingUp,
} from 'lucide-react'
import { toast } from 'sonner'
import { loadToolState, saveToolState } from '@/lib/tool-state-client'

interface Campaign {
  id: string
  name: string
  type: 'email' | 'workflow' | 'landing-page'
  status: 'draft' | 'active' | 'paused' | 'completed'
  contactsEnrolled: number
  conversionRate: number
  createdAt: string
}

interface Contact {
  id: string
  email: string
  firstName: string
  lastName: string
  company?: string
  lifecycleStage: 'lead' | 'marketingqualifiedlead' | 'subscriber' | 'customer'
  enrolledCampaigns: string[]
}

export default function HubSpotPage() {
  const TOOL_ID = 'hubspot'
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [tab, setTab] = useState<'campaigns' | 'contacts'>('campaigns')
  const [showCreateCampaign, setShowCreateCampaign] = useState(false)
  const [showAddContact, setShowAddContact] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [campaignForm, setCampaignForm] = useState({
    name: '',
    type: 'email' as const,
  })
  const [contactForm, setContactForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    company: '',
  })

  useEffect(() => {
    let cancelled = false
    async function restore() {
      const state = await loadToolState<{ campaigns: Campaign[]; contacts: Contact[] }>(TOOL_ID)
      if (!cancelled) {
        if (state?.campaigns) setCampaigns(state.campaigns)
        if (state?.contacts) setContacts(state.contacts)
      }
    }
    restore()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    void saveToolState(TOOL_ID, { campaigns, contacts })
  }, [campaigns, contacts])

  function saveCampaign() {
    if (!campaignForm.name) {
      toast.error('Enter campaign name')
      return
    }

    if (editingId) {
      setCampaigns(
        campaigns.map(c =>
          c.id === editingId
            ? { ...c, name: campaignForm.name, type: campaignForm.type }
            : c
        )
      )
      setEditingId(null)
      toast.success('Campaign updated')
    } else {
      const newCampaign: Campaign = {
        id: `campaign-${Date.now()}`,
        name: campaignForm.name,
        type: campaignForm.type,
        status: 'draft',
        contactsEnrolled: 0,
        conversionRate: 0,
        createdAt: new Date().toISOString(),
      }
      setCampaigns([newCampaign, ...campaigns])
      toast.success('Campaign created')
    }
    setCampaignForm({ name: '', type: 'email' })
    setShowCreateCampaign(false)
  }

  function launchCampaign(id: string) {
    setCampaigns(
      campaigns.map(c => {
        if (c.id === id) {
          return {
            ...c,
            status: 'active',
            contactsEnrolled: Math.floor(Math.random() * 500) + 50,
            conversionRate: Math.floor(Math.random() * 8) + 1,
          }
        }
        return c
      })
    )
    toast.success('Campaign launched!')
  }

  function deleteCampaign(id: string) {
    setCampaigns(campaigns.filter(c => c.id !== id))
    toast.success('Campaign deleted')
  }

  function saveContact() {
    if (!contactForm.email || !contactForm.firstName || !contactForm.lastName) {
      toast.error('Fill in all required fields')
      return
    }

    const newContact: Contact = {
      id: `contact-${Date.now()}`,
      email: contactForm.email,
      firstName: contactForm.firstName,
      lastName: contactForm.lastName,
      company: contactForm.company,
      lifecycleStage: 'lead',
      enrolledCampaigns: [],
    }
    setContacts([newContact, ...contacts])
    toast.success('Contact added')
    setContactForm({ email: '', firstName: '', lastName: '', company: '' })
    setShowAddContact(false)
  }

  const stats = {
    totalContacts: contacts.length,
    activeCampaigns: campaigns.filter(c => c.status === 'active').length,
    totalEnrolled: campaigns.reduce((acc, c) => acc + c.contactsEnrolled, 0),
    avgConversion:
      campaigns.length > 0
        ? (campaigns.reduce((acc, c) => acc + c.conversionRate, 0) / campaigns.length).toFixed(1)
        : 0,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">HubSpot Marketing Hub</h1>
        <p className="text-muted-foreground mt-2">Marketing automation and CRM platform</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Total Contacts</p>
            <p className="text-2xl font-bold">{stats.totalContacts}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Active Campaigns</p>
            <p className="text-2xl font-bold text-blue-600">{stats.activeCampaigns}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Contacts Enrolled</p>
            <p className="text-2xl font-bold">{stats.totalEnrolled}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Avg Conversion</p>
            <p className="text-2xl font-bold">{stats.avgConversion}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setTab('campaigns')}
          className={`px-4 py-2 font-semibold transition-colors ${
            tab === 'campaigns'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Mail className="h-4 w-4 inline mr-2" />
          Campaigns
        </button>
        <button
          onClick={() => setTab('contacts')}
          className={`px-4 py-2 font-semibold transition-colors ${
            tab === 'contacts'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Users className="h-4 w-4 inline mr-2" />
          Contacts
        </button>
      </div>

      {/* Campaigns Tab */}
      {tab === 'campaigns' && (
        <div className="space-y-4">
          {!showCreateCampaign ? (
            <Button onClick={() => setShowCreateCampaign(true)} className="w-full md:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Create Campaign
            </Button>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Create Campaign</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Campaign Name</Label>
                  <Input
                    placeholder="Q1 Email Nurture Series"
                    value={campaignForm.name}
                    onChange={e => setCampaignForm({ ...campaignForm, name: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Campaign Type</Label>
                  <select
                    className="w-full px-3 py-2 border rounded-md"
                    value={campaignForm.type}
                    onChange={e => setCampaignForm({ ...campaignForm, type: e.target.value as any })}
                  >
                    <option value="email">Email Campaign</option>
                    <option value="workflow">Automation Workflow</option>
                    <option value="landing-page">Landing Page</option>
                  </select>
                </div>

                <div className="flex gap-2">
                  <Button onClick={saveCampaign} className="flex-1">
                    Create
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowCreateCampaign(false)
                      setCampaignForm({ name: '', type: 'email' })
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {campaigns.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  My Campaigns
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {campaigns.map(campaign => (
                  <div key={campaign.id} className="border rounded-lg p-4 hover:bg-muted/50">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{campaign.name}</h4>
                          <Badge variant="outline">{campaign.type}</Badge>
                          <Badge
                            variant={
                              campaign.status === 'active' ? 'default' : 'secondary'
                            }
                          >
                            {campaign.status}
                          </Badge>
                        </div>

                        {campaign.status === 'active' && (
                          <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                            <div>
                              <p className="text-xs text-muted-foreground">Contacts Enrolled</p>
                              <p className="font-semibold">{campaign.contactsEnrolled}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Conversion Rate</p>
                              <p className="font-semibold">{campaign.conversionRate}%</p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        {campaign.status === 'draft' && (
                          <Button
                            size="sm"
                            onClick={() => launchCampaign(campaign.id)}
                          >
                            <TrendingUp className="h-4 w-4 mr-1" />
                            Launch
                          </Button>
                        )}
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteCampaign(campaign.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Contacts Tab */}
      {tab === 'contacts' && (
        <div className="space-y-4">
          {!showAddContact ? (
            <Button onClick={() => setShowAddContact(true)} className="w-full md:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add Contact
            </Button>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Add Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      placeholder="email@company.com"
                      value={contactForm.email}
                      onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>First Name</Label>
                    <Input
                      placeholder="John"
                      value={contactForm.firstName}
                      onChange={e =>
                        setContactForm({ ...contactForm, firstName: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>Last Name</Label>
                    <Input
                      placeholder="Smith"
                      value={contactForm.lastName}
                      onChange={e => setContactForm({ ...contactForm, lastName: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Company (Optional)</Label>
                    <Input
                      placeholder="Acme Corp"
                      value={contactForm.company}
                      onChange={e => setContactForm({ ...contactForm, company: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={saveContact} className="flex-1">
                    Add Contact
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowAddContact(false)
                      setContactForm({ email: '', firstName: '', lastName: '', company: '' })
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {contacts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Contacts ({contacts.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {contacts.map(contact => (
                    <div key={contact.id} className="border rounded p-3 hover:bg-muted/50">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-sm">
                            {contact.firstName} {contact.lastName}
                          </p>
                          <p className="text-xs text-muted-foreground">{contact.email}</p>
                          {contact.company && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {contact.company}
                            </p>
                          )}
                          <Badge variant="outline" className="mt-2 text-xs">
                            {contact.lifecycleStage}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
