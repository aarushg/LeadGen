'use client'

import Link from 'next/link'

export function PrintReportActions() {
  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        onClick={() => window.print()}
        className="inline-flex h-10 items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white"
      >
        Print report
      </button>
      <Link
        href="/dashboard/reporting"
        className="inline-flex h-10 items-center justify-center rounded-md border border-slate-300 px-4 py-2 text-sm font-medium"
      >
        Back to reporting
      </Link>
    </div>
  )
}
