import { ShoppingCart } from "lucide-react";
import type { Product } from "@/lib/types/product";
import { formatPrice } from "@/lib/utils/price";

type ProductCardProps = Pick<Product, "title" | "price" | "imageUrl">;

/**
 * Presentational component for a single product.
 * Deliberately kept as a Server Component — it has no interactivity.
 * Client-side event handlers (e.g. add-to-cart) can be added later
 * by extracting a small "use client" child component.
 */
export function ProductCard({ imageUrl, title, price }: ProductCardProps) {
  const formattedPrice = formatPrice(price);

  return (
    <div className="flex flex-col bg-white border border-gray-200">
      {/* Product Image */}
      <div className="aspect-square w-full flex items-center justify-center p-4 bg-white">
        <img
          src={imageUrl}
          alt={title}
          loading="lazy"
          decoding="async"
          className="max-w-full max-h-full object-contain"
        />
      </div>

      {/* Card Body */}
      <div className="px-3 pb-3 flex flex-col flex-1">
        {/* Title — clamped to 2 lines to keep grid rows aligned */}
        <p className="text-[11px] text-gray-500 leading-snug mb-2 min-h-[30px] line-clamp-2">
          {title}
        </p>

        {/* Price Row */}
        <div className="flex items-center gap-1.5 mb-3">
          <span className="text-sm font-bold text-gray-800">
            {formattedPrice} ГРН
          </span>
          <ShoppingCart
            className="w-3.5 h-3.5 text-gray-400 ml-auto"
            strokeWidth={1.5}
          />
        </div>

        {/* CTA Button */}
        <button
          type="button"
          className="w-full py-2.5 text-[11px] font-bold uppercase tracking-wider transition-[filter] hover:brightness-95 mt-auto bg-lime-brand text-[#1a1a1a]"
        >
          ДЕТАЛЬНІШЕ
        </button>
      </div>
    </div>
  );
}
