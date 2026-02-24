import { auth } from "@/lib/auth"
import Link from "next/link"
import Image from "next/image"
import { Plus, Search, Edit, Trash2, Tag } from "lucide-react"

import { prisma } from "@/lib/prisma"

export default async function AdminCategoriesPage() {
  const session = await auth()
  
  // Real Categories
  const dbCategories = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  const categories = dbCategories.map(c => ({
    id: c.id,
    name: c.name,
    productCount: c._count.products,
    createdAt: c.createdAt.toISOString().split('T')[0]
  }))

  return (
    <>
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">Categories</h1>
            <p className="text-gray-500">Organize your product taxonomy</p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-blue-700 transition">
            <Plus size={20} /> Add Category
          </button>
        </header>

        {/* Data Controls */}
        <div className="bg-white dark:bg-[#111] p-4 rounded-t-xl border border-gray-200 dark:border-gray-800 border-b-0 flex justify-between items-center">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Search categories..." className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-b-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-[#1a1a1a] border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="py-3 px-6 font-semibold text-sm">Category Name</th>
                <th className="py-3 px-6 font-semibold text-sm">Total Products</th>
                <th className="py-3 px-6 font-semibold text-sm">Created Date</th>
                <th className="py-3 px-6 font-semibold text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} className="border-b border-gray-100 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition">
                  <td className="py-4 px-6 font-medium flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/20 rounded flex items-center justify-center text-blue-600">
                      <Tag size={16} />
                    </div>
                    {category.name}
                  </td>
                  <td className="py-4 px-6 text-gray-500">{category.productCount}</td>
                  <td className="py-4 px-6 text-gray-500">{category.createdAt}</td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-gray-400 hover:text-blue-600 transition"><Edit size={18} /></button>
                      <button className="p-2 text-gray-400 hover:text-red-600 transition"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    </>
  )
}
