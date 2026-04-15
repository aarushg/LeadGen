'use client'

import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type ManagedRole = 'nurse' | 'lawyer' | 'dreamer'

type AppUser = {
  id: string
  email: string
  full_name: string
  role: 'admin' | ManagedRole
  managed_by_admin_id?: string
}

type ClientAccount = {
  id: string
  name: string
  assigned_user_ids: string[]
}

export default function AdminPage() {
  const [users, setUsers] = useState<AppUser[]>([])
  const [clients, setClients] = useState<ClientAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [forbidden, setForbidden] = useState(false)

  const [newUserEmail, setNewUserEmail] = useState('')
  const [newUserFullName, setNewUserFullName] = useState('')
  const [newUserRole, setNewUserRole] = useState<ManagedRole>('nurse')
  const [creatingUser, setCreatingUser] = useState(false)

  const [newClientName, setNewClientName] = useState('')
  const [newClientAssignedUserIds, setNewClientAssignedUserIds] = useState<string[]>([])
  const [creatingClient, setCreatingClient] = useState(false)

  const [selectedClientId, setSelectedClientId] = useState('')
  const [editAssignedUserIds, setEditAssignedUserIds] = useState<string[]>([])
  const [savingAssignments, setSavingAssignments] = useState(false)

  const managedUsers = useMemo(() => users.filter((u) => u.role !== 'admin'), [users])

  async function loadAdminData() {
    setLoading(true)
    try {
      const [usersRes, clientsRes] = await Promise.all([
        fetch('/api/admin/users', { cache: 'no-store' }),
        fetch('/api/admin/clients', { cache: 'no-store' }),
      ])

      if (usersRes.status === 403 || clientsRes.status === 403) {
        setForbidden(true)
        return
      }

      if (!usersRes.ok || !clientsRes.ok) {
        throw new Error('Failed to load admin data')
      }

      const usersData = await usersRes.json()
      const clientsData = await clientsRes.json()
      setUsers(usersData.users ?? [])
      setClients(clientsData.clients ?? [])
    } catch {
      toast.error('Could not load admin data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAdminData()
  }, [])

  useEffect(() => {
    if (!selectedClientId) return
    const selected = clients.find((client) => client.id === selectedClientId)
    setEditAssignedUserIds(selected?.assigned_user_ids ?? [])
  }, [selectedClientId, clients])

  function toggleId(list: string[], id: string) {
    return list.includes(id) ? list.filter((item) => item !== id) : [...list, id]
  }

  async function createUser() {
    if (!newUserEmail.trim() || !newUserFullName.trim()) {
      toast.error('Name and email are required')
      return
    }

    setCreatingUser(true)
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newUserEmail,
          fullName: newUserFullName,
          role: newUserRole,
        }),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error ?? 'Failed to create user')

      toast.success('Managed user created')
      setNewUserEmail('')
      setNewUserFullName('')
      setNewUserRole('nurse')
      await loadAdminData()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create user')
    } finally {
      setCreatingUser(false)
    }
  }

  async function createClient() {
    if (!newClientName.trim()) {
      toast.error('Client name is required')
      return
    }

    setCreatingClient(true)
    try {
      const res = await fetch('/api/admin/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newClientName,
          assignedUserIds: newClientAssignedUserIds,
        }),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error ?? 'Failed to create client')

      toast.success('Client created')
      setNewClientName('')
      setNewClientAssignedUserIds([])
      await loadAdminData()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create client')
    } finally {
      setCreatingClient(false)
    }
  }

  async function saveClientAssignments() {
    if (!selectedClientId) {
      toast.error('Select a client first')
      return
    }

    setSavingAssignments(true)
    try {
      const res = await fetch('/api/admin/clients', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: selectedClientId,
          assignedUserIds: editAssignedUserIds,
        }),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error ?? 'Failed to update assignments')

      toast.success('Client assignments updated')
      await loadAdminData()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update assignments')
    } finally {
      setSavingAssignments(false)
    }
  }

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading admin workspace...</p>
  }

  if (forbidden) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Admin Workspace</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            You do not have admin access for this workspace.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Workspace</h1>
        <p className="text-muted-foreground">Create managed users, create clients, and assign users to clients.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Create Managed User</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-user-name">Full Name</Label>
              <Input
                id="new-user-name"
                value={newUserFullName}
                onChange={(e) => setNewUserFullName(e.target.value)}
                placeholder="Jane Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-user-email">Email</Label>
              <Input
                id="new-user-email"
                type="email"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                placeholder="jane@agency.com"
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={newUserRole} onValueChange={(value) => setNewUserRole(value as ManagedRole)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nurse">Nurse</SelectItem>
                  <SelectItem value="lawyer">Lawyer</SelectItem>
                  <SelectItem value="dreamer">Dreamer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full" onClick={createUser} disabled={creatingUser}>
              {creatingUser ? 'Creating user...' : 'Create User'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Create Client</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-client-name">Client Name</Label>
              <Input
                id="new-client-name"
                value={newClientName}
                onChange={(e) => setNewClientName(e.target.value)}
                placeholder="Acme Corporation"
              />
            </div>
            <div className="space-y-2">
              <Label>Assign Users</Label>
              <div className="space-y-2 rounded-md border p-3 max-h-44 overflow-auto">
                {managedUsers.length === 0 ? (
                  <p className="text-xs text-muted-foreground">Create a user first.</p>
                ) : (
                  managedUsers.map((user) => (
                    <label key={user.id} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={newClientAssignedUserIds.includes(user.id)}
                        onChange={() => setNewClientAssignedUserIds((prev) => toggleId(prev, user.id))}
                      />
                      <span>{user.full_name} ({user.email})</span>
                    </label>
                  ))
                )}
              </div>
            </div>
            <Button className="w-full" onClick={createClient} disabled={creatingClient}>
              {creatingClient ? 'Creating client...' : 'Create Client'}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Manage Client Assignments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Client</Label>
            <Select value={selectedClientId} onValueChange={setSelectedClientId}>
              <SelectTrigger>
                <SelectValue placeholder="Select client" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Assigned Users</Label>
            <div className="space-y-2 rounded-md border p-3 max-h-56 overflow-auto">
              {managedUsers.length === 0 ? (
                <p className="text-xs text-muted-foreground">No managed users yet.</p>
              ) : (
                managedUsers.map((user) => (
                  <label key={user.id} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={editAssignedUserIds.includes(user.id)}
                      onChange={() => setEditAssignedUserIds((prev) => toggleId(prev, user.id))}
                    />
                    <span>{user.full_name} ({user.email})</span>
                  </label>
                ))
              )}
            </div>
          </div>

          <Button onClick={saveClientAssignments} disabled={savingAssignments || !selectedClientId}>
            {savingAssignments ? 'Saving...' : 'Save Assignments'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
