"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useCartStore } from "@/lib/store"
import { formatINR } from "@/lib/format"
import { CheckCircle2, AlertCircle, Shield } from "lucide-react"
import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { processCheckout } from "@/actions/checkout"

/* ─── Razorpay type declarations ────────────────────────────────── */
declare global {
  interface Window {
    Razorpay: any
  }
}

/* ─── Zod schema (card fields removed) ──────────────────────────── */
const checkoutSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  zipCode: z.string().min(3, "PIN code is required"),
  country: z.string().min(2, "Country is required"),
})

type CheckoutForm = z.infer<typeof checkoutSchema>

/* ─── Helper: load Razorpay checkout script once ────────────────── */
function useRazorpayScript() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined" && window.Razorpay) {
      setLoaded(true)
      return
    }

    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.async = true
    script.onload = () => setLoaded(true)
    script.onerror = () => console.error("Failed to load Razorpay script")
    document.body.appendChild(script)

    return () => {
      // Don't remove — kept for SPA navigation
    }
  }, [])

  return loaded
}

/* ═══════════════════════════════════════════════════════════════════
   Main Checkout Page
   ═══════════════════════════════════════════════════════════════════ */
export default function CheckoutPage() {
  const { items, getTotal, clearCart, addItem } = useCartStore()
  const [isSuccess, setIsSuccess] = useState(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)
  const [isPaying, setIsPaying] = useState(false)
  const razorpayLoaded = useRazorpayScript()
  const searchParams = useSearchParams()

  /* ── Buy-Now → pre-populate cart from URL params ────────────── */
  useEffect(() => {
    const productId = searchParams.get("productId")
    const price = searchParams.get("price")
    const name = searchParams.get("name")
    const image = searchParams.get("image")

    if (productId && price && name) {
      // Only add if not already in cart
      const alreadyInCart = items.some((i) => i.productId === productId)
      if (!alreadyInCart) {
        addItem({
          productId,
          name: decodeURIComponent(name),
          price: parseFloat(price),
          quantity: 1,
          imageUrl: image ? decodeURIComponent(image) : undefined,
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const total = getTotal()

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { country: "India" },
  })

  /* ── Open Razorpay modal after form validation ──────────────── */
  const initiatePayment = useCallback(
    async (formData: CheckoutForm) => {
      setCheckoutError(null)
      setIsPaying(true)

      try {
        // 1. Create Razorpay Order on our backend
        const res = await fetch("/api/razorpay", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: total }),
        })

        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.error || "Could not create payment order.")
        }

        const { orderId, key } = await res.json()

        // 2. Open Razorpay Checkout modal
        const options = {
          key,
          amount: Math.round(total * 100), // paise
          currency: "INR",
          name: "SitePay Store",
          description: `Order – ${items.length} item(s)`,
          order_id: orderId,
          prefill: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
          },
          theme: { color: "#2563eb" },
          handler: async (response: any) => {
            // 3. Payment succeeded → create order in DB
            const orderPayload = {
              ...formData,
              razorpayPaymentId: response.razorpay_payment_id,
              items: items.map((i) => ({
                productId: i.productId,
                quantity: i.quantity,
                price: i.price,
              })),
            }

            const result = await processCheckout(orderPayload)

            if (!result.success) {
              setCheckoutError(result.error || "Order creation failed.")
              setIsPaying(false)
              return
            }

            setIsSuccess(true)
            clearCart()
          },
          modal: {
            ondismiss: () => {
              setIsPaying(false)
            },
          },
        }

        const rzp = new window.Razorpay(options)
        rzp.on("payment.failed", (res: any) => {
          setCheckoutError(
            res.error?.description || "Payment failed. Please try again."
          )
          setIsPaying(false)
        })
        rzp.open()
      } catch (err: any) {
        setCheckoutError(err.message || "Something went wrong.")
        setIsPaying(false)
      }
    },
    [total, items, clearCart]
  )

  /* ── Success State ──────────────────────────────────────────── */
  if (isSuccess) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-32 text-center min-h-[70vh] flex flex-col items-center justify-center">
        <CheckCircle2 size={64} className="text-green-500 mb-6" />
        <h1 className="text-4xl font-bold mb-4">Payment Successful!</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          Thank you for your order. We&apos;ve sent a confirmation email with your
          order details.
        </p>
        <Link
          href="/shop"
          className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
        >
          Continue Shopping
        </Link>
      </div>
    )
  }

  /* ── Empty Cart State ───────────────────────────────────────── */
  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 min-h-[70vh] flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <Link href="/shop" className="text-blue-600 hover:underline">
          Return to Shop
        </Link>
      </div>
    )
  }

  /* ── Main Checkout UI ───────────────────────────────────────── */
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
        {/* ──────── Left: Shipping Form ──────── */}
        <div className="flex-1">
          <form
            id="checkout-form"
            onSubmit={handleSubmit(initiatePayment)}
            className="space-y-8"
          >
            <div className="bg-white dark:bg-[#111] p-8 rounded-2xl border border-gray-200 dark:border-gray-800">
              <h2 className="text-xl font-bold mb-6">Contact Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    {...register("email")}
                    className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-transparent"
                    placeholder="you@example.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <h2 className="text-xl font-bold mt-10 mb-6">
                Shipping Address
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    First Name
                  </label>
                  <input
                    {...register("firstName")}
                    className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-transparent"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Last Name
                  </label>
                  <input
                    {...register("lastName")}
                    className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-transparent"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2">
                    Address
                  </label>
                  <input
                    {...register("address")}
                    className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-transparent"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.address.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">City</label>
                  <input
                    {...register("city")}
                    className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-transparent"
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.city.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Country
                  </label>
                  <input
                    {...register("country")}
                    className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-transparent"
                  />
                  {errors.country && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.country.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    PIN Code
                  </label>
                  <input
                    {...register("zipCode")}
                    className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-transparent"
                  />
                  {errors.zipCode && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.zipCode.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Razorpay trust badge */}
              <div className="mt-8 flex items-center gap-2 text-sm text-gray-500">
                <Shield size={16} className="text-green-600" />
                <span>
                  Secured by <strong>Razorpay</strong> — UPI, Cards, Net
                  Banking &amp; more
                </span>
              </div>
            </div>

            {/* Confirm & Pay Button */}
            <button
              type="submit"
              disabled={isPaying || !razorpayLoaded}
              className="w-full bg-blue-600 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 transition disabled:opacity-50 shadow-lg shadow-blue-500/20"
            >
              {isPaying
                ? "Processing..."
                : !razorpayLoaded
                ? "Loading payment..."
                : `Confirm & Pay ${formatINR(total)}`}
            </button>
          </form>
        </div>

        {/* ──────── Right: Order Summary ──────── */}
        <div className="w-full lg:w-[400px] shrink-0">
          <div className="bg-gray-50 dark:bg-[#1a1a1a] rounded-2xl p-8 border border-gray-200 dark:border-gray-800 sticky top-24">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex justify-between text-sm"
                >
                  <span className="text-gray-600 dark:text-gray-400">
                    {item.quantity}x {item.name}
                  </span>
                  <span className="font-medium">
                    {formatINR(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mb-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Subtotal
                </span>
                <span className="font-medium">{formatINR(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Shipping
                </span>
                <span className="font-medium">Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Tax (0%)
                </span>
                <span className="font-medium">{formatINR(0)}</span>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 flex justify-between items-center">
              <span className="text-lg font-bold">Total</span>
              <span className="text-2xl font-bold text-blue-600">
                {formatINR(total)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
