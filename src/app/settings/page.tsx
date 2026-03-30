import { CheckCircle2, XCircle, Key, Database, AlertTriangle, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { existsSync } from 'fs'
import { join } from 'path'

function isConfigured(value: string | undefined) {
  return !!value && !value.startsWith('your_')
}

function StatusBadge({ ok }: { ok: boolean }) {
  return ok ? (
    <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
      <CheckCircle2 className="h-4 w-4" /> Configured
    </span>
  ) : (
    <span className="flex items-center gap-1.5 text-sm text-red-500 font-medium">
      <XCircle className="h-4 w-4" /> Missing
    </span>
  )
}

function EnvRow({ name, value, description }: { name: string; value: string | undefined; description: string }) {
  const ok = isConfigured(value)
  const masked = ok && value ? value.slice(0, 8) + '••••••••••••' : undefined
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div className="space-y-0.5 min-w-0">
        <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">{name}</code>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
        {ok && masked && (
          <p className="text-xs text-muted-foreground font-mono mt-0.5">{masked}</p>
        )}
      </div>
      <StatusBadge ok={ok} />
    </div>
  )
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold mt-0.5">
        {n}
      </div>
      <div className="space-y-1.5 flex-1">
        <p className="font-medium text-sm">{title}</p>
        <div className="text-sm text-muted-foreground space-y-1">{children}</div>
      </div>
    </div>
  )
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="mt-2 rounded-md bg-muted px-4 py-3 text-xs font-mono overflow-x-auto whitespace-pre-wrap break-all">
      {children}
    </pre>
  )
}

export default function SettingsPage() {
  const anthropicKey = process.env.ANTHROPIC_API_KEY
  const tavilyKey = process.env.TAVILY_API_KEY
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3001'

  const dbExists = existsSync(join(process.cwd(), 'data', 'db.json'))
  const allOk = isConfigured(anthropicKey) && isConfigured(tavilyKey)

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Configure your API keys. Data is stored locally in <code className="text-xs bg-muted px-1 py-0.5 rounded">data/db.json</code>.</p>
      </div>

      {!allOk && (
        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20 dark:border-yellow-900">
          <CardContent className="pt-4 pb-4">
            <div className="flex gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Setup incomplete</p>
                <p className="text-xs text-yellow-700 dark:text-yellow-300">
                  Add the missing keys to <code className="text-xs">.env.local</code>, then restart the dev server.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Environment Variables */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Key className="h-4 w-4" /> API Keys
          </CardTitle>
          <CardDescription>Current status of your <code className="text-xs">.env.local</code> file.</CardDescription>
        </CardHeader>
        <CardContent className="divide-y">
          <EnvRow
            name="ANTHROPIC_API_KEY"
            value={anthropicKey}
            description="Powers lead research briefs and proposal generation via Claude"
          />
          <EnvRow
            name="TAVILY_API_KEY"
            value={tavilyKey}
            description="Web search used during lead research to pull live company data"
          />
          <EnvRow
            name="NEXT_PUBLIC_APP_URL"
            value={appUrl}
            description="The URL this app runs at"
          />
        </CardContent>
      </Card>

      {/* Local database status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Database className="h-4 w-4" /> Local Database
          </CardTitle>
          <CardDescription>Leads and proposals are persisted to a JSON file — no external database required.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <div>
              <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">data/db.json</code>
              <p className="text-xs text-muted-foreground mt-1">Created automatically when you add your first lead or proposal</p>
            </div>
            {dbExists ? (
              <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
                <CheckCircle2 className="h-4 w-4" /> Exists
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground text-sm">
                Not created yet
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Add <code className="bg-muted px-1 py-0.5 rounded">data/</code> to your <code className="bg-muted px-1 py-0.5 rounded">.gitignore</code> if you don&apos;t want to commit your leads data.
          </p>
        </CardContent>
      </Card>

      {/* Step 1: Anthropic */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Step 1 — Get your Anthropic API key</CardTitle>
          <CardDescription>Used for all AI features: research briefs, outreach messages, and proposal generation.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <Step n={1} title="Open the Anthropic Console">
            <p>
              Go to{' '}
              <a
                href="https://console.anthropic.com/settings/keys"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 underline text-foreground"
              >
                console.anthropic.com/settings/keys <ExternalLink className="h-3 w-3" />
              </a>{' '}
              and create a new API key.
            </p>
          </Step>
          <Step n={2} title="Add it to .env.local">
            <CodeBlock>{`ANTHROPIC_API_KEY=sk-ant-...`}</CodeBlock>
          </Step>
        </CardContent>
      </Card>

      {/* Step 2: Tavily */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Step 2 — Get your Tavily API key</CardTitle>
          <CardDescription>Provides live web search results during lead research. Free tier available.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <Step n={1} title="Sign up for Tavily">
            <p>
              Go to{' '}
              <a
                href="https://app.tavily.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 underline text-foreground"
              >
                app.tavily.com <ExternalLink className="h-3 w-3" />
              </a>{' '}
              and copy your API key from the dashboard.
            </p>
          </Step>
          <Step n={2} title="Add it to .env.local">
            <CodeBlock>{`TAVILY_API_KEY=tvly-...`}</CodeBlock>
          </Step>
        </CardContent>
      </Card>

      {/* .env.local template */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-base">Complete .env.local template</CardTitle>
        </CardHeader>
        <CardContent>
          <CodeBlock>{`ANTHROPIC_API_KEY=sk-ant-...
TAVILY_API_KEY=tvly-...
NEXT_PUBLIC_APP_URL=http://localhost:3001`}</CodeBlock>
          <p className="text-xs text-muted-foreground mt-3">
            After updating <code className="bg-muted px-1 py-0.5 rounded">.env.local</code>, restart the dev server (<code className="bg-muted px-1 py-0.5 rounded">npm run dev</code>) for the new values to take effect.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
