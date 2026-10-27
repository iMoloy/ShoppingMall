'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/toast'
import { register } from '@/lib/auth'
import { registerSchema, type RegisterInput } from '@/lib/validations'

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectPath = searchParams.get('redirect') || '/'

  const [formData, setFormData] = useState<RegisterInput>({
    name: '',
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterInput, string>>>({})
  const [loading, setLoading] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof RegisterInput]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors({})

    const validation = registerSchema.safeParse(formData)
    if (!validation.success) {
      const fieldErrors: Partial<Record<keyof RegisterInput, string>> = {}
      for (const issue of validation.error.issues) {
        const field = issue.path[0] as keyof RegisterInput
        if (field && !fieldErrors[field]) {
          fieldErrors[field] = issue.message
        }
      }
      setErrors(fieldErrors)
      return
    }

    setLoading(true)
    try {
      const res = await register(validation.data)
      if (!res.success) {
        toast.error(res.error?.message || 'Registration failed')
        return
      }

      toast.success('Account created successfully')
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
        <h1 className="text-xl font-semibold text-[var(--color-text-primary)]">Create an account</h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          Join Shopping Mall to start ordering your favorite items.
        </p>
      </div>

      <Input
        label="Full name"
        name="name"
        type="text"
        autoComplete="name"
        placeholder="John Doe"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        disabled={loading}
        required
      />

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
        autoComplete="new-password"
        placeholder="••••••••"
        hint="Min 8 characters, at least 1 uppercase letter and 1 number"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
        disabled={loading}
        required
      />

      <Button type="submit" variant="primary" loading={loading} className="mt-2 w-full">
        Create account
      </Button>

      <p className="mt-2 text-center text-xs text-[var(--color-text-muted)]">
        Already have an account?{' '}
        <Link
          href={`/login${redirectPath !== '/' ? `?redirect=${encodeURIComponent(redirectPath)}` : ''}`}
          className="font-medium text-[var(--color-text-primary)] underline transition-colors duration-150 hover:text-[var(--color-brand-600)]"
        >
          Sign in
        </Link>
      </p>
    </form>
  )
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center">
          <p className="text-sm text-[var(--color-text-muted)]">Loading...</p>
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  )
}
