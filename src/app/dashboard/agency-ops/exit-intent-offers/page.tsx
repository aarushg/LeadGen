'use client'

import { useMemo, useState } from 'react'
import { exitIntentOffers } from '@/lib/agency-ops-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export default function ExitIntentOffersPage() {
  const [selectedId, setSelectedId] = useState(exitIntentOffers[0]?.id ?? '')
  const [headline, setHeadline] = useState('Wait before you go')
  const [offerCopy, setOfferCopy] = useState('Get a quick growth audit before you leave this page.')
  const [traffic, setTraffic] = useState('1200')

  const offer = useMemo(
    () => exitIntentOffers.find((item) => item.id === selectedId) ?? exitIntentOffers[0],
    [selectedId]
  )

  const monthlyTraffic = Number.parseInt(traffic, 10) || 0
  const estimatedRecoveries = Math.round(monthlyTraffic * 0.04)
  const estimatedQualified = Math.round(estimatedRecoveries * 0.35)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Exit-Intent Offer Builder</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Design reusable bounce-recovery offers that give abandoning visitors a reason to stay, opt in, or book.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Offer builder</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex flex-wrap gap-2">
              {exitIntentOffers.map((item) => (
                <Button
                  key={item.id}
                  type="button"
                  variant={selectedId === item.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedId(item.id)}
                >
                  {item.offerName}
                </Button>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="headline">Popup headline</Label>
              <Input id="headline" value={headline} onChange={(event) => setHeadline(event.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="copy">Offer copy</Label>
              <Textarea id="copy" value={offerCopy} onChange={(event) => setOfferCopy(event.target.value)} className="min-h-[96px]" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="traffic">Monthly visitors on target page</Label>
              <Input id="traffic" type="number" min="0" value={traffic} onChange={(event) => setTraffic(event.target.value)} />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Card>
              <CardContent className="p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Estimated recoveries</p>
                <p className="mt-2 text-3xl font-semibold">{estimatedRecoveries}</p>
                <p className="mt-1 text-sm text-muted-foreground">Based on a simple 4% recovery assumption from abandoning traffic.</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Projected qualified leads</p>
                <p className="mt-2 text-3xl font-semibold">{estimatedQualified}</p>
                <p className="mt-1 text-sm text-muted-foreground">Assumes roughly 35% of recovered leads are sales qualified.</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <CardTitle>{headline}</CardTitle>
                <Badge variant="secondary">{offer?.targetPage}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl border bg-muted/30 p-4">
                <p className="text-sm">{offerCopy}</p>
                <p className="mt-3 text-sm font-medium">{offer?.incentive}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Trigger</p>
                <p className="mt-1 text-sm">{offer?.trigger}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Follow-up path</p>
                <p className="mt-1 text-sm text-muted-foreground">{offer?.followUp}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
