"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { ArrowDownUp } from "lucide-react";

/**
 * URL-driven Sort Dropdown — Client Component.
 *
 * Updates ?sort=asc or ?sort=desc in the URL without losing existing
 * ?query= or ?category= parameters.
 */
export function SortDropdown() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get("sort") || "default";

  const handleSortChange = useCallback(
    (newSort: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (newSort === "default") {
        params.delete("sort");
      } else {
        params.set("sort", newSort);
      }

      router.replace(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  return (
    <div className="flex items-center gap-2">
      <ArrowDownUp className="w-4 h-4 text-gray-400" />
      <select
        value={currentSort}
        onChange={(e) => handleSortChange(e.target.value)}
        className="text-sm bg-white border border-gray-200 text-gray-700 py-1.5 pl-3 pr-8 outline-none focus:ring-2 focus:ring-lime-brand/50 focus:border-lime-brand transition-shadow appearance-none cursor-pointer"
        aria-label="Сортування товарів"
      >
        <option value="default">За замовчуванням</option>
        <option value="asc">Від дешевих до дорогих</option>
        <option value="desc">Від дорогих до дешевих</option>
      </select>
    </div>
  );
}
