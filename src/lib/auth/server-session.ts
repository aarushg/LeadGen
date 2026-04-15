import { NextRequest } from 'next/server'
import type { AppRole } from '@/lib/db'

export type RequestSession = {
  userId: string
  role: AppRole
  demoMode: boolean
}

const ALLOWED_ROLES: AppRole[] = ['admin', 'nurse', 'lawyer', 'dreamer']

function isRole(value: string): value is AppRole {
  return ALLOWED_ROLES.includes(value as AppRole)
}

export function getRequestSession(req: NextRequest): RequestSession | null {
  const userIdCookie = req.cookies.get('auth_user_id')?.value?.trim()
  const roleCookie = req.cookies.get('auth_role')?.value?.trim().toLowerCase()
  const demoMode = req.cookies.get('demo_mode')?.value === '1'
  const accessToken = req.cookies.get('access_token')?.value ?? ''

  if (userIdCookie && roleCookie && isRole(roleCookie)) {
    return {
      userId: userIdCookie,
      role: roleCookie,
      demoMode,
    }
  }

  if (demoMode && accessToken.startsWith('demo-access-')) {
    const fallbackId = accessToken.replace('demo-access-', '')
    return {
      userId: fallbackId,
      role: fallbackId.startsWith('admin') ? 'admin' : 'nurse',
      demoMode,
    }
  }

  return null
}

export function isAdmin(session: RequestSession | null): session is RequestSession {
  return Boolean(session && session.role === 'admin')
}
