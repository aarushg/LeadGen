import { db } from '@/lib/db'
import { buildExecutiveKpiSnapshot } from '@/lib/agency-ops-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function ExecutiveKpiPage() {
  const leads = await db.leads.list()
  const snapshot = buildExecutiveKpiSnapshot(leads)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Executive KPI Snapshot</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Give clients a fast executive read on volume, quality, close rate, and revenue without digging through multiple dashboards.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card><CardContent className="p-4"><p className="text-xs uppercase tracking-wide text-muted-foreground">Leads</p><p className="mt-2 text-3xl font-semibold">{snapshot.total}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs uppercase tracking-wide text-muted-foreground">Qualified rate</p><p className="mt-2 text-3xl font-semibold">{snapshot.qualificationRate}%</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs uppercase tracking-wide text-muted-foreground">Win rate</p><p className="mt-2 text-3xl font-semibold">{snapshot.winRate}%</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs uppercase tracking-wide text-muted-foreground">Estimated revenue</p><p className="mt-2 text-3xl font-semibold">${snapshot.revenue.toLocaleString()}</p></CardContent></Card>
      </div>
    </div>
  )
}
