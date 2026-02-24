"use client"

import { useCartStore } from "@/lib/store"
import { ShoppingBag } from "lucide-react"

export default function AddToCartButton({ 
  product, 
  variant = 'default' 
}: { 
  product: { id: string; name: string; price: number; images?: string[] },
  variant?: 'default' | 'quick'
}) {
  const { addItem } = useCartStore()

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.images?.[0] || ""
    })
    
    // Optional: Could add a toast notification here
  }

  if (variant === 'quick') {
    return (
      <button 
        onClick={handleAdd}
        className="w-full bg-white text-gray-900 font-semibold py-3 rounded-xl shadow-lg hover:bg-gray-50 transition"
      >
        Quick Add
      </button>
    )
  }

  return (
    <button 
      onClick={handleAdd}
      className="mt-4 w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-800 dark:hover:bg-gray-100 transition"
    >
      <ShoppingBag size={18} /> Add to Cart
    </button>
  )
}
