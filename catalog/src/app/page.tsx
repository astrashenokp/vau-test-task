import { Suspense } from "react";
import { getProducts } from "@/lib/api/products";
import { TopNav } from "@/components/layout/TopNav";
import { SearchBar } from "@/components/catalog/SearchBar";
import { ProductList } from "@/components/catalog/ProductList";

/**
 * Next.js 15: searchParams is a Promise — must be awaited.
 * In Next.js 14 this was a plain object; the async pattern works on both.
 */
interface PageProps {
  searchParams: Promise<{ query?: string | string[] }>;
}

/**
 * Root page — Server Component.
 *
 * Data flow:
 *  1. Await searchParams to get the current ?query= value.
 *  2. Fetch all products from the API (cache: 'no-store').
 *  3. Filter products by query BEFORE passing to ProductList.
 *     Filtering on the server means the client receives only the matching
 *     subset — no wasted data transfer.
 *  4. Pass the raw query string to <SearchBar> so the input is pre-filled
 *     on page refresh (the SearchBar handles further updates client-side).
 *
 * SearchBar is wrapped in <Suspense> because it calls useSearchParams(),
 * which requires a Suspense boundary in the App Router.
 */
export default async function Page({ searchParams }: PageProps) {
  const { query } = await searchParams;
  // Next.js searchParams can be an array if ?query=a&query=b
  const queryStr = Array.isArray(query) ? query[0] : query;
  const allProducts = await getProducts();

  const products = queryStr
    ? allProducts.filter((p) =>
        p.title.toLowerCase().includes(queryStr.toLowerCase()),
      )
    : allProducts;

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-6xl">
        <TopNav />

        <div className="p-6">
          {/*
           * Suspense is required here because SearchBar calls useSearchParams().
           * The fallback is a plain input shell so the layout doesn't shift.
           */}
          <Suspense
            fallback={
              <div className="relative mb-4">
                <input
                  type="search"
                  disabled
                  placeholder="Пошук товарів..."
                  className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 placeholder:text-gray-300"
                />
              </div>
            }
          >
            <SearchBar defaultValue={queryStr} />
          </Suspense>

          {products.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-12">
              Товарів за запитом &ldquo;{queryStr}&rdquo; не знайдено.
            </p>
          ) : (
            <ProductList products={products} />
          )}
        </div>
      </div>
    </main>
  );
}
