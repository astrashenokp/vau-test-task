"use client";

/**
 * Providers.tsx — single "use client" wrapper for all global providers.
 *
 * WHY this file exists:
 * app/layout.tsx is a Server Component and must stay that way (metadata,
 * font loading, etc. only work there). But context providers need
 * "use client". The pattern is to push all client-only wrappers into a
 * thin file like this, keeping layout.tsx clean.
 */

import { type ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import { CartProvider } from "@/context/CartContext";
import { SlideOverCart } from "@/components/cart/SlideOverCart";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      {children}
      
      {/* Global Slide-over Cart */}
      <SlideOverCart />

      {/*
       * Toaster must live inside a Client Component tree.
       * bottom-right keeps it away from the TopNav and search bar.
       */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            fontSize: "13px",
            fontWeight: 600,
          },
          success: {
            iconTheme: {
              primary: "#c4e500",
              secondary: "#1a1a1a",
            },
          },
        }}
      />
    </CartProvider>
  );
}
