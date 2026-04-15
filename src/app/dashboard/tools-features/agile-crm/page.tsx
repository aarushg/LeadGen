'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Plus, Trash2, UserRound, Workflow } from 'lucide-react'
import { toast } from 'sonner'
import { loadToolState, saveToolState, trackToolEvent } from '@/lib/tool-state-client'

interface Contact {
  id: string
  name: string
  email: string
  stage: 'new' | 'qualified' | 'proposal' | 'won'
  owner: string
}

interface ContactForm {
  name: string
  email: string
  owner: string
}

const TOOL_ID = 'agile-crm'

export default function AgileCrmPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [form, setForm] = useState<ContactForm>({ name: '', email: '', owner: '' })
  const [search, setSearch] = useState('')

  useEffect(() => {
    let cancelled = false
    async function restore() {
      const state = await loadToolState<{ contacts: Contact[] }>(TOOL_ID)
      if (!cancelled && state?.contacts) {
        setContacts(state.contacts)
      }
    }
    restore()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    void saveToolState(TOOL_ID, { contacts })
  }, [contacts])

  function addContact() {
    if (!form.name.trim() || !form.email.trim() || !form.owner.trim()) {
      toast.error('Provide name, email, and owner')
      return
    }

    const contact: Contact = {
      id: `contact-${Date.now()}`,
      name: form.name.trim(),
      email: form.email.trim(),
      owner: form.owner.trim(),
      stage: 'new',
    }

    setContacts([contact, ...contacts])
    setForm({ name: '', email: '', owner: '' })
    void trackToolEvent(TOOL_ID, 'contact_created')
    toast.success('Contact added to Agile CRM board')
  }

  function advanceStage(id: string) {
    const stageOrder: Contact['stage'][] = ['new', 'qualified', 'proposal', 'won']

    setContacts(
      contacts.map(contact => {
        if (contact.id !== id) return contact
        const current = stageOrder.indexOf(contact.stage)
        const nextStage = stageOrder[Math.min(current + 1, stageOrder.length - 1)]
        if (nextStage !== contact.stage) {
          void trackToolEvent(TOOL_ID, 'stage_advanced', { from: contact.stage, to: nextStage })
        }
        return { ...contact, stage: nextStage }
      })
    )
  }

  function removeContact(id: string) {
    setContacts(contacts.filter(contact => contact.id !== id))
    void trackToolEvent(TOOL_ID, 'contact_deleted')
    toast.success('Contact removed')
  }

  const filtered = useMemo(() => {
    const normalized = search.toLowerCase().trim()
    if (!normalized) return contacts
    return contacts.filter(contact =>
      [contact.name, contact.email, contact.owner, contact.stage].some(field =>
        field.toLowerCase().includes(normalized)
      )
    )
  }, [contacts, search])

  const stageCounts = {
    new: contacts.filter(c => c.stage === 'new').length,
    qualified: contacts.filter(c => c.stage === 'qualified').length,
    proposal: contacts.filter(c => c.stage === 'proposal').length,
    won: contacts.filter(c => c.stage === 'won').length,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Agile CRM - Contact and Pipeline Manager</h1>
        <p className="text-muted-foreground mt-2">
          Manage contact lifecycle from first touch to closed won with lightweight automation
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardContent className="pt-4"><p className="text-sm text-muted-foreground">New</p><p className="text-2xl font-bold">{stageCounts.new}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-sm text-muted-foreground">Qualified</p><p className="text-2xl font-bold">{stageCounts.qualified}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-sm text-muted-foreground">Proposal</p><p className="text-2xl font-bold">{stageCounts.proposal}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-sm text-muted-foreground">Won</p><p className="text-2xl font-bold">{stageCounts.won}</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><UserRound className="h-5 w-5" />Add Contact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label>Name</Label>
              <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Maya Carter" />
            </div>
            <div>
              <Label>Email</Label>
              <Input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="maya@acme.com" />
            </div>
            <div>
              <Label>Owner</Label>
              <Input value={form.owner} onChange={e => setForm({ ...form, owner: e.target.value })} placeholder="Account Executive" />
            </div>
          </div>
          <Button onClick={addContact} className="w-full"><Plus className="h-4 w-4 mr-2" />Create Contact</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2"><Workflow className="h-5 w-5" />Pipeline Contacts</span>
            <Input className="w-64" placeholder="Search contacts" value={search} onChange={e => setSearch(e.target.value)} />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {filtered.length === 0 && <p className="text-sm text-muted-foreground">No contacts found.</p>}
          {filtered.map(contact => (
            <div key={contact.id} className="border rounded-lg p-4 flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{contact.name}</p>
                <p className="text-sm text-muted-foreground">{contact.email}</p>
                <div className="flex gap-2 mt-2">
                  <Badge variant="outline">Owner: {contact.owner}</Badge>
                  <Badge>{contact.stage}</Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => advanceStage(contact.id)} disabled={contact.stage === 'won'}>
                  Advance
                </Button>
                <Button size="sm" variant="destructive" onClick={() => removeContact(contact.id)}>
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
