const CATEGORIES = [
  "ВУДКИ",
  "ВОЛОСІНЬ",
  "ПРИМАНКИ",
  "КОТУШКИ",
  "ОСНАЩЕННЯ",
  "ПРИКОРМКА",
];

/**
 * Top navigation bar matching the design mockup.
 * Rendered as a Server Component — no client-side interactivity needed
 * for the current scope (static category list).
 */
export function TopNav() {
  return (
    <nav className="flex items-center w-full overflow-x-auto bg-lime-brand">
      {CATEGORIES.map((category) => (
        <button
          key={category}
          type="button"
          className="px-5 py-3 text-xs font-bold tracking-wider text-gray-900 whitespace-nowrap hover:bg-black/10 transition-colors"
        >
          {category}
        </button>
      ))}
    </nav>
  );
}
