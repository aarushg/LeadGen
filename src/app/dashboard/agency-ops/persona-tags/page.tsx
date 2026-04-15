import { personaTags } from '@/lib/agency-ops-data'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function PersonaTagsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Persona Tagging</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Standardize persona tags so outreach, offers, and reporting stay aligned to the buyer profile.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {personaTags.map((tag) => (
          <Card key={tag.id}>
            <CardHeader>
              <CardTitle>{tag.persona}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {tag.traits.map((trait) => (
                  <Badge key={trait} variant="outline">{trait}</Badge>
                ))}
              </div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Best offer</p><p className="mt-1 text-sm text-muted-foreground">{tag.bestOffer}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
