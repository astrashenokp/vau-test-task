import { Suspense } from "react";
import { getProducts } from "@/lib/api/products";
import { TopNav } from "@/components/layout/TopNav";
import { SearchBar } from "@/components/catalog/SearchBar";
import { SortDropdown } from "@/components/catalog/SortDropdown";
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
    sort?: string | string[];
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
  const sort = normalise(rawParams.sort);

  const allProducts = await getProducts();

  let products = allProducts.filter((p) => {
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

  // Apply Sorting
  if (sort === "asc") {
    products.sort((a, b) => a.price - b.price);
  } else if (sort === "desc") {
    products.sort((a, b) => b.price - a.price);
  }

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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="w-full sm:w-96">
              <Suspense
                fallback={
                  <div className="relative">
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
            </div>

            <Suspense
              fallback={
                <div className="w-48 h-[34px] bg-gray-200 animate-pulse" />
              }
            >
              <SortDropdown />
            </Suspense>
          </div>

          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white border border-gray-200 rounded-sm shadow-sm">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Товарів не знайдено
              </h3>
              <p className="text-sm text-gray-500 text-center max-w-md">
                {category && !query && (
                  <>У категорії &ldquo;<span className="font-semibold text-gray-700">{category}</span>&rdquo; немає товарів.</>
                )}
                {query && !category && (
                  <>За запитом &ldquo;<span className="font-semibold text-gray-700">{query}</span>&rdquo; нічого не знайдено.</>
                )}
                {query && category && (
                  <>За запитом &ldquo;<span className="font-semibold text-gray-700">{query}</span>&rdquo; у категорії &ldquo;<span className="font-semibold text-gray-700">{category}</span>&rdquo; товарів не знайдено.</>
                )}
                {!query && !category && "У нашому каталозі поки що немає товарів."}
              </p>
            </div>
          ) : (
            <ProductList products={products} />
          )}
        </div>
      </div>
    </main>
  );
}
