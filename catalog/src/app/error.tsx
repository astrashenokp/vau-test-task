"use client";

/**
 * Route-level error boundary.
 *
 * Must be a Client Component — Next.js requires error.tsx to export a
 * default Client Component so it can receive the `reset` callback.
 *
 * Catches any error thrown by Server Components in this route segment
 * (e.g., a failed API fetch in getProducts()) and gives the user a
 * clear recovery path without a blank screen.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white border border-gray-200 p-10 text-center max-w-md">
        <h2 className="text-lg font-bold text-gray-800 mb-2">
          Не вдалося завантажити товари
        </h2>
        <p className="text-xs text-gray-500 mb-6">
          {error.message || "Сталася невідома помилка. Спробуйте ще раз."}
        </p>
        <button
          type="button"
          onClick={reset}
          className="px-6 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-[filter] hover:brightness-95"
          style={{ backgroundColor: "#c4e500", color: "#1a1a1a" }}
        >
          Спробувати ще раз
        </button>
      </div>
    </main>
  );
}
