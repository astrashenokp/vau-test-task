import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/layout/Providers";
import { Header } from "@/components/layout/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Каталог товарів",
  description: "Рибальський каталог — вудки, котушки, приманки та оснащення",
};

/**
 * Root layout — Server Component.
 *
 * Structure:
 *   <html>
 *     <body>
 *       <Providers>           ← "use client" boundary (CartProvider + Toaster)
 *         <Header />          ← reads CartContext, shows badge
 *         {children}          ← page.tsx (Server Component)
 *       </Providers>
 *     </body>
 *   </html>
 *
 * Providers is the ONLY place in the tree that carries "use client".
 * Everything above it (this file) remains a Server Component.
 */
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="uk"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-100">
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
