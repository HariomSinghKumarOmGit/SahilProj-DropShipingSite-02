"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useCartStore } from "@/lib/store"
import { CheckCircle2, AlertCircle } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { processCheckout } from "@/actions/checkout"

const checkoutSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  zipCode: z.string().min(3, "ZIP/Postal code is required"),
  country: z.string().min(2, "Country is required"),
  cardNumber: z.string().min(16, "Card number is required").max(16),
  expiry: z.string().regex(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, "MM/YY format required"),
  cvv: z.string().min(3).max(4),
})

type CheckoutForm = z.infer<typeof checkoutSchema>

export default function CheckoutPage() {
  const { items, getTotal, clearCart } = useCartStore()
  const [isSuccess, setIsSuccess] = useState(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)
  const total = getTotal()

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema)
  })

  const onSubmit = async (data: CheckoutForm) => {
    setCheckoutError(null)
    
    // Process payment and stock update using the Server Action
    const orderData = {
      ...data,
      items: items.map(i => ({ productId: i.productId, quantity: i.quantity, price: i.price }))
    }

    const res = await processCheckout(orderData)

    if (!res.success) {
      setCheckoutError(res.error || "An unexpected error occurred.")
      return
    }

    console.log("Order Processed successfully:", res.orderId)
    setIsSuccess(true)
    clearCart()
  }

  if (isSuccess) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-32 text-center min-h-[70vh] flex flex-col items-center justify-center">
        <CheckCircle2 size={64} className="text-green-500 mb-6" />
        <h1 className="text-4xl font-bold mb-4">Payment Successful!</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          Thank you for your order. We've sent a confirmation email with your order details.
        </p>
        <Link href="/shop" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition">
          Continue Shopping
        </Link>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 min-h-[70vh] flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <Link href="/shop" className="text-blue-600 hover:underline">Return to Shop</Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 min-h-screen">
      <h1 className="text-3xl font-bold mb-10">Checkout</h1>
      
      {checkoutError && (
        <div className="mb-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-center gap-3">
          <AlertCircle size={20} className="shrink-0" />
          <p className="font-medium">{checkoutError}</p>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-1">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="bg-white dark:bg-[#111] p-8 rounded-2xl border border-gray-200 dark:border-gray-800">
              <h2 className="text-xl font-bold mb-6">Contact Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input {...register("email")} className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-transparent" placeholder="you@example.com" />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>
              </div>

              <h2 className="text-xl font-bold mt-10 mb-6">Shipping Address</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">First Name</label>
                  <input {...register("firstName")} className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-transparent" />
                  {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Last Name</label>
                  <input {...register("lastName")} className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-transparent" />
                  {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2">Address</label>
                  <input {...register("address")} className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-transparent" />
                  {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">City</label>
                  <input {...register("city")} className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-transparent" />
                  {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Country</label>
                  <input {...register("country")} className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-transparent" />
                  {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">ZIP Code</label>
                  <input {...register("zipCode")} className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-transparent" />
                  {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode.message}</p>}
                </div>
              </div>
              
              <h2 className="text-xl font-bold mt-10 mb-6">Payment Method (Mock)</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2">Card Number</label>
                  <input {...register("cardNumber")} className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-transparent" placeholder="0000 0000 0000 0000" />
                  {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Expiry (MM/YY)</label>
                  <input {...register("expiry")} className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-transparent" placeholder="MM/YY" />
                  {errors.expiry && <p className="text-red-500 text-sm mt-1">{errors.expiry.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">CVV</label>
                  <input {...register("cvv")} type="password" className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-transparent" placeholder="123" />
                  {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv.message}</p>}
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isSubmitting ? "Processing..." : `Pay $${total.toFixed(2)}`}
            </button>
          </form>
        </div>

        <div className="w-full lg:w-[400px] shrink-0">
          <div className="bg-gray-50 dark:bg-[#1a1a1a] rounded-2xl p-8 border border-gray-200 dark:border-gray-800 sticky top-24">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              {items.map(item => (
                <div key={item.productId} className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">{item.quantity}x {item.name}</span>
                  <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mb-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                <span className="font-medium">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                <span className="font-medium">Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Tax (0%)</span>
                <span className="font-medium">$0.00</span>
              </div>
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 flex justify-between items-center">
              <span className="text-lg font-bold">Total</span>
              <span className="text-2xl font-bold text-blue-600">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
