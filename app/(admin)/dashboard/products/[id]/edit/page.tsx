import { auth } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { updateProductAction } from "@/actions/product"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import ProductForm from "@/components/admin/ProductForm"

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params
  const id = resolvedParams.id

  const session = await auth()
  if (!session || (session.user as any).role !== "ADMIN") {
    redirect("/login")
  }

  const product = await prisma.product.findUnique({ where: { id } })
  if (!product) notFound()

  const categories = await prisma.category.findMany()
  const updateAction = updateProductAction.bind(null, product.id)

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
          <h1 className="text-2xl font-bold">Edit Product</h1>
          <p className="text-gray-500 text-sm mt-1">
            Update inventory mapping for {product.name}
          </p>
        </div>
      </header>

      <ProductForm
        categories={categories}
        product={product}
        formAction={updateAction}
      />
    </div>
  )
}
