"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

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
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (price: number) => {
    if (!session) {
      router.push("/api/auth/signin");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price }),
      });

      const data = await response.json();
      window.location.href = data.url;
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
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
              onClick={() => handleSubscribe(plan.price)}
              disabled={loading}
            >
              {loading ? "Processing..." : "Get Started"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}