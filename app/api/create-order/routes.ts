import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(request) {
    try {
        const body = await request.json(); // Ensure request body is read
        const { amount } = body; // Get amount from request

        if (!amount) {
            return NextResponse.json({ error: "Amount is required" }, { status: 400 });
        }

        const order = await razorpay.orders.create({
            amount: amount * 100, // Convert to paise
            currency: "INR",
            receipt: `receipt_${Math.random().toString(36).substring(7)}`,
        });

        return NextResponse.json({ order_id: order.id }, { status: 200 });
    } catch (error) {
        console.error("Error creating order:", error);
        return NextResponse.json({ error: "Error creating order" }, { status: 500 });
    }
}
