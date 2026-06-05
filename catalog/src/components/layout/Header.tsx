"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";

/**
 * Site-wide header.
 * Reads totalItems from CartContext and renders a badge when the cart
 * is non-empty. Marked "use client" because it calls useCart (a context hook).
 */
export function Header() {
  const { totalItems } = useCart();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <span className="text-sm font-bold tracking-wide text-gray-900 uppercase">
        Каталог товарів
      </span>

      <div className="relative inline-flex">
        <ShoppingCart className="w-5 h-5 text-gray-700" strokeWidth={1.5} />

        {/* Badge — only mounted when cart has items */}
        {totalItems > 0 && (
          <span
            className="absolute -top-2 -right-2 min-w-[16px] h-4 px-0.5 flex items-center justify-center rounded-full bg-lime-brand text-[#1a1a1a] text-[9px] font-bold leading-none"
            aria-label={`${totalItems} items in cart`}
          >
            {totalItems > 99 ? "99+" : totalItems}
          </span>
        )}
      </div>
    </header>
  );
}
