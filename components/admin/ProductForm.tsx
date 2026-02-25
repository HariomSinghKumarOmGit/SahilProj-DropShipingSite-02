"use client"

import { useState, useRef, useCallback, useTransition } from "react"
import Link from "next/link"
import {
  Save,
  Upload,
  Package,
  Image as ImageIcon,
  Star,
  X,
  Plus,
} from "lucide-react"

/* ── Types ─────────────────────────────────────────────────────── */

type Category = { id: string; name: string }

type ExistingProduct = {
  id: string
  name: string
  description: string | null
  price: number
  stock: number | null
  categoryId: string | null
  images: string[]
  thumbnails: string[]
  rating: number
  reviewCount: number
}

type ImagePreview = {
  file: File
  preview: string
}

type Props = {
  categories: Category[]
  product?: ExistingProduct | null
  formAction: (formData: FormData) => Promise<void>
}

/* ── Component ─────────────────────────────────────────────────── */

export default function ProductForm({ categories, product, formAction }: Props) {
  const [galleryPreviews, setGalleryPreviews] = useState<ImagePreview[]>([])
  const [thumbnailPreviews, setThumbnailPreviews] = useState<ImagePreview[]>([])
  const [isPending, startTransition] = useTransition()

  const galleryInputRef = useRef<HTMLInputElement>(null)
  const thumbnailInputRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  /* ── handlers ── */

  const handleFiles = useCallback(
    (
      files: FileList | null,
      setter: React.Dispatch<React.SetStateAction<ImagePreview[]>>
    ) => {
      if (!files) return
      const newPreviews = Array.from(files).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }))
      setter((prev) => [...prev, ...newPreviews])
    },
    []
  )

  const removePreview = useCallback(
    (
      index: number,
      setter: React.Dispatch<React.SetStateAction<ImagePreview[]>>
    ) => {
      setter((prev) => {
        URL.revokeObjectURL(prev[index].preview)
        return prev.filter((_, i) => i !== index)
      })
    },
    []
  )

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const form = e.currentTarget
    const fd = new FormData()

    /* scalar fields */
    const fields = ["name", "description", "categoryId", "price", "stock", "rating", "reviewCount"]
    for (const name of fields) {
      const el = form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null
      if (el) fd.append(name, el.value)
    }

    /* files */
    for (const p of galleryPreviews) fd.append("gallery_images", p.file)
    for (const p of thumbnailPreviews) fd.append("thumbnail_images", p.file)

    startTransition(() => {
      formAction(fd)
    })
  }

  const isEdit = !!product

  /* ── UI ── */

  const inputClass =
    "w-full px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-[#1a1a1a] focus:ring-2 focus:ring-blue-500 outline-none transition"

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ── Basic Details ─────────────────────────────────── */}
      <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Package size={20} className="text-blue-600" /> Basic Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold">Product Name</label>
            <input
              type="text"
              name="name"
              defaultValue={product?.name ?? ""}
              required
              className={inputClass}
            />
          </div>

          {/* Description */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold">Description</label>
            <textarea
              name="description"
              rows={4}
              defaultValue={product?.description ?? ""}
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">Category</label>
            <select
              name="categoryId"
              defaultValue={product?.categoryId ?? ""}
              className={inputClass}
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">Price (₹)</label>
            <input
              type="number"
              name="price"
              defaultValue={product?.price ?? ""}
              step="0.01"
              min="0"
              required
              className={inputClass}
            />
          </div>

          {/* Stock */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">Stock Quantity</label>
            <input
              type="number"
              name="stock"
              defaultValue={product?.stock ?? 0}
              min="0"
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* ── Reviews / Social Proof ────────────────────────── */}
      <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Star size={20} className="text-amber-500" /> Reviews &amp; Social Proof
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Star Rating</label>
            <input
              type="number"
              name="rating"
              defaultValue={product?.rating ?? 5.0}
              step="0.1"
              min="0"
              max="5"
              className={inputClass}
            />
            <p className="text-xs text-gray-400">0 – 5 (supports decimals like 4.5)</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Review Count</label>
            <input
              type="number"
              name="reviewCount"
              defaultValue={product?.reviewCount ?? 0}
              min="0"
              className={inputClass}
            />
            <p className="text-xs text-gray-400">Number displayed next to stars</p>
          </div>
        </div>
      </div>

      {/* ── Gallery Images ────────────────────────────────── */}
      <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold mb-1 flex items-center gap-2">
          <Upload size={20} className="text-emerald-600" /> Gallery Images
        </h2>
        <p className="text-gray-500 text-xs mb-4">
          Upload 4–5 product shots for the product detail page gallery
          {isEdit && product!.images?.length > 0 && (
            <span className="ml-1 text-emerald-600 font-medium">
              • Currently {product!.images.length} image
              {product!.images.length > 1 ? "s" : ""} saved — upload new to
              replace
            </span>
          )}
        </p>

        <div className="flex flex-wrap gap-3">
          {/* existing images (edit mode) */}
          {isEdit &&
            galleryPreviews.length === 0 &&
            (product!.images ?? []).map((src, i) => (
              <div
                key={`existing-g-${i}`}
                className="w-28 h-28 rounded-xl overflow-hidden border-2 border-emerald-200 dark:border-emerald-800 relative group"
              >
                <img
                  src={src}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <span className="text-white text-xs font-semibold">
                    Saved
                  </span>
                </div>
              </div>
            ))}

          {/* new preview thumbnails */}
          {galleryPreviews.map((p, i) => (
            <div
              key={`preview-g-${i}`}
              className="w-28 h-28 rounded-xl overflow-hidden border-2 border-emerald-400 relative group"
            >
              <img
                src={p.preview}
                alt=""
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removePreview(i, setGalleryPreviews)}
                className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-lg"
              >
                <X size={14} />
              </button>
            </div>
          ))}

          {/* upload trigger box */}
          <button
            type="button"
            onClick={() => galleryInputRef.current?.click()}
            className="w-28 h-28 rounded-xl border-2 border-dashed border-emerald-300 dark:border-emerald-700 flex flex-col items-center justify-center gap-1 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition cursor-pointer"
          >
            <Plus size={22} />
            <span className="text-[10px] font-semibold">Add Images</span>
          </button>
        </div>

        <input
          ref={galleryInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files, setGalleryPreviews)}
        />
      </div>

      {/* ── Thumbnail Images ──────────────────────────────── */}
      <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold mb-1 flex items-center gap-2">
          <ImageIcon size={20} className="text-violet-600" /> Thumbnail Images
        </h2>
        <p className="text-gray-500 text-xs mb-4">
          Upload 1–2 images for the shop grid (used for hover-swap effect)
          {isEdit && product!.thumbnails?.length > 0 && (
            <span className="ml-1 text-violet-600 font-medium">
              • Currently {product!.thumbnails.length} thumbnail
              {product!.thumbnails.length > 1 ? "s" : ""} saved — upload new to
              replace
            </span>
          )}
        </p>

        <div className="flex flex-wrap gap-3">
          {/* existing thumbnails (edit mode) */}
          {isEdit &&
            thumbnailPreviews.length === 0 &&
            (product!.thumbnails ?? []).map((src, i) => (
              <div
                key={`existing-t-${i}`}
                className="w-28 h-28 rounded-xl overflow-hidden border-2 border-violet-200 dark:border-violet-800 relative group"
              >
                <img
                  src={src}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <span className="text-white text-xs font-semibold">
                    Saved
                  </span>
                </div>
              </div>
            ))}

          {/* new preview thumbnails */}
          {thumbnailPreviews.map((p, i) => (
            <div
              key={`preview-t-${i}`}
              className="w-28 h-28 rounded-xl overflow-hidden border-2 border-violet-400 relative group"
            >
              <img
                src={p.preview}
                alt=""
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removePreview(i, setThumbnailPreviews)}
                className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-lg"
              >
                <X size={14} />
              </button>
            </div>
          ))}

          {/* upload trigger box */}
          <button
            type="button"
            onClick={() => thumbnailInputRef.current?.click()}
            className="w-28 h-28 rounded-xl border-2 border-dashed border-violet-300 dark:border-violet-700 flex flex-col items-center justify-center gap-1 text-violet-500 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition cursor-pointer"
          >
            <Plus size={22} />
            <span className="text-[10px] font-semibold">Add Images</span>
          </button>
        </div>

        <input
          ref={thumbnailInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files, setThumbnailPreviews)}
        />
      </div>

      {/* ── Actions ───────────────────────────────────────── */}
      <div className="flex justify-end gap-4">
        <Link
          href="/dashboard/products"
          className="px-6 py-2.5 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-60"
        >
          <Save size={18} />
          {isPending
            ? "Saving…"
            : isEdit
              ? "Update Product"
              : "Save Product"}
        </button>
      </div>
    </form>
  )
}
