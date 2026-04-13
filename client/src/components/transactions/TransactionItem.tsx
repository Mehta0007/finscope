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
  const [confirmDelete, setConfirmDelete] = useState(false);
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
    "app-input w-full rounded-xl border px-3 py-2 text-sm outline-none transition focus:opacity-95";

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
            className="app-button-secondary rounded-full border px-3 py-1.5 text-xs font-medium transition hover:opacity-90"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={
              isUpdating || !draft.amount || !draft.category.trim() || !draft.date
            }
            className="app-button-primary rounded-full px-3 py-1.5 text-xs font-medium transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isUpdating ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col gap-4 px-4 py-4 sm:px-5 sm:py-5 md:flex-row md:items-center md:justify-between border-l-2 transition-colors"
      style={{ borderLeftColor: isIncome ? "var(--income-accent)" : "var(--expense-accent)" }}
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium capitalize">
            {category}
          </span>
          <span className="app-surface-muted app-text-subtle rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em]">
            {type}
          </span>
        </div>

        {description ? (
          <p className="app-text-subtle mt-2 line-clamp-2 text-sm leading-6">
            {description}
          </p>
        ) : null}

        <p className="app-text-faint mt-2 text-xs uppercase tracking-[0.14em]">
          {formattedDate}
        </p>
      </div>

      <div className="flex items-center justify-between gap-4 md:justify-end">
        <span
          className={`text-base font-medium tracking-tight sm:text-lg ${
            isIncome ? "" : "app-text-muted"
          }`}
        >
          {isIncome ? "+" : "-"}
          {formatCurrencyINR(amount).replace("\u20B9", "\u20B9 ")}
        </span>

        <button
          onClick={() => {
            if (confirmDelete) {
              onDelete(id);
              return;
            }

            setConfirmDelete(true);
          }}
          disabled={isDeleting}
          className="app-button-secondary rounded-full border px-3 py-1.5 text-xs font-medium transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isDeleting
            ? "Deleting..."
            : confirmDelete
              ? "Confirm?"
              : "Delete"}
        </button>
        <button
          onClick={() => {
            setConfirmDelete(false);
            setIsEditing(true);
          }}
          className="app-button-secondary rounded-full border px-3 py-1.5 text-xs font-medium transition hover:opacity-90"
        >
          Edit
        </button>
        {confirmDelete ? (
          <button
            onClick={() => setConfirmDelete(false)}
            className="app-button-secondary rounded-full border px-3 py-1.5 text-xs font-medium transition hover:opacity-90"
          >
            Cancel
          </button>
        ) : null}
      </div>
    </div>
  );
};

