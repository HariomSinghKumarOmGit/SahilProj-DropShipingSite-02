import NextAuth, { NextAuthConfig } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: string;
    } & import("next-auth").DefaultSession["user"]
  }
  interface User {
    id: string;
    role?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role?: string;
  }
}

export const authConfig = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        })

        if (!user) return null

        const passwordsMatch = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash || ""
        )

        if (passwordsMatch) return { id: user.id, name: user.name, email: user.email, role: user.role }
        return null
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        if (!user.email) return false;
        const existingUser = await prisma.user.findUnique({ where: { email: user.email } })
        if (!existingUser) {
          await prisma.user.create({
            data: {
              email: user.email,
              name: user.name || "Google User",
              passwordHash: null,
              role: "USER"
            }
          })
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        // If OAuth, fetch the user from DB to get the role and real ID
        if (account?.provider === "google" && user.email) {
          const dbUser = await prisma.user.findUnique({ where: { email: user.email } })
          if (dbUser) {
            token.role = dbUser.role
            token.id = dbUser.id
          }
        } else {
          token.role = user.role;
          token.id = user.id;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.role) session.user.role = token.role as string;
      if (token?.id) session.user.id = token.id as string;
      return session;
    }
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)
