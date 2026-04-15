import { caseStudyWorkflowItems } from '@/lib/agency-ops-data'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function CaseStudyWorkflowPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Case Study Publishing Workflow</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Standardize the path from client win to approved proof asset so good results become reusable sales material.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {caseStudyWorkflowItems.map((row) => (
          <Card key={row.id}>
            <CardHeader className="space-y-3">
              <CardTitle>{row.client}</CardTitle>
              <Badge variant="secondary">{row.stage}</Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Proof angle</p><p className="mt-1 text-sm">{row.proofAngle}</p></div>
              <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Owner</p><p className="mt-1 text-sm text-muted-foreground">{row.owner}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
