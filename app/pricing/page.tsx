"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs"; // Using Clerk authentication
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Script from "next/script";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const plans = [
  {
    name: "Starter",
    price: 10,
    credits: 10,
    features: ["10 room redesigns", "All styles available", "24/7 support"],
  },
  {
    name: "Pro",
    price: 25,
    credits: 30,
    features: [
      "30 room redesigns",
      "All styles available",
      "Priority support",
      "HD downloads",
    ],
  },
  {
    name: "Enterprise",
    price: 50,
    credits: 70,
    features: [
      "70 room redesigns",
      "All styles available",
      "Priority support",
      "HD downloads",
      "Custom styles",
    ],
  },
];

export default function PricingPage() {
  const { isSignedIn, user } = useUser(); // Clerk authentication
  const router = useRouter();
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});

  const handlePayment = async (planName: string, price: number) => {
    if (!isSignedIn) {
      router.push("/sign-in"); // Redirect to Clerk sign-in page
      return;
    }

    setLoading((prev) => ({ ...prev, [planName]: true }));

    try {
      const response = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: price }),
      });
      const data = await response.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: price * 100,
        currency: "INR",
        name: "Room Redesign",
        description: `${price} credits package`,
        order_id: data.order_id,
        handler: function (response: any) {
          console.log("Payment Successful", response);
          // Handle successful payment here (e.g., update user credits)
        },
        prefill: {
          name: user?.fullName || "",
          email: user?.primaryEmailAddress?.emailAddress || "",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment Failed", error);
    } finally {
      setLoading((prev) => ({ ...prev, [planName]: false }));
    }
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className="container mx-auto py-10">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Simple, Transparent Pricing</h1>
          <p className="mt-2 text-muted-foreground">
            Choose the perfect plan for your needs
          </p>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="rounded-lg border bg-card p-8 shadow-sm"
            >
              <h3 className="text-2xl font-bold">{plan.name}</h3>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-bold">${plan.price}</span>
                <span className="ml-1 text-muted-foreground">/month</span>
              </div>
              <p className="mt-2 text-muted-foreground">
                {plan.credits} credits included
              </p>
              <ul className="mt-6 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                className="mt-8 w-full"
                onClick={() => handlePayment(plan.name, plan.price)}
                disabled={loading[plan.name]}
              >
                {loading[plan.name] ? "Processing..." : "Pay Now"}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
