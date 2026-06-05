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
  totalPrice: number;
  isCartOpen: boolean;
}

interface CartDispatch {
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  openCart: () => void;
  closeCart: () => void;
}

// ── Contexts ───────────────────────────────────────────────────────────────

const CartStateContext = createContext<CartState | null>(null);
const CartDispatchContext = createContext<CartDispatch | null>(null);

// ── Provider ───────────────────────────────────────────────────────────────

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // -- Actions --

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

  const removeFromCart = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const increaseQuantity = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
      )
    );
  }, []);

  const decreaseQuantity = useCallback((id: string) => {
    setItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item,
        )
        // Automatically remove if quantity hits 0
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  // -- Computed State --

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const stateValue = useMemo(
    () => ({ items, totalItems, totalPrice, isCartOpen }),
    [items, totalItems, totalPrice, isCartOpen]
  );

  const dispatchValue = useMemo(
    () => ({
      addToCart,
      removeFromCart,
      increaseQuantity,
      decreaseQuantity,
      openCart,
      closeCart,
    }),
    [
      addToCart,
      removeFromCart,
      increaseQuantity,
      decreaseQuantity,
      openCart,
      closeCart,
    ]
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
