import { consentPrompts } from '@/lib/agency-ops-data'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ConsentPromptsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Progressive Consent and Compliance Prompts</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Handle consent more cleanly in lead capture flows so compliance prompts do not add unnecessary friction.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {consentPrompts.map((prompt) => (
          <Card key={prompt.id}>
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <CardTitle>{prompt.trigger}</CardTitle>
                <Badge variant="secondary">Consent</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div><p className="text-sm">{prompt.prompt}</p></div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Best for</p><p className="mt-1 text-sm text-muted-foreground">{prompt.compliantFor}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
