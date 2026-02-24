"use client"

import { ShoppingBag, User } from "lucide-react"
import { useCartStore } from "@/lib/store"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

export default function Header() {
  const pathname = usePathname()
  const { items } = useCartStore()
  
  // Hide header on admin pages
  if (pathname?.startsWith('/dashboard')) return null

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <header className="fixed top-0 w-full h-20 z-50 px-6 py-4 flex justify-between items-center bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <Link href="/" className="flex items-center">
          <Image 
            src="/logo.png" 
            alt="Viral Nova Logo" 
          width={250} 
            height={50} 
          className="object-cover h-15 w-40 -mb-3" 
            priority 
          />
      </Link>
      
      <nav className="hidden md:flex space-x-8 font-medium">
        <Link href="/shop" className="hover:text-blue-600 transition">Shop</Link>
        <Link href="/categories" className="hover:text-blue-600 transition">Categories</Link>
        <Link href="/about" className="hover:text-blue-600 transition">About</Link>
      </nav>
      
      <div className="flex items-center space-x-6">
        <Link href="/login" className="font-medium hover:text-blue-600 transition flex items-center gap-2">
          <User size={20} />
          <span className="hidden sm:inline">Login</span>
        </Link>
        <Link href="/cart" className="relative font-medium hover:text-blue-600 transition p-2">
          <ShoppingBag size={24} />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  )
}
