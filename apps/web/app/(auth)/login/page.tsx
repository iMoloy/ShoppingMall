'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/toast'
import { login } from '@/lib/auth'
import { loginSchema, type LoginInput } from '@/lib/validations'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectPath = searchParams.get('redirect') || '/'

  const [formData, setFormData] = useState<LoginInput>({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof LoginInput, string>>>({})
  const [loading, setLoading] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof LoginInput]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors({})

    const validation = loginSchema.safeParse(formData)
    if (!validation.success) {
      const fieldErrors: Partial<Record<keyof LoginInput, string>> = {}
      for (const issue of validation.error.issues) {
        const field = issue.path[0] as keyof LoginInput
        if (field && !fieldErrors[field]) {
          fieldErrors[field] = issue.message
        }
      }
      setErrors(fieldErrors)
      return
    }

    setLoading(true)
    try {
      const res = await login(validation.data)
      if (!res.success) {
        toast.error(res.error?.message || 'Login failed')
        return
      }

      toast.success('Signed in successfully')
      router.push(redirectPath)
      router.refresh()
    } catch {
      toast.error('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="mb-2">
        <h1 className="text-xl font-semibold text-[var(--color-text-primary)]">Sign in</h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          Welcome back. Enter your credentials to access your account.
        </p>
      </div>

      <Input
        label="Email address"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        disabled={loading}
        required
      />

      <Input
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        placeholder="••••••••"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
        disabled={loading}
        required
      />

      <Button type="submit" variant="primary" loading={loading} className="mt-2 w-full">
        Sign in
      </Button>

      <p className="mt-2 text-center text-xs text-[var(--color-text-muted)]">
        Don&apos;t have an account?{' '}
        <Link
          href={`/register${redirectPath !== '/' ? `?redirect=${encodeURIComponent(redirectPath)}` : ''}`}
          className="font-medium text-[var(--color-text-primary)] underline transition-colors duration-150 hover:text-[var(--color-brand-600)]"
        >
          Create account
        </Link>
      </p>
    </form>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center">
          <p className="text-sm text-[var(--color-text-muted)]">Loading...</p>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
