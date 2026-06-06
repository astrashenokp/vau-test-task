"use server";

import { revalidatePath } from "next/cache";
import { createProduct } from "@/lib/api/products";
import type { CreateProductPayload } from "@/lib/types/product";
import type { Product } from "@/lib/types/product";

// ── Result Type ────────────────────────────────────────────────────────────

type ActionResult =
  | { success: true; product: Product }
  | { success: false; error: string };

// ── Server Action ──────────────────────────────────────────────────────────

/**
 * Server Action that creates a product via the MockAPI POST endpoint.
 *
 * WHY A SERVER ACTION:
 *  - The MockAPI URL lives only in `process.env` — never exposed to the browser.
 *  - `revalidatePath('/')` tells Next.js to re-fetch products on the catalog page
 *    so the new item appears immediately without any client-side router.refresh() call.
 *  - Zero extra dependencies vs. a route handler.
 */
export async function createProductAction(
  payload: CreateProductPayload
): Promise<ActionResult> {
  try {
    const product = await createProduct(payload);
    // Invalidate the catalog page so the new product appears immediately
    revalidatePath("/");
    return { success: true, product };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Невідома помилка";
    return { success: false, error: message };
  }
}
