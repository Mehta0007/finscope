import { useTransactions } from "@/hooks/useTransactions";
import { useDeleteTransaction } from "@/hooks/useDeleteTransaction";
import { TransactionItem } from "./TransactionItem";

export const TransactionList = () => {
  const { transactions, isLoading, error } = useTransactions();
  const { mutate: deleteTransaction } = useDeleteTransaction();

  // 🔹 Loading state
  if (isLoading) {
    return <div className="p-4 text-sm text-gray-500">Loading...</div>;
  }

  // 🔹 Error state
  if (error) {
    return <div className="p-4 text-sm text-red-500">Something went wrong</div>;
  }

  // 🔹 Empty state
  if (!transactions || transactions.length === 0) {
    return <div className="p-4 text-sm text-gray-400">No transactions yet</div>;
  }

  return (
    <div className="divide-y">
      {transactions.map((transaction) => (
        <TransactionItem
          key={transaction.id}
          transaction={transaction}
          onDelete={deleteTransaction}
        />
      ))}
    </div>
  );
};