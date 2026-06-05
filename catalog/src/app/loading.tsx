/**
 * Route-level loading UI.
 *
 * Next.js automatically wraps page.tsx in a <Suspense> boundary and renders
 * this component while the async Server Component is fetching data.
 * No "use client" needed — this is a Server Component.
 */
export default function Loading() {
  return (
    <main className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-6xl">
        {/* Nav skeleton */}
        <div className="h-11 w-full animate-pulse bg-lime-200" />

        {/* Grid skeleton — mirrors the 4-column layout */}
        <div className="p-6 min-w-[1024px] grid grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col bg-white border border-gray-200">
              <div className="aspect-square animate-pulse bg-gray-100" />
              <div className="p-3 space-y-2">
                <div className="h-3 animate-pulse bg-gray-100 rounded w-full" />
                <div className="h-3 animate-pulse bg-gray-100 rounded w-3/4" />
                <div className="h-4 animate-pulse bg-gray-100 rounded w-1/2 mt-2" />
                <div className="h-9 animate-pulse bg-lime-100 rounded mt-3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
