'use client'

import { useMemo, useState } from 'react'
import { geoPersonalizationVariants } from '@/lib/agency-ops-data'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function GeoPersonalizationPage() {
  const [selectedId, setSelectedId] = useState(geoPersonalizationVariants[0]?.id ?? '')
  const variant = useMemo(
    () => geoPersonalizationVariants.find((item) => item.id === selectedId) ?? geoPersonalizationVariants[0],
    [selectedId]
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Geo-Targeted Landing Page Personalization</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Tailor landing page messaging by market so agencies can localize proof, CTAs, and offer framing without rebuilding the whole page.
        </p>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-lg">Market selector</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {geoPersonalizationVariants.map((item) => (
            <Button key={item.id} type="button" size="sm" variant={selectedId === item.id ? 'default' : 'outline'} onClick={() => setSelectedId(item.id)}>
              {item.market}
            </Button>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <CardTitle>{variant.market} version</CardTitle>
          <Badge variant="secondary">Localized messaging</Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-2xl border bg-muted/30 p-4">
            <p className="text-lg font-semibold">{variant.headline}</p>
            <p className="mt-3 text-sm text-muted-foreground">{variant.socialProof}</p>
            <p className="mt-4 text-sm font-medium">{variant.cta}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
