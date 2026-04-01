'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, Loader, Send, Plus, Edit2, Trash2, BarChart3 } from 'lucide-react'
import { toast } from 'sonner'
import { loadToolState, saveToolState, trackToolEvent } from '@/lib/tool-state-client'

interface Campaign {
  id: string
  name: string
  subject: string
  body: string
  recipientCount: number
  status: 'draft' | 'scheduled' | 'sent'
  createdAt: string
  stats?: {
    sendDate: string
    opens: number
    clicks: number
    conversions: number
  }
}

export default function MailchimpPage() {
  const TOOL_ID = 'mailchimp'
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [newCampaign, setNewCampaign] = useState({ name: '', subject: '', body: '', recipientCount: 0 })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function restore() {
      const state = await loadToolState<{ campaigns: Campaign[] }>(TOOL_ID)
      if (!cancelled && state?.campaigns) {
        setCampaigns(state.campaigns)
      }
    }
    restore()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    void saveToolState(TOOL_ID, { campaigns })
  }, [campaigns])

  function saveCampaign() {
    if (!newCampaign.name || !newCampaign.subject || !newCampaign.body) {
      toast.error('Fill in all fields')
      return
    }

    if (editingId) {
      setCampaigns(
        campaigns.map(c =>
          c.id === editingId
            ? {
                ...c,
                name: newCampaign.name,
                subject: newCampaign.subject,
                body: newCampaign.body,
                recipientCount: newCampaign.recipientCount,
              }
            : c
        )
      )
      setEditingId(null)
      toast.success('Campaign updated')
    } else {
      const campaign: Campaign = {
        id: `campaign-${Date.now()}`,
        name: newCampaign.name,
        subject: newCampaign.subject,
        body: newCampaign.body,
        recipientCount: newCampaign.recipientCount,
        status: 'draft',
        createdAt: new Date().toISOString(),
      }
      setCampaigns([campaign, ...campaigns])
      toast.success('Campaign created')
    }

    resetForm()
  }

  function resetForm() {
    setNewCampaign({ name: '', subject: '', body: '', recipientCount: 0 })
    setShowForm(false)
    setEditingId(null)
  }

  function deleteCampaign(id: string) {
    setCampaigns(campaigns.filter(c => c.id !== id))
    toast.success('Campaign deleted')
  }

  function sendCampaign(id: string) {
    setCampaigns(
      campaigns.map(c =>
        c.id === id
          ? {
              ...c,
              status: 'sent',
              stats: {
                sendDate: new Date().toISOString(),
                opens: Math.floor(Math.random() * 100),
                clicks: Math.floor(Math.random() * 50),
                conversions: Math.floor(Math.random() * 20),
              },
            }
          : c
      )
    )
    void trackToolEvent(TOOL_ID, 'campaign_sent')
    toast.success('Campaign sent!')
  }

  function editCampaign(campaign: Campaign) {
    setNewCampaign({
      name: campaign.name,
      subject: campaign.subject,
      body: campaign.body,
      recipientCount: campaign.recipientCount,
    })
    setEditingId(campaign.id)
    setShowForm(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Mailchimp - Email Campaigns</h1>
        <p className="text-muted-foreground mt-2">Create and track email marketing campaigns</p>
      </div>

      {!showForm ? (
        <Button onClick={() => setShowForm(true)} className="w-full md:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          New Campaign
        </Button>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Edit' : 'Create'} Campaign</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Campaign Name</Label>
              <Input
                placeholder="Spring Promotion"
                value={newCampaign.name}
                onChange={e => setNewCampaign({ ...newCampaign, name: e.target.value })}
              />
            </div>

            <div>
              <Label>Email Subject</Label>
              <Input
                placeholder="Get 50% off this weekend only"
                value={newCampaign.subject}
                onChange={e => setNewCampaign({ ...newCampaign, subject: e.target.value })}
              />
            </div>

            <div>
              <Label>Email Body</Label>
              <Textarea
                placeholder="Dear Customer,

Check out our amazing offer..."
                value={newCampaign.body}
                onChange={e => setNewCampaign({ ...newCampaign, body: e.target.value })}
                rows={6}
              />
            </div>

            <div>
              <Label>Recipients</Label>
              <Input
                type="number"
                min="0"
                placeholder="5000"
                value={newCampaign.recipientCount}
                onChange={e => setNewCampaign({ ...newCampaign, recipientCount: parseInt(e.target.value) || 0 })}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={saveCampaign} className="flex-1">
                {editingId ? 'Update' : 'Create'} Campaign
              </Button>
              <Button variant="outline" onClick={resetForm} className="flex-1">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {campaigns.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>My Campaigns ({campaigns.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {campaigns.map(campaign => (
              <div key={campaign.id} className="border rounded-lg p-4 hover:bg-muted/50">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{campaign.name}</h4>
                      <Badge variant={campaign.status === 'sent' ? 'default' : 'secondary'}>{campaign.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Subject: {campaign.subject}</p>
                    <p className="text-xs text-muted-foreground mt-1">{campaign.recipientCount} recipients</p>

                    {campaign.stats && (
                      <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                          <p className="text-blue-600 dark:text-blue-400 font-semibold">{campaign.stats.opens}</p>
                          <p className="text-blue-600 dark:text-blue-400">Opens</p>
                        </div>
                        <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded">
                          <p className="text-green-600 dark:text-green-400 font-semibold">{campaign.stats.clicks}</p>
                          <p className="text-green-600 dark:text-green-400">Clicks</p>
                        </div>
                        <div className="bg-purple-50 dark:bg-purple-900/20 p-2 rounded">
                          <p className="text-purple-600 dark:text-purple-400 font-semibold">{campaign.stats.conversions}</p>
                          <p className="text-purple-600 dark:text-purple-400">Conversions</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 flex-col">
                    {campaign.status === 'draft' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => editCampaign(campaign)}
                          className="whitespace-nowrap"
                        >
                          <Edit2 className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => sendCampaign(campaign.id)}
                          className="whitespace-nowrap"
                        >
                          <Send className="h-4 w-4 mr-1" />
                          Send
                        </Button>
                      </>
                    )}
                    {campaign.status === 'sent' && (
                      <Button variant="outline" size="sm" className="whitespace-nowrap">
                        <BarChart3 className="h-4 w-4 mr-1" />
                        Stats
                      </Button>
                    )}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteCampaign(campaign.id)}
                      className="whitespace-nowrap"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
