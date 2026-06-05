"use client";

import { useState } from "react";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";
import type { Product } from "@/lib/types/product";
import { formatPrice } from "@/lib/utils/price";
import { Modal } from "@/components/ui/Modal";
import { useCartDispatch } from "@/context/CartContext";

/**
 * Props are the full Product so the Modal receives a complete object.
 */
type ProductCardProps = Product;

/**
 * Interactive product card — "use client" because it:
 *  1. Tracks modal open/close state with useState.
 *  2. Calls useCartDispatch() to add items without triggering re-renders on cart state changes.
 *
 * Two ways to add to cart from this card:
 *  a. Cart icon button (quick-add, no modal needed)
 *  b. "ДЕТАЛЬНІШЕ" → opens Modal → "ДОДАТИ В КОШИК"
 *
 * Image strategy:
 *  - Uses next/image <Image fill> inside a positioned container.
 *  - `fill` avoids hardcoding dimensions we don't know at build time.
 *  - `sizes` tells the browser the correct image width at each viewport.
 *  - `object-contain` preserves aspect ratio (product images vary in shape).
 *
 * Hover micro-interactions via Tailwind `group` utilities:
 *  - Card lifts 4px + drop shadow on hover.
 *  - Image scales subtly on hover (overflow-hidden clips the scale).
 *  - Cart icon turns lime-brand on hover to signal interactivity.
 */
export function ProductCard({ id, imageUrl, title, price }: ProductCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToCart } = useCartDispatch();
  const product: Product = { id, imageUrl, title, price };

  /**
   * Quick-add handler — wired to the ShoppingCart icon button.
   * Stops propagation so clicking the icon doesn't bubble up to
   * any parent click handlers.
   */
  function handleQuickAdd(e: React.MouseEvent) {
    e.stopPropagation();
    addToCart(product);
    toast.success(`"${title.slice(0, 35)}…" додано до кошика!`);
  }

  return (
    <>
      {/* ── Card ──────────────────────────────────────────── */}
      <div className="group flex flex-col bg-white border border-gray-200 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
        {/* Image — relative container required by next/image fill */}
        <div className="relative aspect-square w-full overflow-hidden bg-white">
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 1200px) 25vw, 300px"
            className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Body */}
        <div className="px-3 pb-3 flex flex-col flex-1">
          {/* Title — clamped to 2 lines so all grid rows align */}
          <p className="text-[11px] text-gray-500 leading-snug mb-2 min-h-[30px] line-clamp-2">
            {title}
          </p>

          {/* Price row + quick-add cart icon */}
          <div className="flex items-center gap-1.5 mb-3">
            <span className="text-sm font-bold text-gray-800">
              {formatPrice(price)}&nbsp;ГРН
            </span>

            {/*
             * Quick-add button — clicking the cart icon adds the product
             * directly to the cart without opening the modal.
             */}
            <button
              type="button"
              onClick={handleQuickAdd}
              aria-label={`Додати "${title}" до кошика`}
              title="Швидко додати до кошика"
              className="ml-auto p-1 -mr-1 text-gray-400 hover:text-lime-brand transition-colors"
            >
              <ShoppingCart className="w-3.5 h-3.5" strokeWidth={1.5} />
            </button>
          </div>

          {/* CTA — opens the modal for full product details */}
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="w-full py-2.5 text-[11px] font-bold uppercase tracking-wider mt-auto bg-lime-brand text-[#1a1a1a] transition-[filter] hover:brightness-90"
          >
            ДЕТАЛЬНІШЕ
          </button>
        </div>
      </div>

      {/* ── Modal (mounted only when open) ────────────────── */}
      {isModalOpen && (
        <Modal product={product} onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
}
