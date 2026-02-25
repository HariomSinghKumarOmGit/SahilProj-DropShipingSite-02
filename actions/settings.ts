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
  
  // Existing banners the user didn't delete from the UI
  const keptBannersRaw = formData.get("keptBanners") as string | null
  let finalBanners: string[] = []
  if (keptBannersRaw) {
    try {
      finalBanners = JSON.parse(keptBannersRaw)
    } catch (e) {
      console.error("Failed to parse keptBanners", e)
    }
  }

  // Process logo upload
  const logoFile = formData.get("logo") as File | null
  if (logoFile && logoFile.size > 0) {
    logoUrl = await saveFile(logoFile, "logos")
  }

  // Process new banner uploads
  const newBannerFiles = formData.getAll("newBanners") as File[]
  for (const file of newBannerFiles) {
    if (file && file.size > 0) {
      const savedPath = await saveFile(file, "banners")
      finalBanners.push(savedPath)
    }
  }

  // Upsert the single settings record
  if (current) {
    await prisma.storeSettings.update({
      where: { id: current.id },
      data: { logoUrl, bannerUrls: finalBanners },
    })
  } else {
    await prisma.storeSettings.create({
      data: { logoUrl, bannerUrls: finalBanners },
    })
  }

  // Revalidate the entire site so Header & Homepage pick up changes
  revalidatePath("/", "layout")
}
