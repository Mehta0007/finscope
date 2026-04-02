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
    "w-full rounded-2xl border border-white/10 bg-[#0c0c0d] px-4 py-3 text-sm text-white placeholder:text-white/28 outline-none transition focus:border-white/22";
  const labelClass =
    "text-[10px] uppercase tracking-[0.18em] text-white/34";

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-white/30">
            Transaction
          </p>
          <h3 className="mt-2 text-lg font-medium tracking-tight text-white">
            Add a new entry
          </h3>
          <p className="mt-2 text-sm leading-6 text-white/42">
            Keep your records current with one clean daily log.
          </p>
        </div>

        <div className="rounded-full border border-white/8 bg-[#0c0c0d] p-1">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setForm({ ...form, type: "expense" })}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                form.type === "expense"
                  ? "bg-white text-black"
                  : "text-white/45 hover:text-white"
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setForm({ ...form, type: "income" })}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                form.type === "income"
                  ? "bg-white text-black"
                  : "text-white/45 hover:text-white"
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
            className={`${baseInputClass} mt-2 text-white/70`}
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
                    ? "border-white bg-white text-black"
                    : "border-white/8 text-white/45 hover:border-white/16 hover:text-white"
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
        className="mt-1 inline-flex w-full items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isPending ? "Adding transaction..." : "Add transaction"}
      </button>
    </form>
  );
};
