import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CartItem = {
  productId: string
  name: string
  price: number
  quantity: number
  imageUrl?: string
}

interface CartState {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const currentItems = get().items
        const existingItem = currentItems.find((i) => i.productId === item.productId)
        
        if (existingItem) {
          set({
            items: currentItems.map((i) => 
              i.productId === item.productId ? { ...i, quantity: i.quantity + item.quantity } : i
            )
          })
        } else {
          set({ items: [...currentItems, item] })
        }
      },
      removeItem: (productId) => {
        set({ items: get().items.filter((i) => i.productId !== productId) })
      },
      updateQuantity: (productId, quantity) => {
        set({
          items: get().items.map((i) => 
            i.productId === productId ? { ...i, quantity } : i
          )
        })
      },
      clearCart: () => set({ items: [] }),
      getTotal: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0)
      }
    }),
    {
      name: 'ecommerce-cart',
    }
  )
)
