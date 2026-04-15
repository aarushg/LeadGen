
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Zap, LayoutDashboard, Search, FileText, Users, Settings, Menu, X, LibraryBig, BarChart3, Lightbulb, Megaphone, BriefcaseBusiness, Bot } from 'lucide-react'
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
  { href: '/dashboard/ai-assistant', label: 'AI Assistant', icon: Bot },
  { href: '/settings', label: 'Settings', icon: Settings },
]

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <aside className="flex flex-col h-full w-full bg-card border-r border-border">
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border flex-shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-gradient flex items-center justify-center flex-shrink-0">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-base">LeadGen</span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary transition-colors md:hidden">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-primary/15 text-primary border border-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors w-full"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
