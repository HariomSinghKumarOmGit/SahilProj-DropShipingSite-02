"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const navItems = [
    { name: "Overview", path: "/dashboard" },
    { name: "Products", path: "/dashboard/products" },
    { name: "Categories", path: "/dashboard/categories" },
    { name: "Orders", path: "/dashboard/orders" },
    { name: "Users", path: "/dashboard/users" },
  ]

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-[#0a0a0a] pt-20">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-[#111] border-r border-gray-200 dark:border-gray-800 p-6 flex-shrink-0">
        <nav className="space-y-2 mt-4">
          {navItems.map((item) => {
            const isActive = pathname === item.path || (item.path !== "/dashboard" && pathname.startsWith(item.path))
            return (
              <Link 
                key={item.path} 
                href={item.path} 
                className={`flex items-center gap-3 p-3 rounded-lg font-medium transition ${
                  isActive 
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600" 
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                {item.name}
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
