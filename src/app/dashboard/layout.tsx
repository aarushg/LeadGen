import { requireAuth } from '@/lib/auth/require-auth'
import { AppLayout } from '@/components/layout/app-layout'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  await requireAuth()
  return <AppLayout>{children}</AppLayout>
}
