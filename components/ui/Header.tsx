"use client"

import { useState, useEffect } from "react"
import { ShoppingBag, User, Sun, Moon } from "lucide-react"
import { useCartStore } from "@/lib/store"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { signIn } from "next-auth/react"
import { useTheme } from "next-themes"
import { Menu, X } from "lucide-react"

export default function Header({ logoUrl = "/logo.png" }: { logoUrl?: string }) {
  const pathname = usePathname()
  const { items } = useCartStore()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => setMounted(true), [])
  
  // Hide header on admin pages
  if (pathname?.startsWith('/dashboard')) return null

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <header className="fixed top-0 w-full h-20 z-50 px-6 py-4 flex justify-between items-center bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <Link href="/" className="flex items-center">
          <img 
            src={logoUrl} 
            alt="Store Logo" 
            className="object-contain h-15 w-40 -mb-3" 
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

        <button onClick={() => signIn("google", { callbackUrl: "/shop" })} className="font-medium hover:text-blue-600 transition hidden md:flex items-center gap-2">
           <span className="hidden sm:inline">Google Login</span>
        </button>
        <Link href="/login" className="font-medium hover:text-blue-600 transition hidden md:flex items-center gap-2">
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
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden p-2 text-gray-700 dark:text-gray-300"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="absolute top-20 left-0 w-full bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 md:hidden shadow-lg animate-in slide-in-from-top-2">
          <nav className="flex flex-col p-4 space-y-4 font-medium">
            <Link 
              href="/shop" 
              className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Shop
            </Link>
            <button 
              onClick={() => { signIn("google", { callbackUrl: "/shop" }); setMobileMenuOpen(false); }} 
              className="px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
            >
              Sign In with Google
            </button>
            <Link 
              href="/login" 
              className="px-4 py-2 flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              <User size={20} />
              Login
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
