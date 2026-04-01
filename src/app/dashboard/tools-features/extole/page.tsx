'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Gift, Plus, Users, Trophy, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { loadToolState, saveToolState, trackToolEvent } from '@/lib/tool-state-client'

interface ReferralProgram {
  id: string
  name: string
  rewardType: 'cash' | 'discount' | 'credits'
  rewardValue: number
  inviteGoal: number
  status: 'draft' | 'active' | 'paused'
  advocates: number
  referrals: number
  conversions: number
  createdAt: string
}

interface Advocate {
  id: string
  name: string
  email: string
  referrals: number
  conversions: number
  rewardEarned: number
}

interface ReferralProgramFormData {
  name: string
  rewardType: ReferralProgram['rewardType']
  rewardValue: number
  inviteGoal: number
}

export default function ExtolePage() {
  const TOOL_ID = 'extole'
  const [programs, setPrograms] = useState<ReferralProgram[]>([])
  const [advocates, setAdvocates] = useState<Advocate[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<ReferralProgramFormData>({
    name: '',
    rewardType: 'cash',
    rewardValue: 25,
    inviteGoal: 10,
  })

  useEffect(() => {
    let cancelled = false
    async function restore() {
      const state = await loadToolState<{ programs: ReferralProgram[]; advocates: Advocate[] }>(TOOL_ID)
      if (!cancelled && state) {
        setPrograms(state.programs ?? [])
        setAdvocates(state.advocates ?? [])
      }
    }
    restore()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    void saveToolState(TOOL_ID, { programs, advocates })
  }, [programs, advocates])

  function createProgram() {
    if (!form.name || form.rewardValue <= 0 || form.inviteGoal <= 0) {
      toast.error('Enter valid program details')
      return
    }

    const program: ReferralProgram = {
      id: `prog-${Date.now()}`,
      name: form.name,
      rewardType: form.rewardType,
      rewardValue: form.rewardValue,
      inviteGoal: form.inviteGoal,
      status: 'draft',
      advocates: 0,
      referrals: 0,
      conversions: 0,
      createdAt: new Date().toISOString(),
    }

    setPrograms([program, ...programs])
    setShowForm(false)
    setForm({ name: '', rewardType: 'cash', rewardValue: 25, inviteGoal: 10 })
    void trackToolEvent(TOOL_ID, 'program_created')
    toast.success('Referral program created')
  }

  function launchProgram(id: string) {
    const seededAdvocates: Advocate[] = [
      {
        id: `adv-${Date.now()}-1`,
        name: 'Taylor Morgan',
        email: 'taylor@example.com',
        referrals: 4,
        conversions: 2,
        rewardEarned: 50,
      },
      {
        id: `adv-${Date.now()}-2`,
        name: 'Jordan Lee',
        email: 'jordan@example.com',
        referrals: 7,
        conversions: 3,
        rewardEarned: 75,
      },
    ]

    setPrograms(
      programs.map(program =>
        program.id === id
          ? {
              ...program,
              status: 'active',
              advocates: seededAdvocates.length,
              referrals: seededAdvocates.reduce((acc, a) => acc + a.referrals, 0),
              conversions: seededAdvocates.reduce((acc, a) => acc + a.conversions, 0),
            }
          : program
      )
    )
    setAdvocates(prev => [...seededAdvocates, ...prev])
    void trackToolEvent(TOOL_ID, 'program_launched')
    toast.success('Program launched with advocate tracking')
  }

  function pauseProgram(id: string) {
    setPrograms(programs.map(p => (p.id === id ? { ...p, status: 'paused' } : p)))
    void trackToolEvent(TOOL_ID, 'program_paused')
    toast.success('Program paused')
  }

  function deleteProgram(id: string) {
    setPrograms(programs.filter(p => p.id !== id))
    void trackToolEvent(TOOL_ID, 'program_deleted')
    toast.success('Program deleted')
  }

  const totalAdvocates = programs.reduce((acc, p) => acc + p.advocates, 0)
  const totalReferrals = programs.reduce((acc, p) => acc + p.referrals, 0)
  const totalConversions = programs.reduce((acc, p) => acc + p.conversions, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Extole - Referral and Advocacy Platform</h1>
        <p className="text-muted-foreground mt-2">Create referral programs and track advocate performance</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Programs</p>
            <p className="text-2xl font-bold">{programs.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Advocates</p>
            <p className="text-2xl font-bold">{totalAdvocates}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Referrals</p>
            <p className="text-2xl font-bold">{totalReferrals}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Conversions</p>
            <p className="text-2xl font-bold">{totalConversions}</p>
          </CardContent>
        </Card>
      </div>

      {!showForm ? (
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Referral Program
        </Button>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>New Program</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Program Name</Label>
              <Input
                placeholder="Customer Referral Program"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label>Reward Type</Label>
                <select
                  className="w-full px-3 py-2 border rounded-md"
                  value={form.rewardType}
                  onChange={e =>
                    setForm({ ...form, rewardType: e.target.value as 'cash' | 'discount' | 'credits' })
                  }
                >
                  <option value="cash">Cash</option>
                  <option value="discount">Discount</option>
                  <option value="credits">Credits</option>
                </select>
              </div>
              <div>
                <Label>Reward Value</Label>
                <Input
                  type="number"
                  min="1"
                  value={form.rewardValue}
                  onChange={e => setForm({ ...form, rewardValue: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label>Invite Goal</Label>
                <Input
                  type="number"
                  min="1"
                  value={form.inviteGoal}
                  onChange={e => setForm({ ...form, inviteGoal: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={createProgram} className="flex-1">Create</Button>
              <Button variant="outline" onClick={() => setShowForm(false)} className="flex-1">Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {programs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5" />
              Referral Programs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {programs.map(program => (
              <div key={program.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{program.name}</h4>
                      <Badge variant="outline">{program.rewardType}</Badge>
                      <Badge>{program.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Reward: {program.rewardValue} • Goal: {program.inviteGoal} invites
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Advocates: {program.advocates} • Referrals: {program.referrals} • Conversions: {program.conversions}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    {program.status === 'draft' && (
                      <Button size="sm" onClick={() => launchProgram(program.id)}>Launch</Button>
                    )}
                    {program.status === 'active' && (
                      <Button size="sm" variant="outline" onClick={() => pauseProgram(program.id)}>Pause</Button>
                    )}
                    <Button size="sm" variant="destructive" onClick={() => deleteProgram(program.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {advocates.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Top Advocates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {advocates.slice(0, 8).map(adv => (
              <div key={adv.id} className="border rounded p-3 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm">{adv.name}</p>
                  <p className="text-xs text-muted-foreground">{adv.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{adv.referrals} referrals</p>
                  <p className="text-xs text-muted-foreground">{adv.conversions} conversions • {adv.rewardEarned} earned</p>
                </div>
                <Trophy className="h-4 w-4 text-amber-500" />
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
