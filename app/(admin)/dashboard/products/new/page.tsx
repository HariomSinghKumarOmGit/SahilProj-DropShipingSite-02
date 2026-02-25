import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { createProductAction } from "@/actions/product"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import ProductForm from "@/components/admin/ProductForm"

export default async function NewProductPage() {
  const session = await auth()
  if (!session || (session.user as any).role !== "ADMIN") {
    redirect("/login")
  }

  const categories = await prisma.category.findMany()

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <header className="flex items-center gap-4 mb-8">
        <Link
          href="/dashboard/products"
          className="p-2 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Add New Product</h1>
          <p className="text-gray-500 text-sm mt-1">
            Create a new product listing in your catalog
          </p>
        </div>
      </header>

      <ProductForm categories={categories} formAction={createProductAction} />
    </div>
  )
}
