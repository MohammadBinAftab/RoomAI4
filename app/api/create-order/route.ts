import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json(); // Ensure request body is read
        const { amount } = body; // Get amount from request

        if (!amount || typeof amount !== "number") {
            return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
        }

        // Create Razorpay order
        const orderResponse = await fetch("https://api.razorpay.com/v1/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Basic ${Buffer.from(
                    `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`
                ).toString("base64")}`,
            },
            body: JSON.stringify({
                amount: amount * 100, // Razorpay requires amount in paise
                currency: "INR",
                receipt: `receipt_${Date.now()}`,
                payment_capture: 1,
            }),
        });

        if (!orderResponse.ok) {
            return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
        }

        const orderData = await orderResponse.json();

        return NextResponse.json({ order_id: orderData.id }, { status: 200 });
    } catch (error) {
        console.error("Error creating order:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
