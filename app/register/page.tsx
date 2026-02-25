"use client"

import { useActionState } from "react"
import { registerAction } from "@/actions/auth"
import Link from "next/link"
import { ArrowRight, Lock, Mail, User } from "lucide-react"

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(registerAction, undefined)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0a0a0a] px-4 py-24">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-3xl p-8 shadow-xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-purple-600">
              Create Account
            </h1>
            <p className="text-gray-500 mt-3 font-medium">Join us to manage your orders and profile.</p>
          </div>

          <form action={formAction} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="text" 
                  name="name"
                  required
                  placeholder="John Doe"
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="email" 
                  name="email"
                  required
                  placeholder="hello@example.com"
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="password" 
                  name="password"
                  required
                  placeholder="••••••••"
                  minLength={6}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium" 
                />
              </div>
            </div>

            {state?.error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm font-medium text-center">
                {state.error}
              </div>
            )}
            
            {state?.success && (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-700 dark:text-green-400 text-sm font-medium text-center">
                {state.message} 
                <div className="mt-2 text-blue-600 font-bold underline">
                  <Link href="/login">Go to Login</Link>
                </div>
              </div>
            )}

            <button 
              type="submit" 
              disabled={isPending || state?.success}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-blue-600/20"
            >
              {isPending ? "Creating Account..." : (
                <>
                  Create Account <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm font-medium text-gray-500">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
