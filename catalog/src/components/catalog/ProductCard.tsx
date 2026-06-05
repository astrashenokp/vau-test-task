"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import type { Product } from "@/lib/types/product";
import { formatPrice } from "@/lib/utils/price";
import { Modal } from "@/components/ui/Modal";

/**
 * Props are the full Product so the Modal receives a complete object
 * without reconstructing it from partial pieces.
 */
type ProductCardProps = Product;

/**
 * Interactive product card — marked "use client" because it:
 *  1. Tracks modal open/close state with useState.
 *  2. Passes an onClick handler to the CTA button.
 *
 * Hover micro-interactions are done with Tailwind `group` utilities:
 *  - Card lifts 4px on hover (`hover:-translate-y-1`) with a drop shadow.
 *  - Product image subtly scales up (`group-hover:scale-105`).
 *  - Button darkens slightly (`hover:brightness-90`).
 */
export function ProductCard({ id, imageUrl, title, price }: ProductCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const product: Product = { id, imageUrl, title, price };

  return (
    <>
      {/* ── Card ──────────────────────────────────────────── */}
      <div className="group flex flex-col bg-white border border-gray-200 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
        {/* Image container */}
        <div className="aspect-square w-full flex items-center justify-center p-4 bg-white overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            loading="lazy"
            decoding="async"
            className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Body */}
        <div className="px-3 pb-3 flex flex-col flex-1">
          {/* Title — clamped to 2 lines so all rows stay aligned */}
          <p className="text-[11px] text-gray-500 leading-snug mb-2 min-h-[30px] line-clamp-2">
            {title}
          </p>

          {/* Price row */}
          <div className="flex items-center gap-1.5 mb-3">
            <span className="text-sm font-bold text-gray-800">
              {formatPrice(price)}&nbsp;ГРН
            </span>
            <ShoppingCart
              className="w-3.5 h-3.5 text-gray-400 ml-auto"
              strokeWidth={1.5}
            />
          </div>

          {/* CTA — opens the modal */}
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
