const examples = [
  {
    before: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace",
    after: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0",
    style: "Modern",
  },
  {
    before: "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a",
    after: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0",
    style: "Minimalist",
  },
  {
    before: "https://images.unsplash.com/photo-1616137466211-f939a420be84",
    after: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0",
    style: "Scandinavian",
  },
  {
    before: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace",
    after: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0",
    style: "Industrial",
  },
];

export function Examples() {
  return (
    <div className="container mx-auto px-4">
      <h2 className="text-center text-3xl font-bold">AI-Powered Transformations</h2>
      <p className="mt-4 text-center text-muted-foreground">
        See how our AI transforms rooms into different styles
      </p>
      <div className="mt-12 grid gap-8 md:grid-cols-2">
        {examples.map((example, i) => (
          <div key={i} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="mb-2 text-sm font-medium">Before</p>
                <img
                  src={example.before}
                  alt="Before"
                  className="aspect-video rounded-lg object-cover"
                />
              </div>
              <div>
                <p className="mb-2 text-sm font-medium">After ({example.style})</p>
                <img
                  src={example.after}
                  alt="After"
                  className="aspect-video rounded-lg object-cover"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}