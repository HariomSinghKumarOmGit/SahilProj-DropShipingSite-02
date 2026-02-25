"use client"

import { useCartStore } from "@/lib/store"
import { useRouter } from "next/navigation"
import React from "react"

export default function BuyNowButton({ 
  product, 
  className,
  children
}: { 
  product: { id: string; name: string; price: number; images?: string[] },
  className?: string,
  children?: React.ReactNode
}) {
  const { addItem } = useCartStore()
  const router = useRouter()

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Add 1 quantity to the cart
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.images?.[0] || ""
    })
    
    // Immediately redirect to checkout
    router.push("/checkout")
  }

  return (
    <button onClick={handleBuyNow} className={className}>
      {children || "Buy Now"}
    </button>
  )
}
