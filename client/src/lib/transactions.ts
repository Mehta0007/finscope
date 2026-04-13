import type { Transaction, TransactionInput } from "@/types/transaction.types";

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
  const sortedTransactions = sortTransactionsByDate(transactions);
  const referenceDate =
    sortedTransactions.length > 0
      ? new Date(sortedTransactions[0].date)
      : new Date();
  const currentMonth = referenceDate.getMonth();
  const currentYear = referenceDate.getFullYear();

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
    referenceMonthLabel: referenceDate.toLocaleDateString("en-IN", {
      month: "long",
      year: "numeric",
    }),
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

// Parses a single CSV line, correctly handling quoted values that may contain commas.
// e.g. `"Food, groceries","expense"` → ["Food, groceries", "expense"]
const parseCSVLine = (line: string): string[] => {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      // Two consecutive quotes inside a quoted field = escaped quote character
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      values.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  values.push(current.trim());
  return values;
};

// Parses CSV text (exported by this app or matching the same column order)
// into valid TransactionInput objects, plus a list of human-readable error strings.
// Expected columns: Date, Type, Category, Description, Amount
export const parseCSVToTransactions = (
  csvText: string,
): { valid: TransactionInput[]; errors: string[] } => {
  const lines = csvText.trim().split(/\r?\n/);

  if (lines.length < 2) {
    return { valid: [], errors: ["File is empty or has no data rows."] };
  }

  // Skip the header row (index 0)
  const dataLines = lines.slice(1);
  const valid: TransactionInput[] = [];
  const errors: string[] = [];

  for (let i = 0; i < dataLines.length; i++) {
    const line = dataLines[i].trim();
    if (!line) continue; // skip blank lines

    const values = parseCSVLine(line);

    if (values.length < 5) {
      errors.push(`Row ${i + 2}: needs 5 columns (Date, Type, Category, Description, Amount).`);
      continue;
    }

    const [date, type, category, description, amountStr] = values;

    if (type !== "income" && type !== "expense") {
      errors.push(`Row ${i + 2}: type must be "income" or "expense", got "${type}".`);
      continue;
    }

    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) {
      errors.push(`Row ${i + 2}: invalid amount "${amountStr}".`);
      continue;
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      errors.push(`Row ${i + 2}: invalid date "${date}".`);
      continue;
    }

    valid.push({ date, type, category, description: description ?? "", amount });
  }

  return { valid, errors };
};

export const exportTransactionsToCSV = (transactions: Transaction[]) => {
  const headers = ["Date", "Type", "Category", "Description", "Amount"];

  const rows = transactions.map((transaction) => [
    transaction.date,
    transaction.type,
    transaction.category,
    transaction.description ?? "",
    String(transaction.amount),
  ]);

  const csv = [headers, ...rows]
    .map((row) =>
      row
        .map((value) => `"${String(value).replaceAll('"', '""')}"`)
        .join(","),
    )
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "finscope-transactions.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
