'use client';

import { useState } from "react";
import { useUser, SignInButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Script from "next/script";
import { useToast } from "@/components/ui/use-toast";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const plans = [
  {
    name: "Starter",
    price: 99,
    credits: 50,
    features: ["50 room redesigns", "All styles available", "24/7 support"],
  },
  {
    name: "Pro",
    price: 249,
    credits: 150,
    features: [
      "150 room redesigns",
      "All styles available",
      "Priority support",
      "HD downloads",
    ],
  },
  {
    name: "Enterprise",
    price: 499,
    credits: 400,
    features: [
      "400 room redesigns",
      "All styles available",
      "Priority support",
      "HD downloads",
      "Custom styles",
    ],
  },
];

export default function PricingPage() {
  const { isSignedIn, user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const { toast } = useToast();

  const handlePayment = async (price: number, planName: string, credits: number) => {
    if (!isSignedIn) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to make a purchase.",
      });
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
        description: `${credits} credits package`,
        order_id: data.order_id,
        handler: async function (response: any) {
          try {
            // Verify payment on server and add credits
            const verifyRes = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                credits,
                planName,
              }),
            });

            if (!verifyRes.ok) {
              const errorBlock = await verifyRes.json();
              throw new Error(errorBlock.error || "Payment verification failed");
            }

            toast({
              title: "Payment Successful",
              description: `${credits} credits have been added to your account`,
            });
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          } catch (error) {
            console.error("Error verifying payment:", error);
            toast({
              title: "Error",
              description: "Failed to verify or add credits. Please contact support.",
              variant: "destructive",
            });
          }
        },
        prefill: {
          name: user?.fullName || "",
          email: user?.primaryEmailAddress || "",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment Failed", error);
      toast({
        title: "Payment Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
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
                <span className="text-4xl font-bold">₹{plan.price}</span>
                <span className="ml-1 text-muted-foreground">/once</span>
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
                onClick={() => handlePayment(plan.price, plan.name, plan.credits)}
                disabled={loading[plan.name]}
              >
                {loading[plan.name] ? "Processing..." : "Pay Now"}
              </Button>
            </div>
          ))}
        </div>

        {!isSignedIn && (
          <div className="text-center mt-6">
            <SignInButton mode="modal">
              <Button>
                Sign In to Purchase
              </Button>
            </SignInButton>
          </div>
        )}
      </div>
    </>
  );
}
