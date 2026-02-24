import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Users, ShoppingBag, CreditCard, TrendingUp } from "lucide-react"
import Image from "next/image"
import RevenueChart from "@/components/admin/RevenueChart"

import { prisma } from "@/lib/prisma"

export default async function AdminDashboard() {
  const session = await auth()
  
  // Protect route
  if (!session || (session.user as any).role !== "ADMIN") {
    redirect("/login")
  }

  // Fetch real metrics concurrently
  const [totalRevenueResult, usersCount, ordersCount] = await Promise.all([
    prisma.order.aggregate({ _sum: { totalAmount: true } }),
    prisma.user.count(),
    prisma.order.count(),
  ])

  const revenueNum = totalRevenueResult._sum.totalAmount || 0;

  // Real data structure
  const stats = [
    { name: 'Total Revenue', value: `$${revenueNum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, change: '+0.0%', icon: CreditCard },
    { name: 'Active Users', value: usersCount.toString(), change: '+0.0%', icon: Users },
    { name: 'Total Orders', value: ordersCount.toString(), change: '+0.0%', icon: ShoppingBag },
    { name: 'Conversion Rate', value: 'N/A', change: '0%', icon: TrendingUp },
  ]

  return (
    <>
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Dashboard Overview</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Welcome, Admin</span>
            <div className="w-10 h-10 bg-blue-600 rounded-full"></div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white dark:bg-[#111] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="text-gray-500">
                  <stat.icon size={24} />
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.name}</h3>
              <div className="mt-1 flex justify-between items-baseline">
                <span className="text-2xl font-bold">{stat.value}</span>
                <span className="text-sm font-medium text-green-500">{stat.change}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Revenue Chart Dashboard area */}
        <div className="bg-white dark:bg-[#111] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm h-96 flex flex-col">
          <h2 className="text-lg font-bold mb-4">Revenue Overview</h2>
          <RevenueChart />
        </div>
    </>
  )
}
