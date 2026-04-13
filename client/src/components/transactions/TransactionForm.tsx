import { useState } from "react";
import { useCreateTransaction } from "@/hooks/useCreateTransaction";
import type { TransactionInput } from "@/types/transaction.types";

const getToday = () => new Date().toISOString().split("T")[0];

const initialState: TransactionInput = {
  amount: 0,
  type: "expense",
  category: "",
  description: "",
  date: getToday(),
};

const categorySuggestions = {
  expense: ["Food", "Bills", "Rent", "Travel"],
  income: ["Salary", "Freelance", "Bonus", "Refund"],
} as const;

export const TransactionForm = () => {
  const { mutate, isPending } = useCreateTransaction();
  const [form, setForm] = useState<TransactionInput>(initialState);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(form, {
      onSuccess: () => setForm(initialState),
    });
  };

  const baseInputClass =
    "app-input w-full rounded-2xl border px-4 py-3 text-sm placeholder:text-[var(--text-faint)] outline-none transition focus:opacity-95";
  const labelClass =
    "app-text-faint text-[10px] uppercase tracking-[0.18em]";

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5"
    >
      <div className="flex items-center justify-end">
        <div className="app-surface-soft rounded-full border p-1">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setForm({ ...form, type: "expense" })}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                form.type === "expense"
                  ? "app-button-primary"
                  : "app-text-subtle hover:opacity-90"
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setForm({ ...form, type: "income" })}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                form.type === "income"
                  ? "app-button-primary"
                  : "app-text-subtle hover:opacity-90"
              }`}
            >
              Income
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className={labelClass}>Amount</span>
          <input
            type="number"
            placeholder="0.00"
            min="0"
            step="0.01"
            value={form.amount || ""}
            onChange={(e) =>
              setForm({ ...form, amount: Number(e.target.value) })
            }
            className={`${baseInputClass} mt-2`}
            required
          />
        </label>

        <label className="block">
          <span className={labelClass}>Date</span>
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className={`${baseInputClass} mt-2`}
            required
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className={labelClass}>Category</span>
          <input
            type="text"
            placeholder="Food, Salary, Rent..."
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className={`${baseInputClass} mt-2`}
            required
          />
          <div className="mt-3 flex flex-wrap gap-2">
            {categorySuggestions[form.type].map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => setForm({ ...form, category: suggestion })}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                  form.category === suggestion
                    ? "app-button-primary border-transparent"
                    : "app-button-secondary"
                }`}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </label>

        <label className="block">
          <span className={labelClass}>Description</span>
          <input
            type="text"
            placeholder="Optional note"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            className={`${baseInputClass} mt-2`}
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={isPending || !form.amount || !form.category || !form.date}
        className="app-button-primary mt-1 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-medium transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isPending ? "Adding transaction..." : "Add transaction"}
      </button>
    </form>
  );
};
