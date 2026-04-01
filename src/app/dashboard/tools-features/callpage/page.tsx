'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Plus, Phone, Clock, TrendingUp, Trash2, Copy, Download } from 'lucide-react'
import { toast } from 'sonner'
import { loadToolState, saveToolState } from '@/lib/tool-state-client'

interface PhoneTrackingNumber {
  id: string
  name: string
  overlapNumber: string
  forwardingNumber: string
  campaignName: string
  incomingCallsCount: number
  missedCallsCount: number
  totalCallDuration: number
  createdAt: string
}

interface CallRecord {
  id: string
  phoneNumberId: string
  callerNumber: string
  callerName: string
  duration: number // in seconds
  timestamp: string
  status: 'answered' | 'missed'
  recordingURL?: string
}

export default function CallPagePage() {
  const TOOL_ID = 'callpage'
  const [trackingNumbers, setTrackingNumbers] = useState<PhoneTrackingNumber[]>([])
  const [callRecords, setCallRecords] = useState<CallRecord[]>([])
  const [showCreate, setShowCreate] = useState(false)
  const [selectedNumberId, setSelectedNumberId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    campaignName: '',
    forwardingNumber: '',
  })

  useEffect(() => {
    let cancelled = false
    async function restore() {
      const state = await loadToolState<{
        trackingNumbers: PhoneTrackingNumber[]
        callRecords: CallRecord[]
      }>(TOOL_ID)
      if (!cancelled) {
        if (state?.trackingNumbers) setTrackingNumbers(state.trackingNumbers)
        if (state?.callRecords) setCallRecords(state.callRecords)
      }
    }
    restore()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    void saveToolState(TOOL_ID, { trackingNumbers, callRecords })
  }, [trackingNumbers, callRecords])

  function createTrackingNumber() {
    if (!formData.name || !formData.campaignName || !formData.forwardingNumber) {
      toast.error('Fill in all required fields')
      return
    }

    const newNumber: PhoneTrackingNumber = {
      id: `number-${Date.now()}`,
      name: formData.name,
      overlapNumber: `+1 (${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      forwardingNumber: formData.forwardingNumber,
      campaignName: formData.campaignName,
      incomingCallsCount: 0,
      missedCallsCount: 0,
      totalCallDuration: 0,
      createdAt: new Date().toISOString(),
    }

    setTrackingNumbers([newNumber, ...trackingNumbers])
    toast.success('Phone number created')
    resetForm()
  }

  function resetForm() {
    setFormData({
      name: '',
      campaignName: '',
      forwardingNumber: '',
    })
    setShowCreate(false)
  }

  function deleteTrackingNumber(id: string) {
    setTrackingNumbers(trackingNumbers.filter(n => n.id !== id))
    setCallRecords(callRecords.filter(c => c.phoneNumberId !== id))
    if (selectedNumberId === id) {
      setSelectedNumberId(null)
    }
    toast.success('Tracking number deleted')
  }

  function simulateIncomingCall(phoneNumberId: string) {
    const newCall: CallRecord = {
      id: `call-${Date.now()}`,
      phoneNumberId,
      callerNumber: `+1 (${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      callerName: `Caller ${Math.floor(Math.random() * 1000)}`,
      duration: Math.floor(Math.random() * 900) + 60, // 1-15 minutes
      timestamp: new Date().toISOString(),
      status: Math.random() > 0.2 ? 'answered' : 'missed',
      recordingURL: `https://callpage.io/recordings/call-${Date.now()}.mp3`,
    }

    setCallRecords([newCall, ...callRecords])
    setTrackingNumbers(
      trackingNumbers.map(n => {
        if (n.id === phoneNumberId) {
          return {
            ...n,
            incomingCallsCount: n.incomingCallsCount + 1,
            missedCallsCount: newCall.status === 'missed' ? n.missedCallsCount + 1 : n.missedCallsCount,
            totalCallDuration: n.totalCallDuration + newCall.duration,
          }
        }
        return n
      })
    )
    toast.success(
      `Incoming call from ${newCall.callerNumber} (${newCall.status === 'answered' ? 'Answered' : 'Missed'})`
    )
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard')
  }

  function exportCallData() {
    const csvContent =
      'Call Date,Caller Number,Duration (seconds),Status\n' +
      callRecords
        .map(
          c =>
            `${new Date(c.timestamp).toLocaleString()},${c.callerNumber},${c.duration},${c.status}`
        )
        .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `call-records-${Date.now()}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
    toast.success('Call data exported')
  }

  const selectedNumber = selectedNumberId
    ? trackingNumbers.find(n => n.id === selectedNumberId)
    : null
  const selectedCalls = selectedNumberId
    ? callRecords.filter(c => c.phoneNumberId === selectedNumberId)
    : []

  const totalCalls = callRecords.length
  const totalAnswered = callRecords.filter(c => c.status === 'answered').length
  const totalMissed = callRecords.filter(c => c.status === 'missed').length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">CallPage - Call Tracking</h1>
        <p className="text-muted-foreground mt-2">Track and optimize phone calls from your campaigns</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Total Calls</p>
            <p className="text-2xl font-bold">{totalCalls}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Answered</p>
            <p className="text-2xl font-bold text-green-600">{totalAnswered}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Missed</p>
            <p className="text-2xl font-bold text-red-600">{totalMissed}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Tracking Numbers</p>
            <p className="text-2xl font-bold">{trackingNumbers.length}</p>
          </CardContent>
        </Card>
      </div>

      {!showCreate ? (
        <Button onClick={() => setShowCreate(true)} className="w-full md:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Create Tracking Number
        </Button>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Create New Tracking Number</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Tracking Number Name</Label>
                <Input
                  placeholder="Lead Campaign Q1"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <Label>Campaign Name</Label>
                <Input
                  placeholder="Google Ads Campaign"
                  value={formData.campaignName}
                  onChange={e => setFormData({ ...formData, campaignName: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label>Forwarding Number (Your Number)</Label>
              <Input
                placeholder="+1 (555) 123-4567"
                value={formData.forwardingNumber}
                onChange={e => setFormData({ ...formData, forwardingNumber: e.target.value })}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Calls will be forwarded from the generated number to this number
              </p>
            </div>

            <div className="flex gap-2">
              <Button onClick={createTrackingNumber} className="flex-1">
                Create Number
              </Button>
              <Button variant="outline" onClick={resetForm} className="flex-1">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        {/* Tracking Numbers List */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Tracking Numbers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {trackingNumbers.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">
                No tracking numbers yet
              </p>
            ) : (
              trackingNumbers.map(number => (
                <div
                  key={number.id}
                  onClick={() => setSelectedNumberId(number.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors border ${
                    selectedNumberId === number.id
                      ? 'bg-primary/10 border-primary'
                      : 'bg-muted border-transparent hover:bg-muted/80'
                  }`}
                >
                  <p className="font-semibold text-sm">{number.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{number.campaignName}</p>
                  <p className="text-sm font-mono mt-2 text-primary">{number.overlapNumber}</p>
                  <div className="flex gap-1 mt-2 text-xs">
                    <Badge variant="outline">{number.incomingCallsCount} calls</Badge>
                    <Badge variant="outline" className="text-red-600">
                      {number.missedCallsCount} missed
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={e => {
                      e.stopPropagation()
                      deleteTrackingNumber(number.id)
                    }}
                    className="w-full mt-2"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Call Details & Actions */}
        <div className="md:col-span-2 space-y-4">
          {selectedNumber ? (
            <>
              {/* Number Details Card */}
              <Card>
                <CardHeader>
                  <CardTitle>{selectedNumber.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Your Tracking Number</p>
                      <div className="flex items-center justify-between">
                        <p className="text-xl font-mono font-bold">{selectedNumber.overlapNumber}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(selectedNumber.overlapNumber)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="border rounded p-3">
                        <p className="text-muted-foreground">Campaign</p>
                        <p className="font-semibold">{selectedNumber.campaignName}</p>
                      </div>
                      <div className="border rounded p-3">
                        <p className="text-muted-foreground">Forwarding To</p>
                        <p className="font-semibold font-mono">{selectedNumber.forwardingNumber}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 bg-muted p-3 rounded-lg text-center text-sm">
                      <div>
                        <p className="text-muted-foreground text-xs">Total Calls</p>
                        <p className="font-bold text-lg">{selectedNumber.incomingCallsCount}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Answered</p>
                        <p className="font-bold text-green-600">
                          {selectedNumber.incomingCallsCount - selectedNumber.missedCallsCount}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Total Time</p>
                        <p className="font-bold">
                          {Math.floor(selectedNumber.totalCallDuration / 60)}m
                        </p>
                      </div>
                    </div>

                    <Button
                      onClick={() => simulateIncomingCall(selectedNumber.id)}
                      className="w-full"
                      variant="outline"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Simulate Incoming Call
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Call Records */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Call Records
                    </CardTitle>
                    {selectedCalls.length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={exportCallData}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Export
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {selectedCalls.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                      <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No calls yet</p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                      {selectedCalls.map(call => (
                        <div key={call.id} className="border rounded p-3 hover:bg-muted/50">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <p className="font-mono text-sm font-semibold">
                                {call.callerNumber}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(call.timestamp).toLocaleString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <Badge
                                variant={call.status === 'answered' ? 'default' : 'outline'}
                                className={call.status === 'answered' ? 'bg-green-600' : 'bg-red-100 text-red-700'}
                              >
                                {call.status}
                              </Badge>
                              <p className="text-xs text-muted-foreground mt-1">
                                {Math.floor(call.duration / 60)}m {call.duration % 60}s
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="pt-8 pb-8 text-center">
                <Phone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Select a tracking number to view calls</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
