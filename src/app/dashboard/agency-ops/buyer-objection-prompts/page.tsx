import { buyerObjectionPrompts } from '@/lib/agency-ops-data'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function BuyerObjectionPromptsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Buyer Objection Prompt Set</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Give teams reusable prompts that answer hesitation before the lead leaves or goes silent.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {buyerObjectionPrompts.map((row) => (
          <Card key={row.id}>
            <CardHeader className="space-y-3">
              <CardTitle>{row.objection}</CardTitle>
              <Badge variant="secondary">{row.bestUse}</Badge>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{row.prompt}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
