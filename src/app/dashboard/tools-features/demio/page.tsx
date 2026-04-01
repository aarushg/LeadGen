'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit2, Trash2, Users, Calendar, Play } from 'lucide-react'
import { toast } from 'sonner'
import { loadToolState, saveToolState, trackToolEvent } from '@/lib/tool-state-client'

interface Webinar {
  id: string
  title: string
  description: string
  date: string
  time: string
  duration: number
  host: string
  registrations: number
  status: 'draft' | 'scheduled' | 'live' | 'completed'
  attendees: number
  recordingURL?: string
}

export default function DemioPage() {
  const TOOL_ID = 'demio'
  const [webinars, setWebinars] = useState<Webinar[]>([])
  const [showCreate, setShowCreate] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    duration: 60,
    host: '',
  })

  useEffect(() => {
    let cancelled = false
    async function restore() {
      const state = await loadToolState<{ webinars: Webinar[] }>(TOOL_ID)
      if (!cancelled && state?.webinars) {
        setWebinars(state.webinars)
      }
    }
    restore()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    void saveToolState(TOOL_ID, { webinars })
  }, [webinars])

  function saveWebinar() {
    if (!formData.title || !formData.date || !formData.time || !formData.host) {
      toast.error('Fill in all required fields')
      return
    }

    if (editingId) {
      setWebinars(
        webinars.map(w =>
          w.id === editingId
            ? {
                ...w,
                title: formData.title,
                description: formData.description,
                date: formData.date,
                time: formData.time,
                duration: formData.duration,
                host: formData.host,
              }
            : w
        )
      )
      setEditingId(null)
      toast.success('Webinar updated')
    } else {
      const newWebinar: Webinar = {
        id: `webinar-${Date.now()}`,
        title: formData.title,
        description: formData.description,
        date: formData.date,
        time: formData.time,
        duration: formData.duration,
        host: formData.host,
        registrations: 0,
        status: 'draft',
        attendees: 0,
      }
      setWebinars([newWebinar, ...webinars])
      toast.success('Webinar created')
    }
    resetForm()
  }

  function resetForm() {
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      duration: 60,
      host: '',
    })
    setShowCreate(false)
    setEditingId(null)
  }

  function editWebinar(webinar: Webinar) {
    setFormData({
      title: webinar.title,
      description: webinar.description,
      date: webinar.date,
      time: webinar.time,
      duration: webinar.duration,
      host: webinar.host,
    })
    setEditingId(webinar.id)
    setShowCreate(true)
  }

  function deleteWebinar(id: string) {
    setWebinars(webinars.filter(w => w.id !== id))
    toast.success('Webinar deleted')
  }

  function startWebinar(id: string) {
    setWebinars(
      webinars.map(w =>
        w.id === id
          ? { ...w, status: 'live' as const, attendees: Math.floor(w.registrations * 0.7) }
          : w
      )
    )
    void trackToolEvent(TOOL_ID, 'webinar_live')
    toast.success('Webinar started - Going live!')
  }

  function endWebinar(id: string) {
    setWebinars(
      webinars.map(w =>
        w.id === id
          ? {
              ...w,
              status: 'completed' as const,
              recordingURL: `https://demio.com/recordings/${id}`,
            }
          : w
      )
    )
    void trackToolEvent(TOOL_ID, 'webinar_completed')
    toast.success('Webinar completed - Recording saved')
  }

  function registerForWebinar(id: string) {
    setWebinars(
      webinars.map(w =>
        w.id === id ? { ...w, registrations: w.registrations + 1 } : w
      )
    )
    toast.success('Registered for webinar!')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Demio - Webinar Scheduler</h1>
        <p className="text-muted-foreground mt-2">Schedule and host interactive webinars</p>
      </div>

      {!showCreate ? (
        <Button onClick={() => setShowCreate(true)} className="w-full md:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Schedule Webinar
        </Button>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Edit' : 'Schedule'} Webinar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Webinar Title</Label>
                <Input
                  placeholder="Lead Generation Masterclass"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div>
                <Label>Host Name</Label>
                <Input
                  placeholder="Your Name"
                  value={formData.host}
                  onChange={e => setFormData({ ...formData, host: e.target.value })}
                />
              </div>

              <div>
                <Label>Date</Label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                />
              </div>

              <div>
                <Label>Start Time</Label>
                <Input
                  type="time"
                  value={formData.time}
                  onChange={e => setFormData({ ...formData, time: e.target.value })}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Duration (minutes)</Label>
                <Input
                  type="number"
                  min="30"
                  max="240"
                  value={formData.duration}
                  onChange={e => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                placeholder="Learn proven strategies for generating high-quality leads..."
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={saveWebinar} className="flex-1">
                {editingId ? 'Update' : 'Schedule'} Webinar
              </Button>
              <Button variant="outline" onClick={resetForm} className="flex-1">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {webinars.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">My Webinars</h2>
            <p className="text-sm text-muted-foreground">
              {webinars.length} webinars • {webinars.reduce((acc, w) => acc + w.registrations, 0)} total registrations
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {webinars.map(webinar => (
              <Card key={webinar.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="line-clamp-1">{webinar.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">by {webinar.host}</p>
                    </div>
                    <Badge
                      variant={
                        webinar.status === 'live'
                          ? 'default'
                          : webinar.status === 'completed'
                            ? 'secondary'
                            : 'outline'
                      }
                    >
                      {webinar.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm line-clamp-2">{webinar.description}</p>

                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground text-xs">Date</p>
                      <p className="font-semibold">{new Date(webinar.date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Time</p>
                      <p className="font-semibold">{webinar.time}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Duration</p>
                      <p className="font-semibold">{webinar.duration} min</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm bg-muted/50 p-2 rounded">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <div>
                        <p className="text-xs text-muted-foreground">Registrations</p>
                        <p className="font-semibold">{webinar.registrations}</p>
                      </div>
                    </div>
                    {webinar.status === 'live' && (
                      <div className="flex items-center gap-2">
                        <Play className="h-4 w-4 text-green-500" />
                        <div>
                          <p className="text-xs text-muted-foreground">Live Now</p>
                          <p className="font-semibold">{webinar.attendees} attending</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {webinar.status === 'completed' && webinar.recordingURL && (
                    <div className="bg-blue-50 p-2 rounded text-sm">
                      <p className="text-muted-foreground">Recording available</p>
                      <a href={webinar.recordingURL} className="text-blue-600 hover:underline font-semibold">
                        Watch Recording →
                      </a>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                    {webinar.status === 'draft' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => editWebinar(webinar)}
                        >
                          <Edit2 className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteWebinar(webinar.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </>
                    )}

                    {webinar.status === 'scheduled' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => startWebinar(webinar.id)}
                        >
                          <Play className="h-4 w-4 mr-1" />
                          Go Live
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteWebinar(webinar.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                      </>
                    )}

                    {webinar.status === 'live' && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => endWebinar(webinar.id)}
                        className="col-span-2"
                      >
                        End Webinar
                      </Button>
                    )}

                    {webinar.status === 'completed' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteWebinar(webinar.id)}
                        className="col-span-2"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {webinars.length === 0 && !showCreate && (
        <Card>
          <CardContent className="pt-8 pb-8 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No webinars scheduled yet</p>
            <p className="text-sm text-muted-foreground mt-1">Create your first webinar to get started</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
