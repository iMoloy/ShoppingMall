import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ProductListItem } from '@shoppingmall/shared-types'

interface WishlistState {
  items: ProductListItem[]
  addItem: (product: ProductListItem) => void
  removeItem: (productId: string) => void
  toggleItem: (product: ProductListItem) => boolean
  isInWishlist: (productId: string) => boolean
  clearWishlist: () => void
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) =>
        set((state) => {
          if (state.items.some((item) => item.id === product.id)) {
            return state
          }
          return { items: [product, ...state.items] }
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        })),

      toggleItem: (product) => {
        const isPresent = get().items.some((item) => item.id === product.id)
        if (isPresent) {
          set((state) => ({
            items: state.items.filter((item) => item.id !== product.id),
          }))
          return false
        } else {
          set((state) => ({
            items: [product, ...state.items],
          }))
          return true
        }
      },

      isInWishlist: (productId) => get().items.some((item) => item.id === productId),

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'shoppingmall_wishlist_storage_v1',
    },
  ),
)

// Selector hook for total count
export const useWishlistCount = () => useWishlistStore((s) => s.items.length)
