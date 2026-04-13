import { useDeleteTransaction } from "@/hooks/useDeleteTransaction";
import { useTransactions } from "@/hooks/useTransactions";
import { useUpdateTransaction } from "@/hooks/useUpdateTransaction";
import {
  getTransactionGroupLabel,
  sortTransactionsByDate,
} from "@/lib/transactions";
import type { Transaction, TransactionInput } from "@/types/transaction.types";
import { TransactionItem } from "./TransactionItem";

export const TransactionList = () => {
  const { transactions, isLoading, error } = useTransactions();
  const deleteTransaction = useDeleteTransaction();
  const updateTransaction = useUpdateTransaction();

  if (isLoading) {
    return (
      <div className="app-surface-soft rounded-2xl border px-4 py-8 text-center">
        <p className="app-text-subtle text-sm">Loading transactions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-surface-soft rounded-2xl border px-4 py-8 text-center">
        <p className="app-text-subtle text-sm">Unable to load transactions.</p>
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="app-surface-soft rounded-2xl border border-dashed px-5 py-10 text-center">
        <p className="app-text-muted text-sm font-medium">No transactions yet</p>
        <p className="app-text-subtle mt-2 text-sm leading-6">
          Add your first income or expense to start building your overview.
        </p>
      </div>
    );
  }

  const groupedTransactions = sortTransactionsByDate(transactions).reduce<
    Array<{ label: string; items: Transaction[] }>
  >((groups, transaction) => {
    const label = getTransactionGroupLabel(transaction.date);
    const currentGroup = groups[groups.length - 1];

    if (currentGroup && currentGroup.label === label) {
      currentGroup.items.push(transaction);
      return groups;
    }

    groups.push({ label, items: [transaction] });
    return groups;
  }, []);

  return (
    <div className="space-y-4">
      <div className="app-text-faint flex items-center justify-between text-xs uppercase tracking-[0.18em]">
        <span>History</span>
        <span>{transactions.length} entries</span>
      </div>

      <div className="space-y-4">
        {groupedTransactions.map((group) => (
          <section
            key={group.label}
            className="app-surface-soft overflow-hidden rounded-2xl border"
          >
            <div className="app-border border-b px-4 py-3 sm:px-5">
              <p className="app-text-faint text-[11px] font-medium uppercase tracking-[0.18em]">
                {group.label}
              </p>
            </div>

            <div className="app-border divide-y">
              {group.items.map((transaction) => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                  onDelete={(id) => deleteTransaction.mutate(id)}
                  onUpdate={(id, data: TransactionInput) =>
                    updateTransaction.mutate({ id, data })
                  }
                  isDeleting={
                    deleteTransaction.isPending &&
                    deleteTransaction.variables === transaction.id
                  }
                  isUpdating={
                    updateTransaction.isPending &&
                    updateTransaction.variables?.id === transaction.id
                  }
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};
