import RotatingBanner from "@/components/ui/RotatingBanner"
import Footer from "@/components/ui/Footer"
import ProductCard from "@/components/shop/ProductCard"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { getStoreSettings } from "@/lib/settings"

export default async function Home() {
  const [products, settings] = await Promise.all([
    prisma.product.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: { category: true },
    }),
    getStoreSettings(),
  ])

  return (
    <main className="min-h-screen">
      {/* ── Rotating Banner ── */}
      <RotatingBanner bannerUrl={settings.bannerUrl} />

      {/* ── Products Grid ── */}
      <section className="py-14 bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex justify-between items-end mb-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-blue-500 mb-2">
                Live collection
              </p>
              <h2 className="text-3xl md:text-4xl font-extrabold">
                Trending Now 🎉
              </h2>
            </div>
            <Link
              href="/shop"
              className="hidden sm:flex items-center gap-1 text-blue-600 font-semibold hover:text-blue-700 transition text-sm"
            >
              View All <ArrowRight size={16} />
            </Link>
          </div>

          {/* Cards */}
          {products.length === 0 ? (
            <div className="text-center py-24 text-gray-400">
              No products yet. Add some from the admin panel.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={{
                    ...product,
                    images: product.images ?? [],
                    description: product.description,
                    category: product.category,
                  }}
                />
              ))}
            </div>
          )}

          {/* Mobile View All */}
          <div className="mt-10 sm:hidden flex justify-center">
            <Link
              href="/shop"
              className="flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition"
            >
              View All Products <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <Footer />
    </main>
  )
}
