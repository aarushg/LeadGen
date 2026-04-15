'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { ListPlus, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { loadToolState, saveToolState, trackToolEvent } from '@/lib/tool-state-client'

interface SumoCampaign {
  id: string
  name: string
  formType: 'popup' | 'welcome-mat' | 'smart-bar'
  trigger: 'exit-intent' | 'time-delay' | 'scroll-depth'
  status: 'draft' | 'live'
  submissions: number
}

const TOOL_ID = 'sumo'

export default function SumoPage() {
  const [campaigns, setCampaigns] = useState<SumoCampaign[]>([])
  const [name, setName] = useState('')
  const [formType, setFormType] = useState<SumoCampaign['formType']>('popup')
  const [trigger, setTrigger] = useState<SumoCampaign['trigger']>('exit-intent')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    let cancelled = false
    async function restore() {
      const state = await loadToolState<{ campaigns: SumoCampaign[] }>(TOOL_ID)
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
    if (!name.trim()) {
      toast.error('Campaign name is required')
      return
    }

    const campaign: SumoCampaign = {
      id: `sumo-${Date.now()}`,
      name: name.trim(),
      formType,
      trigger,
      status: 'draft',
      submissions: 0,
    }

    setCampaigns([campaign, ...campaigns])
    setName('')
    void trackToolEvent(TOOL_ID, 'campaign_created')
    toast.success('List-building campaign created')
  }

  function launchCampaign(id: string) {
    setCampaigns(
      campaigns.map(campaign =>
        campaign.id === id
          ? {
              ...campaign,
              status: 'live',
              submissions: campaign.submissions + Math.floor(Math.random() * 18) + 3,
            }
          : campaign
      )
    )
    void trackToolEvent(TOOL_ID, 'campaign_launched')
    toast.success('Campaign is now live')
  }

  function deleteCampaign(id: string) {
    setCampaigns(campaigns.filter(campaign => campaign.id !== id))
    void trackToolEvent(TOOL_ID, 'campaign_deleted')
    toast.success('Campaign deleted')
  }

  const visibleCampaigns = useMemo(() => {
    const normalized = filter.toLowerCase().trim()
    if (!normalized) return campaigns
    return campaigns.filter(campaign =>
      [campaign.name, campaign.formType, campaign.trigger, campaign.status].some(value =>
        value.toLowerCase().includes(normalized)
      )
    )
  }, [campaigns, filter])

  const totalSubmissions = campaigns.reduce((sum, campaign) => sum + campaign.submissions, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Sumo - List Building and Popups</h1>
        <p className="text-muted-foreground mt-2">
          Build high-converting website forms and launch lead capture experiences with trigger control
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardContent className="pt-4"><p className="text-sm text-muted-foreground">Campaigns</p><p className="text-2xl font-bold">{campaigns.length}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-sm text-muted-foreground">Live</p><p className="text-2xl font-bold">{campaigns.filter(c => c.status === 'live').length}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-sm text-muted-foreground">Submissions</p><p className="text-2xl font-bold">{totalSubmissions}</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Create Sumo Campaign</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label>Campaign Name</Label>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="Newsletter Exit Capture" />
            </div>
            <div>
              <Label>Form Type</Label>
              <select className="w-full px-3 py-2 border rounded-md" value={formType} onChange={e => setFormType(e.target.value as SumoCampaign['formType'])}>
                <option value="popup">popup</option>
                <option value="welcome-mat">welcome-mat</option>
                <option value="smart-bar">smart-bar</option>
              </select>
            </div>
            <div>
              <Label>Trigger</Label>
              <select className="w-full px-3 py-2 border rounded-md" value={trigger} onChange={e => setTrigger(e.target.value as SumoCampaign['trigger'])}>
                <option value="exit-intent">exit-intent</option>
                <option value="time-delay">time-delay</option>
                <option value="scroll-depth">scroll-depth</option>
              </select>
            </div>
          </div>
          <Button onClick={createCampaign} className="w-full"><Plus className="h-4 w-4 mr-2" />Create Campaign</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2"><ListPlus className="h-5 w-5" />Campaign Queue</span>
            <Input className="w-64" placeholder="Filter campaigns" value={filter} onChange={e => setFilter(e.target.value)} />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {visibleCampaigns.length === 0 && <p className="text-sm text-muted-foreground">No campaigns yet.</p>}
          {visibleCampaigns.map(campaign => (
            <div key={campaign.id} className="border rounded-lg p-4 flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{campaign.name}</p>
                <p className="text-sm text-muted-foreground">Type: {campaign.formType} | Trigger: {campaign.trigger}</p>
                <div className="flex gap-2 mt-2">
                  <Badge>{campaign.status}</Badge>
                  <Badge variant="outline">Submissions: {campaign.submissions}</Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => launchCampaign(campaign.id)} disabled={campaign.status === 'live'}>
                  Launch
                </Button>
                <Button size="sm" variant="destructive" onClick={() => deleteCampaign(campaign.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
