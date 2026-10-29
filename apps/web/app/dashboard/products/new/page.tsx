'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input, Textarea } from '@/components/ui/input'
import { toast } from '@/components/ui/toast'
import { api } from '@/lib/api'
import { createProductSchema, type CreateProductInput } from '@/lib/validations'
import type { Category } from '@shoppingmall/shared-types'

export default function NewProductPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [fetchingCats, setFetchingCats] = useState(true)

  const [formData, setFormData] = useState<{
    name: string
    description: string
    price: string
    stock: string
    categoryId: string
    imageUrl: string
  }>({
    name: '',
    description: '',
    price: '',
    stock: '1',
    categoryId: '',
    imageUrl: '',
  })

  const [errors, setErrors] = useState<Partial<Record<keyof CreateProductInput, string>>>({})

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await api.get<Category[]>('/categories')
        if (res.success && res.data.length > 0) {
          setCategories(res.data)
          setFormData((prev) => ({ ...prev, categoryId: res.data[0]?.id ?? '' }))
        }
      } finally {
        setFetchingCats(false)
      }
    }
    loadCategories()
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof CreateProductInput]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors({})

    const parsedPrice = parseFloat(formData.price)
    const parsedStock = parseInt(formData.stock, 10)

    const payload = {
      name: formData.name,
      description: formData.description,
      price: isNaN(parsedPrice) ? 0 : parsedPrice,
      stock: isNaN(parsedStock) ? 0 : parsedStock,
      categoryId: formData.categoryId,
      imageUrl: formData.imageUrl || undefined,
    }

    const validation = createProductSchema.safeParse(payload)
    if (!validation.success) {
      const fieldErrors: Partial<Record<keyof CreateProductInput, string>> = {}
      for (const issue of validation.error.issues) {
        const field = issue.path[0] as keyof CreateProductInput
        if (field && !fieldErrors[field]) {
          fieldErrors[field] = issue.message
        }
      }
      setErrors(fieldErrors)
      return
    }

    setLoading(true)
    try {
      const res = await api.post('/products', {
        ...validation.data,
        images: validation.data.imageUrl ? [validation.data.imageUrl] : [],
      })

      if (!res.success) {
        toast.error(res.error?.message || 'Failed to create product')
        return
      }

      toast.success('Product created successfully')
      router.push('/dashboard/products')
      router.refresh()
    } catch {
      toast.error('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">Add New Product</h1>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            Create and list a new item in your online store.
          </p>
        </div>
        <Button asChild variant="ghost">
          <Link href="/dashboard/products">Cancel</Link>
        </Button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
        <Input
          label="Product Title"
          name="name"
          placeholder="e.g. Vintage Leather Shoulder Bag"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          required
        />

        <Textarea
          label="Description"
          name="description"
          placeholder="Describe materials, sizing, features, and specs..."
          value={formData.description}
          onChange={handleChange}
          error={errors.description}
          required
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Price ($)"
            name="price"
            type="number"
            step="0.01"
            min="0"
            placeholder="49.99"
            value={formData.price}
            onChange={handleChange}
            error={errors.price}
            required
          />

          <Input
            label="Initial Stock Quantity"
            name="stock"
            type="number"
            min="0"
            step="1"
            placeholder="10"
            value={formData.stock}
            onChange={handleChange}
            error={errors.stock}
            required
          />
        </div>

        {/* Category Selection */}
        <div className="flex flex-col gap-1">
          <label htmlFor="categoryId" className="text-sm font-medium text-[var(--color-text-primary)]">
            Category
          </label>
          <select
            id="categoryId"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            disabled={fetchingCats}
            className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text-primary)] focus:border-[var(--color-brand-600)] focus:outline-none focus:ring-1 focus:ring-[var(--color-brand-600)] disabled:opacity-60"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="text-xs text-red-500">{errors.categoryId}</p>
          )}
        </div>

        {/* Image URL (ImgBB CDN) */}
        <Input
          label="Image URL (ImgBB or CDN)"
          name="imageUrl"
          type="url"
          placeholder="https://i.ibb.co/..."
          hint="Paste an image link from ImgBB or your image host."
          value={formData.imageUrl}
          onChange={handleChange}
          error={errors.imageUrl}
        />

        <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
          <Button asChild variant="secondary">
            <Link href="/dashboard/products">Cancel</Link>
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            Save Product
          </Button>
        </div>
      </form>
    </div>
  )
}
