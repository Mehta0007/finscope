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

// Maps every recognised column name variation to a canonical field name.
// We normalise headers to lowercase + no spaces before looking them up here,
// so "Amount (INR)", "amount_inr", and "AMT" all resolve to "amount".
const HEADER_ALIASES: Record<string, "date" | "type" | "category" | "description" | "amount"> = {
  // date
  date: "date",
  transactiondate: "date",
  txdate: "date",
  // type
  type: "type",
  transactiontype: "type",
  kind: "type",
  txtype: "type",
  // category
  category: "category",
  cat: "category",
  // description
  description: "description",
  desc: "description",
  note: "description",
  notes: "description",
  memo: "description",
  details: "description",
  // amount
  amount: "amount",
  amt: "amount",
  amountinr: "amount",
  value: "amount",
  price: "amount",
  total: "amount",
};

type ColumnMap = {
  date: number;
  type: number;
  category: number;
  description: number;   // -1 means column is absent (it's optional)
  amount: number;
};

// Reads the header row and returns the index of each required column.
// Throws a descriptive error string if a required column is missing.
const resolveColumns = (headerLine: string): ColumnMap | string => {
  const headers = parseCSVLine(headerLine);
  const map: Partial<ColumnMap> = { description: -1 };

  headers.forEach((raw, index) => {
    // Normalise: lowercase, strip spaces, underscores, hyphens, and parenthetical suffixes
    // e.g. "Amount (INR)" → "amountinr", "transaction_type" → "transactiontype"
    const normalised = raw
      .toLowerCase()
      .replace(/[\s_\-()]/g, "")
      .replace(/[^a-z0-9]/g, "");

    const field = HEADER_ALIASES[normalised];
    if (field) map[field] = index;
  });

  const required = ["date", "type", "category", "amount"] as const;
  const missing = required.filter((f) => map[f] === undefined);

  if (missing.length > 0) {
    return `Header row is missing required column(s): ${missing.join(", ")}. Found: ${headers.join(", ")}`;
  }

  return map as ColumnMap;
};

// Parses CSV text into valid TransactionInput objects, plus human-readable errors.
// Column order does not matter — the header row is read first and columns are
// resolved by name, accepting common aliases (see HEADER_ALIASES above).
// Required columns: date, type, category, amount.  description is optional.
export const parseCSVToTransactions = (
  csvText: string,
): { valid: TransactionInput[]; errors: string[] } => {
  const lines = csvText.trim().split(/\r?\n/);

  if (lines.length < 2) {
    return { valid: [], errors: ["File is empty or has no data rows."] };
  }

  // Resolve column positions from the header row
  const columnMap = resolveColumns(lines[0]);
  if (typeof columnMap === "string") {
    return { valid: [], errors: [columnMap] };
  }

  const dataLines = lines.slice(1);
  const valid: TransactionInput[] = [];
  const errors: string[] = [];

  for (let i = 0; i < dataLines.length; i++) {
    const line = dataLines[i].trim();
    if (!line) continue;

    const values = parseCSVLine(line);
    const rowNum = i + 2; // +2 because header is row 1

    const date = values[columnMap.date] ?? "";
    const type = (values[columnMap.type] ?? "").toLowerCase().trim();
    const category = values[columnMap.category] ?? "";
    const description = columnMap.description >= 0 ? (values[columnMap.description] ?? "") : "";
    const amountStr = values[columnMap.amount] ?? "";

    if (type !== "income" && type !== "expense") {
      errors.push(`Row ${rowNum}: type must be "income" or "expense", got "${type}".`);
      continue;
    }

    // Strip currency symbols (₹, $, £, etc.) and commas before parsing
    const amount = parseFloat(amountStr.replace(/[^0-9.]/g, ""));
    if (isNaN(amount) || amount <= 0) {
      errors.push(`Row ${rowNum}: invalid amount "${amountStr}".`);
      continue;
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      errors.push(`Row ${rowNum}: invalid date "${date}".`);
      continue;
    }

    if (!category.trim()) {
      errors.push(`Row ${rowNum}: category is empty.`);
      continue;
    }

    valid.push({ date, type, category, description, amount });
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
