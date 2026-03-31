import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { API_BASE_URL } from '@/lib/config/api'

/**
 * Server-side auth guard. Call this at the top of any protected Server Component
 * layout or page. Redirects to /login if the access_token cookie is absent.
 */
export async function requireAuth() {
  const cookieStore = await cookies()
  const demoMode = cookieStore.get('demo_mode')?.value === '1'
  let accessToken = cookieStore.get('access_token')?.value
  const refreshToken = cookieStore.get('refresh_token')?.value

  if (demoMode && accessToken) {
    return
  }

  if (!accessToken && refreshToken) {
    try {
      const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
        cache: 'no-store',
      })

      if (refreshResponse.ok) {
        const refreshData = (await refreshResponse.json()) as {
          accessToken?: string
          token?: string
          jwt?: string
        }
        accessToken = refreshData.accessToken || refreshData.token || refreshData.jwt
      }
    } catch {
      redirect('/login')
    }
  }

  if (!accessToken) {
    redirect('/login')
  }

  try {
    const response = await fetch(`${API_BASE_URL}/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      redirect('/login')
    }
  } catch {
    redirect('/login')
  }
}
