"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Paintbrush } from "lucide-react";
import { UserButton, SignInButton, SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { CreditsDisplay } from "@/components/credits-display";  

export function Navbar() {
  const { user } = useUser();

  return (
    <nav className="border-b">
      <div className="container mx-auto flex h-16 items-center px-4">
        <Link href="/" className="flex items-center gap-2">
          <Paintbrush className="h-6 w-6" />
          <span className="text-xl font-bold">RoomAI</span>
        </Link>

        <div className="ml-auto flex items-center gap-4">
          <Link href="/redesign">
            <Button variant="ghost">Redesign</Button>
          </Link>
          <Link href="/pricing">
            <Button variant="ghost">Pricing</Button>
          </Link>
       

          <SignedOut>
            <SignInButton>
              <Button>Login</Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </nav>
  );
}
