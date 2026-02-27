import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import ProductGallery from "@/components/shop/ProductGallery"
import { ShoppingBag, Star, Truck, ShieldCheck } from "lucide-react"
import Link from "next/link"
import AddToCartButton from "@/components/shop/AddToCartButton"
import { formatINR } from "@/lib/format"

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true }
  })

  if (!product) {
    notFound()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 pb-32 sm:pb-24 min-h-screen">
      {/* Breadcrumbs */}
      <nav className="flex text-sm text-gray-500 mb-8 mt-12">
        <ol className="flex items-center space-x-2">
          <li><Link href="/" className="hover:text-blue-600 transition">Home</Link></li>
          <li><span className="mx-2">/</span></li>
          <li><Link href="/shop" className="hover:text-blue-600 transition">Shop</Link></li>
          <li><span className="mx-2">/</span></li>
          <li className="text-gray-900 dark:text-gray-100 font-medium">{product.name}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
        {/* Left Gallery */}
        <div className="md:sticky md:top-24 h-max">
          <ProductGallery images={product.images} />
        </div>

        {/* Right Info */}
        <div className="flex flex-col">
          <div className="mb-6 border-b border-gray-200 dark:border-gray-800 pb-6">
            <div className="flex items-center gap-4 mb-2">
              <span className="text-sm font-semibold tracking-wider text-blue-600 uppercase">{product.category?.name || "Premium Item"}</span>
              <div className="flex items-center text-yellow-500">
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <span className="text-gray-500 text-xs ml-2">(4.9/5)</span>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {product.name}
            </h1>
            <p className="text-3xl font-medium text-gray-900 dark:text-white">
              {formatINR(product.price)}
            </p>
          </div>

          <div className="prose prose-blue dark:prose-invert mb-8 text-gray-600 dark:text-gray-300">
            <p>{product.description || "No description provided."}</p>
          </div>

          {/* Cart Actions Placeholder (Will be hooked to Zustand) */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8 pt-6 border-t border-gray-200 dark:border-gray-800">
            <div className="flex-1 w-full">
              <AddToCartButton product={product} />
            </div>
            <Link
              href={`/checkout?productId=${product.id}&price=${product.price}&name=${encodeURIComponent(product.name)}&image=${encodeURIComponent(product.images?.[0] || '')}`}
              className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-bold py-4 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition mt-4 text-center"
            >
              Buy Now
            </Link>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500 mb-8 border-b border-gray-200 dark:border-gray-800 pb-8">
            <div className={`w-3 h-3 rounded-full ${product.stock && product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
            {product.stock && product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </div>

          {/* Benefits Info */}
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 shrink-0">
                <Truck size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Free Global Shipping</h4>
                <p className="text-sm text-gray-500">Fast and trackable delivery worldwide on orders over ₹500.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 shrink-0">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">1 Year Warranty</h4>
                <p className="text-sm text-gray-500">Every product is backed by our full comprehensive warranty.</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Sticky Bottom Bar */}
      <div className="fixed sm:hidden bottom-0 left-0 right-0 bg-white dark:bg-[#1a1a1a] border-t border-gray-200 dark:border-gray-800 p-4 z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div className="flex gap-3">
          <div className="flex-1">
            <AddToCartButton product={product} variant="quick" />
          </div>
          <Link
            href={`/checkout?productId=${product.id}&price=${product.price}&name=${encodeURIComponent(product.name)}&image=${encodeURIComponent(product.images?.[0] || '')}`}
            className="flex-1 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold py-3 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition shadow-lg text-center"
          >
            Buy Now
          </Link>
        </div>
      </div>
    </div>
  )
}
