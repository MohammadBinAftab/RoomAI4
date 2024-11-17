import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Interior Designer",
    content: "This AI tool has revolutionized how I present design concepts to my clients. The results are incredibly realistic!",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
  },
  {
    name: "Michael Chen",
    role: "Homeowner",
    content: "I was skeptical at first, but the room redesigns exceeded my expectations. It helped me visualize my dream home perfectly.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
  },
  {
    name: "Emily Rodriguez",
    role: "Real Estate Agent",
    content: "A game-changer for property staging! My listings get more attention with these AI-generated room transformations.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
  },
];

export function Testimonials() {
  return (
    <div className="bg-muted/50 py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-3xl font-bold">What Our Users Say</h2>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="rounded-lg bg-background p-6 shadow-sm"
            >
              <div className="flex gap-1 text-yellow-400">
                {Array(5).fill(null).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mt-4 text-muted-foreground">{testimonial.content}</p>
              <div className="mt-6 flex items-center gap-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}