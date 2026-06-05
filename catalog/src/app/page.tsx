import { getProducts } from "@/lib/api/products";
import { TopNav } from "@/components/layout/TopNav";
import { ProductList } from "@/components/catalog/ProductList";

/**
 * Root page — intentionally a Server Component (no "use client" directive).
 *
 * Data flow:
 *  1. `getProducts()` fetches from the live API (cache: 'no-store').
 *  2. Products are passed down to `<ProductList />` which renders the grid.
 *  3. If fetch throws, Next.js routes the error to `error.tsx`.
 *  4. While awaiting, Next.js renders `loading.tsx` as the Suspense fallback.
 */
export default async function Page() {
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-6xl">
        <TopNav />
        <div className="p-6">
          <ProductList products={products} />
        </div>
      </div>
    </main>
  );
}
