import { guaranteeSections } from '@/lib/agency-ops-data'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function GuaranteeSectionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Risk-Reversal and Guarantee Section Generator</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Frame offer guarantees more clearly so prospects feel lower risk before they convert or book.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {guaranteeSections.map((item) => (
          <Card key={item.id}>
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <CardTitle>{item.offer}</CardTitle>
                <Badge variant="secondary">Guarantee</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">{item.guarantee}</p>
              <p className="text-sm text-muted-foreground">{item.useCase}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
