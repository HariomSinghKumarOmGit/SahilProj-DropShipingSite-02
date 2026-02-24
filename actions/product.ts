"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import fs from "fs/promises"
import path from "path"

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
  
  const imageFiles = formData.getAll("images") as File[]
  const imageUrls: String[] = []

  for (const imageFile of imageFiles) {
    if (imageFile && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer()
      const buffer = Buffer.from(bytes)

      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`
      const ext = path.extname(imageFile.name) || '.jpg'
      const fileName = `product-${uniqueSuffix}${ext}`
      
      const uploadsDir = path.join(process.cwd(), "public", "uploads")
      
      try {
        await fs.mkdir(uploadsDir, { recursive: true })
      } catch(e) {}
      
      const filePath = path.join(uploadsDir, fileName)
      await fs.writeFile(filePath, buffer)
      
      imageUrls.push(`/uploads/${fileName}`)
    }
  }

  await prisma.product.create({
    data: {
      name,
      description,
      price,
      stock,
      categoryId,
      images: imageUrls
    }
  })

  redirect("/dashboard/products")
}

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
  
  const imageFiles = formData.getAll("images") as File[]
  const imageUrls: String[] = []

  for (const imageFile of imageFiles) {
    if (imageFile && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer()
      const buffer = Buffer.from(bytes)

      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`
      const ext = path.extname(imageFile.name) || '.jpg'
      const fileName = `product-${uniqueSuffix}${ext}`
      
      const uploadsDir = path.join(process.cwd(), "public", "uploads")
      
      try {
        await fs.mkdir(uploadsDir, { recursive: true })
      } catch(e) {}
      
      const filePath = path.join(uploadsDir, fileName)
      await fs.writeFile(filePath, buffer)
      
      imageUrls.push(`/uploads/${fileName}`)
    }
  }

  await prisma.product.update({
    where: { id },
    data: {
      name,
      description,
      price,
      stock,
      categoryId,
      ...(imageUrls.length > 0 && { images: imageUrls })
    }
  })

  redirect("/dashboard/products")
}
