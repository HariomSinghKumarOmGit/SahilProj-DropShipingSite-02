import { prisma } from "@/lib/prisma"

/**
 * Fetches the single StoreSettings record (or returns sensible defaults).
 * Safe to call from any Server Component.
 */
export async function getStoreSettings() {
  const settings = await prisma.storeSettings.findFirst()
  return {
    logoUrl: settings?.logoUrl ?? "/logo.png",
    bannerUrl: settings?.bannerUrl ?? null,
  }
}
