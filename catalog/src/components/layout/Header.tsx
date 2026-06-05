"use client";

import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useCartState, useCartDispatch } from "@/context/CartContext";

export function Header() {
  const { totalItems } = useCartState();
  const { openCart } = useCartDispatch();
  const [isMounted, setIsMounted] = useState(false);

  // Prevent hydration mismatches by only rendering the dynamic cart
  // badge after the component has mounted on the client. This is crucial
  // if the cart state is eventually hydrated from localStorage.
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <span className="text-sm font-bold tracking-wide text-gray-900 uppercase">
        Каталог товарів
      </span>

      <button
        type="button"
        onClick={openCart}
        aria-label="Відкрити кошик"
        className="relative inline-flex p-1 -mr-1 text-gray-700 hover:text-lime-brand transition-colors"
      >
        <ShoppingCart className="w-5 h-5" strokeWidth={1.5} />

        {/* Badge — only mounted when client-side mounted AND cart has items */}
        {isMounted && totalItems > 0 && (
          <span
            className="absolute -top-1 -right-1 min-w-[16px] h-4 px-0.5 flex items-center justify-center rounded-full bg-lime-brand text-[#1a1a1a] text-[9px] font-bold leading-none shadow-sm"
            aria-label={`${totalItems} items in cart`}
          >
            {totalItems > 99 ? "99+" : totalItems}
          </span>
        )}
      </button>
    </header>
  );
}
