import { create } from 'zustand'
import type { CartItemResponse } from '@shoppingmall/shared-types'

interface CartState {
  items: CartItemResponse[]
  isOpen: boolean
  // Actions
  setItems: (items: CartItemResponse[]) => void
  addItem: (item: CartItemResponse) => void
  updateQuantity: (itemId: string, quantity: number) => void
  removeItem: (itemId: string) => void
  clear: () => void
  openCart: () => void
  closeCart: () => void
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  isOpen: false,

  setItems: (items) => set({ items }),

  addItem: (incoming) =>
    set((state) => {
      const exists = state.items.find((i) => i.product.id === incoming.product.id)
      if (exists) {
        return {
          items: state.items.map((i) =>
            i.product.id === incoming.product.id
              ? { ...i, quantity: i.quantity + incoming.quantity }
              : i,
          ),
        }
      }
      return { items: [...state.items, incoming] }
    }),

  updateQuantity: (itemId, quantity) =>
    set((state) => ({
      items: state.items.map((i) => (i.id === itemId ? { ...i, quantity } : i)),
    })),

  removeItem: (itemId) =>
    set((state) => ({ items: state.items.filter((i) => i.id !== itemId) })),

  clear: () => set({ items: [] }),

  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
}))

// Derived selector — total item count for navbar badge
export const useCartCount = () =>
  useCartStore((s) => s.items.reduce((acc, i) => acc + i.quantity, 0))
