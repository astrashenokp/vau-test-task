"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { useCartState, useCartDispatch } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils/price";

/**
 * Slide-over Cart Drawer — Client Component.
 *
 * Renders conditionally based on isCartOpen context state.
 * Fixed to the right edge. Includes a backdrop that closes the cart on click.
 */
export function SlideOverCart() {
  const { isCartOpen, items, totalPrice } = useCartState();
  const { closeCart, increaseQuantity, decreaseQuantity, removeFromCart } =
    useCartDispatch();

  const backdropRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isCartOpen) closeCart();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isCartOpen, closeCart]);

  // Lock body scroll when open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === backdropRef.current) closeCart();
  }

  if (!isCartOpen) return null;

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex justify-end transition-opacity"
      aria-modal="true"
      role="dialog"
      aria-label="Кошик"
    >
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-lime-brand" />
            Кошик
          </h2>
          <button
            type="button"
            onClick={closeCart}
            className="p-2 -mr-2 text-gray-400 hover:text-gray-900 transition-colors"
            aria-label="Закрити кошик"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-4">
              <ShoppingBag className="w-12 h-12 opacity-20" strokeWidth={1} />
              <p>Ваш кошик порожній.</p>
              <button
                type="button"
                onClick={closeCart}
                className="text-lime-brand font-bold uppercase tracking-wider text-xs hover:underline mt-2"
              >
                Продовжити покупки
              </button>
            </div>
          ) : (
            <ul className="space-y-6">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4">
                  {/* Image */}
                  <div className="relative w-20 h-20 bg-gray-50 flex-shrink-0 border border-gray-100 overflow-hidden rounded-sm">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      sizes="80px"
                      className="object-contain p-1"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex flex-col flex-1">
                    <h3 className="text-xs font-bold text-gray-900 line-clamp-2 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-lime-brand font-bold text-sm mt-1 mb-2">
                      {formatPrice(item.price)} ГРН
                    </p>

                    {/* Quantity & Remove */}
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center border border-gray-200">
                        <button
                          type="button"
                          onClick={() => decreaseQuantity(item.id)}
                          className="px-2 py-1 text-gray-500 hover:bg-gray-100 transition-colors"
                          aria-label="Зменшити кількість"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => increaseQuantity(item.id)}
                          className="px-2 py-1 text-gray-500 hover:bg-gray-100 transition-colors"
                          aria-label="Збільшити кількість"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                        aria-label="Видалити товар"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer (Totals & Checkout) */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-600">Разом:</span>
              <span className="text-xl font-bold text-gray-900">
                {formatPrice(totalPrice)} ГРН
              </span>
            </div>
            <button
              type="button"
              className="w-full py-3 bg-lime-brand text-[#1a1a1a] font-bold text-xs tracking-wider uppercase transition-[filter] hover:brightness-90 flex items-center justify-center"
            >
              ОФОРМИТИ ЗАМОВЛЕННЯ
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
