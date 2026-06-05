"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import type { Product } from "@/lib/types/product";
import { formatPrice } from "@/lib/utils/price";
import { useCartDispatch } from "@/context/CartContext";

interface ModalProps {
  product: Product;
  onClose: () => void;
}

/**
 * Product detail modal overlay.
 *
 * Behaviour:
 * - Closes on backdrop click (checks target === backdrop ref to avoid
 *   closing when clicking inside the white card).
 * - Closes on Escape key press.
 * - Locks <body> scroll while open, restores on unmount.
 * - "ДОДАТИ В КОШИК" adds to CartContext and fires a toast notification.
 */
export function Modal({ product, onClose }: ModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCartDispatch();

  // Close on Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Prevent background scroll while modal is mounted
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === backdropRef.current) onClose();
  }

  function handleAddToCart() {
    addToCart(product);
    toast.success(`"${product.title.slice(0, 40)}…" додано до кошика!`);
    onClose();
  }

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={product.title}
    >
      <div className="relative bg-white w-full max-w-lg mx-4 shadow-2xl">
        {/* ── Close button ──────────────────────────────────── */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрити"
          className="absolute top-3 right-3 p-1 text-gray-400 hover:text-gray-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ── Product image ─────────────────────────────────── */}
        <div className="flex items-center justify-center bg-gray-50 p-8 border-b border-gray-100">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="max-h-56 object-contain"
          />
        </div>

        {/* ── Product details ───────────────────────────────── */}
        <div className="p-6">
          <h2 className="text-sm font-bold text-gray-900 mb-3 leading-snug">
            {product.title}
          </h2>

          {/* Placeholder description */}
          <p className="text-xs text-gray-500 leading-relaxed mb-6">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>

          {/* Price + CTA row */}
          <div className="flex items-center justify-between gap-4">
            <span className="text-xl font-bold text-gray-900 whitespace-nowrap">
              {formatPrice(product.price)}&nbsp;ГРН
            </span>

            <button
              type="button"
              onClick={handleAddToCart}
              className="px-6 py-2.5 text-[11px] font-bold uppercase tracking-wider bg-lime-brand text-[#1a1a1a] transition-[filter] hover:brightness-90"
            >
              ДОДАТИ В КОШИК
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
