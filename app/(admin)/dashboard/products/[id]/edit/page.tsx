import { auth } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { updateProductAction } from "@/actions/product"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { ArrowLeft, Save, Upload, Package } from "lucide-react"

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const session = await auth()
  if (!session || (session.user as any).role !== "ADMIN") {
    redirect("/login")
  }
  
  const product = await prisma.product.findUnique({
    where: { id: params.id }
  })

  if (!product) {
    notFound()
  }

  const categories = await prisma.category.findMany()
  const updateAction = updateProductAction.bind(null, product.id)

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <header className="flex items-center gap-4 mb-8">
        <Link href="/dashboard/products" className="p-2 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Edit Product</h1>
          <p className="text-gray-500 text-sm mt-1">Update inventory mapping for {product.name}</p>
        </div>
      </header>

      <form action={updateAction} className="space-y-6">
        <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Package size={20} className="text-blue-600" /> Basic Details
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold">Product Name</label>
              <input 
                type="text" 
                name="name" 
                defaultValue={product.name}
                required 
                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-[#1a1a1a] focus:ring-2 focus:ring-blue-500 outline-none" 
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold">Description</label>
              <textarea 
                name="description" 
                rows={4} 
                defaultValue={product.description}
                required
                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-[#1a1a1a] focus:ring-2 focus:ring-blue-500 outline-none resize-none" 
              ></textarea>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Category</label>
              <select 
                name="categoryId" 
                defaultValue={product.categoryId}
                required 
                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-[#1a1a1a] focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Select Category</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Price ($)</label>
              <input 
                type="number" 
                name="price"
                defaultValue={product.price}
                step="0.01" 
                min="0"
                required 
                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-[#1a1a1a] focus:ring-2 focus:ring-blue-500 outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Stock Quantity</label>
              <input 
                type="number" 
                name="stock"
                defaultValue={product.stock}
                min="0"
                required 
                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-[#1a1a1a] focus:ring-2 focus:ring-blue-500 outline-none" 
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold flex justify-between">
                <span>Product Image</span>
                {product.imageUrl && <span className="text-gray-500 text-xs font-normal">Leave blank to keep current image</span>}
              </label>
              <div className="border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl p-8 text-center bg-gray-50 dark:bg-[#1a1a1a] hover:bg-gray-100 dark:hover:bg-[#222] transition relative overflow-hidden">
                <input 
                  type="file" 
                  name="image" 
                  accept="image/png, image/jpeg, image/webp"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="relative z-0">
                  <Upload className="mx-auto text-gray-400 mb-3" size={32} />
                  <p className="font-semibold text-gray-700 dark:text-gray-300">Click or drag new image to update</p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG or WEBP up to 5MB</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Link href="/dashboard/products" className="px-6 py-2.5 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition">
            Cancel
          </Link>
          <button type="submit" className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2">
            <Save size={18} /> Update Product
          </button>
        </div>
      </form>
    </div>
  )
}
