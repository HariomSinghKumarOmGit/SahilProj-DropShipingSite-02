import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

// Initialize Razorpay instance with server-side keys
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

/**
 * POST /api/razorpay
 *
 * Body: { amount: number }          ← amount in RUPEES (e.g. 1499)
 * Returns: { orderId, amount, currency, key }
 *
 * ⚠️  Razorpay expects the amount in **paise** (1 INR = 100 paise).
 *     So we multiply the rupee value by 100 before calling the API.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount } = body;

    if (!amount || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        { error: "A valid positive amount (in INR) is required." },
        { status: 400 }
      );
    }

    // Convert rupees → paise (Razorpay requirement)
    const amountInPaise = Math.round(amount * 100);

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,          // paise
      currency: order.currency,      // "INR"
      key: process.env.RAZORPAY_KEY_ID, // public key for client
    });
  } catch (error: any) {
    console.error("[Razorpay] Order creation failed:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create Razorpay order." },
      { status: 500 }
    );
  }
}
