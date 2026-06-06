import type { Product, CreateProductPayload } from "@/lib/types/product";

const API_URL =
  process.env.PRODUCTS_API_URL ??
  "https://6a22f0fa5c610353286a8f6e.mockapi.io/products";

/**
 * Fetches all products from the remote API.
 * `cache: 'no-store'` ensures we never serve stale data from Next.js's
 * built-in fetch cache — the assignment explicitly forbids static data.
 *
 * Throws on non-OK HTTP responses so that Next.js error.tsx boundaries
 * can catch and display them gracefully.
 */
export async function getProducts(): Promise<Product[]> {
  const res = await fetch(API_URL, { cache: "no-store" });

  if (!res.ok) {
    throw new Error(
      `Failed to fetch products: ${res.status} ${res.statusText}`
    );
  }

  const data: Product[] = await res.json();
  return data;
}

/**
 * Creates a new product via POST to the MockAPI endpoint.
 * Called exclusively from Server Actions — the API URL is never
 * exposed to the browser bundle.
 *
 * Returns the newly created Product (including the server-generated `id`).
 * Throws on non-OK HTTP responses so the Server Action can catch and report them.
 */
export async function createProduct(payload: CreateProductPayload): Promise<Product> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(
      `Failed to create product: ${res.status} ${res.statusText}`
    );
  }

  const data: Product = await res.json();
  return data;
}
