import { Sidebar } from './sidebar'

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto md:ml-64">
        <div className="p-6 pt-16 md:pt-6">{children}</div>
      </main>
    </div>
  )
}
