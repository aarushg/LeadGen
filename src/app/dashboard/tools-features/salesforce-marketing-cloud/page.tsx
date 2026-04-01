'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Plus, Rocket, Trash2, BarChart3 } from 'lucide-react'
import { toast } from 'sonner'
import { loadToolState, saveToolState, trackToolEvent } from '@/lib/tool-state-client'

interface SFMCCampaign {
  id: string
  name: string
  channel: 'email' | 'sms' | 'push'
  audience: string
  status: 'draft' | 'active' | 'completed'
  sends: number
  opens: number
  clicks: number
  createdAt: string
}

interface SFMCFormData {
  name: string
  channel: SFMCCampaign['channel']
  audience: string
  message: string
}

export default function SalesforceMarketingCloudPage() {
  const TOOL_ID = 'salesforce-marketing-cloud'
  const [campaigns, setCampaigns] = useState<SFMCCampaign[]>([])
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState<SFMCFormData>({
    name: '',
    channel: 'email',
    audience: '',
    message: '',
  })

  useEffect(() => {
    let cancelled = false
    async function restore() {
      const state = await loadToolState<{ campaigns: SFMCCampaign[] }>(TOOL_ID)
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

  function createCampaign() {
    if (!form.name || !form.audience || !form.message) {
      toast.error('Fill in all required fields')
      return
    }

    const campaign: SFMCCampaign = {
      id: `sfmc-${Date.now()}`,
      name: form.name,
      channel: form.channel,
      audience: form.audience,
      status: 'draft',
      sends: 0,
      opens: 0,
      clicks: 0,
      createdAt: new Date().toISOString(),
    }

    setCampaigns([campaign, ...campaigns])
    setForm({ name: '', channel: 'email', audience: '', message: '' })
    setShowCreate(false)
    void trackToolEvent(TOOL_ID, 'campaign_created')
    toast.success('Journey campaign created')
  }

  function launchCampaign(id: string) {
    setCampaigns(
      campaigns.map(c =>
        c.id === id
          ? {
              ...c,
              status: 'active',
              sends: Math.floor(Math.random() * 5000) + 1000,
              opens: Math.floor(Math.random() * 2000) + 500,
              clicks: Math.floor(Math.random() * 600) + 100,
            }
          : c
      )
    )
    void trackToolEvent(TOOL_ID, 'campaign_launched')
    toast.success('Campaign launched')
  }

  function completeCampaign(id: string) {
    setCampaigns(campaigns.map(c => (c.id === id ? { ...c, status: 'completed' } : c)))
    void trackToolEvent(TOOL_ID, 'campaign_completed')
    toast.success('Campaign marked complete')
  }

  function removeCampaign(id: string) {
    setCampaigns(campaigns.filter(c => c.id !== id))
    toast.success('Campaign deleted')
  }

  const totalSends = campaigns.reduce((acc, c) => acc + c.sends, 0)
  const totalOpens = campaigns.reduce((acc, c) => acc + c.opens, 0)
  const totalClicks = campaigns.reduce((acc, c) => acc + c.clicks, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Salesforce Marketing Cloud</h1>
        <p className="text-muted-foreground mt-2">Enterprise campaign orchestration across channels</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Campaigns</p>
            <p className="text-2xl font-bold">{campaigns.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Total Sends</p>
            <p className="text-2xl font-bold">{totalSends}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Total Opens</p>
            <p className="text-2xl font-bold">{totalOpens}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Total Clicks</p>
            <p className="text-2xl font-bold">{totalClicks}</p>
          </CardContent>
        </Card>
      </div>

      {!showCreate ? (
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Journey Campaign
        </Button>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Create Campaign</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Q2 Expansion Journey" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Channel</Label>
                <select className="w-full px-3 py-2 border rounded-md" value={form.channel} onChange={(e) => setForm({ ...form, channel: e.target.value as 'email' | 'sms' | 'push' })}>
                  <option value="email">Email</option>
                  <option value="sms">SMS</option>
                  <option value="push">Push</option>
                </select>
              </div>
              <div>
                <Label>Audience</Label>
                <Input value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value })} placeholder="Enterprise Decision Makers" />
              </div>
            </div>
            <div>
              <Label>Message</Label>
              <Textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={4} placeholder="Campaign messaging..." />
            </div>
            <div className="flex gap-2">
              <Button onClick={createCampaign} className="flex-1">Create</Button>
              <Button variant="outline" onClick={() => setShowCreate(false)} className="flex-1">Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {campaigns.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Campaign Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{campaign.name}</h4>
                      <Badge variant="outline">{campaign.channel}</Badge>
                      <Badge>{campaign.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Audience: {campaign.audience}</p>
                    <p className="text-xs text-muted-foreground mt-2">Sends: {campaign.sends} • Opens: {campaign.opens} • Clicks: {campaign.clicks}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    {campaign.status === 'draft' && (
                      <Button size="sm" onClick={() => launchCampaign(campaign.id)}>
                        <Rocket className="h-4 w-4 mr-1" />
                        Launch
                      </Button>
                    )}
                    {campaign.status === 'active' && (
                      <Button size="sm" variant="outline" onClick={() => completeCampaign(campaign.id)}>
                        Complete
                      </Button>
                    )}
                    <Button size="sm" variant="destructive" onClick={() => removeCampaign(campaign.id)}>
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
  )
}
