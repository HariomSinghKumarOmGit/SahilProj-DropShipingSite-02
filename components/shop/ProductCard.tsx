"use client"

import { useState } from "react"
import { ShoppingBag, X, Star, Check } from "lucide-react"
import { useCartStore } from "@/lib/store"
import BuyNowButton from "./BuyNowButton"

type Product = {
  id: string
  name: string
  price: number
  images: string[]
  description?: string | null
  category?: { name: string } | null
  rating?: number
  reviewCount?: number
}

const FALLBACK = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"

function resolveImage(url: string | null | undefined) {
  if (!url) return FALLBACK
  if (url.startsWith("http")) return url
  if (url.startsWith("/")) return url
  return `/uploads/${url}`
}

/* ─── Product Quick-View Modal ──────────────────────────────────── */
function ProductModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const [selectedImg, setSelectedImg] = useState(0)
  const [added, setAdded] = useState(false)
  const { addItem } = useCartStore()

  const images =
    product.images?.length > 0
      ? product.images.map(resolveImage)
      : [FALLBACK, FALLBACK]

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: images[0],
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="relative z-10 bg-white dark:bg-[#1a1a1a] rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          <X size={18} />
        </button>

        {/* Images Panel */}
        <div className="md:w-1/2 p-6 space-y-4">
          {/* Main Image */}
          <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden">
            <img
              src={images[selectedImg]}
              alt={product.name}
              className="w-full h-full object-cover transition-all duration-400"
            />
          </div>

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImg(i)}
                  className={`w-16 h-16 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                    i === selectedImg
                      ? "border-blue-500 scale-105"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details Panel */}
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
          <div>
            {product.category && (
              <span className="text-xs font-semibold uppercase tracking-widest text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full">
                {product.category.name}
              </span>
            )}
            <h2 className="text-2xl md:text-3xl font-bold mt-3 mb-2 leading-tight">
              {product.name}
            </h2>

            {/* Stars */}
            <div className="flex items-center gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((s) => {
                const r = product.rating ?? 5
                if (s <= Math.floor(r)) return <Star key={s} size={15} fill="#f59e0b" stroke="none" />
                if (s === Math.ceil(r) && r % 1 >= 0.3) return <Star key={s} size={15} fill="#f59e0b" stroke="none" className="opacity-50" />
                return <Star key={s} size={15} fill="#d1d5db" stroke="none" />
              })}
              <span className="text-sm text-gray-500 ml-2">({product.reviewCount ?? 0} reviews)</span>
            </div>

            {product.description && (
              <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                {product.description}
              </p>
            )}

            <div className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6">
              ₹{product.price.toFixed(0)}
              <span className="text-base font-normal text-gray-400 line-through ml-3">
                ₹{(product.price * 1.5).toFixed(0)}
              </span>
              <span className="ml-3 text-sm font-semibold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full">
                33% off
              </span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3 mt-4">
            <button
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 shadow-lg shadow-blue-500/30"
              onClick={handleAddToCart}
            >
              {added ? (
                <>
                  <Check size={20} /> Added to Cart!
                </>
              ) : (
                <>
                  <ShoppingBag size={20} /> Add to Cart
                </>
              )}
            </button>
            <BuyNowButton
              product={product}
              className="w-full py-4 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 font-bold rounded-2xl flex items-center justify-center gap-2 transition-all duration-200 active:scale-95"
            >
              Buy Now →
            </BuyNowButton>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Product Card ──────────────────────────────────────────────── */
export default function ProductCard({ product }: { product: Product }) {
  const [hovered, setHovered] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const { addItem } = useCartStore()

  const img0 = resolveImage(product.images?.[0])
  const img1 = resolveImage(product.images?.[1] || product.images?.[0])

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation()
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: img0,
    })
  }

  return (
    <>
      {/* Modal */}
      {modalOpen && (
        <ProductModal product={product} onClose={() => setModalOpen(false)} />
      )}

      {/* Card */}
      <div
        className={`group cursor-pointer flex flex-col rounded-2xl bg-white dark:bg-[#1a1a1a] shadow-sm hover:shadow-xl transition-all duration-300 ${
          hovered ? "-translate-y-2 scale-[1.02]" : ""
        }`}
        style={{ transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease" }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => setModalOpen(true)}
      >
        {/* Image Container */}
        <div className="relative aspect-square rounded-t-2xl overflow-hidden bg-gray-100 dark:bg-gray-800">
          {/* Primary image */}
          <img
            src={img0}
            alt={product.name}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${
              hovered ? "opacity-0 scale-110" : "opacity-100 scale-100"
            }`}
          />
          {/* Secondary image on hover */}
          <img
            src={img1}
            alt={product.name}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${
              hovered ? "opacity-100 scale-105" : "opacity-0 scale-110"
            }`}
          />

          {/* Quick View Overlay */}
          <div
            className={`absolute inset-0 flex items-end p-3 transition-all duration-300 ${
              hovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <button
              className="w-full bg-white/90 backdrop-blur-sm text-gray-900 text-sm font-semibold py-2.5 rounded-xl shadow-md hover:bg-white transition"
              onClick={(e) => {
                e.stopPropagation()
                setModalOpen(true)
              }}
            >
              Quick View
            </button>
          </div>

          {/* Badge */}
          <div className="absolute top-2 left-2 bg-amber-400 text-white text-xs font-bold px-2 py-1 rounded-lg shadow">
            HOT
          </div>
        </div>

        {/* Info */}
        <div className="p-4 flex flex-col gap-1">
          {product.category && (
            <p className="text-xs font-semibold text-blue-500 uppercase tracking-wide">
              {product.category.name}
            </p>
          )}
          <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 text-sm leading-snug">
            {product.name}
          </h3>

          {/* Stars */}
          <div className="flex items-center gap-0.5 mt-0.5">
            {[1, 2, 3, 4, 5].map((s) => {
              const r = product.rating ?? 5
              if (s <= Math.floor(r)) return <Star key={s} size={11} fill="#f59e0b" stroke="none" />
              if (s === Math.ceil(r) && r % 1 >= 0.3) return <Star key={s} size={11} fill="#f59e0b" stroke="none" className="opacity-50" />
              return <Star key={s} size={11} fill="#d1d5db" stroke="none" />
            })}
            <span className="text-xs text-gray-400 ml-1">({product.reviewCount ?? 0})</span>
          </div>

          {/* Price Row */}
          <div className="flex items-center justify-between mt-1 pt-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-lg font-extrabold text-gray-900 dark:text-white">
                ₹{product.price.toFixed(0)}
              </span>
              <span className="text-sm text-gray-400 line-through">
                ₹{(product.price * 1.5).toFixed(0)}
              </span>
              <span className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-1.5 py-0.5 rounded-md hidden md:inline-block">
                33% off
              </span>
            </div>
            
            <button
              onClick={handleQuickAdd}
              className="md:hidden p-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full hover:bg-gray-800 dark:hover:bg-gray-100 transition shadow-sm"
              aria-label="Add to cart"
            >
              <ShoppingBag size={18} />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
