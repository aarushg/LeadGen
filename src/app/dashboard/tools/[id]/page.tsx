import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Globe, Building2, Target, Sparkles, CheckCircle2 } from 'lucide-react'
import { db } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface ToolDetailsPageProps {
  params: Promise<{ id: string }>
}

export default async function ToolDetailsPage({ params }: ToolDetailsPageProps) {
  const { id } = await params
  const tool = await db.tools.get(id)

  if (!tool) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <Button asChild variant="ghost" size="sm" className="mb-2">
            <Link href="/dashboard/tools">
              <ArrowLeft className="h-4 w-4" />
              Back to Tools
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">{tool.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">{tool.summary}</p>
        </div>
        <Badge variant="secondary">{tool.type}</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <Target className="h-4 w-4" />
              Best For
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium">{tool.bestFor}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium">{tool.type}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Official Website
            </CardTitle>
          </CardHeader>
          <CardContent>
            <a
              href={tool.website ?? '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-primary hover:underline"
            >
              Visit vendor site
            </a>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Key Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {tool.keyFeatures.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="flex gap-2 flex-wrap">
        <Button asChild>
          <Link href={`/research?company=${encodeURIComponent(tool.name)}`}>Research This Tool</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/dashboard/leads">Open CRM</Link>
        </Button>
      </div>
    </div>
  )
}
