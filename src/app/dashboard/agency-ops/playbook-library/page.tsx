import { agencyPlaybookLibrary } from '@/lib/agency-ops-data'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function PlaybookLibraryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reusable Agency Playbook Library</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Store repeatable delivery workflows so launch, recovery, and retention work can be reused across accounts.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {agencyPlaybookLibrary.map((item) => (
          <Card key={item.id}>
            <CardHeader className="space-y-3">
              <CardTitle>{item.name}</CardTitle>
              <Badge variant="secondary">{item.useCase}</Badge>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {item.steps.map((step) => (
                <Badge key={step} variant="outline">{step}</Badge>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
