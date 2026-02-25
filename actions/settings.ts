"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { saveFile } from "@/lib/upload"

export async function updateSettingsAction(formData: FormData) {
  const session = await auth()
  if (!session || (session.user as any).role !== "ADMIN") {
    throw new Error("Unauthorized")
  }

  // Get current settings (if any)
  const current = await prisma.storeSettings.findFirst()

  let logoUrl = current?.logoUrl ?? null
  let bannerUrl = current?.bannerUrl ?? null

  // Process logo upload
  const logoFile = formData.get("logo") as File | null
  if (logoFile && logoFile.size > 0) {
    logoUrl = await saveFile(logoFile, "logos")
  }

  // Process banner upload
  const bannerFile = formData.get("banner") as File | null
  if (bannerFile && bannerFile.size > 0) {
    bannerUrl = await saveFile(bannerFile, "banners")
  }

  // Upsert the single settings record
  if (current) {
    await prisma.storeSettings.update({
      where: { id: current.id },
      data: { logoUrl, bannerUrl },
    })
  } else {
    await prisma.storeSettings.create({
      data: { logoUrl, bannerUrl },
    })
  }

  // Revalidate the entire site so Header & Homepage pick up changes
  revalidatePath("/", "layout")
}
