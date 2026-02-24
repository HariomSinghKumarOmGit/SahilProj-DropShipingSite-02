"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createCategoryAction(formData: FormData) {
  const session = await auth()
  if (!session || (session.user as any).role !== "ADMIN") {
    throw new Error("Unauthorized")
  }

  const name = formData.get("name") as string

  if (!name) {
    throw new Error("Category name is required")
  }

  await prisma.category.create({
    data: { name }
  })

  revalidatePath("/dashboard/categories")
}

export async function deleteCategoryAction(formData: FormData) {
  const session = await auth()
  if (!session || (session.user as any).role !== "ADMIN") {
    throw new Error("Unauthorized")
  }

  const id = formData.get("id") as string

  if (!id) {
    throw new Error("Category ID is required")
  }

  await prisma.category.delete({
    where: { id }
  })

  revalidatePath("/dashboard/categories")
}
