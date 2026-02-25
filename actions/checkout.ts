"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const checkoutSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  address: z.string().min(5),
  city: z.string().min(2),
  zipCode: z.string().min(3),
  country: z.string().min(2),
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().min(1),
      price: z.number().min(0)
    })
  )
})

export async function processCheckout(formData: z.infer<typeof checkoutSchema>) {
  try {
    const session = await auth()
    
    if (!session || !session.user || !session.user.id) {
      return { success: false, error: "You must be logged in to place an order." }
    }

    const { items } = formData

    if (!items || items.length === 0) {
      return { success: false, error: "Your cart is empty." }
    }

    const userId = session.user.id as string

    // Wrap the checkout in a Prisma Transaction to ensure data integrity
    const result = await prisma.$transaction(async (tx) => {
      let totalAmount = 0;

      // First, verify stock for all items
      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId }
        })

        if (!product) {
          throw new Error(`Product not found.`)
        }

        if ((product.stock ?? 0) < item.quantity) {
          throw new Error(`Not enough stock for ${product.name}.`)
        }

        totalAmount += product.price * item.quantity

        // Decrement stock
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: (product.stock ?? 0) - item.quantity }
        })
      }

      // Create Order
      const order = await tx.order.create({
        data: {
          userId,
          totalAmount,
          status: "PENDING",
          orderItems: {
            create: items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price
            }))
          }
        }
      })

      return order
    })

    return { success: true, orderId: result.id }

  } catch (error: any) {
    return { success: false, error: error.message || "Something went wrong during checkout." }
  }
}
