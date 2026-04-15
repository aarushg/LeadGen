import { industryIntakeTemplates } from '@/lib/agency-ops-data'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function IndustryIntakePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Industry-Specific Intake Form Templates</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Use niche-tailored intake structures so agencies ask smarter qualification questions for each client vertical.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {industryIntakeTemplates.map((template) => (
          <Card key={template.id}>
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <CardTitle>{template.industry}</CardTitle>
                <Badge variant="secondary">Template</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {template.fields.map((field) => (
                  <Badge key={field} variant="outline">{field}</Badge>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">{template.qualifier}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
