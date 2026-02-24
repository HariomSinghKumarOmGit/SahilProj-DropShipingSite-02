import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { createProductAction } from "@/actions/product"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { ArrowLeft, Save, Upload, Package } from "lucide-react"

export default async function NewProductPage() {
  const session = await auth()
  if (!session || (session.user as any).role !== "ADMIN") {
    redirect("/login")
  }
  
  const categories = await prisma.category.findMany()

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <header className="flex items-center gap-4 mb-8">
        <Link href="/dashboard/products" className="p-2 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Add New Product</h1>
          <p className="text-gray-500 text-sm mt-1">Create a new product listing in your catalog</p>
        </div>
      </header>

      <form action={createProductAction} className="space-y-6">
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
                required 
                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-[#1a1a1a] focus:ring-2 focus:ring-blue-500 outline-none" 
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold">Description</label>
              <textarea 
                name="description" 
                rows={4} 
                required
                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-[#1a1a1a] focus:ring-2 focus:ring-blue-500 outline-none resize-none" 
              ></textarea>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Category</label>
              <select 
                name="categoryId" 
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
                min="0"
                required 
                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-[#1a1a1a] focus:ring-2 focus:ring-blue-500 outline-none" 
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold">Product Image</label>
              <div className="border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl p-8 text-center bg-gray-50 dark:bg-[#1a1a1a] hover:bg-gray-100 dark:hover:bg-[#222] transition relative">
                <input 
                  type="file" 
                  name="image" 
                  accept="image/png, image/jpeg, image/webp"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Upload className="mx-auto text-gray-400 mb-3" size={32} />
                <p className="font-semibold text-gray-700 dark:text-gray-300">Click or drag image to upload</p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG or WEBP up to 5MB</p>
              </div>
            </div>

          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Link href="/dashboard/products" className="px-6 py-2.5 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition">
            Cancel
          </Link>
          <button type="submit" className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2">
            <Save size={18} /> Save Product
          </button>
        </div>
      </form>
    </div>
  )
}
