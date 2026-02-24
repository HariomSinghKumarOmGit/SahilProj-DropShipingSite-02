"use client"

import { useCartStore } from "@/lib/store"
import Link from "next/link"
import { Trash2, ArrowRight } from "lucide-react"

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotal } = useCartStore()

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 min-h-[70vh] flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link href="/shop" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition">
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 min-h-screen">
      <h1 className="text-3xl font-bold mb-10">Shopping Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-1">
          <div className="border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left bg-white dark:bg-[#111]">
              <thead className="bg-gray-50 dark:bg-[#1a1a1a] border-b border-gray-200 dark:border-gray-800">
                <tr>
                  <th className="py-4 px-6 font-semibold">Product</th>
                  <th className="py-4 px-6 font-semibold hidden md:table-cell">Price</th>
                  <th className="py-4 px-6 font-semibold">Quantity</th>
                  <th className="py-4 px-6 font-semibold text-right">Total</th>
                  <th className="py-4 px-6 font-semibold text-right"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.productId} className="border-b border-gray-200 dark:border-gray-800 last:border-0">
                    <td className="py-6 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-lg shrink-0" />
                        <div>
                          <p className="font-semibold">{item.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-6 hidden md:table-cell">${item.price.toFixed(2)}</td>
                    <td className="py-6 px-6">
                      <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg w-fit">
                        <button 
                          onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                          className="px-3 py-1 text-gray-500 hover:text-gray-900 dark:hover:text-white"
                        >-</button>
                        <span className="px-3 py-1 min-w-12 text-center font-medium">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="px-3 py-1 text-gray-500 hover:text-gray-900 dark:hover:text-white"
                        >+</button>
                      </div>
                    </td>
                    <td className="py-6 px-6 text-right font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </td>
                    <td className="py-6 px-6 text-right">
                      <button 
                        onClick={() => removeItem(item.productId)}
                        className="text-red-500 hover:text-red-700 transition p-2"
                      >
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="w-full lg:w-[400px] shrink-0">
          <div className="bg-gray-50 dark:bg-[#1a1a1a] rounded-2xl p-8 border border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                <span className="font-medium">${getTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                <span className="font-medium">Calculated at checkout</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Tax</span>
                <span className="font-medium">Calculated at checkout</span>
              </div>
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mb-8 flex justify-between items-center">
              <span className="text-lg font-bold">Total</span>
              <span className="text-2xl font-bold">${getTotal().toFixed(2)}</span>
            </div>

            <Link href="/checkout" className="w-full bg-blue-600 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 transition">
              Proceed to Checkout <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
