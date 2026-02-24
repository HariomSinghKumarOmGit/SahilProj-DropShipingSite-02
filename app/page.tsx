import GsapHero from "@/components/ui/GsapHero"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ShoppingBag, ShieldCheck, Zap } from "lucide-react"
import { prisma } from "@/lib/prisma"

export default async function Home() {
  const trendingProducts = await prisma.product.findMany({
    take: 4,
    orderBy: { createdAt: 'desc' },
    include: { category: true }
  })

  const resolveImage = (url: string | null) => {
    if (!url) return "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80" // Fallback placeholder
    if (url.startsWith('http')) return url;
    return `/uploads/${url.startsWith('/') ? url.slice(1) : url}`;
  }

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <GsapHero />

      {/* Features Section */}
      <section className="py-24 bg-white dark:bg-[#111]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6">
                <Zap size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Fast Delivery</h3>
              <p className="text-gray-600 dark:text-gray-400">Lightning fast shipping on all orders. Get your premium items within 48 hours globally.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Secure Payments</h3>
              <p className="text-gray-600 dark:text-gray-400">Your transactions are protected by industry-leading encryption and security protocols.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6">
                <ShoppingBag size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Premium Quality</h3>
              <p className="text-gray-600 dark:text-gray-400">Exceptional materials and craftsmanship. We guarantee 100% satisfaction on all products.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Products Grid (Live Data) */}
      <section className="py-24 bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Trending Now</h2>
              <p className="text-gray-600 dark:text-gray-400">Discover what our community is loving right now.</p>
            </div>
            <Link href="/shop" className="hidden sm:flex items-center text-blue-600 font-semibold hover:text-blue-700 transition">
              View All <ArrowRight size={20} className="ml-2" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {trendingProducts.map((item) => (
              <div key={item.id} className="group cursor-pointer">
                <div className="relative aspect-4/5 bg-gray-200 dark:bg-gray-800 rounded-2xl overflow-hidden mb-4">
                  <img src={resolveImage(item.imageUrl)} alt={item.name} className="object-cover w-full h-full group-hover:scale-105 transition duration-300" />
                  {/* Hover overlay add to cart */}
                  <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="w-full bg-white text-gray-900 font-semibold py-3 rounded-xl shadow-lg hover:bg-gray-50 transition">
                      Quick Add
                    </button>
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-1 line-clamp-1">{item.name}</h3>
                <p className="text-gray-500 mb-2 line-clamp-1">{item.category?.name || "Premium Item"}</p>
                <p className="font-medium">${item.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-12 sm:hidden flex justify-center">
            <Link href="/shop" className="flex items-center text-blue-600 font-semibold hover:text-blue-700 transition">
              View All <ArrowRight size={20} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
