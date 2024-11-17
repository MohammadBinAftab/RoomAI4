import { Hero } from "@/components/hero";
import { Testimonials } from "@/components/testimonials";
import { Examples } from "@/components/examples";
import { Features } from "@/components/features";

export default function Home() {
  return (
    <div className="flex flex-col gap-20 py-10">
      <Hero />
      <Examples />
      <Testimonials />
      <Features />
    </div>
  );
}