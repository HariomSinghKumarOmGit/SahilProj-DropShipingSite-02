import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import SettingsForm from "./SettingsForm"

export default async function SettingsPage() {
  const session = await auth()
  if (!session || (session.user as any).role !== "ADMIN") {
    redirect("/login")
  }

  const settings = await prisma.storeSettings.findFirst()

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <header className="mb-8">
        <h1 className="text-2xl font-bold">Site Settings</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage your storefront logo and homepage banner
        </p>
      </header>

      <SettingsForm
        currentLogo={settings?.logoUrl ?? null}
        currentBanner={settings?.bannerUrl ?? null}
      />
    </div>
  )
}
