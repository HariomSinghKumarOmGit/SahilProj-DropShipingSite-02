import { prisma } from "@/lib/prisma"

/**
 * Fetches the single StoreSettings record (or returns sensible defaults).
 * Safe to call from any Server Component.
 */
export async function getStoreSettings() {
  try {
    const settings = await prisma.storeSettings.findFirst()
    return {
      logoUrl: settings?.logoUrl ?? "/logo.png",
      bannerUrl: settings?.bannerUrl ?? null,
    }
  } catch (error) {
    console.error("Database connection failed in getStoreSettings:", error)
    return {
      logoUrl: "/logo.png",
      bannerUrl: null,
    }
  }
}
