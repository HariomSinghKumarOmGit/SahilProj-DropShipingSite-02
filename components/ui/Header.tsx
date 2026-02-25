"use client"

import { useState, useEffect } from "react"
import { ShoppingBag, User, Sun, Moon } from "lucide-react"
import { useCartStore } from "@/lib/store"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { signIn } from "next-auth/react"
import { useTheme } from "next-themes"

export default function Header() {
  const pathname = usePathname()
  const { items } = useCartStore()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  
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
        {/* <Link href="/categories" className="hover:text-blue-600 transition">Categories</Link> */}
        {/* <Link href="/about" className="hover:text-blue-600 transition">About</Link> */}
      </nav>
      
      <div className="flex items-center space-x-4">
        {/* Theme Toggle */}
        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
            aria-label="Toggle dark mode"
          >
            {theme === "dark" ? (
              <Sun size={18} className="text-amber-400" />
            ) : (
              <Moon size={18} className="text-gray-700" />
            )}
          </button>
        )}

        <button onClick={() => signIn("google", { callbackUrl: "/shop" })} className="font-medium hover:text-blue-600 transition flex items-center gap-2">
          {/* <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
            <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
              <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
              <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
              <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
              <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
            </g>
          </svg> */}
          {/* <span className="hidden sm:inline">Google Login</span> */}
        </button>
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
