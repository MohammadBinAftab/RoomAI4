import Link from "next/link";
import { Paintbrush } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <Paintbrush className="h-6 w-6" />
              <span className="text-xl font-bold">RoomRedesign AI</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Transform your living space with AI-powered room redesign technology.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold">Product</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/redesign" className="text-sm text-muted-foreground hover:text-foreground">
                  Redesign Room
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold">Company</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">
                  About
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} RoomRedesign AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}