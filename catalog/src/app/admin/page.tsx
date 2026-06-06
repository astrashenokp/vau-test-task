import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { AdminForm } from "./_components/AdminForm";

/**
 * Admin Page — Server Component shell.
 *
 * Intentionally has no data fetching — it simply renders the
 * AdminForm Client Component which handles all interaction.
 * The Server Action (actions.ts) handles the actual POST.
 */
export const metadata = {
  title: "Адмін-панель | Fishing Catalog",
  description: "Додати новий товар до каталогу.",
};

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-xl px-4 py-12">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-gray-900 transition-colors mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          До каталогу
        </Link>

        {/* Card */}
        <div className="bg-white border border-gray-200 shadow-sm p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100">
            <div className="w-10 h-10 bg-lime-brand flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#1a1a1a]" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Адмін-панель</h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Заповніть форму, щоб додати новий товар до MockAPI.
              </p>
            </div>
          </div>

          {/* Form */}
          <AdminForm />
        </div>

        {/* Footer note */}
        <p className="text-center text-[11px] text-gray-400 mt-6">
          Новий товар з'явиться в каталозі одразу після додавання.
        </p>
      </div>
    </main>
  );
}
