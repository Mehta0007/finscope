import { useState } from "react";
import { useCreateTransaction } from "@/hooks/useCreateTransaction";
import type { TransactionInput } from "@/types/transaction.types";

const initialState: TransactionInput = {
  amount: 0,
  type: "expense",
  category: "",
  description: "",
  date: "",
};

export const TransactionForm = () => {
  const { mutate, isPending } = useCreateTransaction();
  const [form, setForm] = useState<TransactionInput>(initialState);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(form, {
      onSuccess: () => setForm(initialState),
    });
  };

  const inputClass = "w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none focus:border-zinc-500 transition";

  return (
    <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col gap-4">
      <p className="text-sm font-semibold text-white">New Transaction</p>

      {/* Amount + Type */}
      <div className="flex gap-3">
        <input
          type="number"
          placeholder="Amount"
          value={form.amount || ""}
          onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
          className={`${inputClass} flex-1`}
          required
        />
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value as "income" | "expense" })}
          className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-zinc-500 transition"
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>

      {/* Category + Date */}
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className={`${inputClass} flex-1`}
          required
        />
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-zinc-400 outline-none focus:border-zinc-500 transition"
          required
        />
      </div>

      {/* Description */}
      <input
        type="text"
        placeholder="Description (optional)"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        className={inputClass}
      />

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-white text-black rounded-lg py-2.5 text-sm font-semibold hover:bg-zinc-200 transition disabled:opacity-40"
      >
        {isPending ? "Adding..." : "Add Transaction"}
      </button>
    </form>
  );
};