"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "@/lib/types/product";

// ── Types ──────────────────────────────────────────────────────────────────

/** A cart item is a Product plus a running quantity count. */
export interface CartItem extends Product {
  quantity: number;
}

interface CartContextValue {
  /** All items currently in the cart. */
  items: CartItem[];
  /** Total number of individual units across all items. */
  totalItems: number;
  /** Add one unit of a product. If it already exists, increments quantity. */
  addToCart: (product: Product) => void;
}

// ── Context ────────────────────────────────────────────────────────────────

const CartContext = createContext<CartContextValue | null>(null);

// ── Provider ───────────────────────────────────────────────────────────────

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = useCallback((product: Product) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        // Already in cart — bump the quantity
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      // New product — append with quantity 1
      return [...prev, { ...product, quantity: 1 }];
    });
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, totalItems }}>
      {children}
    </CartContext.Provider>
  );
}

// ── Hook ───────────────────────────────────────────────────────────────────

/**
 * Consume the cart anywhere inside <CartProvider>.
 * Throws at runtime if called outside the provider tree — catching
 * accidental misuse early instead of silently returning undefined.
 */
export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be called inside <CartProvider>.");
  }
  return ctx;
}
