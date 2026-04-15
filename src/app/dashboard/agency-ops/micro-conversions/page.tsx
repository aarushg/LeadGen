import { microConversionPrompts } from '@/lib/agency-ops-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function MicroConversionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Micro-Conversion Prompt Library</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Use lighter prompts to capture intent from visitors who are not ready for a full conversion yet.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {microConversionPrompts.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle>{item.placement}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div><p className="text-sm">{item.prompt}</p></div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Goal</p><p className="mt-1 text-sm text-muted-foreground">{item.goal}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
