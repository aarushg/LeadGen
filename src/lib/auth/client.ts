import { API_BASE_URL } from '@/lib/config/api'

type AuthRole = 'dreamer' | 'nurse' | 'lawyer' | 'admin'

type AuthSession = {
  mode: 'demo' | 'express'
  role: AuthRole
  user: {
    id: string
    email: string
    rawRole?: string
  }
  accessToken?: string
  refreshToken?: string
}

type SignUpInput = {
  role: Exclude<AuthRole, 'admin'>
  username: string
  password: string
}

const isBackendConfigured = Boolean(process.env.NEXT_PUBLIC_API_BASE_URL?.trim())

const demoNurseAccounts = [
  { id: 'nurse-1', email: 'anjali@dreamcatcher.app', password: 'demo123' },
  { id: 'nurse-2', email: 'mariam@dreamcatcher.app', password: 'demo123' },
]

const demoLawyerAccounts = [{ id: 'lawyer-1', email: 'priya@dreamcatcher.app', password: 'demo123' }]

const demoAdminAccounts = [{ id: 'admin-1', email: 'admin@dreamcatcher.app', password: 'admin' }]

const demoWorkPermitAccounts = [{ id: 'wp-1', email: 'rajesh@dreamcatcher.app', password: 'demo123' }]

const DEMO_ACCOUNTS_STORAGE_KEY = 'leadgen.demo.accounts'

type DemoAccount = {
  id: string
  email: string
  password: string
  role: AuthRole
  fullName?: string
  country?: string
  specialty?: string
}

type AuthResponse = {
  ok?: boolean
  message?: string
  accessToken?: string
  refreshToken?: string
  token?: string
  jwt?: string
  user?: {
    id: string
    role?: string
    email?: string
  }
}

function persistClientToken(data: AuthResponse) {
  if (typeof document === 'undefined') {
    return
  }

  const accessToken = data.accessToken || data.token || data.jwt
  const refreshToken = data.refreshToken

  if (accessToken) {
    // Persist access token as a cookie so Next.js middleware can read it.
    const accessMaxAge = 60 * 15 // 15 minutes
    document.cookie = `access_token=${encodeURIComponent(accessToken)}; Path=/; SameSite=Lax; Max-Age=${accessMaxAge}`
  }

  if (refreshToken) {
    // Keep refresh token longer, similar to NurseApp refresh session behavior.
    const refreshMaxAge = 60 * 60 * 24 * 30 // 30 days
    document.cookie = `refresh_token=${encodeURIComponent(refreshToken)}; Path=/; SameSite=Lax; Max-Age=${refreshMaxAge}`
  }
}

export function clearClientToken() {
  if (typeof document === 'undefined') return
  document.cookie = 'access_token=; Path=/; Max-Age=0; SameSite=Lax'
  document.cookie = 'refresh_token=; Path=/; Max-Age=0; SameSite=Lax'
  document.cookie = 'demo_mode=; Path=/; Max-Age=0; SameSite=Lax'
}

function setDemoMode(enabled: boolean) {
  if (typeof document === 'undefined') return
  if (!enabled) {
    document.cookie = 'demo_mode=; Path=/; Max-Age=0; SameSite=Lax'
    return
  }

  const maxAge = 60 * 60 * 24 * 30
  document.cookie = `demo_mode=1; Path=/; SameSite=Lax; Max-Age=${maxAge}`
}

function getCookie(name: string) {
  if (typeof document === 'undefined') return ''
  const value = document.cookie
    .split('; ')
    .find((part) => part.startsWith(`${name}=`))
    ?.split('=')[1]

  return value ? decodeURIComponent(value) : ''
}

function getBaseDemoAccounts(): DemoAccount[] {
  return [
    ...demoNurseAccounts.map((account) => ({ ...account, role: 'nurse' as const })),
    ...demoLawyerAccounts.map((account) => ({ ...account, role: 'lawyer' as const })),
    ...demoAdminAccounts.map((account) => ({ ...account, role: 'admin' as const })),
    ...demoWorkPermitAccounts.map((account) => ({ ...account, role: 'dreamer' as const })),
  ]
}

function getStoredDemoAccounts(): DemoAccount[] {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const raw = window.localStorage.getItem(DEMO_ACCOUNTS_STORAGE_KEY)
    if (!raw) {
      return []
    }

    const parsed = JSON.parse(raw) as DemoAccount[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveStoredDemoAccounts(accounts: DemoAccount[]) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(DEMO_ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts))
}

function getDemoAccountsByRole(role: AuthRole) {
  const baseAccounts = getBaseDemoAccounts()
  const storedAccounts = getStoredDemoAccounts()
  return [...baseAccounts, ...storedAccounts].filter((account) => account.role === role)
}

