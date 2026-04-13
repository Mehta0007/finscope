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

type FieldErrors = {
  amount?: string;
  category?: string;
  date?: string;
};

export const TransactionForm = () => {
  const { mutate, isPending } = useCreateTransaction();
  const [form, setForm] = useState<TransactionInput>(initialState);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  // Track whether the user has attempted to submit at least once.
  // We only show errors after the first attempt so the form doesn't
  // feel accusatory before the user has done anything.
  const [submitted, setSubmitted] = useState(false);

  const validate = (current: TransactionInput): FieldErrors => {
    const errors: FieldErrors = {};
    if (!current.amount || current.amount <= 0) errors.amount = "Enter a valid amount greater than 0.";
    if (!current.category.trim()) errors.category = "Category is required.";
    if (!current.date) errors.date = "Date is required.";
    return errors;
  };

  const handleChange = (patch: Partial<TransactionInput>) => {
    const next = { ...form, ...patch };
    setForm(next);
    // Live-clear errors as the user fixes them, but only after first submit
    if (submitted) setFieldErrors(validate(next));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const errors = validate(form);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    mutate(form, {
      onSuccess: () => {
        setForm(initialState);
        setFieldErrors({});
        setSubmitted(false);
      },
    });
  };

  const baseInputClass =
    "app-input w-full rounded-2xl border px-4 py-3 text-sm placeholder:text-[var(--text-faint)] outline-none transition focus:opacity-95";
  const labelClass = "app-text-faint text-[10px] uppercase tracking-[0.18em]";
  const errorClass = "mt-1.5 text-xs" ;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      {/* Type toggle — sits at the top right of the form */}
      <div className="flex items-center justify-end">
        <div className="app-surface-soft rounded-full border p-1">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => handleChange({ type: "expense" })}
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
              onClick={() => handleChange({ type: "income" })}
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
        <div>
          <label className="block">
            <span className={labelClass}>Amount</span>
            <input
              type="number"
              placeholder="0.00"
              min="0"
              step="0.01"
              value={form.amount || ""}
              onChange={(e) => handleChange({ amount: Number(e.target.value) })}
              className={`${baseInputClass} mt-2 ${fieldErrors.amount ? "border-[var(--expense-accent)]" : ""}`}
            />
          </label>
          {fieldErrors.amount && (
            <p className={errorClass} style={{ color: "var(--expense-accent)" }}>
              {fieldErrors.amount}
            </p>
          )}
        </div>

        <div>
          <label className="block">
            <span className={labelClass}>Date</span>
            <input
              type="date"
              value={form.date}
              onChange={(e) => handleChange({ date: e.target.value })}
              className={`${baseInputClass} mt-2 ${fieldErrors.date ? "border-[var(--expense-accent)]" : ""}`}
            />
          </label>
          {fieldErrors.date && (
            <p className={errorClass} style={{ color: "var(--expense-accent)" }}>
              {fieldErrors.date}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block">
            <span className={labelClass}>Category</span>
            <input
              type="text"
              placeholder="Food, Salary, Rent..."
              value={form.category}
              onChange={(e) => handleChange({ category: e.target.value })}
              className={`${baseInputClass} mt-2 ${fieldErrors.category ? "border-[var(--expense-accent)]" : ""}`}
            />
          </label>
          {fieldErrors.category && (
            <p className={errorClass} style={{ color: "var(--expense-accent)" }}>
              {fieldErrors.category}
            </p>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            {categorySuggestions[form.type].map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => handleChange({ category: suggestion })}
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
        </div>

        <label className="block">
          <span className={labelClass}>Description</span>
          <input
            type="text"
            placeholder="Optional note"
            value={form.description}
            onChange={(e) => handleChange({ description: e.target.value })}
            className={`${baseInputClass} mt-2`}
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="app-button-primary mt-1 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-medium transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isPending ? "Adding transaction..." : "Add transaction"}
      </button>
    </form>
  );
};
