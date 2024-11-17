import { Camera, Palette, Zap, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const features = [
  {
    icon: Camera,
    title: "Easy Upload",
    description: "Simply upload a photo of your room to get started",
  },
  {
    icon: Palette,
    title: "Multiple Styles",
    description: "Choose from various design styles to transform your space",
  },
  {
    icon: Zap,
    title: "Instant Results",
    description: "Get your redesigned room in seconds with our advanced AI",
  },
  {
    icon: Clock,
    title: "Save Time",
    description: "Skip the lengthy design process with instant visualizations",
  },
];

export function Features() {
  return (
    <div className="container mx-auto px-4">
      <div className="grid gap-12 md:grid-cols-2">
        <div className="grid grid-cols-2 gap-4">
          <img
            src="https://images.unsplash.com/photo-1616594039964-ae9021a400a0"
            alt="Feature 1"
            className="rounded-lg object-cover"
          />
          <img
            src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace"
            alt="Feature 2"
            className="rounded-lg object-cover"
          />
          <img
            src="https://images.unsplash.com/photo-1616137466211-f939a420be84"
            alt="Feature 3"
            className="rounded-lg object-cover"
          />
          <img
            src="https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a"
            alt="Feature 4"
            className="rounded-lg object-cover"
          />
        </div>
        
        <div className="flex flex-col justify-center">
          <h2 className="text-3xl font-bold">Why Choose RoomRedesign AI?</h2>
          <div className="mt-8 grid gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <feature.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="mt-1 text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <Link href="/redesign" className="mt-8">
            <Button size="lg">Try It Now</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}