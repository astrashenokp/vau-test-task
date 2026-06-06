# 🎣 Fishing Catalog — Next.js App Router

A production-quality fishing-gear product catalog built as a test assignment. Demonstrates real-world patterns for the Next.js 16 App Router: server-side data fetching, URL-driven state, global React Context, image optimization, and interactive slide-over cart UI.

---

## ✨ Features

| Feature | Details |
|---|---|
| **Product Grid** | 4-column catalog fetched from MockAPI on every request (`cache: 'no-store'`). |
| **URL-driven Category Filter** | Click any category in the top nav. URL becomes `?category=ВУДКИ`. Shareable & bookmark-friendly. |
| **Live Search** | Debounced 300 ms search input writes to `?query=`. Server filters before data leaves the API. |
| **Server-Side Sorting** | Sort dropdown writes `?sort=asc\|desc` to the URL. The Server Component sorts the fetched array in-place. |
| **Global Cart (React Context)** | Cart state is held in a split Context (separate state/dispatch) to prevent cascading re-renders across the product grid. |
| **Slide-over Cart Drawer** | Click the cart icon to open an animated drawer with full quantity management, per-item removal, and total price. |
| **Product Modal** | "ДЕТАЛЬНІШЕ" opens a full-detail overlay with an "Add to Cart" CTA. |
| **Toast Notifications** | `react-hot-toast` confirms every cart action instantly. |
| **Image Optimization** | All product images are rendered via `next/image` with `fill` + `sizes`, served through Next.js's built-in image optimizer. |
| **Empty States** | Contextual "no results" UI with icon for any filter/search combination. |
| **Admin Panel** | `/admin` route with a form to add new products directly to MockAPI via a Next.js Server Action. |
| **Hydration-safe** | Cart badge uses an `isMounted` pattern to prevent server/client HTML mismatches. |

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) — App Router |
| Language | [TypeScript 5](https://www.typescriptlang.org/) — strict mode |
| Styling | [Tailwind CSS 4](https://tailwindcss.com/) |
| Icons | [Lucide React](https://lucide.dev/) |
| Notifications | [react-hot-toast](https://react-hot-toast.com/) |
| Data | [MockAPI.io](https://mockapi.io/) |
| Runtime | Node.js ≥ 18.18 |

---

## 📁 Project Structure

```
catalog/
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   ├── _components/
│   │   │   │   └── AdminForm.tsx   # Client form + Server Action for product creation
│   │   │   └── page.tsx            # Admin page — Server Component shell
│   │   ├── layout.tsx              # Root layout — mounts Providers + Header
│   │   ├── page.tsx                # Server Component — fetches, filters, sorts, renders grid
│   │   ├── loading.tsx             # Route-level loading skeleton
│   │   └── error.tsx               # Route-level error boundary
│   ├── components/
│   │   ├── cart/
│   │   │   └── SlideOverCart.tsx   # Global slide-over cart drawer
│   │   ├── catalog/
│   │   │   ├── ProductCard.tsx     # Interactive product card (Client)
│   │   │   ├── ProductList.tsx     # 4-column grid wrapper (Server)
│   │   │   ├── SearchBar.tsx       # Debounced URL-driven search input (Client)
│   │   │   └── SortDropdown.tsx    # URL-driven sort select (Client)
│   │   ├── layout/
│   │   │   ├── Header.tsx          # Top bar with cart icon + badge (Client)
│   │   │   ├── Providers.tsx       # Root Client boundary wrapping context + toasts
│   │   │   └── TopNav.tsx          # Category navigation (Client)
│   │   └── ui/
│   │       └── Modal.tsx           # Product detail modal (Client)
│   ├── context/
│   │   └── CartContext.tsx         # Split state/dispatch React Context
│   └── lib/
│       ├── api/products.ts         # getProducts() + createProduct() fetch utilities
│       ├── types/product.ts        # Product interface + CreateProductPayload type
│       └── utils/price.ts          # formatPrice() helper
├── next.config.ts                  # next/image remotePatterns + SVG config
└── .env.local                      # PRODUCTS_API_URL (optional override)
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** `>= 18.18.0`
- **npm** `>= 9`

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/vau-test-task.git
cd vau-test-task/catalog

# 2. Install dependencies
npm install

# 3. (Optional) Configure environment
cp .env.local.example .env.local
# Then edit .env.local and set your MockAPI endpoint:
# PRODUCTS_API_URL=https://your-id.mockapi.io/products

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the catalog.
Open [http://localhost:3000/admin](http://localhost:3000/admin) to access the Admin Panel.

### Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PRODUCTS_API_URL` | `https://6a22f0fa5c610353286a8f6e.mockapi.io/products` | MockAPI endpoint to fetch and create products. |

> **Note:** Next.js server-only env vars (no `NEXT_PUBLIC_` prefix) are **never exposed** to the browser. The API URL stays server-side.

### Image Domain Setup

External product images are proxied through Next.js's image optimizer. The following domains are pre-configured in `next.config.ts`:

```ts
remotePatterns: [
  { protocol: "https", hostname: "*.mockapi.io" },
  { protocol: "https", hostname: "placehold.co" },
  { protocol: "https", hostname: "loremflickr.com" },
  { protocol: "https", hostname: "*.blob.vercel-storage.com" },
],
dangerouslyAllowSVG: true,
contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
```

If your image CDN is different, add its `hostname` to `remotePatterns`.

### Production Build

```bash
npm run build
npm run start
```

---

## 🗺️ Pages

| Route | Description |
|---|---|
| `/` | Product catalog with category nav, search, and sort |
| `/admin` | Admin panel to add new products to MockAPI |

---

## 📖 Key Architectural Decisions

### Server vs. Client Components

| Component | Type | Why |
|---|---|---|
| `app/page.tsx` | **Server** | Fetches, filters, and sorts data — no client JS shipped. |
| `app/admin/page.tsx` | **Server** | Static shell — renders the `<AdminForm />` Client Component. |
| `ProductList.tsx` | **Server** | Pure rendering — no interactivity needed. |
| `ProductCard.tsx` | **Client** | Manages modal open/close state and cart dispatch. |
| `TopNav.tsx` | **Client** | Reads `useSearchParams()` to highlight active category. |
| `Header.tsx` | **Client** | Reads cart state and dispatches `openCart`. |
| `AdminForm.tsx` | **Client** | Controlled form inputs, submission state, and toast feedback. |

### Cart Context Split Pattern

The `CartContext` uses **two separate React contexts** — `CartStateContext` and `CartDispatchContext`. This is a critical performance decision: `ProductCard` components only subscribe to `CartDispatchContext` (which is stable), so they are **never re-rendered** when the cart total changes. Only `Header` and `SlideOverCart` subscribe to the full state.

### URL as State

All filter, search, and sort state lives **exclusively in the URL**. This means:
- Pages are shareable and bookmark-friendly.
- The browser Back/Forward buttons work naturally.
- No `useState` on the server.

### Admin Panel: Server Actions

The Admin form uses a **Next.js Server Action** (`"use server"`) instead of a client-side `fetch`. Benefits:
- The MockAPI URL is **never sent to the browser**.
- Calling `revalidatePath('/')` inside the action makes the catalog **automatically show the new product** after creation — no manual refresh needed.
- Zero additional dependencies.
