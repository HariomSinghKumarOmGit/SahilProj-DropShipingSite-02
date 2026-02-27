import { auth } from "@/lib/auth"
import Link from "next/link"
import Image from "next/image"
import { ShoppingBag, Search, Eye, Filter } from "lucide-react"

import { prisma } from "@/lib/prisma"
import { formatINR } from "@/lib/format"

export default async function AdminOrdersPage() {
  const session = await auth()
  
  // Real Orders
  const dbOrders = await prisma.order.findMany({
    include: { 
      user: true,
      orderItems: true
    },
    orderBy: { createdAt: 'desc' }
  })

  const orders = dbOrders.map(o => ({
    id: o.id,
    customer: o.user?.name || o.user?.email || "Guest",
    date: o.createdAt.toISOString().split('T')[0],
    total: o.totalAmount,
    items: o.orderItems.reduce((acc, item) => acc + item.quantity, 0),
    status: o.status.charAt(0).toUpperCase() + o.status.slice(1).toLowerCase() // "PENDING" -> "Pending"
  }))

  return (
    <>
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">Orders</h1>
            <p className="text-gray-500">Manage and fulfill customer orders</p>
          </div>
          <button className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
            <Filter size={20} /> Advanced Filters
          </button>
        </header>

        {/* Data Controls */}
        <div className="bg-white dark:bg-[#111] p-4 rounded-t-xl border border-gray-200 dark:border-gray-800 border-b-0 flex justify-between items-center">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Search order ID or customer..." className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <select className="border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#1a1a1a] rounded-lg px-4 py-2 focus:outline-none">
            <option>All Statuses</option>
            <option>Pending</option>
            <option>Processing</option>
            <option>Shipped</option>
            <option>Delivered</option>
          </select>
        </div>

        {/* Data Table */}
        <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-b-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-[#1a1a1a] border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="py-3 px-6 font-semibold text-sm">Order ID</th>
                <th className="py-3 px-6 font-semibold text-sm">Customer</th>
                <th className="py-3 px-6 font-semibold text-sm">Date</th>
                <th className="py-3 px-6 font-semibold text-sm">Items</th>
                <th className="py-3 px-6 font-semibold text-sm">Total</th>
                <th className="py-3 px-6 font-semibold text-sm">Status</th>
                <th className="py-3 px-6 font-semibold text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-gray-100 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition">
                  <td className="py-4 px-6 font-medium text-blue-600 dark:text-blue-400">{order.id}</td>
                  <td className="py-4 px-6">{order.customer}</td>
                  <td className="py-4 px-6 text-gray-500">{order.date}</td>
                  <td className="py-4 px-6 text-gray-500">{order.items}</td>
                  <td className="py-4 px-6 font-medium">{formatINR(order.total)}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 w-max ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-500' :
                      order.status === 'Shipped' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-500' :
                      order.status === 'Processing' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-500' :
                      'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-500'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        order.status === 'Delivered' ? 'bg-green-500' : 
                        order.status === 'Shipped' ? 'bg-blue-500' : 
                        order.status === 'Processing' ? 'bg-purple-500' : 'bg-orange-500'
                      }`}></span>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="p-2 text-gray-400 flex items-center gap-1 hover:text-blue-600 transition ml-auto font-medium text-sm">
                      <Eye size={16} /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    </>
  )
}
