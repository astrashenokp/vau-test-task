"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "@/lib/types/product";

// ── Types ──────────────────────────────────────────────────────────────────

export interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
}

interface CartDispatch {
  addToCart: (product: Product) => void;
}

// ── Contexts ───────────────────────────────────────────────────────────────

/**
 * Split contexts: one for state, one for dispatch.
 * This is a critical performance optimisation. It prevents all ProductCards
 * (which only need addToCart) from re-rendering every time the cart state
 * (items/totalItems) changes.
 */
const CartStateContext = createContext<CartState | null>(null);
const CartDispatchContext = createContext<CartDispatch | null>(null);

// ── Provider ───────────────────────────────────────────────────────────────

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = useCallback((product: Product) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const stateValue = useMemo(
    () => ({ items, totalItems }),
    [items, totalItems]
  );

  const dispatchValue = useMemo(
    () => ({ addToCart }),
    [addToCart]
  );

  return (
    <CartDispatchContext.Provider value={dispatchValue}>
      <CartStateContext.Provider value={stateValue}>
        {children}
      </CartStateContext.Provider>
    </CartDispatchContext.Provider>
  );
}

// ── Hooks ──────────────────────────────────────────────────────────────────

export function useCartState(): CartState {
  const ctx = useContext(CartStateContext);
  if (!ctx) throw new Error("useCartState must be used within CartProvider");
  return ctx;
}

export function useCartDispatch(): CartDispatch {
  const ctx = useContext(CartDispatchContext);
  if (!ctx) throw new Error("useCartDispatch must be used within CartProvider");
  return ctx;
}
