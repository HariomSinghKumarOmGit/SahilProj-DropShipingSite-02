import { auth } from "@/lib/auth"
import Link from "next/link"
import Image from "next/image"
import { PackageOpen, Plus, Search, Edit, Trash2 } from "lucide-react"

import { prisma } from "@/lib/prisma"

export default async function AdminProductsPage() {
  const session = await auth()
  
  // Real products
  const dbProducts = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' }
  })

  // Format the data for the UI
  const products = dbProducts.map(p => {
    let status = 'Active';
    if (p.stock === 0) status = 'Out of Stock';
    else if (p.stock <= 10) status = 'Low Stock';

    return {
      id: p.id,
      name: p.name,
      category: p.category?.name || "Uncategorized",
      price: p.price,
      stock: p.stock,
      status
    }
  })

  return (
    <>
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">Products</h1>
            <p className="text-gray-500">Manage your store catalog and inventory</p>
          </div>
          <Link href="/dashboard/products/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-blue-700 transition">
            <Plus size={20} /> Add Product
          </Link>
        </header>

        {/* Data Controls */}
        <div className="bg-white dark:bg-[#111] p-4 rounded-t-xl border border-gray-200 dark:border-gray-800 border-b-0 flex justify-between items-center">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Search products..." className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <select className="border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#1a1a1a] rounded-lg px-4 py-2 focus:outline-none">
            <option>All Categories</option>
            <option>Electronics</option>
            <option>Accessories</option>
          </select>
        </div>

        {/* Data Table */}
        <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-b-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-[#1a1a1a] border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="py-3 px-6 font-semibold text-sm">Product Name</th>
                <th className="py-3 px-6 font-semibold text-sm">Category</th>
                <th className="py-3 px-6 font-semibold text-sm">Price</th>
                <th className="py-3 px-6 font-semibold text-sm">Stock</th>
                <th className="py-3 px-6 font-semibold text-sm">Status</th>
                <th className="py-3 px-6 font-semibold text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-gray-100 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition">
                  <td className="py-4 px-6 font-medium flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded flex items-center justify-center text-gray-500">
                      <PackageOpen size={20} />
                    </div>
                    {product.name}
                  </td>
                  <td className="py-4 px-6 text-gray-500">{product.category}</td>
                  <td className="py-4 px-6 font-medium">${product.price.toFixed(2)}</td>
                  <td className="py-4 px-6">{product.stock}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      product.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-500' :
                      product.status === 'Low Stock' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-500' :
                      'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-500'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/dashboard/products/${product.id}/edit`} className="p-2 text-gray-400 hover:text-blue-600 transition">
                        <Edit size={18} />
                      </Link>
                      <form action={async () => {
                        "use server"
                        await prisma.product.delete({ where: { id: product.id } })
                      }}>
                        <button type="submit" className="p-2 text-gray-400 hover:text-red-600 transition">
                          <Trash2 size={18} />
                        </button>
                      </form>
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
