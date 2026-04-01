import type { Transaction } from "@/types/transaction.types";

type TransactionItemProps = {
  transaction: Transaction;
  onDelete: (id: string) => void;
};

export const TransactionItem = ({ transaction, onDelete }: TransactionItemProps) => {
  const { id, amount, type, category, description, date } = transaction;

  const isIncome = type === "income";

  const formattedDate = new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="flex items-center justify-between py-4 border-b border-zinc-800 last:border-0">
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium text-white capitalize">{category}</span>
        {description && (
          <span className="text-xs text-zinc-500">{description}</span>
        )}
        <span className="text-xs text-zinc-600">{formattedDate}</span>
      </div>

      <div className="flex items-center gap-4">
        <span className={`text-sm font-semibold ${isIncome ? "text-emerald-400" : "text-red-400"}`}>
          {isIncome ? "+" : "-"}₹{amount}
        </span>
        <button
          onClick={() => onDelete(id)}
          className="text-xs text-zinc-600 hover:text-red-400 transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
};