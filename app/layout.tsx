import { type Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";

import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Providers } from "./providers";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: "RoomAI",
  description: "Transform your space with AI-powered room redesign",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}>
        <ClerkProvider>
          <Providers>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
              <div className="flex min-h-screen flex-col">
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
              <Toaster />
            </ThemeProvider>
          </Providers>
        </ClerkProvider>
      </body>
    </html>
  );
}
