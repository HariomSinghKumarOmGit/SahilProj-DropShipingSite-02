"use server"

import { signIn } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { AuthError } from "next-auth"

export async function loginAction(prevState: any, formData: FormData) {
  try {
    const data = Object.fromEntries(formData)
    console.log("Login Action received data:", { ...data, password: '[REDACTED]' })
    await signIn("credentials", { ...data, redirectTo: "/dashboard" })
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === "CredentialsSignin") {
        return { error: "Invalid credentials." }
      }
      return { error: "Something went wrong." }
    }
    throw error // Re-throw if it's not an authentication error (like Next.js redirect)
  }
}

export async function registerAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const name = formData.get("name") as string

  if (!email || !password || !name) {
    return { error: "Missing fields" }
  }

  const existingUser = await prisma.user.findUnique({
    where: { email }
  })

  if (existingUser) {
    return { error: "User already exists" }
  }

  const passwordHash = await bcrypt.hash(password, 10)

  await prisma.user.create({
    data: { name, email, passwordHash }
  })

  return { success: "Account created! You can now login." }
}
