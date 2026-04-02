import type { Transaction } from "@/types/transaction.types";

export const formatCurrencyINR = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

export const sortTransactionsByDate = (transactions: Transaction[]) =>
  [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

export const getTransactionSummary = (transactions: Transaction[]) => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  let totalIncome = 0;
  let totalExpenses = 0;
  let monthlyIncome = 0;
  let monthlyExpenses = 0;

  for (const transaction of transactions) {
    const amount = Number(transaction.amount) || 0;
    const transactionDate = new Date(transaction.date);
    const isCurrentMonth =
      transactionDate.getMonth() === currentMonth &&
      transactionDate.getFullYear() === currentYear;

    if (transaction.type === "income") {
      totalIncome += amount;
      if (isCurrentMonth) monthlyIncome += amount;
    } else {
      totalExpenses += amount;
      if (isCurrentMonth) monthlyExpenses += amount;
    }
  }

  return {
    balance: totalIncome - totalExpenses,
    totalIncome,
    totalExpenses,
    monthlyIncome,
    monthlyExpenses,
    monthlyBalance: monthlyIncome - monthlyExpenses,
  };
};

export const getTransactionGroupLabel = (date: string) => {
  const transactionDate = new Date(date);
  const today = new Date();
  const startOfToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const startOfTransactionDay = new Date(
    transactionDate.getFullYear(),
    transactionDate.getMonth(),
    transactionDate.getDate(),
  );
  const diffInDays = Math.round(
    (startOfToday.getTime() - startOfTransactionDay.getTime()) / 86400000,
  );

  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "Yesterday";

  return transactionDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year:
      transactionDate.getFullYear() === today.getFullYear()
        ? undefined
        : "numeric",
  });
};

export const getCategoryBreakdown = (transactions: Transaction[]) => {
  const expensesByCategory = transactions.reduce<Record<string, number>>(
    (acc, transaction) => {
      if (transaction.type !== "expense") return acc;

      const category = transaction.category || "Other";
      acc[category] = (acc[category] ?? 0) + Number(transaction.amount || 0);
      return acc;
    },
    {},
  );

  const total = Object.values(expensesByCategory).reduce(
    (sum, value) => sum + value,
    0,
  );

  return Object.entries(expensesByCategory)
    .map(([category, amount]) => ({
      category,
      amount,
      share: total === 0 ? 0 : (amount / total) * 100,
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);
};

export const getMonthlyTrend = (
  transactions: Transaction[],
  monthsToShow = 6,
) => {
  const now = new Date();
  const buckets = Array.from({ length: monthsToShow }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - index, 1);
    return {
      key: `${date.getFullYear()}-${date.getMonth()}`,
      label: date.toLocaleDateString("en-IN", { month: "short" }),
      income: 0,
      expense: 0,
    };
  }).reverse();

  const bucketMap = new Map(buckets.map((bucket) => [bucket.key, bucket]));

  for (const transaction of transactions) {
    const date = new Date(transaction.date);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    const bucket = bucketMap.get(key);

    if (!bucket) continue;

    if (transaction.type === "income") {
      bucket.income += Number(transaction.amount || 0);
    } else {
      bucket.expense += Number(transaction.amount || 0);
    }
  }

  return buckets;
};
