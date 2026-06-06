/**
 * Represents a single product returned from the API.
 * The shape matches the mockapi.io response schema.
 */
export interface Product {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
}

/**
 * Payload for creating a new product via POST.
 * Omits `id` — MockAPI generates it server-side.
 */
export type CreateProductPayload = Omit<Product, "id">;
