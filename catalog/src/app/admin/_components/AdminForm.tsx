"use client";

import { useRef, useState, useTransition } from "react";
import toast from "react-hot-toast";
import { PackagePlus, Loader2 } from "lucide-react";
import { createProductAction } from "../actions";

// ── Category options (mirrors TopNav.tsx) ─────────────────────────────────

const CATEGORIES = [
  "ВУДКИ",
  "ВОЛОСІНЬ",
  "ПРИМАНКИ",
  "КОТУШКИ",
  "ОСНАЩЕННЯ",
  "ПРИКОРМКА",
] as const;

type Category = (typeof CATEGORIES)[number];

// ── Form state type ────────────────────────────────────────────────────────

interface FormState {
  title: string;
  price: string;
  imageUrl: string;
  category: Category;
}

const INITIAL_STATE: FormState = {
  title: "",
  price: "",
  imageUrl: "",
  category: "ВУДКИ",
};

// ── Field component ────────────────────────────────────────────────────────

function Field({
  label,
  id,
  error,
  children,
}: {
  label: string;
  id: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-bold uppercase tracking-wider text-gray-600">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

// ── Admin Form ─────────────────────────────────────────────────────────────

/**
 * Client Component that:
 *  1. Manages controlled form state with useState.
 *  2. Validates fields before submission.
 *  3. Calls the Server Action via useTransition to avoid blocking the UI.
 *  4. Shows toast feedback and resets the form on success.
 */
export function AdminForm() {
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate(): boolean {
    const newErrors: Partial<Record<keyof FormState, string>> = {};

    if (!form.title.trim()) newErrors.title = "Назва є обов'язковою";
    if (!form.price.trim()) {
      newErrors.price = "Ціна є обов'язковою";
    } else if (isNaN(Number(form.price)) || Number(form.price) <= 0) {
      newErrors.price = "Ціна повинна бути позитивним числом";
    }
    if (form.imageUrl.trim() && !/^https?:\/\/.+/.test(form.imageUrl.trim())) {
      newErrors.imageUrl = "Введіть коректний URL (починається з https://)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    startTransition(async () => {
      const titleForImage = `${form.category} - ${form.title.trim()}`.slice(0, 20);
      const result = await createProductAction({
        title: form.title.trim(),
        price: Number(form.price),
        imageUrl: form.imageUrl.trim() || `https://placehold.co/400x400/eeeeee/31343c?text=${encodeURIComponent(titleForImage)}`,
      });

      if (result.success) {
        toast.success(`"${result.product?.title}" успішно додано до каталогу!`);
        setForm(INITIAL_STATE);
        formRef.current?.reset();
      } else {
        toast.error(result.error ?? "Не вдалося додати товар. Спробуйте знову.");
      }
    });
  }

  const inputClass =
    "w-full px-3 py-2 text-sm bg-white border border-gray-200 outline-none focus:ring-2 focus:ring-lime-brand/50 focus:border-lime-brand transition-shadow placeholder:text-gray-400";
  const inputErrorClass = "border-red-400 focus:ring-red-400/30 focus:border-red-400";

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Title */}
      <Field label="Назва товару *" id="title" error={errors.title}>
        <input
          id="title"
          type="text"
          placeholder="Спінінг Golden Catch Inquisitor..."
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          className={`${inputClass} ${errors.title ? inputErrorClass : ""}`}
          disabled={isPending}
        />
      </Field>

      {/* Price */}
      <Field label="Ціна (ГРН) *" id="price" error={errors.price}>
        <input
          id="price"
          type="number"
          min="1"
          step="0.01"
          placeholder="1250"
          value={form.price}
          onChange={(e) => set("price", e.target.value)}
          className={`${inputClass} ${errors.price ? inputErrorClass : ""}`}
          disabled={isPending}
        />
      </Field>

      {/* Image URL */}
      <Field
        label="URL зображення"
        id="imageUrl"
        error={errors.imageUrl}
      >
        <input
          id="imageUrl"
          type="url"
          placeholder="https://placehold.co/400x400/... (необов'язково)"
          value={form.imageUrl}
          onChange={(e) => set("imageUrl", e.target.value)}
          className={`${inputClass} ${errors.imageUrl ? inputErrorClass : ""}`}
          disabled={isPending}
        />
        <p className="text-[11px] text-gray-400">
          Якщо поле порожнє — буде згенеровано placeholder-зображення автоматично.
        </p>
      </Field>

      {/* Category */}
      <Field label="Категорія *" id="category">
        <select
          id="category"
          value={form.category}
          onChange={(e) => set("category", e.target.value as Category)}
          className={`${inputClass} appearance-none cursor-pointer`}
          disabled={isPending}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </Field>

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full flex items-center justify-center gap-2 py-3 bg-lime-brand text-[#1a1a1a] font-bold text-xs tracking-wider uppercase transition-[filter] hover:brightness-90 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:brightness-100"
      >
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Додаємо товар...
          </>
        ) : (
          <>
            <PackagePlus className="w-4 h-4" />
            Додати товар
          </>
        )}
      </button>
    </form>
  );
}
