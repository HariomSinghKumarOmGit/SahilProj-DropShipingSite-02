import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { ShoppingBag } from "lucide-react"

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { category?: string; sort?: string; q?: string }
}) {
  const products = await prisma.product.findMany({
    where: {
      ...(searchParams.category && { categoryId: searchParams.category }),
      ...(searchParams.q && {
        OR: [
          { name: { contains: searchParams.q, mode: "insensitive" } },
          { description: { contains: searchParams.q, mode: "insensitive" } }
        ]
      })
    },
    orderBy: searchParams.sort === "price-asc" ? { price: "asc" } : searchParams.sort === "price-desc" ? { price: "desc" } : { createdAt: "desc" }
  })
  
  const resolveImage = (url: string | null) => {
    if (!url) return "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80" // Fallback placeholder
    if (url.startsWith('http')) return url;
    return `/uploads/${url.startsWith('/') ? url.slice(1) : url}`;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 min-h-screen">
      <div className="flex justify-between items-end mb-8 border-b border-gray-200 dark:border-gray-800 pb-8">
        <div>
          <h1 className="text-4xl font-bold mb-4">Shop Collection</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl text-lg">
            Browse our complete selection of premium products. Filter by category, price, or find exactly what you're looking for.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full md:w-64 shrink-0 space-y-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><Link href="/shop" className="text-blue-600 font-medium">All Products</Link></li>
              <li><Link href="/shop?category=tech" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">Technology</Link></li>
              <li><Link href="/shop?category=home" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">Home Office</Link></li>
              <li><Link href="/shop?category=accessories" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">Accessories</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Sort By</h3>
            <select className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-[#111] text-gray-900 dark:text-white">
              <option value="newest">Newest Arrivals</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {products.length === 0 ? (
            <div className="text-center py-24 text-gray-500">No products found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <div key={product.id} className="group cursor-pointer flex flex-col h-full">
                  <div className="relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden mb-4 border border-gray-200 dark:border-gray-800">
                    <img 
                      src={resolveImage(product.imageUrl)} 
                      alt={product.name} 
                      className="object-cover w-full h-full group-hover:scale-105 transition duration-300" 
                    />
                  </div>
                  <div className="flex justify-between items-start mb-1 flex-1">
                    <h3 className="text-lg font-semibold line-clamp-2 pr-4">{product.name}</h3>
                    <p className="font-bold whitespace-nowrap">${product.price.toFixed(2)}</p>
                  </div>
                  <button className="mt-4 w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-800 dark:hover:bg-gray-100 transition">
                    <ShoppingBag size={18} /> Add to Cart
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
