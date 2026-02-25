"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { saveFiles } from "@/lib/upload"

/* ── Create Product ─────────────────────────────────────────────── */
export async function createProductAction(formData: FormData) {
  const session = await auth()
  if (!session || (session.user as any).role !== "ADMIN") {
    throw new Error("Unauthorized")
  }

  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const categoryId = formData.get("categoryId") as string
  const price = parseFloat(formData.get("price") as string)
  const stock = parseInt(formData.get("stock") as string, 10)
  const rating = parseFloat(formData.get("rating") as string) || 5.0
  const reviewCount = parseInt(formData.get("reviewCount") as string, 10) || 0

  // ── Gallery images (4-5 product shots) → public/uploads/products/
  const galleryFiles = formData.getAll("gallery_images") as File[]
  const galleryPaths = await saveFiles(galleryFiles, "products")

  // ── Thumbnail images (1-2 hover/grid images) → public/uploads/thumbnails/
  const thumbnailFiles = formData.getAll("thumbnail_images") as File[]
  const thumbnailPaths = await saveFiles(thumbnailFiles, "thumbnails")

  await prisma.product.create({
    data: {
      name,
      description,
      price,
      stock,
      categoryId,
      rating,
      reviewCount,
      images: galleryPaths,
      thumbnails: thumbnailPaths,
    },
  })

  revalidatePath("/dashboard/products")
  redirect("/dashboard/products")
}

/* ── Update Product ─────────────────────────────────────────────── */
export async function updateProductAction(id: string, formData: FormData) {
  const session = await auth()
  if (!session || (session.user as any).role !== "ADMIN") {
    throw new Error("Unauthorized")
  }

  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const categoryId = formData.get("categoryId") as string
  const price = parseFloat(formData.get("price") as string)
  const stock = parseInt(formData.get("stock") as string, 10)
  const rating = parseFloat(formData.get("rating") as string) || 5.0
  const reviewCount = parseInt(formData.get("reviewCount") as string, 10) || 0

  // ── Gallery images → only overwrite if new files uploaded
  const galleryFiles = formData.getAll("gallery_images") as File[]
  const galleryPaths = await saveFiles(galleryFiles, "products")

  // ── Thumbnail images → only overwrite if new files uploaded
  const thumbnailFiles = formData.getAll("thumbnail_images") as File[]
  const thumbnailPaths = await saveFiles(thumbnailFiles, "thumbnails")

  await prisma.product.update({
    where: { id },
    data: {
      name,
      description,
      price,
      stock,
      categoryId,
      rating,
      reviewCount,
      ...(galleryPaths.length > 0 && { images: galleryPaths }),
      ...(thumbnailPaths.length > 0 && { thumbnails: thumbnailPaths }),
    },
  })

  revalidatePath("/dashboard/products")
  redirect("/dashboard/products")
}

/* ── Delete Product ─────────────────────────────────────────────── */
export async function deleteProductAction(id: string) {
  const session = await auth()
  if (!session || (session.user as any).role !== "ADMIN") {
    throw new Error("Unauthorized")
  }

  try {
    const exists = await prisma.product.findUnique({ where: { id }, select: { id: true } })
    if (!exists) {
      console.warn(`[deleteProductAction] Product ${id} not found — already deleted?`)
      revalidatePath("/dashboard/products")
      return
    }

    await prisma.product.delete({ where: { id } })
    revalidatePath("/dashboard/products")
  } catch (err: any) {
    console.error("[deleteProductAction] Error:", err?.message)
    throw new Error("Failed to delete product. Please try again.")
  }
}
