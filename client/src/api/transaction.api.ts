import type { TransactionInput } from "@/types/transaction.types";

const API_URL = "http://localhost:5000/transactions";



export const getTransaction = async (token: string) => {
  const res = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch transactions");
  }
  return res.json();
};

export const createTransaction = async (token: string, data: TransactionInput) => {
  console.log("🚀 CALLING CREATE TRANSACTION API");
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error(" Failed  to update transaction");
  }
  return res.json();
};

export const deleteTransaction = async (token: string, id: string) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error(" Failed  to delete transaction");
  }
  return res.json();
};

export const updateTransaction = async (
  token: string,
  id: string,
  data: TransactionInput,
) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to update transaction");
  }

  return res.json();
};
