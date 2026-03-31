"use client"

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { FormEvent, Suspense, useEffect, useState } from 'react'

import { getInitialSession, loginUser } from '@/lib/auth/client'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/dashboard'
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [bootstrapping, setBootstrapping] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function bootstrap() {
      try {
        const session = await getInitialSession()
        if (!active) return

        if (session) {
          router.replace(next)
          router.refresh()
          return
        }
      } catch {
        // Keep manual login available.
      } finally {
        if (active) {
          setBootstrapping(false)
        }
      }
    }

    bootstrap()

    return () => {
      active = false
    }
  }, [next, router])

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const normalized = username.trim().toLowerCase()
      const email = normalized.includes('@') ? normalized : `${normalized}@dreamcatcher.app`
      await loginUser({ role: 'nurse', email, password })
      router.push(next)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto flex min-h-[80vh] w-full max-w-md items-center px-4">
      <section className="w-full rounded-xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Login</h1>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <input
            type="text"
            required
            className="w-full rounded-md border px-3 py-2"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
          <input
            type="password"
            required
            className="w-full rounded-md border px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <button
            type="submit"
            disabled={loading || bootstrapping}
            className="w-full rounded-md bg-black px-4 py-2 text-white disabled:opacity-60"
          >
            {bootstrapping ? 'Checking session...' : loading ? 'Please wait...' : 'Login'}
          </button>
        </form>
        <p className="mt-4 text-sm">
          Use your username and password to access your account. No account?{' '}
          <Link href="/signup" className="underline">
            Go to signup
          </Link>
          .
        </p>
      </section>
    </main>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
