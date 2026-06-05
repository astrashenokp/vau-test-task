"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useRef } from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  /** The current query read from searchParams by the Server Component parent. */
  defaultValue?: string;
}

/**
 * URL-driven search input — Client Component.
 *
 * Strategy:
 *  - On each keystroke, we update ?query=... in the URL via router.replace.
 *  - router.replace (not push) avoids polluting the browser history with
 *    every character typed.
 *  - useSearchParams() gives us access to all current params so other
 *    query-string values (e.g. a future ?page=2) are preserved.
 *  - defaultValue seeds the input from the URL on first render, so the
 *    field is pre-filled after a page refresh.
 */
export function SearchBar({ defaultValue }: { defaultValue?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const timeoutRef = useRef<NodeJS.Timeout>(null);

  const handleSearch = useCallback(
    (term: string) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        const params = new URLSearchParams(searchParams.toString());
        if (term.trim()) {
          params.set("query", term.trim());
        } else {
          params.delete("query");
        }
        router.replace(`${pathname}?${params.toString()}`);
      }, 300);
    },
    [router, pathname, searchParams],
  );

  return (
    <div className="relative mb-4">
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
        strokeWidth={1.5}
      />
      <input
        type="search"
        placeholder="Пошук товарів..."
        defaultValue={defaultValue}
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 outline-none focus:border-lime-brand transition-colors placeholder:text-gray-400"
      />
    </div>
  );
}
