'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Send, Settings, Plus, Trash2, MessageCircle, Users } from 'lucide-react'
import { toast } from 'sonner'
import { loadToolState, saveToolState } from '@/lib/tool-state-client'

interface ChatMessage {
  id: string
  senderType: 'visitor' | 'agent'
  senderName: string
  message: string
  timestamp: string
  read: boolean
}

interface Conversation {
  id: string
  visitorName: string
  visitorEmail: string
  status: 'active' | 'waiting' | 'closed'
  messages: ChatMessage[]
  createdAt: string
  lastMessageTime: string
}

interface AutoResponse {
  id: string
  trigger: string
  message: string
}

export default function IntercomPage() {
  const TOOL_ID = 'intercom'
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messageInput, setMessageInput] = useState('')
  const [showAutoResponseSettings, setShowAutoResponseSettings] = useState(false)
  const [autoResponses, setAutoResponses] = useState<AutoResponse[]>([
    {
      id: '1',
      trigger: 'hello',
      message: 'Thanks for reaching out! A team member will respond shortly.',
    },
  ])
  const [newAutoResponse, setNewAutoResponse] = useState({ trigger: '', message: '' })
  const [showCreateConversation, setShowCreateConversation] = useState(false)
  const [newVisitor, setNewVisitor] = useState({ name: '', email: '' })
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    let cancelled = false
    async function restore() {
      const state = await loadToolState<{
        conversations: Conversation[]
        autoResponses: AutoResponse[]
      }>(TOOL_ID)

      if (!cancelled) {
        if (state?.conversations) setConversations(state.conversations)
        if (state?.autoResponses) setAutoResponses(state.autoResponses)
      }
    }
    restore()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    void saveToolState(TOOL_ID, { conversations, autoResponses })
  }, [conversations, autoResponses])

  useEffect(() => {
    scrollToBottom()
  }, [selectedConversation, conversations])

  const selected = selectedConversation
    ? conversations.find(c => c.id === selectedConversation)
    : null

  function createConversation() {
    if (!newVisitor.name || !newVisitor.email) {
      toast.error('Enter visitor name and email')
      return
    }

    const conversation: Conversation = {
      id: `conv-${Date.now()}`,
      visitorName: newVisitor.name,
      visitorEmail: newVisitor.email,
      status: 'active',
      messages: [
        {
          id: `msg-${Date.now()}`,
          senderType: 'visitor',
          senderName: newVisitor.name,
          message: 'Hi, I have a question about your product',
          timestamp: new Date().toISOString(),
          read: false,
        },
      ],
      createdAt: new Date().toISOString(),
      lastMessageTime: new Date().toISOString(),
    }

    setConversations([conversation, ...conversations])
    setSelectedConversation(conversation.id)
    setNewVisitor({ name: '', email: '' })
    setShowCreateConversation(false)
    toast.success('Conversation started')
  }

  function sendMessage() {
    if (!selectedConversation || !messageInput.trim()) {
      toast.error('Select a conversation and enter a message')
      return
    }

    setConversations(
      conversations.map(c => {
        if (c.id === selectedConversation) {
          const newMessage: ChatMessage = {
            id: `msg-${Date.now()}`,
            senderType: 'agent',
            senderName: 'You',
            message: messageInput,
            timestamp: new Date().toISOString(),
            read: true,
          }

          // Check for auto-response triggers
          const triggeredResponse = autoResponses.find(ar =>
            messageInput.toLowerCase().includes(ar.trigger.toLowerCase())
          )

          const updatedMessages = [newMessage]

          if (triggeredResponse) {
            const autoResponseMsg: ChatMessage = {
              id: `msg-${Date.now()}-auto`,
              senderType: 'visitor',
              senderName: c.visitorName,
              message: triggeredResponse.message,
              timestamp: new Date(Date.now() + 1000).toISOString(),
              read: true,
            }
            updatedMessages.push(autoResponseMsg)
          }

          return {
            ...c,
            messages: [...c.messages, ...updatedMessages],
            lastMessageTime: new Date().toISOString(),
          }
        }
        return c
      })
    )

    setMessageInput('')
    toast.success('Message sent')
  }

  function deleteConversation(id: string) {
    setConversations(conversations.filter(c => c.id !== id))
    if (selectedConversation === id) {
      setSelectedConversation(null)
    }
    toast.success('Conversation deleted')
  }

  function addAutoResponse() {
    if (!newAutoResponse.trigger || !newAutoResponse.message) {
      toast.error('Fill in trigger and message')
      return
    }

    setAutoResponses([
      ...autoResponses,
      {
        id: `auto-${Date.now()}`,
        ...newAutoResponse,
      },
    ])
    setNewAutoResponse({ trigger: '', message: '' })
    toast.success('Auto-response added')
  }

  function deleteAutoResponse(id: string) {
    setAutoResponses(autoResponses.filter(ar => ar.id !== id))
    toast.success('Auto-response deleted')
  }

  const unreadCount = conversations.reduce(
    (acc, c) => acc + c.messages.filter(m => !m.read && m.senderType === 'visitor').length,
    0
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Intercom - Live Chat</h1>
        <p className="text-muted-foreground mt-2">Real-time engagement with your website visitors</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Total Conversations</p>
            <p className="text-2xl font-bold">{conversations.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Unread Messages</p>
            <p className="text-2xl font-bold text-orange-600">{unreadCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Active Chats</p>
            <p className="text-2xl font-bold">
              {conversations.filter(c => c.status === 'active').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Response Time</p>
            <p className="text-2xl font-bold">2 min</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Conversations List */}
        <Card className="md:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Conversations
              </CardTitle>
              <Badge variant="outline">{conversations.length}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              onClick={() => setShowCreateConversation(true)}
              className="w-full"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-1" />
              New Chat
            </Button>

            {showCreateConversation && (
              <div className="bg-muted p-3 rounded-lg space-y-2">
                <Input
                  placeholder="Visitor name"
                  value={newVisitor.name}
                  onChange={e => setNewVisitor({ ...newVisitor, name: e.target.value })}
                  size={30}
                />
                <Input
                  placeholder="Email"
                  type="email"
                  value={newVisitor.email}
                  onChange={e => setNewVisitor({ ...newVisitor, email: e.target.value })}
                />
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    onClick={createConversation}
                    className="flex-1"
                  >
                    Create
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowCreateConversation(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {conversations.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">
                  No conversations yet
                </p>
              ) : (
                conversations.map(conv => (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv.id)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedConversation === conv.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{conv.visitorName}</p>
                        <p className="text-xs opacity-75 truncate">{conv.visitorEmail}</p>
                      </div>
                      <Badge
                        variant={conv.status === 'active' ? 'default' : 'outline'}
                        className="text-xs"
                      >
                        {conv.status}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Chat Area & Settings */}
        <div className="md:col-span-2 space-y-4">
          {selected ? (
            <>
              {/* Chat Messages */}
              <Card className="flex flex-col h-96">
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{selected.visitorName}</CardTitle>
                      <p className="text-xs text-muted-foreground">{selected.visitorEmail}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteConversation(selected.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto space-y-3 pt-4">
                  {selected.messages.map(msg => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.senderType === 'agent' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs p-3 rounded-lg ${
                          msg.senderType === 'agent'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-xs opacity-75 mb-1">{msg.senderName}</p>
                        <p className="text-sm">{msg.message}</p>
                        <p className="text-xs opacity-50 mt-1">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </CardContent>
                <div className="border-t p-3 space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={messageInput}
                      onChange={e => setMessageInput(e.target.value)}
                      onKeyPress={e => e.key === 'Enter' && sendMessage()}
                    />
                    <Button onClick={sendMessage} size="sm">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="pt-8 pb-8 text-center">
                <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Select a conversation to chat</p>
              </CardContent>
            </Card>
          )}

          {/* Auto-Response Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Auto-Response Rules
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAutoResponseSettings(!showAutoResponseSettings)}
                >
                  {showAutoResponseSettings ? 'Hide' : 'Edit'}
                </Button>
              </div>
            </CardHeader>
            {showAutoResponseSettings && (
              <CardContent className="space-y-3 pt-0">
                <div className="space-y-3 bg-muted p-3 rounded-lg">
                  <div>
                    <Label className="text-xs">Trigger Keyword</Label>
                    <Input
                      placeholder="e.g., 'pricing'"
                      value={newAutoResponse.trigger}
                      onChange={e =>
                        setNewAutoResponse({ ...newAutoResponse, trigger: e.target.value })
                      }
                      size={30}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Auto-Response Message</Label>
                    <Textarea
                      placeholder="Enter auto-response message..."
                      value={newAutoResponse.message}
                      onChange={e =>
                        setNewAutoResponse({ ...newAutoResponse, message: e.target.value })
                      }
                      rows={2}
                    />
                  </div>
                  <Button onClick={addAutoResponse} className="w-full">
                    Add Rule
                  </Button>
                </div>

                <div className="space-y-2">
                  {autoResponses.map(ar => (
                    <div key={ar.id} className="border rounded p-2 flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-semibold text-sm">Keyword: {ar.trigger}</p>
                        <p className="text-xs text-muted-foreground">{ar.message}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteAutoResponse(ar.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
