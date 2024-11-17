import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col items-center gap-8 py-20 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Transform Your Space with AI
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          Experience the future of interior design. Upload a photo of your room and let our AI transform it into your dream space in seconds.
        </p>
        <div className="flex gap-4">
          <Link href="/redesign">
            <Button size="lg">Try it Now</Button>
          </Link>
          <Link href="/pricing">
            <Button variant="outline" size="lg">View Pricing</Button>
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <img
            src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace"
            alt="Modern living room"
            className="aspect-video rounded-lg object-cover"
          />
          <img
            src="https://images.unsplash.com/photo-1616137466211-f939a420be84"
            alt="Minimalist bedroom"
            className="aspect-video rounded-lg object-cover"
          />
          <img
            src="https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a"
            alt="Scandinavian kitchen"
            className="aspect-video rounded-lg object-cover"
          />
        </div>
      </div>
    </div>
  );
}