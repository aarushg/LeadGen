import { localSeoTemplates } from '@/lib/agency-ops-data'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function LocalSeoTemplatesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Local SEO Landing Page Templates</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Standardize location-page structure so agencies can scale local SEO faster without rebuilding every page from scratch.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {localSeoTemplates.map((template) => (
          <Card key={template.id}>
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <CardTitle>{template.locationType}</CardTitle>
                <Badge variant="secondary">{template.cta}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {template.modules.map((module) => (
                  <Badge key={module} variant="outline">{module}</Badge>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">{template.note}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
