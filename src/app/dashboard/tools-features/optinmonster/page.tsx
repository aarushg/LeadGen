'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit2, Trash2, Eye, Code } from 'lucide-react'
import { toast } from 'sonner'
import { loadToolState, saveToolState } from '@/lib/tool-state-client'

interface FormField {
  id: string
  name: string
  type: 'text' | 'email' | 'phone' | 'checkbox' | 'textarea'
  required: boolean
}

interface OptinForm {
  id: string
  name: string
  title: string
  description: string
  fields: FormField[]
  submitButtonText: string
  type: 'popup' | 'inline' | 'slide-in'
  conversions: number
  createdAt: string
}

export default function OptinMonsterPage() {
  const TOOL_ID = 'optinmonster'
  const [forms, setForms] = useState<OptinForm[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    description: '',
    submitButtonText: 'Get Instant Access',
    type: 'popup' as any,
    fields: [{ id: '1', name: 'Email', type: 'email' as any, required: true }],
  })

  useEffect(() => {
    let cancelled = false
    async function restore() {
      const state = await loadToolState<{ forms: OptinForm[] }>(TOOL_ID)
      if (!cancelled && state?.forms) {
        setForms(state.forms)
      }
    }
    restore()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    void saveToolState(TOOL_ID, { forms })
  }, [forms])

  function saveForm() {
    if (!formData.name || !formData.title || formData.fields.length === 0) {
      toast.error('Fill in all required fields')
      return
    }

    if (editingId) {
      setForms(
        forms.map(f =>
          f.id === editingId
            ? {
                ...f,
                name: formData.name,
                title: formData.title,
                description: formData.description,
                fields: formData.fields,
                submitButtonText: formData.submitButtonText,
                type: formData.type,
              }
            : f
        )
      )
      setEditingId(null)
      toast.success('Form updated')
    } else {
      const newForm: OptinForm = {
        id: `form-${Date.now()}`,
        name: formData.name,
        title: formData.title,
        description: formData.description,
        fields: formData.fields,
        submitButtonText: formData.submitButtonText,
        type: formData.type,
        conversions: 0,
        createdAt: new Date().toISOString(),
      }
      setForms([newForm, ...forms])
      toast.success('Form created')
    }
    resetForm()
  }

  function resetForm() {
    setFormData({
      name: '',
      title: '',
      description: '',
      submitButtonText: 'Get Instant Access',
      type: 'popup',
      fields: [{ id: '1', name: 'Email', type: 'email', required: true }],
    })
    setShowForm(false)
    setEditingId(null)
  }

  function addField() {
    setFormData({
      ...formData,
      fields: [
        ...formData.fields,
        {
          id: `field-${Date.now()}`,
          name: 'Field Name',
          type: 'text',
          required: false,
        },
      ],
    })
  }

  function removeField(id: string) {
    setFormData({
      ...formData,
      fields: formData.fields.filter(f => f.id !== id),
    })
  }

  function updateField(id: string, updates: Partial<FormField>) {
    setFormData({
      ...formData,
      fields: formData.fields.map(f => (f.id === id ? { ...f, ...updates } : f)),
    })
  }

  function deleteForm(id: string) {
    setForms(forms.filter(f => f.id !== id))
    toast.success('Form deleted')
  }

  function editForm(form: OptinForm) {
    setFormData({
      name: form.name,
      title: form.title,
      description: form.description,
      fields: form.fields,
      submitButtonText: form.submitButtonText,
      type: form.type,
    })
    setEditingId(form.id)
    setShowForm(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">OptinMonster - Form Builder</h1>
        <p className="text-muted-foreground mt-2">Create high-converting opt-in forms and pop-ups</p>
      </div>

      {!showForm ? (
        <Button onClick={() => setShowForm(true)} className="w-full md:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Create Form
        </Button>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Edit' : 'Create'} Form</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Form Name</Label>
                <Input
                  placeholder="Lead Magnet Form"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <Label>Display Type</Label>
                <select
                  className="w-full px-3 py-2 border rounded-md"
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                >
                  <option value="popup">Popup</option>
                  <option value="inline">Inline</option>
                  <option value="slide-in">Slide In</option>
                </select>
              </div>
            </div>

            <div>
              <Label>Form Title</Label>
              <Input
                placeholder="Get Your Free Guide"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                placeholder="Enter your email to download..."
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div>
              <Label>Button Text</Label>
              <Input
                placeholder="Get Instant Access"
                value={formData.submitButtonText}
                onChange={e => setFormData({ ...formData, submitButtonText: e.target.value })}
              />
            </div>

            {/* Form Fields */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="font-semibold">Form Fields</p>
                <Button variant="outline" size="sm" onClick={addField}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Field
                </Button>
              </div>

              {formData.fields.map((field, idx) => (
                <div key={field.id} className="p-3 border rounded-lg space-y-2 bg-muted/50">
                  <div className="grid gap-2 md:grid-cols-3">
                    <Input
                      placeholder="Field name"
                      value={field.name}
                      onChange={e => updateField(field.id, { name: e.target.value })}
                    />
                    <select
                      className="px-3 py-2 border rounded-md"
                      value={field.type}
                      onChange={e => updateField(field.id, { type: e.target.value as any })}
                    >
                      <option value="text">Text</option>
                      <option value="email">Email</option>
                      <option value="phone">Phone</option>
                      <option value="textarea">Textarea</option>
                      <option value="checkbox">Checkbox</option>
                    </select>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeField(field.id)}
                      disabled={formData.fields.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={field.required}
                      onChange={e => updateField(field.id, { required: e.target.checked })}
                    />
                    Required
                  </label>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Button onClick={saveForm} className="flex-1">
                {editingId ? 'Update' : 'Create'} Form
              </Button>
              <Button variant="outline" onClick={resetForm} className="flex-1">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {forms.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>My Forms ({forms.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {forms.map(form => (
              <div key={form.id} className="border rounded-lg p-4 hover:bg-muted/50">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{form.name}</h4>
                      <Badge variant="outline">{form.type}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{form.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {form.fields.length} fields • {form.conversions} conversions
                    </p>
                  </div>

                  <div className="flex gap-2 flex-col">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => editForm(form)}
                    >
                      <Edit2 className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteForm(form.id)}
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
