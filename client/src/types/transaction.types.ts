
export type TransactionInput = {
  amount: number;
  category: string;
  description?: string;
  date: string;
  type: "income" | "expense";
};

export type Transaction = {
  id: string;
  amount: number;
  category: string;
  description?: string;
  date: string;
  type: "income" | "expense";
  created_at?: string;
};