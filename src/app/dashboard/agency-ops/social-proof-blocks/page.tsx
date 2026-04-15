import { socialProofBlocks } from '@/lib/agency-ops-data'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function SocialProofBlocksPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Social Proof Block Manager</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Organize reusable trust blocks so agencies can deploy stronger proof across landing pages and offers.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {socialProofBlocks.map((block) => (
          <Card key={block.id}>
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <CardTitle>{block.page}</CardTitle>
                <Badge variant="secondary">{block.proofType}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div><p className="text-sm font-medium">{block.headline}</p></div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Supporting text</p><p className="mt-1 text-sm text-muted-foreground">{block.supportingText}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
