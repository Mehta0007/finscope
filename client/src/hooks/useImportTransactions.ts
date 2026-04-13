import { createTransaction } from "@/api/transaction.api";
import type { TransactionInput } from "@/types/transaction.types";
import { useAuth } from "@clerk/clerk-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Accepts an array of TransactionInput objects and creates each one on the server
// sequentially (one after another), then refreshes the transaction list.
//
// Why sequential and not parallel (Promise.all)?
// Most free-tier DB hosts have low connection limits. Sequential calls are safer
// and still fast enough for typical import sizes (< 500 rows).
export const useImportTransactions = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transactions: TransactionInput[]) => {
      const token = await getToken();
      const results = [];
      for (const transaction of transactions) {
        const result = await createTransaction(token!, transaction);
        results.push(result);
      }
      return results;
    },
    onSuccess: () => {
      // Tell TanStack Query that the "transactions" cache is stale so it refetches.
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
};
