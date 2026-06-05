"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

/**
 * Category slugs kept in upper-case so they match the mock API's category
 * field naming convention exactly. The same values end up in the URL as
 * ?category=ВУДКИ, and the Server Component compares case-insensitively.
 */
const CATEGORIES = [
  "ВУДКИ",
  "ВОЛОСІНЬ",
  "ПРИМАНКИ",
  "КОТУШКИ",
  "ОСНАЩЕННЯ",
  "ПРИКОРМКА",
] as const;

type Category = (typeof CATEGORIES)[number];

/**
 * Top navigation bar — Client Component.
 *
 * WHY "use client":
 *   We need useRouter/useSearchParams to write the ?category= URL param
 *   on each click. This is intentionally the only interactivity in the nav;
 *   no state is held locally — the URL is the source of truth.
 *
 * Behaviour:
 *   - Clicking an inactive category → sets ?category=НАЗВА, preserves ?query=.
 *   - Clicking the active category again → removes ?category= (toggle off).
 *   - Uses router.replace (not push) — category changes don't pollute history.
 *
 * Active styling:
 *   The active category gets a solid black underline and white text to give
 *   strong visual feedback without needing any local state.
 */
export function TopNav() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeCategory = searchParams.get("category");

  const handleCategoryClick = useCallback(
    (category: Category) => {
      // Clone all existing params so ?query= and others are preserved
      const params = new URLSearchParams(searchParams.toString());

      if (activeCategory === category) {
        // Toggle off — clicking the active category deselects it
        params.delete("category");
      } else {
        params.set("category", category);
      }

      router.replace(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams, activeCategory],
  );

  return (
    <nav
      className="flex items-center w-full overflow-x-auto bg-lime-brand"
      aria-label="Навігація за категоріями"
    >
      {CATEGORIES.map((category) => {
        const isActive = activeCategory === category;

        return (
          <button
            key={category}
            type="button"
            onClick={() => handleCategoryClick(category)}
            aria-pressed={isActive}
            className={[
              "px-5 py-3 text-xs font-bold tracking-wider whitespace-nowrap transition-colors",
              isActive
                ? "bg-[#1a1a1a] text-lime-brand"
                : "text-gray-900 hover:bg-black/10",
            ].join(" ")}
          >
            {category}
          </button>
        );
      })}
    </nav>
  );
}
