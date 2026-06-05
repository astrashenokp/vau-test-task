import type { Product } from "@/lib/types/product";
import { ProductCard } from "./ProductCard";

interface ProductListProps {
  products: Product[];
}

/**
 * Server Component responsible for the desktop-only 4-column product grid.
 * Layout is intentionally non-responsive (min-w-[1024px]) per requirements.
 */
export function ProductList({ products }: ProductListProps) {
  return (
    <div className="min-w-[1024px] grid grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  );
}
