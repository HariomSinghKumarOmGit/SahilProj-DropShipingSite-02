import { auth } from "@/lib/auth"
import Link from "next/link"
import Image from "next/image"
import { Users, Search, Edit, Lock, Mail } from "lucide-react"

import { prisma } from "@/lib/prisma"

export default async function AdminUsersPage() {
  const session = await auth()
  
  // Real Users
  const dbUsers = await prisma.user.findMany({
    include: {
      _count: { select: { orders: true } }
    },
    orderBy: { createdAt: 'desc' }
  })

  const usersList = dbUsers.map(u => ({
    id: u.id,
    name: u.name || "Unknown",
    email: u.email,
    role: u.role,
    joined: u.createdAt.toISOString().split('T')[0],
    orders: u._count.orders
  }))

  return (
    <>
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">Users</h1>
            <p className="text-gray-500">Manage customers and admin accounts</p>
          </div>
        </header>

        {/* Data Controls */}
        <div className="bg-white dark:bg-[#111] p-4 rounded-t-xl border border-gray-200 dark:border-gray-800 border-b-0 flex justify-between items-center">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Search name or email..." className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <select className="border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#1a1a1a] rounded-lg px-4 py-2 focus:outline-none">
            <option>All Roles</option>
            <option>Users</option>
            <option>Admins</option>
          </select>
        </div>

        {/* Data Table */}
        <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-b-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-[#1a1a1a] border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="py-3 px-6 font-semibold text-sm">User</th>
                <th className="py-3 px-6 font-semibold text-sm">Role</th>
                <th className="py-3 px-6 font-semibold text-sm">Joined</th>
                <th className="py-3 px-6 font-semibold text-sm">Contact</th>
                <th className="py-3 px-6 font-semibold text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {usersList.map((user) => (
                <tr key={user.id} className="border-b border-gray-100 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition">
                  <td className="py-4 px-6 font-medium flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-500 uppercase font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.orders} total orders</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      user.role === 'ADMIN' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-500' :
                      'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-500">{user.joined}</td>
                  <td className="py-4 px-6">
                    <a href={`mailto:${user.email}`} className="text-blue-600 hover:underline flex items-center gap-1 text-sm">
                      <Mail size={14} /> {user.email}
                    </a>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-gray-400 hover:text-blue-600 transition" title="Edit User"><Edit size={18} /></button>
                      <button className="p-2 text-gray-400 hover:text-orange-600 transition" title="Reset Password"><Lock size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    </>
  )
}
