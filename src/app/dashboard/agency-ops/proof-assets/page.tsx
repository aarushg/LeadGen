import { proofAssets } from '@/lib/agency-ops-data'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const statusVariant: Record<string, 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline'> = {
  Draft: 'outline',
  Ready: 'warning',
  Live: 'success',
}

export default function ProofAssetsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Testimonial and Proof Asset Manager</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Keep reviews, testimonials, and case studies organized so trust assets are easier to deploy across campaigns.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {proofAssets.map((asset) => (
          <Card key={asset.id}>
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <CardTitle>{asset.client}</CardTitle>
                <Badge variant={statusVariant[asset.status] ?? 'secondary'}>{asset.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Asset type</p><p className="mt-1 text-sm">{asset.assetType}</p></div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Use case</p><p className="mt-1 text-sm text-muted-foreground">{asset.useCase}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
