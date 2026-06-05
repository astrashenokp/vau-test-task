import { Suspense } from "react";
import { getProducts } from "@/lib/api/products";
import { TopNav } from "@/components/layout/TopNav";
import { SearchBar } from "@/components/catalog/SearchBar";
import { ProductList } from "@/components/catalog/ProductList";

// ── Types ──────────────────────────────────────────────────────────────────

/**
 * Next.js 15: searchParams is a Promise — must be awaited.
 * Both `query` and `category` can be arrays if the user manually crafts a
 * URL like ?query=a&query=b, so we type them as `string | string[]` and
 * normalise to a single string before use.
 */
interface PageProps {
  searchParams: Promise<{
    query?: string | string[];
    category?: string | string[];
  }>;
}

/** Safely collapses a string-or-array searchParam into a single string. */
function normalise(param: string | string[] | undefined): string | undefined {
  if (Array.isArray(param)) return param[0];
  return param;
}

// ── Page ───────────────────────────────────────────────────────────────────

/**
 * Root page — Server Component.
 *
 * Data flow:
 *  1. Await searchParams to extract `query` and `category`.
 *  2. Fetch all products from the API (cache: 'no-store').
 *  3. Apply BOTH filters server-side before sending data to the client:
 *       a. Category filter: case-insensitive substring match on product.title.
 *          NOTE: the mock API has no category field, so we do a best-effort
 *          title match. In a real API you would filter on a `category` field.
 *       b. Search filter: case-insensitive substring on product.title.
 *  4. Pass the filtered subset to <ProductList> — no wasted data transfer.
 *
 * <TopNav> and <SearchBar> both call useSearchParams(), which requires a
 * <Suspense> boundary in App Router. Each gets its own boundary so a slow
 * search bar doesn't block the nav from rendering.
 */
export default async function Page({ searchParams }: PageProps) {
  const rawParams = await searchParams;
  const query = normalise(rawParams.query);
  const category = normalise(rawParams.category);

  const allProducts = await getProducts();

  const products = allProducts.filter((p) => {
    const titleLower = p.title.toLowerCase();

    // Category filter (case-insensitive title substring)
    if (category && !titleLower.includes(category.toLowerCase())) {
      return false;
    }

    // Search query filter (case-insensitive title substring)
    if (query && !titleLower.includes(query.toLowerCase())) {
      return false;
    }

    return true;
  });

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-6xl">
        {/*
         * TopNav calls useSearchParams() to read ?category= — Suspense required.
         * Fallback is a same-height skeleton bar so layout doesn't shift.
         */}
        <Suspense
          fallback={
            <div className="flex w-full h-[44px] bg-lime-brand animate-pulse" />
          }
        >
          <TopNav />
        </Suspense>

        <div className="p-6">
          {/*
           * SearchBar calls useSearchParams() — also needs its own Suspense.
           * Fallback is a visually identical disabled input.
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
            <SearchBar defaultValue={query} />
          </Suspense>

          {products.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-12">
              {category && !query && (
                <>
                  У категорії &ldquo;{category}&rdquo; товарів не знайдено.
                </>
              )}
              {query && !category && (
                <>
                  За запитом &ldquo;{query}&rdquo; товарів не знайдено.
                </>
              )}
              {query && category && (
                <>
                  За запитом &ldquo;{query}&rdquo; у категорії &ldquo;
                  {category}&rdquo; товарів не знайдено.
                </>
              )}
            </p>
          ) : (
            <ProductList products={products} />
          )}
        </div>
      </div>
    </main>
  );
}