function hasDemoAccount(email: string) {
  const normalizedEmail = email.trim().toLowerCase()
  return [...getBaseDemoAccounts(), ...getStoredDemoAccounts()].some(
    (account) => account.email.toLowerCase() === normalizedEmail
  )
}

async function post<T>(path: string, body: Record<string, unknown>): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  })

  const data = await res.json().catch(() => ({} as AuthResponse))

  if (!res.ok) {
    throw new Error(data?.message || 'Request failed')
  }

  return data as T
}

export async function signIn(email: string, password: string) {
  const data = await post<AuthResponse>('/auth/login', { email, password })
  persistClientToken(data)
  return data
}

export async function loginUser({
  role,
  email,
  password,
}: {
  role: AuthRole
  email: string
  password: string
}): Promise<AuthSession> {
  if (!email.trim() || !password) {
    throw new Error('Email and password are required.')
  }

  if (!isBackendConfigured) {
    const allAccounts = [...getBaseDemoAccounts(), ...getStoredDemoAccounts()]

    const account = allAccounts.find(
      (item) => item.email.toLowerCase() === email.trim().toLowerCase() && item.password === password
    )

    if (!account) {
      throw new Error('Invalid login. Use one of the demo accounts.')
    }

    // Create synthetic tokens so middleware/protected layouts can work in demo mode.
    persistClientToken({
      accessToken: `demo-access-${account.id}`,
      refreshToken: `demo-refresh-${account.id}`,
    })
    setDemoMode(true)

    return {
      mode: 'demo',
      role: account.role,
      user: { id: account.id, email: account.email },
      accessToken: `demo-access-${account.id}`,
      refreshToken: `demo-refresh-${account.id}`,
    }
  }

  const result = await post<AuthResponse>('/auth/login', {
    email: email.trim(),
    password,
  })

  persistClientToken(result)
  setDemoMode(false)

  const userId = result.user?.id || 'unknown-user'
  const userRole = result.user?.role || role

  return {
    mode: 'express',
    role,
    user: {
      id: userId,
      email: email.trim(),
      rawRole: userRole,
    },
    accessToken: result.accessToken || result.token || result.jwt,
    refreshToken: result.refreshToken,
  }
}

export async function signUp(email: string, password: string, fullName: string) {
  const data = await post<AuthResponse>('/auth/register', {
    email,
    password,
    fullName,
  })
  persistClientToken(data)
  return data
}

export async function signUpUser({
  role,
  username,
  password,
}: SignUpInput) {
  if (!username.trim() || !password.trim()) {
    throw new Error('Username and password are required.')
  }

  const normalizedUsername = username.trim().toLowerCase()
  const email = normalizedUsername.includes('@')
    ? normalizedUsername
    : `${normalizedUsername}@dreamcatcher.app`
  const fullName = username.trim()

  if (!isBackendConfigured) {
    if (hasDemoAccount(email)) {
      throw new Error('An account with this email already exists.')
    }

    const accountIdPrefix = role === 'dreamer' ? 'wp' : role
    const createdAccount: DemoAccount = {
      id: `${accountIdPrefix}-${Date.now()}`,
      email,
      password,
      role,
      fullName,
    }

    saveStoredDemoAccounts([...getStoredDemoAccounts(), createdAccount])

    return {
      message:
        role === 'lawyer'
          ? 'Demo sign-up complete. The admin must approve your account.'
          : 'Demo sign-up complete. You can now log in with your new account.',
    }
  }

  const body: Record<string, unknown> = {
    email,
    password,
    fullName,
  }

  if (role === 'lawyer') {
    body.role = 'lawyer'
  }

  await post<AuthResponse>('/auth/register', body)

  if (role === 'lawyer') {
    return { message: 'Account created. The admin must approve your account.' }
  }

  if (role === 'dreamer') {
    return { message: 'Account created. You can now log in and start your personalized plan.' }
  }

  return { message: 'Account created. You can now log in.' }
}

export async function requestPasswordReset(email: string) {
  if (!email.trim()) {
    throw new Error('Email is required.')
  }

  if (!isBackendConfigured) {
    return { message: 'Demo mode: password reset email would be sent here.' }
  }

  return { message: 'Please contact your coordinator to reset your password.' }
}

export async function refreshSession() {
  const refreshToken = getCookie('refresh_token')
  if (!refreshToken) {
    return null
  }

  const data = await post<AuthResponse>('/auth/refresh', { refreshToken })
  persistClientToken(data)
  return data
}

export async function getInitialSession() {
  try {
    return await refreshSession()
  } catch {
    clearClientToken()
    return null
  }
}