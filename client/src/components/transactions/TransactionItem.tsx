import { formatCurrencyINR } from "@/lib/transactions";
import type { TransactionInput } from "@/types/transaction.types";
import type { Transaction } from "@/types/transaction.types";
import { useState } from "react";

type TransactionItemProps = {
  transaction: Transaction;
  onDelete: (id: string) => void;
  onUpdate: (id: string, data: TransactionInput) => void;
  isDeleting?: boolean;
  isUpdating?: boolean;
};

export const TransactionItem = ({
  transaction,
  onDelete,
  onUpdate,
  isDeleting = false,
  isUpdating = false,
}: TransactionItemProps) => {
  const { id, amount, type, category, description, date } = transaction;
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<TransactionInput>({
    amount,
    type,
    category,
    description: description ?? "",
    date: date.split("T")[0] ?? date,
  });

  const isIncome = type === "income";

  const formattedDate = new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const handleSave = () => {
    onUpdate(id, draft);
    setIsEditing(false);
  };

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none transition focus:border-white/20";

  if (isEditing) {
    return (
      <div className="space-y-4 px-4 py-4 sm:px-5 sm:py-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            type="text"
            value={draft.category}
            onChange={(e) => setDraft({ ...draft, category: e.target.value })}
            className={inputClass}
            placeholder="Category"
          />
          <input
            type="number"
            value={draft.amount || ""}
            onChange={(e) =>
              setDraft({ ...draft, amount: Number(e.target.value) })
            }
            className={inputClass}
            min="0"
            step="0.01"
            placeholder="Amount"
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <select
            value={draft.type}
            onChange={(e) =>
              setDraft({
                ...draft,
                type: e.target.value as "income" | "expense",
              })
            }
            className={inputClass}
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
          <input
            type="date"
            value={draft.date}
            onChange={(e) => setDraft({ ...draft, date: e.target.value })}
            className={inputClass}
          />
        </div>

        <input
          type="text"
          value={draft.description}
          onChange={(e) => setDraft({ ...draft, description: e.target.value })}
          className={inputClass}
          placeholder="Description"
        />

        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => {
              setDraft({
                amount,
                type,
                category,
                description: description ?? "",
                date: date.split("T")[0] ?? date,
              });
              setIsEditing(false);
            }}
            className="rounded-full border border-white/8 px-3 py-1.5 text-xs font-medium text-white/40 transition hover:border-white/16 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={
              isUpdating || !draft.amount || !draft.category.trim() || !draft.date
            }
            className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isUpdating ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 px-4 py-4 sm:px-5 sm:py-5 md:flex-row md:items-center md:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium capitalize text-white">
            {category}
          </span>
          <span
            className={`rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] ${
              isIncome
                ? "bg-white/10 text-white/72"
                : "bg-white/6 text-white/46"
            }`}
          >
            {type}
          </span>
        </div>

        {description ? (
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/42">
            {description}
          </p>
        ) : null}

        <p className="mt-2 text-xs uppercase tracking-[0.14em] text-white/26">
          {formattedDate}
        </p>
      </div>

      <div className="flex items-center justify-between gap-4 md:justify-end">
        <span
          className={`text-base font-medium tracking-tight sm:text-lg ${
            isIncome ? "text-white" : "text-white/78"
          }`}
        >
          {isIncome ? "+" : "-"}
          {formatCurrencyINR(amount).replace("\u20B9", "\u20B9 ")}
        </span>

        <button
          onClick={() => onDelete(id)}
          disabled={isDeleting}
          className="rounded-full border border-white/8 px-3 py-1.5 text-xs font-medium text-white/34 transition hover:border-white/16 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
        <button
          onClick={() => setIsEditing(true)}
          className="rounded-full border border-white/8 px-3 py-1.5 text-xs font-medium text-white/34 transition hover:border-white/16 hover:text-white"
        >
          Edit
        </button>
      </div>
    </div>
  );
};
