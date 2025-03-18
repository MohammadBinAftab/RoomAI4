"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { ClerkProvider } from "@clerk/nextjs";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ClerkProvider>
            <TooltipProvider>
                {children}
            </TooltipProvider>
        </ClerkProvider>
    );
}
