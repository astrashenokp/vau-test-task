/**
 * Formats a number into a Ukrainian Hryvnia (UAH) display format.
 * E.g., 6000 -> "6 000"
 */
export function formatPrice(price: number): string {
  return price.toLocaleString("uk-UA").replace(",", " ");
}
