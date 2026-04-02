'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Zap, LayoutDashboard, Search, FileText, Users, Settings, Menu, X, LibraryBig, BarChart3, Lightbulb, Megaphone, BriefcaseBusiness } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/research', label: 'Lead Research', icon: Search },
  { href: '/dashboard/tools', label: 'Tools Library', icon: LibraryBig },
  { href: '/dashboard/tools/analytics', label: 'Tool Analytics', icon: BarChart3 },
  { href: '/dashboard/reporting', label: 'Reporting', icon: BarChart3 },
  { href: '/dashboard/agency-ops', label: 'Agency Ops', icon: BriefcaseBusiness },
  { href: '/dashboard/growth-hub', label: 'Growth Hub', icon: Lightbulb },
  { href: '/dashboard/paid-campaigns', label: 'Paid Campaigns', icon: Megaphone },
  { href: '/proposals', label: 'Proposals', icon: FileText },
  { href: '/dashboard/leads', label: 'CRM', icon: Users },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const NavLinks = () => (
    <nav className="flex-1 space-y-1 px-3 py-4">
      {navItems.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
        return (
          <Link
            key={href}
            href={href}
            onClick={() => setMobileOpen(false)}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              active
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground'
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        )
      })}
    </nav>
  )

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="fixed left-4 top-4 z-50 rounded-md p-2 bg-background border shadow-sm md:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 flex h-full w-64 flex-col border-r bg-background transition-transform md:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 px-6 py-5 border-b">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Zap className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg">LeadGen</span>
        </div>

        <NavLinks />
      </aside>
    </>
  )
}
